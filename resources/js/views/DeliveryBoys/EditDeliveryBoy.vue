<template>
    <div>
        <div class="page-heading">
            <div class="row">
                <div class="col-12 col-md-6 order-md-1 order-last">
                    <h3 v-if="this.$roleDeliveryBoy === this.login_user.role.name">
                        {{ __('my_profile') }}
                    </h3>
                    <h3 v-else>
                        <template v-if="id">{{ __('edit') }}</template>
                        <template v-else>{{ __('create') }}</template>
                        {{ __('delivery_boy') }}
                    </h3>
                </div>
                <div class="col-12 col-md-6 order-md-2 order-first">
                    <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-md-end">
                        <ol class="breadcrumb justify-content-md-end mb-0 text-end">
                            <li class="breadcrumb-item">

                                <router-link to="/delivery_boy"
                                    v-if="this.$roleDeliveryBoy === this.login_user.role.name">{{
                                        __('dashboard') }}</router-link>
                                <router-link to="/dashboard" v-else>{{ __('dashboard') }}</router-link>
                            </li>
                            <template v-if="this.$roleDeliveryBoy === this.login_user.role.name">
                                <li class="breadcrumb-item" aria-current="page">{{ __('my_profile') }}</li>
                            </template>

                            <template v-else>

                                <li class="breadcrumb-item" aria-current="page">
                                    <router-link :to="$route.path.includes('/seller') ? '/seller/delivery_boys' : '/delivery_boys'">{{ __('manage_delivery_boy') }}</router-link>
                                </li>

                                <li class="breadcrumb-item active" aria-current="page">
                                    <template v-if="id">{{ __('edit') }}</template>
                                    <template v-else>{{ __('create') }}</template>
                                    {{ __('delivery_boy') }}
                                </li>
                            </template>
                        </ol>
                    </nav>
                </div>
            </div>

            <div class="row">
                <div class="col-12 col-md-12 order-md-1 order-last">
                    <div class="card">
                        <div class="card-header" v-if="this.$roleDeliveryBoy !== this.login_user.role.name">
                            <h4>{{ __('delivery_boy') }}</h4>
                            <span class="pull-right">
                                <router-link :to="$route.path.includes('/seller') ? '/seller/delivery_boys' : '/delivery_boys'" class="btn btn-primary" v-b-tooltip.hover
                                    title="View Delivery boys">{{ __('view_delivery_boys') }}</router-link>
                            </span>
                        </div>

                        <form ref="my-form" @submit.prevent="saveRecord">
                            <div class="card-body">

                                <!-- Language Tabs for Translatable Fields -->
                                <b-tabs v-model="activeLanguageTab" v-if="languages.length > 0"
                                    :key="'lang-tabs-' + languagesKey" content-class="mt-3">
                                    <!-- Default Language Tab (All main form fields) -->
                                    <b-tab v-for="(lang, index) in languages" :key="'lang-tab-' + lang.id" lazy
                                        v-if="lang.is_default">
                                        <template #title>
                                            <span :class="{ 'text-primary': lang.is_default }">
                                                {{ lang.name }}
                                            </span>
                                        </template>

                                        <!-- Translate buttons -->
                                        <div class="mb-3" v-if="lang.is_default && languages.length > 1">
                                            <b-button size="sm" variant="outline-primary" class="mr-2"
                                                @click="translateEmpty(lang)" v-b-tooltip.hover
                                                :title="__('only_empty_fields_will_be_translated_existing_content_will_not_be_changed')"
                                                :disabled="loadingEmpty">
                                                <span v-if="!loadingEmpty">{{ __('translate_empty_fields') }}</span>
                                                <b-spinner v-else small></b-spinner>
                                            </b-button>

                                            <b-button size="sm" variant="outline-danger"
                                                @click="translateOverwrite(lang)" v-b-tooltip.hover
                                                :title="__('all_fields_will_be_translated_and_existing_content_will_be_overwritten')"
                                                :disabled="loadingOverwrite">
                                                <span v-if="!loadingOverwrite">{{ __('translate_and_overwrite')
                                                    }}</span>
                                                <b-spinner v-else small></b-spinner>
                                            </b-button>

                                            <div v-if="translateSuccessMessage"
                                                class="text-success mt-2 font-weight-bold">
                                                {{ translateSuccessMessage }}
                                            </div>
                                        </div>
                                        <!-- Translate buttons END -->
                                    </b-tab>

                                    <!-- Other Language Tabs (ONLY Translatable Fields - No other fields) -->
                                    <b-tab v-for="(lang, index) in languages" :key="'lang-tab-' + lang.id" lazy
                                        v-if="!lang.is_default">
                                        <template #title>
                                            <span>
                                                {{ lang.name }}
                                            </span>
                                        </template>

                                        <div class="row">
                                            <!-- Name (Translatable) -->
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label for="name">{{ __('name') }}</label>
                                                    <input type="text" name="name" :id="'name_' + lang.id"
                                                        v-model="translations[lang.id].name" class="form-control"
                                                        :placeholder="__('name')">
                                                </div>
                                            </div>

                                            <!-- Address (Translatable) -->
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="address">{{ __('address') }}</label>
                                                    <textarea name="address" :id="'address_' + lang.id"
                                                        v-model="translations[lang.id].address" rows='3'
                                                        class="form-control" :placeholder="__('address')"></textarea>
                                                </div>
                                            </div>

                                            <!-- Other Payment Information (Translatable) -->
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="other_payment_info">{{ __('other_payment_information')
                                                        }}</label>
                                                    <textarea name="other_payment_info"
                                                        :id="'other_payment_info_' + lang.id"
                                                        v-model="translations[lang.id].other_payment_information"
                                                        rows='3' class="form-control"
                                                        :placeholder="__('other_payment_information')"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </b-tab>
                                </b-tabs>

                                <!-- Main Form Fields (Only show when default language tab is active or no tabs) -->
                                <div
                                    v-if="!languages.length || (defaultLanguage && getCurrentLanguage() && getCurrentLanguage().is_default)">
                                    <!-- Personal Information Section -->
                                    <div class="row mt-3">
                                        <!-- Name (Default Language) -->
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="name">{{ __('name') }}<span
                                                        class="text-danger text-xs">*</span></label>
                                                <input type="text" name="name" id="name" v-if="defaultLanguage"
                                                    v-model="translations[defaultLanguage.id].name" class="form-control"
                                                    :placeholder="__('name')">
                                            </div>
                                        </div>

                                        <!-- Date Of Birth -->
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="dob">{{ __('date_of_birth') }} <span
                                                        class="text-danger text-xs">*</span></label>
                                                <input type="date" name="dob" id="dob" v-model="deliveryBoys.dob"
                                                    class="form-control" :placeholder="__('date_of_birth')"
                                                    @input="validateDateOfBirth">
                                                <span v-if="dobvalidationError" class="error">{{ dobvalidationError
                                                    }}</span>
                                            </div>
                                        </div>

                                        <!-- Mobile -->
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="mobile">{{ __('mobile') }}<span
                                                        class="text-danger text-xs">*</span></label>
                                                <input type="number" name="mobile" id="mobile"
                                                    v-model="deliveryBoys.mobile" class="form-control"
                                                    :placeholder="__('mobile_no')" @input="validateMobileNumber">
                                                <span v-if="mobilevalidationError" class="error">{{
                                                    mobilevalidationError }}</span>
                                            </div>
                                        </div>

                                        <!-- Email -->
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="email">{{ __('email') }}<span
                                                        class="text-danger text-xs">*</span></label>
                                                <input type="text" name="email" id="email" v-model="deliveryBoys.email"
                                                    :readonly="this.$roleDeliveryBoy === this.login_user.role.name"
                                                    class="form-control" :placeholder="__('email')">
                                            </div>
                                        </div>

                                        <!-- Password (only for admin) -->
                                        <div class="col-md-4"
                                            v-if="this.$roleDeliveryBoy !== this.login_user.role.name">
                                            <div class="form-group">
                                                <label for="password">{{ __('password') }}<span
                                                        class="text-danger text-xs">*</span></label>
                                                <div class="input-group">
                                                    <input :type="showPassword ? 'text' : 'password'" name="password"
                                                        id="password" v-model="deliveryBoys.password"
                                                        class="form-control" :placeholder="__('password')">
                                                    <button type="button" v-on:click="showPassword = !showPassword"
                                                        class="btn btn-primary font-bold">
                                                        <i v-if="showPassword" class="fa fa-eye-slash"
                                                            aria-hidden="true"></i>
                                                        <i v-else class="fa fa-eye" aria-hidden="true"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Confirm Password (only for admin) -->
                                        <div class="col-md-4"
                                            v-if="this.$roleDeliveryBoy !== this.login_user.role.name">
                                            <div class="form-group">
                                                <label for="confirm_password">{{ __('confirm_password') }}<span
                                                        class="text-danger text-xs"
                                                        v-if="!deliveryBoys.id || deliveryBoys.password">*</span></label>
                                                <div class="input-group">
                                                    <input :type="showConfirmPassword ? 'text' : 'password'"
                                                        name="confirm_password" id="confirm_password"
                                                        v-model="deliveryBoys.confirm_password" class="form-control"
                                                        :placeholder="__('confirm_password')">
                                                    <button type="button"
                                                        v-on:click="showConfirmPassword = !showConfirmPassword"
                                                        class="btn btn-primary font-bold">
                                                        <i v-if="showConfirmPassword" class="fa fa-eye-slash"
                                                            aria-hidden="true"></i>
                                                        <i v-else class="fa fa-eye" aria-hidden="true"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Bank Details Section -->
                                    <div class="row">
                                        <!-- Bank's IFSC Code -->
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="ifsc_code">{{ __('bank_ifsc_code') }}<span
                                                        class="text-danger text-xs">*</span></label>
                                                <input type="text" name="ifsc_code" id="ifsc_code"
                                                    v-model="deliveryBoys.ifsc_code" required
                                                    :readonly="this.$roleDeliveryBoy === this.login_user.role.name"
                                                    class="form-control" :placeholder="__('bank_ifsc_code')">
                                            </div>
                                        </div>

                                        <!-- Bank Name -->
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="bank_name">{{ __('bank_name') }}<span
                                                        class="text-danger text-xs">*</span></label>
                                                <input type="text" name="bank_name" id="bank_name"
                                                    v-model="deliveryBoys.bank_name" required
                                                    :readonly="this.$roleDeliveryBoy === this.login_user.role.name"
                                                    class="form-control" :placeholder="__('bank_name')">
                                            </div>
                                        </div>

                                        <!-- Account Number -->
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="account_number">{{ __('account_number') }}<span
                                                        class="text-danger text-xs">*</span></label>
                                                <input type="number" name="account_number" id="account_number"
                                                    v-model="deliveryBoys.bank_account_number" required
                                                    :readonly="this.$roleDeliveryBoy === this.login_user.role.name"
                                                    class="form-control" :placeholder="__('account_number')"
                                                    @input="validateAccountNumber">
                                                <span v-if="account_numbervalidationError" class="error">{{
                                                    account_numbervalidationError }}</span>
                                            </div>
                                        </div>

                                        <!-- Bank Account Name -->
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="account_name">{{ __('bank_account_name') }}<span
                                                        class="text-danger text-xs">*</span></label>
                                                <input type="text" name="account_name" id="account_name"
                                                    v-model="deliveryBoys.account_name" required
                                                    :readonly="this.$roleDeliveryBoy === this.login_user.role.name"
                                                    class="form-control" :placeholder="__('bank_account_name')">
                                            </div>
                                        </div>

                                        <!-- Select or Search City -->
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="city_name">{{ __('select_or_search_city') }}<span
                                                        class="text-danger text-xs">*</span></label>
                                                <multiselect v-model="city" :options="cities" @close="setCityId"
                                                    :placeholder="__('select_or_search_city')" label="name" track-by="name"
                                                    id="city_name" required>
                                                    <template slot="singleLabel" slot-scope="props">
                                                        <span class="option__desc">
                                                            <span class="option__title">{{ props.option.name }}</span>
                                                        </span>
                                                    </template>
                                                    <template slot="option" slot-scope="props">
                                                        <div class="option__desc">
                                                            <span class="option__title">{{
                                                                props.option.formatted_address }}</span>
                                                        </div>
                                                    </template>
                                                </multiselect>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Address and Other Payment Information Section (Default Language) -->
                                    <div class="row" v-if="defaultLanguage">
                                        <!-- Address (Default Language) -->
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="address">{{ __('address') }}<span
                                                        class="text-danger text-xs">*</span></label>
                                                <textarea name="address" id="address"
                                                    v-model="translations[defaultLanguage.id].address" rows='3'
                                                    class="form-control" :placeholder="__('address')"></textarea>
                                            </div>
                                        </div>

                                        <!-- Other Payment Information (Default Language) -->
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="other_payment_info">{{ __('other_payment_information')
                                                    }}</label>
                                                <textarea name="other_payment_info" id="other_payment_info"
                                                    v-model="translations[defaultLanguage.id].other_payment_information"
                                                    rows='3' class="form-control"
                                                    :placeholder="__('other_payment_information')"></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Document Upload Section -->
                                    <div class="row">
                                        <!-- Driving License -->
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="driving_license">{{ __('driving_licence') }}<span
                                                        class="text-danger text-xs">*</span></label>
                                                <input type="file" class="file-input"
                                                    accept="image/*,application/pdf,.doc,.docx" name="driving_license"
                                                    id="driving_license"
                                                    v-if="this.$roleDeliveryBoy !== this.login_user.role.name"
                                                    v-on:change="handleFileUploadLicense" ref="file_license"
                                                    style="display: none;" />
                                                <div class="file-input-div bg-gray-100"
                                                    v-if="this.$roleDeliveryBoy !== this.login_user.role.name"
                                                    @click="$refs.file_license.click()" @drop="dropFileUploadLicense"
                                                    @dragover="$dragoverFile" @dragleave="$dragleaveFile">
                                                    <template
                                                        v-if="deliveryBoys.driving_license && deliveryBoys.driving_license.name !== ''">
                                                        <label>{{ __('selected_file_name') }}{{
                                                            deliveryBoys.driving_license.name }}</label>
                                                    </template>
                                                    <template v-else>
                                                        <label><i class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                                        <label>{{ __('drop_files_here_or_click_to_upload') }}</label>
                                                    </template>
                                                </div>
                                                <p v-if="drivingLicencevalidationerror" class="error">{{
                                                    drivingLicencevalidationerror }}</p>
                                                <div class="row mt-2" v-if="deliveryBoys.driving_license_url">
                                                    <div v-if="isImage(deliveryBoys.driving_license_url)"
                                                        class="col-md-2">
                                                        <img class="custom-image"
                                                            :src="deliveryBoys.driving_license_url"
                                                            title='Driving License' alt='Driving License' />
                                                    </div>
                                                    <div v-else class="col-md-2 mt-2">
                                                        <a target="_blank" :href="deliveryBoys.driving_license_url"
                                                            class="badge bg-success">
                                                            <i class="fa fa-eye"></i> {{ __('identity_card') }}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- National Identity Card -->
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="national_identity_card">{{ __('national_identity_card')
                                                    }}<span class="text-danger text-xs">*</span></label>
                                                <input type="file" accept="image/*,application/pdf,.doc,.docx"
                                                    name="national_identity_card" id="national_identity_card"
                                                    v-if="this.$roleDeliveryBoy !== this.login_user.role.name"
                                                    v-on:change="handleFileUploadCard" ref="file_card"
                                                    class="file-input" style="display: none;" />
                                                <div class="file-input-div bg-gray-100"
                                                    v-if="this.$roleDeliveryBoy !== this.login_user.role.name"
                                                    @click="$refs.file_card.click()" @drop="dropFileUploadCard"
                                                    @dragover="$dragoverFile" @dragleave="$dragleaveFile">
                                                    <template
                                                        v-if="deliveryBoys.national_identity_card && deliveryBoys.national_identity_card.name !== ''">
                                                        <label>{{ __('selected_file_Name') }}{{
                                                            deliveryBoys.national_identity_card.name }}</label>
                                                    </template>
                                                    <template v-else>
                                                        <label><i class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                                        <label>{{ __('drop_files_here_or_click_to_upload') }}</label>
                                                    </template>
                                                </div>
                                                <p v-if="nationalIdentityCardvalidationerror" class="error">{{
                                                    nationalIdentityCardvalidationerror }}</p>
                                                <div class="row mt-2" v-if="deliveryBoys.national_identity_card_url">
                                                    <div v-if="isImage(deliveryBoys.national_identity_card_url)"
                                                        class="col-md-2">
                                                        <img class="custom-image"
                                                            :src="deliveryBoys.national_identity_card_url"
                                                            title='National Identity Card'
                                                            alt='National Identity Card' />
                                                    </div>
                                                    <div v-else class="col-md-2 mt-2">
                                                        <a target="_blank"
                                                            :href="deliveryBoys.national_identity_card_url"
                                                            class="badge bg-success">
                                                            <i class="fa fa-eye"></i> {{ __('identity_card') }}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="list-group-item m-2">
                                        <div class="d-flex justify-content-between align-content-center">
                                            <h6>{{ __('delivery_boy_bonus_details') }}</h6>
                                            <b-button-group v-if="this.$roleDeliveryBoy !== this.login_user.role.name">
                                                <b-button @click="getBonusSettings"
                                                    v-if="$deliveryBoyBonusSettings == 1" type="button"
                                                    variant="primary" size="sm">
                                                    {{ __('add_default_bonus') }}
                                                </b-button>
                                                <b-button @click="resetBonus" v-if="deliveryBoys.id" type="button"
                                                    size="sm">
                                                    {{ __('reset_bonus') }}
                                                </b-button>
                                            </b-button-group>
                                        </div>
                                        <div class="row mt-2">
                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label for="bonus_type">{{ __('bonus_type') }}<span
                                                            class="text-danger text-xs">*</span></label>
                                                    <select name="bonus_type" id="bonus_type" @change="changeBonusType"
                                                        v-model="deliveryBoys.bonus_type"
                                                        :disabled="this.$roleDeliveryBoy === this.login_user.role.name"
                                                        class="form-control form-select">
                                                        <option value="">{{ __('select') }}</option>
                                                        <option value="1">{{ __('commission') }}</option>
                                                        <option value="0">{{ __('fixed_salaried') }}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div v-if="deliveryBoys.bonus_type == 1" class="col-md-3">
                                                <div class="form-group">
                                                    <label for="bonus_percentage">{{ __('bonus_percentage') }}<span
                                                            class="text-danger text-xs">*</span></label>
                                                    <input type="number" min="0.1" max="100" step="0.1"
                                                        name="bonus_percentage" id="bonus_percentage"
                                                        v-model="deliveryBoys.bonus_percentage" class="form-control"
                                                        :placeholder="__('bonus_percentage')"
                                                        :readonly="this.$roleDeliveryBoy === this.login_user.role.name">
                                                </div>
                                            </div>
                                            <div v-if="deliveryBoys.bonus_type == 1" class="col-md-3">
                                                <div class="form-group">
                                                    <label for="bonus_min_amount">{{ __('minimum_bonus_amount')
                                                        }}</label>
                                                    <input type="number" min="0" step="0.1" required
                                                        class="form-control" name="bonus_min_amount"
                                                        id="bonus_min_amount" v-model="deliveryBoys.bonus_min_amount"
                                                        placeholder='Minimum bonus amount'
                                                        :readonly="this.$roleDeliveryBoy === this.login_user.role.name"
                                                        @input="validateBonusMinAmount" />
                                                    <span class="text text-primary font-size-13"
                                                        v-if="this.$roleDeliveryBoy !== this.login_user.role.name">{{
                                                        __('set_0_if_you_want_to_remove_limit') }}</span>
                                                    <span v-if="bonusMinAmountValidationError" class="error">{{
                                                        bonusMinAmountValidationError }}</span>
                                                </div>
                                            </div>
                                            <div v-if="deliveryBoys.bonus_type == 1" class="col-md-3">
                                                <div class="form-group">
                                                    <label for="bonus_max_amount">{{ __('maximum_bonus_amount')
                                                        }}</label>
                                                    <input type="number" min="0" step="0.1" required
                                                        class="form-control" name="bonus_max_amount"
                                                        id="bonus_max_amount" v-model="deliveryBoys.bonus_max_amount"
                                                        :placeholder="__('maximum_bonus_amount')"
                                                        :readonly="this.$roleDeliveryBoy === this.login_user.role.name"
                                                        @input="validateBonusMaxAmount" />
                                                    <span class="text text-primary font-size-13"
                                                        v-if="this.$roleDeliveryBoy !== this.login_user.role.name">{{
                                                        __('set_0_if_you_want_to_remove_limit') }}</span>
                                                    <span v-if="bonusMaxAmountValidationError" class="error">{{
                                                        bonusMaxAmountValidationError }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Status Section (only for edit mode) -->
                                    <div class="row"
                                        v-if="deliveryBoys.id && this.$roleDeliveryBoy !== this.login_user.role.name">
                                        <div class="col-md-8">
                                            <div class="form-group">
                                                <label>{{ __('status') }}<span
                                                        class="text-danger text-xs">*</span></label><br>
                                                <b-form-radio-group v-model="deliveryBoys.status" :options="[
                                                    { text: __('registered'), 'value': 0 },
                                                    { text: __('active'), 'value': 1 },
                                                    { text: __('not_approved'), 'value': 2 },
                                                    { text: __('deactive'), 'value': 3 },
                                                    { text: __('block'), 'value': 4 },
                                                ]" buttons button-variant="outline-primary" class="d-flex flex-wrap flex-md-nowrap"
                                                    required></b-form-radio-group>
                                            </div>
                                        </div>
                                        <div class="col-md-4" v-if="[2, 3, 4].includes(deliveryBoys.status)">
                                            <div class="form-group">
                                                <label for="remark">{{ __('remark') }}<span
                                                        class="text-danger text-xs">*</span></label>
                                                <textarea class="form-control" name="remark" id="remark" required
                                                    v-model="deliveryBoys.remark"
                                                    :placeholder="__('remark')"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- End of Main Form Fields (only visible on default language tab) -->

                            <!-- Action Buttons -->
                            <div class="card-footer">
                                <template v-if="deliveryBoys.id">
                                    <b-button type="submit" variant="primary" :disabled="isLoading">
                                        {{ __('update') }}
                                        <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
                                    </b-button>
                                </template>
                                <template v-else>
                                    <b-button type="submit" variant="primary" :disabled="isLoading">
                                        {{ __('save') }}
                                        <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
                                    </b-button>
                                    <button v-if="this.$roleDeliveryBoy !== this.login_user.role.name" type="reset"
                                        class="btn btn-danger">{{ __('clear') }}</button>
                                    <button v-else type="button" class="btn btn-danger" @click="$router.go(-1)">{{
                                        __('back') }}</button>
                                </template>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
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
            city: "",
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
                email: "",
                password: "",
                confirm_password: "",
                ifsc_code: "",
                bank_name: "",
                bank_account_number: "",
                account_name: "",
                city_id: "",
                address: "",
                other_payment_information: "",

                driving_license: "",
                driving_license_url: "",

                national_identity_card: "",
                national_identity_card_url: "",

                status: 0,
                remark: "",

                bonus_type: "",
                bonus_percentage: "",
                bonus_min_amount: "",
                bonus_max_amount: "",
            },
            mobilevalidationError: null,
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
        };
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
    },
    methods: {
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

                    if (this.deliveryBoys.id && this.record?.city_id && Array.isArray(this.cities)) {
                        const matched = this.cities.filter((item) => item.id === this.record.city_id);
                        this.city = matched.length ? matched[0] : null;
                    }
                });
        },
        setCityId() {
            this.deliveryBoys.city_id = (this.city && this.city.id != null) ? this.city.id : '';
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
                        this.deliveryBoys.email = (this.record?.admin) ? (this.record.admin.email || '') : '';
                        this.deliveryBoys.password = "";
                        this.deliveryBoys.confirm_password = "";
                        this.deliveryBoys.ifsc_code = emptyIfNull(this.record?.ifsc_code);
                        this.deliveryBoys.bank_name = emptyIfNull(this.record?.bank_name);
                        this.deliveryBoys.bank_account_number = emptyIfNull(this.record?.bank_account_number);
                        this.deliveryBoys.account_name = emptyIfNull(this.record?.account_name);

                        if (Array.isArray(this.cities)) {
                            const matched = this.cities.find((item) => item.id === this.record.city_id);
                            this.city = matched || null;
                        }
                        this.deliveryBoys.city_id = emptyIfNull(this.record?.city_id);

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
            if (!this.deliveryBoys.dob) {
                this.showError(__('please_fill_date_of_birth') || 'Please fill the date of birth.');
                switchToDefault();
                return;
            }
            if (!this.deliveryBoys.mobile) {
                this.showError(__('please_fill_mobile') || 'Please fill the mobile number.');
                switchToDefault();
                return;
            }
            if (!this.deliveryBoys.email) {
                this.showError(__('please_fill_email') || 'Please fill the email.');
                switchToDefault();
                return;
            }
            if (!this.deliveryBoys.city_id) {
                this.showError(__('please_select_city') || 'Please select a city.');
                switchToDefault();
                return;
            }

            const isEdit = !!this.deliveryBoys.id;
            if (!isEdit && !this.deliveryBoys.driving_license) {
                this.showError(__('please_upload_driving_license') || 'Please upload driving license.');
                switchToDefault();
                return;
            }
            if (!isEdit && !this.deliveryBoys.national_identity_card) {
                this.showError(__('please_upload_national_identity_card') || 'Please upload national identity card.');
                switchToDefault();
                return;
            }

            // Password validation: on create required; on edit if filled then confirm must match
            if (!isEdit) {
                if (!this.deliveryBoys.password) {
                    this.showError(__('please_fill_password'));
                    switchToDefault();
                    return;
                }
                if (this.deliveryBoys.password !== this.deliveryBoys.confirm_password) {
                    this.showError(__('password_and_confirm_password_must_match'));
                    switchToDefault();
                    return;
                }
            } else if (this.deliveryBoys.password) {
                if (!this.deliveryBoys.confirm_password) {
                    this.showError(__('please_fill_confirm_password'));
                    switchToDefault();
                    return;
                }
                if (this.deliveryBoys.password !== this.deliveryBoys.confirm_password) {
                    this.showError(__('password_and_confirm_password_must_match'));
                    switchToDefault();
                    return;
                }
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
                fd.append('dob', this.deliveryBoys.dob);
                fd.append('mobile', this.deliveryBoys.mobile);
                fd.append('email', this.deliveryBoys.email);
                fd.append('ifsc_code', this.deliveryBoys.ifsc_code);
                fd.append('bank_name', this.deliveryBoys.bank_name);
                fd.append('bank_account_number', this.deliveryBoys.bank_account_number);
                fd.append('account_name', this.deliveryBoys.account_name);
                fd.append('city_id', this.deliveryBoys.city_id);
                fd.append('status', this.deliveryBoys.status);
                fd.append('remark', this.deliveryBoys.remark ?? '');
                fd.append('bonus_type', this.deliveryBoys.bonus_type);
                fd.append('bonus_percentage', this.deliveryBoys.bonus_percentage ?? 0);
                fd.append('bonus_min_amount', this.deliveryBoys.bonus_min_amount ?? 0);
                fd.append('bonus_max_amount', this.deliveryBoys.bonus_max_amount ?? 0);

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
@import "../../../../node_modules/vue-multiselect/dist/vue-multiselect.min.css";
</style>