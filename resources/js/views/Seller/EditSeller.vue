<template>
    <div>
        <div class="page-heading">

            <div class="row">
                <div class="col-12 col-md-6 order-md-1 order-last">
                    <h3 v-if="isSellerRole">
                        {{ __('my_profile') }}
                    </h3>
                    <h3 v-else>
                        <template v-if="id">{{ __('edit') }}</template>
                        <template v-else>{{ __('add') }}</template>
                        {{ __('seller') }}
                    </h3>
                </div>
                <div class="col-12 col-md-6 order-md-2 order-first">
                    <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item">
                                <router-link to="/seller" v-if="isSellerRole">{{ __('dashboard') }}</router-link>
                                <router-link to="/dashboard" v-else>{{ __('dashboard') }}</router-link>
                            </li>
                            <template v-if="isSellerRole">
                                <li class="breadcrumb-item" aria-current="page">{{ __('my_profile') }}</li>
                            </template>
                            <template v-else>

                                <li class="breadcrumb-item" aria-current="page">
                                    <router-link to="/sellers">{{ __('manage_sellers') }}</router-link>
                                </li>

                                <li class="breadcrumb-item active" aria-current="page">
                                    <template v-if="id">{{ __('edit') }}</template>
                                    <template v-else>{{ __('add') }}</template>
                                    {{ __('seller') }}
                                </li>
                            </template>
                        </ol>
                    </nav>
                </div>
            </div>

            <div class="row">
                <div class="col-12 col-md-12 order-md-1 order-last">
                    <form ref="my-form" @submit.prevent="saveRecord">
                        <div class="card">
                            <div class="card-header">
                                <h4>{{ __('seller_information') }} </h4>
                                <span class="pull-right" v-if="!isSellerRole">
                                    <router-link to="/sellers" class="btn btn-primary" v-b-tooltip.hover
                                        title="Manage Seller">{{
                                            __('manage_seller') }}</router-link>
                                </span>
                            </div>
                            <div class="card-body">
                                <div class="col-md-12 mb-3" v-if="languages.length > 0">
                                    <b-tabs v-model="activeLanguageTab" content-class="mt-3">
                                        <b-tab v-for="language in languages" :key="language.id" :title="language.name"
                                            lazy>
                                            <template #title>
                                                <span :class="{ 'text-primary font-weight-bold': language.is_default }">
                                                    {{ language.name }}
                                                </span>
                                            </template>

                                            <!-- Translate buttons -->
                                            <div class="mb-3" v-if="language.is_default && languages.length > 1">
                                                <b-button size="sm" variant="outline-primary" class="mr-2"
                                                    @click="translateEmpty(language)" v-b-tooltip.hover
                                                    :title="__('only_empty_fields_will_be_translated_existing_content_will_not_be_changed')"
                                                    :disabled="loadingEmpty">
                                                    <span v-if="!loadingEmpty">{{ __('translate_empty_fields') }}</span>
                                                    <b-spinner v-else small></b-spinner>
                                                </b-button>

                                                <b-button size="sm" variant="outline-danger"
                                                    @click="translateOverwrite(language)" v-b-tooltip.hover
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

                                            <div class="row">
                                                <div class="form-group col-md-4">
                                                    <label>{{ __('seller_name') }} <i class="text-danger" v-if="language.is_default">*</i></label>
                                                    <input type="text" class="form-control"
                                                        :required="language.is_default ? true : undefined"
                                                        v-model="translations[language.id].name"
                                                        :placeholder="__('enter_seller_name')" @focus="onInputFocus"
                                                        @blur="onInputBlur">
                                                </div>

                                                <!-- Non-translatable Fields (only shown in default language tab) -->
                                                <template v-if="language.is_default">
                                                    <div class="form-group col-md-4">
                                                        <label>{{ __('email') }} <i class="text-danger">*</i></label>
                                                        <input type="email" class="form-control" v-model="email"
                                                            :placeholder="__('enter_email')" @focus="onInputFocus"
                                                            @blur="onInputBlur">
                                                    </div>

                                                    <div class="form-group col-md-4">
                                                        <label>{{ __('mobile') }} <i class="text-danger">*</i></label>
                                                        <div class="input-group">
                                                            <div class="country-code-dropdown" ref="countryDropdown">
                                                                <button type="button" class="form-control country-code-toggle" @click="countryDropdownOpen = !countryDropdownOpen">
                                                                    {{ country_code }}
                                                                </button>
                                                                <ul v-if="countryDropdownOpen" class="country-code-menu">
                                                                    <li v-for="c in countries" :key="c.id" @click="country_code = c.dial_code; countryDropdownOpen = false">
                                                                        {{ c.dial_code }}
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <input type="text" class="form-control" v-model="mobile"
                                                                :placeholder="__('enter_mobile_number')" inputmode="numeric"
                                                                required @input="validateMobileNumber"
                                                                @focus="onInputFocus" @blur="onInputBlur">
                                                        </div>
                                                        <span v-if="mobilevalidationError" class="error">{{ mobilevalidationError }}</span>
                                                    </div>

                                                    <div class="form-group col-md-4">
                                                        <label>{{ __('password') }} <i v-if="!id" class="text-danger">*</i></label>
                                                        <div class="input-group">
                                                            <input :type="showPassword ? 'text' : 'password'"
                                                                class="form-control" v-model="password"
                                                                :placeholder="__('leave_blank_to_keep_current_password')" >
                                                            <button type="button"
                                                                v-on:click="showPassword = !showPassword"
                                                                class="btn btn-primary font-bold">
                                                                <i v-if="showPassword" class="fa fa-eye"
                                                                    aria-hidden="true"></i>
                                                                <i v-else class="fa fa-eye-slash" aria-hidden="true"></i>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div class="form-group col-md-4">
                                                        <label>{{ __('confirm_password') }} <i v-if="!id" class="text-danger">*</i></label>
                                                        <div class="input-group">
                                                            <input :type="showConfirmPassword ? 'text' : 'password'"
                                                                class="form-control" v-model="confirm_password"
                                                                :placeholder="__('enter_confirm_password')" >
                                                            <button type="button"
                                                                v-on:click="showConfirmPassword = !showConfirmPassword"
                                                                class="btn btn-primary font-bold">
                                                                <i v-if="showConfirmPassword"
                                                                    class="fa fa-eye" aria-hidden="true"></i>
                                                                <i v-else class="fa fa-eye-slash" aria-hidden="true"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </template>
                                            </div>

                                            <div class="card">
                                                <div class="card-header">
                                                    <h4> {{ __('store_information') }}</h4>
                                                </div>
                                                <div class="card-body">
                                                    <div class="row">

                                                        <!-- Translatable Field: Store Name (shown in all language tabs) -->
                                                        <div class="form-group col-md-4">
                                                            <div class="form-group">
                                                                <label>{{ __('store_name') }} <i class="text-danger"
                                                                        v-if="language.is_default">*</i></label>
                                                                <input type="text" class="form-control"
                                                                    :required="language.is_default ? true : undefined"
                                                                    v-model="translations[language.id].store_name"
                                                                    :placeholder="__('enter_store_name')" >
                                                            </div>
                                                        </div>

                                                        <!-- Non-translatable Fields (only shown in default language tab) -->
                                                        <template v-if="language.is_default">
                                                            <div class="form-group col-md-5" v-if="isSellerRole">
                                                                <div class="form-group">
                                                                    <label>{{ __('brand_ids') }}</label>
                                                                    <div v-if="assignedBrands.length">
                                                                        <span v-for="brand in assignedBrands" :key="brand.id"
                                                                            class="badge bg-secondary me-1 mb-1 p-2">
                                                                            {{ brand.name }}
                                                                        </span>
                                                                    </div>
                                                                    <p v-else class="form-control-static">{{ __('no_brands_assigned') }}</p>
                                                                    <small class="text-muted d-block mt-1">{{ __('brand_assignment_is_managed_by_admin') }}</small>
                                                                </div>
                                                            </div>
                                                            <div class="form-group col-md-3">
                                                                <div class="form-group">
                                                                    <label class="control-label d-block">{{ __('product_status')
                                                                        }}</label>
                                                                    <div id="status" class="btn-group">
                                                                        <label class="btn btn-primary"
                                                                            data-toggle-class="btn-primary"
                                                                            data-toggle-passive-class="btn-default">
                                                                            <input type="radio" v-model="status" value="1">
                                                                            {{ __('active') }}
                                                                        </label>
                                                                        <label class="btn btn-danger"
                                                                            data-toggle-class="btn-danger"
                                                                            data-toggle-passive-class="btn-default">
                                                                            <input type="radio" v-model="status" value="3">
                                                                            {{ __('deactive') }}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="form-group col-md-4">
                                                                <div class="form-group">
                                                                    <label>{{ __('tax_name') }}</label>
                                                                    <input type="text" class="form-control"
                                                                        v-model="tax_name"
                                                                        :placeholder="__('enter_tax_name')" >
                                                                </div>
                                                            </div>

                                                            <div class="form-group col-md-4">
                                                                <div class="form-group">
                                                                    <label>{{ __('tax_number') }}</label>
                                                                    <input type="text" class="form-control"
                                                                        v-model="tax_number"
                                                                        :placeholder="__('enter_tax_number')" >
                                                                </div>
                                                            </div>

                                                            <div class="form-group col-md-4">
                                                                <div class="form-group">
                                                                    <label>{{ __('pan_number') }}</label>
                                                                    <input type="text" class="form-control"
                                                                        v-model="pan_number"
                                                                        :placeholder="__('enter_pan_number')" >
                                                                </div>
                                                            </div>

                                                            <div class="row align-items-start">
                                                            <div class="form-group col-md-4 mt-0" v-if="!isSellerRole">
                                                                <div class="form-group">
                                                                    <label for="logo"> {{ __('logo') }} <i v-if="!id"
                                                                            class="text-danger">*</i></label>
                                                                    <input type="file" accept="image/*" id="logo"
                                                                        class="file-input" ref="file_store_logo"
                                                                        v-on:change="handleFileStoreLogo">
                                                                    <div class="file-input-div bg-gray-100"
                                                                        @click="triggerRefClick('file_store_logo')"
                                                                        @drop="dropFileStoreLogo" @dragover="$dragoverFile"
                                                                        @dragleave="$dragleaveFile">
                                                                        <template
                                                                            v-if="store_logo && store_logo.name !== ''">
                                                                            <label>{{ __('selected_file_name') }}{{
                                                                                store_logo.name }}</label>
                                                                        </template>
                                                                        <template v-else>
                                                                            <label><i
                                                                                    class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                                                            <label>{{
                                                                                __('drop_files_here_or_click_to_upload')
                                                                                }}</label>
                                                                        </template>
                                                                    </div>

                                                                    <div class="row mt-2" v-if="store_logo_url">
                                                                        <div class="col-auto">
                                                                            <img class="file-preview-thumb" :src="store_logo_url"
                                                                                title='Store Logo' alt='Store Logo' />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="form-group col-md-4">
                                                                <div class="form-group">
                                                                    <label> {{ __('national_identity_card') }}<i
                                                                            v-if="!id" class="text-danger">*</i></label>
                                                                    <input type="file" class="file-input"
                                                                        accept="image/*,application/pdf,.doc,.docx"
                                                                        ref="file_national_id_card" v-if="!isSellerRole"
                                                                        v-on:change="handleFileNationalIdCard">
                                                                    <div class="file-input-div bg-gray-100"
                                                                        v-if="!isSellerRole"
                                                                        @click="triggerRefClick('file_national_id_card')"
                                                                        @drop="dropFileNationalIdCard"
                                                                        @dragover="$dragoverFile"
                                                                        @dragleave="$dragleaveFile">
                                                                        <template
                                                                            v-if="national_id_card && national_id_card.name !== ''">
                                                                            <label>{{ __('selected_file_name') }} {{
                                                                                national_id_card.name }}</label>
                                                                        </template>
                                                                        <template v-else>
                                                                            <label><i
                                                                                    class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                                                            <label>{{
                                                                                __('drop_files_here_or_click_to_upload')
                                                                                }}</label>
                                                                        </template>
                                                                    </div>
                                                                    <div class="row mt-2" v-if="national_id_card_url">
                                                                        <div v-if="isImage(national_id_card_url)"
                                                                            class="col-auto">
                                                                            <img class="file-preview-thumb"
                                                                                :src="national_id_card_url"
                                                                                title='Identity Card'
                                                                                alt='Identity Card' />
                                                                        </div>
                                                                        <div v-else class="col-auto mt-2">
                                                                            <a target="_blank"
                                                                                :href="national_id_card_url"
                                                                                class="badge bg-success"> <i
                                                                                    class="fa fa-eye"></i> Identity
                                                                                Card</a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="form-group col-md-4">
                                                                <div class="form-group">
                                                                    <label> {{ __('address_proof') }}<i v-if="!id"
                                                                            class="text-danger">*</i></label>
                                                                    <input type="file" class="file-input"
                                                                        accept="image/*,application/pdf,.doc,.docx"
                                                                        ref="file_address_proof" v-if="!isSellerRole"
                                                                        v-on:change="handleFileAddressProof">
                                                                    <div class="file-input-div bg-gray-100"
                                                                        v-if="!isSellerRole"
                                                                        @click="triggerRefClick('file_address_proof')"
                                                                        @drop="dropFileAddressProof"
                                                                        @dragover="$dragoverFile"
                                                                        @dragleave="$dragleaveFile">
                                                                        <template v-if="address_proof_name == ''">
                                                                            <label><i
                                                                                    class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                                                            <label>{{
                                                                                __('drop_files_here_or_click_to_upload')
                                                                                }}</label>
                                                                        </template>
                                                                        <template v-else>
                                                                            <label>{{ __('selected_file_name') }} {{
                                                                                address_proof_name }}</label>
                                                                        </template>
                                                                    </div>
                                                                    <div class="row mt-2" v-if="address_proof_url">
                                                                        <div v-if="isImage(address_proof_url)"
                                                                            class="col-auto">
                                                                            <img class="file-preview-thumb"
                                                                                :src="address_proof_url"
                                                                                title='Address Proof'
                                                                                alt='Address Proof' />
                                                                        </div>
                                                                        <div v-else class="col-auto mt-2">
                                                                            <a target="_blank" :href="address_proof_url"
                                                                                class="badge bg-success">
                                                                                <i class="fa fa-eye"></i> Address
                                                                                Proof</a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            </div>

                                                            <div class="form-group col-md-4" v-if="!isSellerRole">
                                                                <label>{{ __('commission') }}<i
                                                                        class="text-danger">*</i></label>
                                                                <input type="number" class="form-control"
                                                                    v-model="commission"
                                                                    :placeholder="__('enter_commission') + ' (%)'"
                                                                    @input="validateCommission">

                                                                <p v-if="commissionvalidationError" class="error">{{
                                                                    commissionvalidationError
                                                                    }}</p>
                                                                <span class="text text-success font-size-13">
                                                                    <a href="javascript:void(0)"
                                                                        @click="commissionRule = true"
                                                                        title="How it works">{{ __('how_seller_commission_works') }}</a>
                                                                </span>
                                                            </div>
                                                            <div class="form-group col-md-4" v-else>
                                                                <label>{{ __('commission') }}</label>
                                                                <input type="number" class="form-control" :value="commission" disabled>
                                                                <small class="text-muted d-block mt-1">{{ __('commission_is_managed_by_admin') }}</small>
                                                            </div>

                                                            <div class="col-md-12" v-if="id && !isSellerRole">
                                                                <div class="row">
                                                                    <div class="form-group col-md-8">
                                                                        <label class="control-label"> {{ __('status') }}
                                                                            <i class="text-danger">*</i></label><br>
                                                                        <b-form-radio-group v-model="status" :options="[
                                                                            { text: __('registered'), 'value': 0 },
                                                                            { text: __('approved'), 'value': 1 },
                                                                            { text: __('not_approved'), 'value': 2 },
                                                                            { text: __('deactive'), 'value': 3 },
                                                                            { text: __('block'), 'value': 4 },
                                                                        ]" buttons button-variant="outline-primary"
                                                                            class="d-flex flex-wrap flex-md-nowrap"
                                                                            required></b-form-radio-group>
                                                                    </div>
                                                                    <div v-if="[2, 3, 4].includes(status)"
                                                                        class="form-group col-md-4">

                                                                        <label for="remark">{{ __('remark') }} <i
                                                                                class="text-danger">*</i></label>
                                                                        <textarea class="form-control" name="remark"
                                                                            id="remark" required v-model="remark"
                                                                            placeholder="Add a remark of this status..."
                                                                            rows="3" spellcheck="true"></textarea>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>

                                                        <div class="form-group col-md-12">
                                                            <label> {{ __('store_description') }}</label>
                                                            <editor placeholder="Enter store description"
                                                                v-model="translations[language.id].store_description"
                                                                :init="getEditorConfig()" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Non-translatable Cards (only shown in default language tab) -->
                                            <template v-if="language.is_default">

                                                <!-- ── Brand → Zone Assignments Card ── -->
                                                <div class="card" v-if="!isSellerRole">
                                                    <div class="card-header d-flex align-items-center justify-content-between">
                                                        <h4 class="mb-0">{{ __('brand_zone_assignments') }}</h4>
                                                        <button type="button" class="btn btn-sm btn-outline-primary"
                                                            @click="openAddBrandZone" :disabled="showAddCityForm">
                                                            <i class="fa fa-plus"></i>
                                                            {{ __('add_brand_zone') }}
                                                        </button>
                                                    </div>
                                                    <div class="card-body">
                                                        <div class="row" v-if="!showAddCityForm">
                                                            <div class="col-md-12">
                                                                <p class="text-muted mb-3" v-if="!brandZoneRows.length && !showBrandZoneForm">
                                                                    {{ __('no_brand_zone_assignments_yet') }}
                                                                </p>
                                                                <div v-for="(row, index) in brandZoneRows" :key="row.brand_id"
                                                                    class="d-flex align-items-start justify-content-between border rounded p-2 mb-2">
                                                                    <div>
                                                                        <strong>{{ row.brand_name }}</strong>
                                                                        <div class="mt-1">
                                                                            <span v-for="c in row.cities" :key="c.id" class="badge bg-secondary me-1 mb-1">
                                                                                {{ c.name }}<template v-if="c.zone"> - {{ c.zone }}</template>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div class="text-nowrap">
                                                                        <button type="button" class="btn btn-sm btn-primary me-1"
                                                                            @click="editBrandZoneRow(index)" v-b-tooltip.hover :title="__('edit')">
                                                                            <i class="fa fa-pencil-alt"></i>
                                                                        </button>
                                                                        <button type="button" class="btn btn-sm btn-danger"
                                                                            @click="removeBrandZoneRow(index)" v-b-tooltip.hover :title="__('delete')">
                                                                            <i class="fa fa-trash"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <!-- Add/Edit Brand Zone Row Form -->
                                                                <div v-if="showBrandZoneForm" class="border rounded p-3 mb-2 bg-light">
                                                                    <div class="row">
                                                                        <div class="form-group col-md-5">
                                                                            <label>{{ __('brand') }}<i class="text-danger">*</i></label>
                                                                            <select class="form-control" v-model="brandZoneForm.brand_id"
                                                                                :disabled="editingBrandZoneIndex !== null">
                                                                                <option :value="null">-- {{ __('select') }} --</option>
                                                                                <option v-for="b in availableBrandsForZoneForm" :key="b.id" :value="b.id">
                                                                                    {{ b.name }}
                                                                                </option>
                                                                            </select>
                                                                        </div>
                                                                        <div class="form-group col-md-7">
                                                                            <label>{{ __('select_zones') }}<i class="text-danger">*</i></label>
                                                                            <Select2 v-model="brandZoneForm.city_ids" :placeholder="__('select_cities')"
                                                                                :options="cities_options"
                                                                                :settings="{ multiple: 'multiple' }" />
                                                                        </div>
                                                                    </div>
                                                                    <div class="d-flex gap-2">
                                                                        <button type="button" class="btn btn-success btn-sm" @click="saveBrandZoneRow">
                                                                            {{ __('save') }}
                                                                        </button>
                                                                        <button type="button" class="btn btn-secondary btn-sm ml-2" @click="showBrandZoneForm = false">
                                                                            {{ __('cancel') }}
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <button type="button" class="btn btn-sm btn-outline-secondary mt-2"
                                                                    @click="toggleAddCityForm" v-if="!showBrandZoneForm">
                                                                    <i class="fa fa-map-marker-alt"></i> {{ __('define_new_zone') }}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <!-- Add Zone Form (zone name + boundary drawing) -->
                                                        <div v-if="showAddCityForm">
                                                            <p class="text-muted mb-3">
                                                                <i class="fa fa-info-circle"></i>
                                                                Enter a zone name, search the area on the map, then <strong>draw the zone boundary</strong> using the polygon or circle tool.
                                                            </p>
                                                            <div class="row">
                                                                <!-- Left: Zone form fields -->
                                                                <div class="col-md-5">
                                                                    <div class="form-group mt-0">
                                                                        <div class="form-group">
                                                                            <label>{{ __('zone_name') }}<i class="text-danger">*</i></label>
                                                                            <input type="text" class="form-control" v-model="newCity.zone"
                                                                                :placeholder="__('zone_name')">
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group mt-0">
                                                                        <div class="form-group">
                                                                            <label>{{ __('search_location') }}</label>
                                                                            <GmapAutocomplete type="search" class="form-control"
                                                                                :placeholder="__('search_your_location_on_map')"
                                                                                @place_changed="setCityPlace"
                                                                                :options="{ fields: ['address_components', 'formatted_address', 'geometry', 'name'], strictBounds: false }"
                                                                                id="city_map_search">
                                                                            </GmapAutocomplete>
                                                                            <small class="text-muted">{{ __('search_to_navigate_map_then_draw_zone_boundary') }}</small>
                                                                        </div>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div class="form-group col-md-6 mt-0">
                                                                            <div class="form-group">
                                                                                <label>{{ __('latitude') }}</label>
                                                                                <input type="text" class="form-control" v-model="newCity.latitude" readonly :placeholder="__('latitude')">
                                                                            </div>
                                                                        </div>
                                                                        <div class="form-group col-md-6">
                                                                            <div class="form-group">
                                                                                <label>{{ __('longitude') }}</label>
                                                                                <input type="text" class="form-control" v-model="newCity.longitude" readonly :placeholder="__('longitude')">
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="alert alert-warning py-2 px-3" v-if="!cityVertices">
                                                                        <i class="fa fa-draw-polygon mr-1"></i>
                                                                        {{ __('draw_zone_boundary_on_map_using_tools') }}
                                                                    </div>
                                                                    <div class="alert alert-success py-2 px-3" v-else>
                                                                        <i class="fa fa-check-circle mr-1"></i>
                                                                        {{ __('zone_boundary_drawn_successfully') }}
                                                                    </div>
                                                                    <div class="d-flex gap-2">
                                                                        <button type="button" class="btn btn-success btn-sm" @click="saveNewCity" :disabled="isSavingCity">
                                                                            <b-spinner v-if="isSavingCity" small class="mr-1"></b-spinner>
                                                                            {{ isSavingCity ? __('saving') : __('save_zone') }}
                                                                        </button>
                                                                        <button type="button" class="btn btn-secondary btn-sm ml-2" @click="toggleAddCityForm">{{ __('cancel') }}</button>
                                                                    </div>
                                                                </div>

                                                                <!-- Right: Map with polygon drawing -->
                                                                <div class="col-md-7">
                                                                    <div class="mb-2 d-flex gap-2">
                                                                        <button type="button" class="btn btn-sm btn-danger" @click="clearCityDrawing">
                                                                            <i class="fa fa-trash"></i> {{ __('clear_map') }}
                                                                        </button>
                                                                        <span v-if="cityVertices" class="badge bg-success align-self-center ml-2">{{ __('boundary_drawn') }}</span>
                                                                    </div>
                                                                    <GmapMap ref="cityMapRef"
                                                                        :center="cityMapCenter" :zoom="5"
                                                                        :mapTypeControl="true"
                                                                        :drawingControl="true"
                                                                        style="width: 100%; height: 450px;">
                                                                        <GmapMarker v-for="(m, mi) in cityMapMarkers" :key="mi"
                                                                            :position="m.position" :draggable="true" :clickable="true" />
                                                                        <gmap-info-window
                                                                            :options="{ maxWidth: 300, pixelOffset: { width: 0, height: -35 } }"
                                                                            :position="cityInfoWindow.position"
                                                                            :opened="cityInfoWindow.open"
                                                                            @closeclick="cityInfoWindow.open = false">
                                                                            <div v-html="cityInfoWindow.template"></div>
                                                                        </gmap-info-window>
                                                                    </GmapMap>
                                                                    <small class="text-muted d-block mt-1">{{ __('use_drawing_tools_on_map_to_draw_zone_boundary') }}</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- ── END Service Zones & Cities Card ── -->

                                                <!-- ── Service Zones & Cities Card (read-only, distributor's own profile) ── -->
                                                <div class="card" v-else>
                                                    <div class="card-header">
                                                        <h4 class="mb-0">{{ __('service_zones_and_cities') }}</h4>
                                                    </div>
                                                    <div class="card-body">
                                                        <div v-if="assignedCities.length">
                                                            <span v-for="city in assignedCities" :key="city.id"
                                                                class="badge bg-secondary me-1 mb-1 p-2">
                                                                {{ city.name }}<template v-if="city.zone"> - {{ city.zone }}</template>
                                                            </span>
                                                        </div>
                                                        <p v-else class="form-control-static">{{ __('no_zones_assigned') }}</p>
                                                        <small class="text-muted d-block mt-1">{{ __('zone_assignment_is_managed_by_admin') }}</small>
                                                    </div>
                                                </div>
                                                <!-- ── END Service Zones & Cities Card (read-only) ── -->

                                                <!-- ── Store Location Card ── -->
                                                <div class="card">
                                                    <div class="card-header">
                                                        <h4> {{ __('store_location_information') }}</h4>
                                                    </div>
                                                    <div class="card-body">
                                                        <div class="row">
                                                            <div class="form-group col-md-4">
                                                                <div class="form-group">
                                                                    <label> {{ __('state') }}</label>
                                                                    <input type="text" class="form-control"
                                                                        v-model="state" readonly
                                                                        :placeholder="__('state')" >
                                                                </div>
                                                            </div>

                                                            <div class="form-group col-md-4">
                                                                <div class="form-group">
                                                                    <label> {{ __('street') }}</label>
                                                                    <input type="text" class="form-control"
                                                                        v-model="street" readonly
                                                                        :placeholder="__('street')" >
                                                                </div>
                                                            </div>

                                                            <div class="form-group col-md-4">
                                                                <label for="location">{{ __('search_location')
                                                                    }}</label>

                                                                <div class="input-group">
                                                                    <GmapAutocomplete type="search" class="form-control"
                                                                        :placeholder="__('search_your_location_on_map')"
                                                                        @place_changed="setPlace"
                                                                        :options="{ fields: ['formatted_address', 'geometry', 'name', 'address_components'], strictBounds: false }"
                                                                        id="location">
                                                                    </GmapAutocomplete>

                                                                    <b-button type="button" variant="primary"
                                                                        class="search_location_btn" v-b-tooltip.hover
                                                                        title="Add current location"
                                                                        @click="getCurrentLocation">
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                            height="48px" viewBox="0 0 24 24"
                                                                            width="48px" fill="#FFFFFF">
                                                                            <title>current-location</title>
                                                                            <path d="M0 0h24v24H0V0z" fill="none" />
                                                                            <path
                                                                                d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
                                                                        </svg>
                                                                    </b-button>
                                                                </div>

                                                                <span class="text-danger d-block font-size-13">
                                                                    {{
                                                                        __('only_search_location_when_update_is_necessary')
                                                                    }}</span>
                                                                <span class="text text-primary font-size-13">
                                                                    {{
                                                                        __('search_your_seller_name_and_you_will_get_the_location_points_latitude_longitude_below')
                                                                    }}</span>
                                                            </div>

                                                            <div class="form-group col-md-4">
                                                                <div class="form-group">
                                                                    <label> {{ __('latitude') }}<i
                                                                            class="text-danger">*</i></label>
                                                                    <input type="text" class="form-control"
                                                                        v-model="latitude" readonly
                                                                        :placeholder="__('latitude')" >
                                                                </div>
                                                            </div>

                                                            <div class="form-group col-md-4">
                                                                <div class="form-group">
                                                                    <label> {{ __('longitude') }}<i
                                                                            class="text-danger">*</i></label>
                                                                    <input type="text" class="form-control"
                                                                        v-model="longitude" readonly
                                                                        :placeholder="__('longitude')" >
                                                                </div>
                                                            </div>

                                                            <div class="col-md-12 mb-3">
                                                                <div v-if="formatted_address" class="text-danger">
                                                                    {{
                                                                        __('draf_and_click_marker_to_your_shop_proper_location')
                                                                    }}</div>
                                                                <div id="map"
                                                                    style="position: relative; overflow: hidden;">
                                                                    <GmapMap :center="center" :zoom="13"
                                                                        :mapTypeControl=true
                                                                        style="width: 100%; height: 400px; margin-top: 20px"
                                                                        ref="mapRef" @click="handleMapClick">
                                                                        <GmapMarker :key="index"
                                                                            v-for="(m, index) in markers"
                                                                            :position="m.position" :clickable="true"
                                                                            :draggable="true" @drag="updateCoordinates"
                                                                            @click="updateCoordinates" />
                                                                        <gmap-info-window :options="{
                                                                            maxWidth: 300,
                                                                            pixelOffset: { width: 0, height: -35 }
                                                                        }" :position="infoWindow.position"
                                                                            :opened="infoWindow.open"
                                                                            @closeclick="infoWindow.open = false">
                                                                            <div v-html="infoWindow.template"></div>
                                                                        </gmap-info-window>
                                                                    </GmapMap>
                                                                </div>
                                                                <div v-if="formatted_address">
                                                                    <span class="title font-weight-bolder"><b>{{
                                                                        place_name
                                                                            }}</b> - {{ formatted_address }}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>

                                                <div class="card" v-if="isSellerRole">
                                                    <div class="card-header">
                                                        <h4>{{ __('seller_bank_information') }}</h4>
                                                    </div>
                                                    <div class="card-body">
                                                        <div class="row">
                                                            <div class="form-group col-md-3 mt-0">
                                                                <div class="form-group">
                                                                    <label>{{ __('bank_name') }}</label>
                                                                    <input type="text" class="form-control"
                                                                        v-model="bank_name"
                                                                        :placeholder="__('bank_name')">
                                                                </div>
                                                            </div>
                                                            <div class="form-group col-md-3 mt-0">
                                                                <div class="form-group">
                                                                    <label>{{ __('account_number') }}</label>
                                                                    <input type="text" class="form-control"
                                                                        v-model="account_number"
                                                                        :placeholder="__('account_number')">
                                                                </div>
                                                            </div>
                                                            <div class="form-group col-md-3 mt-0">
                                                                <div class="form-group">
                                                                    <label>{{ __('bank_ifsc_code') }}</label>
                                                                    <input type="text" class="form-control"
                                                                        v-model="bank_ifsc_code"
                                                                        :placeholder="__('bank_ifsc_code')">
                                                                </div>
                                                            </div>
                                                            <div class="form-group col-md-3 mt-0">
                                                                <div class="form-group">
                                                                    <label>{{ __('bank_account_name') }}</label>
                                                                    <input type="text" class="form-control"
                                                                        v-model="account_name"
                                                                        :placeholder="__('bank_account_name')">
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="card">
                                                    <div class="card-header">
                                                        <h4>{{ __('upi_information') }}</h4>
                                                    </div>
                                                    <div class="card-body">
                                                        <div class="row">
                                                            <div class="form-group col-md-4 mt-0">
                                                                <div class="form-group">
                                                                    <label>{{ __('upi_id') }}</label>
                                                                    <input type="text" class="form-control"
                                                                        v-model="upi_id"
                                                                        :placeholder="__('upi_id')">
                                                                    <small class="text-muted">e.g. name@upi</small>
                                                                </div>
                                                            </div>
                                                            <div class="form-group col-md-4">
                                                                <div class="form-group">
                                                                    <label>{{ __('upi_mobile') }}</label>
                                                                    <input type="text" class="form-control"
                                                                        v-model="upi_mobile"
                                                                        :placeholder="__('upi_mobile')"
                                                                        inputmode="numeric" maxlength="10">
                                                                </div>
                                                            </div>
                                                            <div class="form-group col-md-4">
                                                                <div class="form-group">
                                                                    <label>{{ __('upi_name') }}</label>
                                                                    <input type="text" class="form-control"
                                                                        v-model="upi_name"
                                                                        :placeholder="__('upi_name')">
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="card">
                                                    <div class="card-header">
                                                        <h4>{{ __('other_setting') }}</h4>
                                                    </div>
                                                    <div class="card-body">
                                                        <div class="row">
                                                            <div class="form-group col-md-3">
                                                                <div class="form-group">
                                                                    <label class="control-label"> {{
                                                                        __('require_product_approval') }}</label><br>
                                                                    <b-form-radio-group
                                                                        v-model="require_products_approval" :options="[
                                                                            { text: __('yes'), 'value': 1 },
                                                                            { text: __('no'), 'value': 0 },
                                                                        ]" buttons button-variant="outline-primary"
                                                                        required></b-form-radio-group>
                                                                </div>
                                                            </div>

                                                            <!-- Door Step Mode / Self Pickup Mode removed for Sarthi
                                                                 (all orders go out via driver/vehicle dispatch).
                                                                 Kept commented for reference / easy restore.
                                                            <div class="form-group col-md-3"
                                                                v-if="store_settings.self_pickup_mode == 1">
                                                                <div class="form-group">
                                                                    <label class="control-label"> {{
                                                                        __('door_step_mode') }}</label><br>
                                                                    <b-form-radio-group v-model="door_step_mode"
                                                                        :options="[
                                                                            { text: __('yes'), 'value': 1 },
                                                                            { text: __('no'), 'value': 0 },
                                                                        ]" buttons button-variant="outline-primary"
                                                                        required></b-form-radio-group>
                                                                </div>
                                                            </div>

                                                            <div class="form-group col-md-3"
                                                                v-if="store_settings.self_pickup_mode == 1">
                                                                <div class="form-group">
                                                                    <label class="control-label"> {{
                                                                        __('self_pickup_mode') }}</label><br>
                                                                    <b-form-radio-group v-model="self_pickup_mode"
                                                                        :options="[
                                                                            { text: __('yes'), 'value': 1 },
                                                                            { text: __('no'), 'value': 0 },
                                                                        ]" buttons button-variant="outline-primary"
                                                                        required></b-form-radio-group>
                                                                </div>
                                                            </div>
                                                            -->

                                                        </div>

                                                        <!-- Self Pickup Configuration Section removed for Sarthi — kept commented for reference.
                                                        <div v-if="store_settings.self_pickup_mode == 1 && self_pickup_mode == 1"
                                                            class="row mt-4">
                                                            <div class="col-12">
                                                                <h5 class="text-primary">{{
                                                                    __('self_pickup_configuration') }}</h5>
                                                            </div>

                                                            Map Section for Pickup Location
                                                            <div class="form-group col-md-12">
                                                                <div class="row">
                                                                    Left Side - Map Only (50%)
                                                                    <div class="col-md-6">
                                                                        Map View
                                                                        <div class="form-group">
                                                                            <div id="pickup_map"
                                                                                style="position: relative; overflow: hidden;">
                                                                                <GmapMap :zoom="13"
                                                                                    :center="pickupCenter"
                                                                                    :mapTypeControl=true
                                                                                    style="width: 100%; height: 400px; margin-top: 5px"
                                                                                    ref="pickupMapRef">
                                                                                    <GmapMarker :key="index"
                                                                                        v-for="(m, index) in pickupMarkers"
                                                                                        :position="google && m.position"
                                                                                        @click="pickupCenter = m.position"
                                                                                        :clickable="true"
                                                                                        :draggable="true"
                                                                                        @dragend="onPickupMarkerDragEnd" />
                                                                                    <gmap-info-window :options="{
                                                                                        maxWidth: 300,
                                                                                        pixelOffset: { width: 0, height: -35 }
                                                                                    }" :position="pickupInfoWindow.position"
                                                                                        :opened="pickupInfoWindow.open"
                                                                                        @closeclick="pickupInfoWindow.open = false">
                                                                                        <div
                                                                                            v-html="pickupInfoWindow.template">
                                                                                        </div>
                                                                                    </gmap-info-window>
                                                                                </GmapMap>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    Right Side - All Details (50%)
                                                                    <div class="col-md-6">
                                                                        Search Input
                                                                        <div class="form-group">
                                                                            <label for="pickup_city_name">{{
                                                                                __('search_location') }}</label>
                                                                            <GmapAutocomplete type="search"
                                                                                class="form-control"
                                                                                :placeholder="__('search_pickup_location_on_map')"
                                                                                @place_changed="setPickupPlace"
                                                                                :options="{ fields: ['address_components', 'formatted_address', 'geometry', 'name', 'place_id', 'plus_code', 'types'], strictBounds: false }"
                                                                                id="pickup_city_name">
                                                                            </GmapAutocomplete>
                                                                            <span class="text text-primary">{{
                                                                                __('search_your_pickup_location_and_to_find_coordinates')
                                                                                }}</span>
                                                                        </div>

                                                                        Pickup Store Address
                                                                        <div class="form-group">
                                                                            <label>{{ __('pickup_store_address') }} <i
                                                                                    class="text-danger">*</i></label>
                                                                            <textarea class="form-control"
                                                                                v-model="pickup_store_address" rows="2"
                                                                                :placeholder="__('pickup_store_address')"></textarea>
                                                                        </div>

                                                                        Coordinates
                                                                        <div class="form-group">
                                                                            <label for="pickup_latitude">{{
                                                                                __('latitude') }} <span
                                                                                    class="text-danger text-sm">*</span></label>
                                                                            <input type="text" class="form-control"
                                                                                name="pickup_latitude"
                                                                                id="pickup_latitude"
                                                                                v-model="pickup_latitude"
                                                                                :placeholder="__('latitude')" required
                                                                                readonly>
                                                                        </div>

                                                                        <div class="form-group">
                                                                            <label for="pickup_longitude">{{
                                                                                __('longitude') }}<span
                                                                                    class="text-danger text-sm">*</span></label>
                                                                            <input type="text" class="form-control"
                                                                                name="pickup_longitude"
                                                                                id="pickup_longitude"
                                                                                v-model="pickup_longitude"
                                                                                :placeholder="__('longitude')" required
                                                                                readonly>
                                                                        </div>

                                                                        Store Timings
                                                                        <div class="form-group">
                                                                            <label>{{ __('store_timings') }} <i
                                                                                    class="text-danger">*</i></label>
                                                                            <div class="row">
                                                                                <div class="col-md-6">
                                                                                    <label class="form-label">{{
                                                                                        __('opening_time') }}</label>
                                                                                    <input type="time"
                                                                                        class="form-control"
                                                                                        v-model="storeTimings.opening_time"
                                                                                        required>
                                                                                </div>
                                                                                <div class="col-md-6">
                                                                                    <label class="form-label">{{
                                                                                        __('closing_time') }}</label>
                                                                                    <input type="time"
                                                                                        class="form-control"
                                                                                        v-model="storeTimings.closing_time"
                                                                                        required>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        -->
                                                    </div>
                                                </div>
                                            </template>

                                        </b-tab>
                                    </b-tabs>
                                </div>

                                <!-- Loading state for languages -->
                                <div v-else-if="isLoadingLanguages" class="text-center p-3 mb-3">
                                    <b-spinner label="Loading languages..."></b-spinner>
                                </div>
                            </div>

                            <!-- Save button - common for all language tabs -->
                            <div class="card-footer">
                                <template v-if="id">
                                    <b-button type="submit" variant="primary" :disabled="isLoading"> {{ __('update') }}
                                        <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
                                    </b-button>
                                </template>
                                <template v-else>
                                    <b-button type="submit" variant="primary" :disabled="isLoading"> {{ __('save') }}
                                        <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
                                    </b-button>
                                    <button type="button" class="btn btn-danger" @click="clearForm()">
                                        {{ __('clear') }}</button>
                                </template>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
        <!-- Commission Rule Modal-->
        <b-modal v-model="commissionRule" size="lg" title="How commission (Admin commission) will get credited?">
            <b-container fluid>
                <ol>

                    <li>
                        Formula for commision (Admin commission) is <b>Sub total (Excluding delivery charge) / 100 *
                            commission percentage</b>
                    </li>
                    <li>
                        For example sub total is 1378 and commission is 20% then 1378 / 100 X 20 = 275.6 so 1378
                        - 275.6 = 1102.4 will get credited into seller's wallet.
                    </li>
                    <li>
                        275.6 is commission for Admin and 1102.4 is earning of seller .
                    </li>
                    <li>
                        If Order status is delivered then only seller will get earning.
                    </li>
                    <li>
                        Ex - 1. Order placed on 11-Aug-21 and product return days are set to 0 so 11-Aug + 0 days =
                        11-Aug seller earning will get credited when admin is logged in admin panel.
                    </li>
                    <li>
                        Ex - 2. Order placed on 11-Aug-21 and product return days are set to 7 so 11-Aug + 7 days =
                        18-Aug seller earning will get credited when admin is logged in admin panel.
                    </li>

                </ol>
            </b-container>
            <template #modal-footer>
                <b-button variant="secondary" size="sm" class="float-right" @click="commissionRule = false">{{
                    __('ok') }}
                </b-button>
            </template>
        </b-modal>
    </div>
</template>
<script>
import { VuejsDatatableFactory } from 'vuejs-datatable';
import axios from "axios";
import Select2 from 'v-select2-component';

import Multiselect from 'vue-multiselect';
import { gmapApi } from 'vue2-google-maps';
import Editor from '@tinymce/tinymce-vue';

import Auth from '../../Auth.js';
import TranslationHelper from '../../mixins/TranslationHelper.js';

export default {
    mixins: [TranslationHelper],
    components: {
        VuejsDatatableFactory,
        Select2,
        Multiselect,
        'editor': Editor
    },
    data: function () {
        return {
            login_user: Auth.user,
            cacheTimer: null,
            cachedData: null,
            skipCache: false,

            isLoading: false,
            center: { lat: 0, lng: 0 },
            map: "",
            drawingManager: "",

            currentPlace: null,
            markers: [],
            place_name: "",
            formatted_address: "",
            infoWindow: {
                position: { lat: 0, lng: 0 },
                open: false,
                template: ''
            },
            city: "",
            cities: [],

            name: "",
            email: "",
            mobile: "",
            country_code: "+91",
            countries: [],
            countryDropdownOpen: false,
            store_url: "",

            password: "",
            showPassword: false,
            confirm_password: "",
            showConfirmPassword: false,

            store_name: "",
            street: "",
            pincode_id: "",
            city_id: [],
            brand_ids: [],
            brandZoneRows: [],
            showBrandZoneForm: false,
            editingBrandZoneIndex: null,
            brandZoneForm: { brand_id: null, city_ids: [] },
            state: "",
            remark: "",
            bank_name: "",
            account_number: "",
            bank_ifsc_code: "",
            account_name: "",
            upi_id: "",
            upi_mobile: "",
            upi_name: "",
            zones: [],
            showAddCityForm: false,
            newCity: {
                name: '', latitude: '', longitude: '', state: '', zone: '',
                formatted_address: '', boundary_points: '', geolocation_type: '', radius: '',
            },
            cityMapCenter: { lat: 20.5937, lng: 78.9629 },
            cityMapMarkers: [],
            cityCurrentOverlay: null,
            cityVertices: '',
            cityGeolocationType: '',
            cityRadius: '',
            cityInfoWindow: { position: { lat: 0, lng: 0 }, open: false, template: '' },
            isSavingCity: false,
            commission: "",
            tax_name: "",
            tax_number: "",
            pan_number: "",
            latitude: "",
            longitude: "",
            store_description: "",
            require_products_approval: 0,
            // customer_privacy: 0,
            // Sarthi: view_order_otp/assign_delivery_boy/change_order_status_delivered removed, no UI here, owned by seller's own self-service settings
            status: 0,
            store_logo: "",
            store_logo_url: "",
            national_id_card: "",
            national_id_card_url: "",
            national_id_card_name: "",

            address_proof: "",
            address_proof_url: "",
            address_proof_name: "",

            brands: [],
            id: null,
            admin_id: null,
            record: null,
            id_card: "",
            proof: "",

            commissionRule: false,
            mobilevalidationError: null,
            commissionvalidationError: null,
            upi_idValidationError: null,
            isFormLoaded: false, // Flag to prevent form refilling
            isUserTyping: false, // Flag to track if user is actively typing

            // Self Pickup fields
            self_pickup_mode: 0,
            door_step_mode: 1,
            pickup_store_address: "",
            pickup_latitude: "",
            pickup_longitude: "",
            pickup_store_timings: "",

            // Pickup map properties
            pickupCenter: { lat: 0, lng: 0 },
            pickupMarkers: [],
            pickupInfoWindow: {
                position: { lat: 0, lng: 0 },
                open: false,
                template: ''
            },
            pickupCurrentPlace: null,

            // Store timings (single time range)
            storeTimings: {
                opening_time: '09:00',
                closing_time: '18:00'
            },

            // Store settings for watcher
            store_settings: {
                one_seller_cart: 0,
                self_pickup_mode: 0
            },

            // Multi-language support
            activeLanguageTab: 0,
            translations: {},
            defaultLanguageId: null,
            languages: [],
            isLoadingLanguages: false,

            // Translate buttons
            translatableFields: ['name', 'store_name', 'store_description'],
            translateSuccessMessage: '',
            loadingEmpty: false,
            loadingOverwrite: false,
        }
    },
    watch: {
        // Auto-disable self pickup when one seller cart is turned off
        'store_settings.one_seller_cart'(newValue) {
            if (newValue == 0) {
                this.self_pickup_mode = 0;
                this.door_step_mode = 1;
            }
        },

        // Validation: When self pickup mode is enabled, at least one delivery mode should be enabled
        'self_pickup_mode'(newValue) {
            this.ensureAtLeastOneDeliveryMode('self_pickup_mode');
        },

        'door_step_mode'(newValue) {
            this.ensureAtLeastOneDeliveryMode('door_step_mode');
        },
        // Sync name field when language tab changes
        activeLanguageTab: function (newTab) {
            if (this.languages.length > 0 && this.languages[newTab]) {
                const currentLangId = this.languages[newTab].id;
                if (this.translations[currentLangId]) {
                    // Update the name field to reflect current language
                    this.name = this.translations[currentLangId].name || '';
                }
            }
        },
        name: function () {
            // Update translation when name changes
            const currentLangId = this.getCurrentLanguageId();
            if (currentLangId && this.translations[currentLangId]) {
                this.translations[currentLangId].name = this.name;
            }
            if (!this.id) this.debouncedSave();
        },
        email: function () { if (!this.id) this.debouncedSave(); },
        mobile: function () { if (!this.id) this.debouncedSave(); },
        store_url: function () { if (!this.id) this.debouncedSave(); },
        store_name: function () { if (!this.id) this.debouncedSave(); },
        street: function () { if (!this.id) this.debouncedSave(); },
        city_id: { handler: function () { if (!this.id) this.debouncedSave(); }, deep: true },
        brand_ids: { handler: function () { if (!this.id) this.debouncedSave(); }, deep: true },
        state: function () { if (!this.id) this.debouncedSave(); },
        upi_id: function () { if (!this.id) this.debouncedSave(); },
        upi_mobile: function () { if (!this.id) this.debouncedSave(); },
        upi_name: function () { if (!this.id) this.debouncedSave(); },
        commission: function () { if (!this.id) this.debouncedSave(); },
        tax_name: function () { if (!this.id) this.debouncedSave(); },
        tax_number: function () { if (!this.id) this.debouncedSave(); },
        pan_number: function () { if (!this.id) this.debouncedSave(); },
        latitude: function () { if (!this.id) this.debouncedSave(); },
        longitude: function () { if (!this.id) this.debouncedSave(); },
        place_name: function () { if (!this.id) this.debouncedSave(); },
        formatted_address: function () { if (!this.id) this.debouncedSave(); },
        store_description: function () { if (!this.id) this.debouncedSave(); },
        require_products_approval: function () { if (!this.id) this.debouncedSave(); },
        self_pickup_mode: function () { if (!this.id) this.debouncedSave(); },
        door_step_mode: function () { if (!this.id) this.debouncedSave(); },
        pickup_store_address: function () { if (!this.id) this.debouncedSave(); },
        pickup_latitude: function () { if (!this.id) this.debouncedSave(); },
        pickup_longitude: function () { if (!this.id) this.debouncedSave(); },
        storeTimings: { handler: function () { if (!this.id) this.debouncedSave(); }, deep: true },
        translations: { handler: function () { if (!this.id) this.debouncedSave(); }, deep: true }
    },
    created: function () {
        this.getBrands();
        this.getZones();
        this.getCities();
        this.getCountries();
        this.getSellerCommission();
        this.getStoreSettings();
        const languagesPromise = this.fetchActiveLanguages();

        this.id = this.$route.params.id;
        if (this.isSellerRole) {
            this.id = this.login_user.seller.id;
        }

        if (this.id) {
            this.getSeller();
        } else {
            languagesPromise.then(() => {
                this.restoreCache();
            });
        }
    },
    beforeDestroy: function () {
        if (!this.id && !this.skipCache) this.saveCache();
        if (this.cacheTimer) clearTimeout(this.cacheTimer);
        document.removeEventListener('click', this.handleCountryDropdownOutsideClick);
    },
    computed: {
        brands_options: function () {
            var temp = [];
            if (this.brands.length !== 0) {
                this.brands.forEach(brand => {
                    temp.push({ id: brand.id, text: brand.name })
                });
            }
            return temp;
        },
        availableBrandsForZoneForm: function () {
            const usedIds = this.brandZoneRows
                .filter((r, idx) => idx !== this.editingBrandZoneIndex)
                .map(r => String(r.brand_id));
            return this.brands.filter(b => !usedIds.includes(String(b.id)));
        },
        assignedBrands: function () {
            if (!Array.isArray(this.brand_ids) || this.brand_ids.length === 0) {
                return [];
            }
            const selected = this.brand_ids.map(String);
            return this.brands.filter(brand => selected.includes(String(brand.id)));
        },
        assignedCities: function () {
            if (!Array.isArray(this.city_id) || this.city_id.length === 0) {
                return [];
            }
            const selected = this.city_id.map(String);
            return this.cities.filter(city => selected.includes(String(city.id)));
        },
        cities_options: function () {
            if (!Array.isArray(this.cities) || this.cities.length === 0) {
                return [];
            }
            return this.cities.map(city => ({
                id: city.id,
                text: (city.name || '') + '-' + (city.zone || '')
            }));
        },
        google: gmapApi,
        // Computed property to safely access $roleSeller
        roleSeller() {
            return (this.$roleSeller !== undefined) ? this.$roleSeller : '';
        },
        // Computed property to check if current user is seller
        // Safely checks all required properties before comparison
        isSellerRole() {
            try {
                return this.login_user &&
                    this.login_user.role &&
                    this.login_user.role.name &&
                    this.roleSeller &&
                    this.roleSeller === this.login_user.role.name;
            } catch (e) {
                return false;
            }
        }
    },
    methods: {
        /**
         * File inputs live inside a `v-for` (language tabs).
         * In Vue 2, any `ref` used inside a loop becomes an ARRAY in `$refs`.
         * So `$refs.someRef.click()` can fail with:
         *   "click is not a function"
         * because `$refs.someRef` is actually `[HTMLInputElement]`.
         *
         * This helper safely handles both cases (array ref and single ref).
         * Uses $nextTick to ensure refs are available after DOM updates.
         */
        triggerRefClick(refName) {
            // Use $nextTick to ensure refs are available after Vue updates DOM
            this.$nextTick(() => {
                try {
                    const ref = this.$refs[refName];

                    // If ref doesn't exist, exit silently
                    if (!ref) {
                        return;
                    }

                    // Handle array case (refs inside v-for)
                    if (Array.isArray(ref)) {
                        // Find first valid element in array
                        for (let i = 0; i < ref.length; i++) {
                            if (ref[i] && typeof ref[i].click === 'function') {
                                ref[i].click();
                                return;
                            }
                        }
                        return;
                    }

                    // Handle single ref case
                    if (typeof ref.click === 'function') {
                        ref.click();
                    }
                } catch (e) {
                    // Keep silent; upload input is a best-effort UX helper.
                    console.warn('Error triggering file input click:', e);
                }
            });
        },

        // Get editor configuration with safe fallbacks
        getEditorConfig() {
            const plugins = (this.$editorPlugins && Array.isArray(this.$editorPlugins))
                ? this.$editorPlugins
                : ["autolink", "lists", "link", "image", "charmap", "anchor", "searchreplace", "visualblocks", "media", "table", "wordcount", "code", "codesample"];

            const toolbar = this.$editorToolbar || "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | charmap | code | removeformat";

            const fontSizes = this.$editorFont_size_formats || '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt';

            return {
                height: 400,
                plugins: plugins,
                toolbar: toolbar,
                font_size_formats: fontSizes,
                ...this.$tinymceImageUploadOptions()
            };
        },

        fetchActiveLanguages() {
            this.isLoadingLanguages = true;
            return axios.get(this.$apiUrl + '/active_languages')
                .then(response => {
                    if (response.data.data) {
                        this.languages = response.data.data;
                        const defaultLang = this.languages.find(lang => lang.is_default === 1);
                        if (defaultLang) {
                            this.defaultLanguageId = defaultLang.id;
                        }
                        this.initializeTranslations();
                        this.isLoadingLanguages = false;
                    } else {
                        this.isLoadingLanguages = false;
                    }
                })
                .catch(error => {
                    console.error('Error loading languages:', error);
                    this.isLoadingLanguages = false;
                });
        },

        initializeTranslations() {
            const allTranslations = {};
            this.languages.forEach(language => {
                allTranslations[language.id] = {
                    name: '',
                    store_name: '',
                    store_description: '',
                };
            });
            this.translations = allTranslations;
        },

        getCurrentLanguageId() {
            if (this.languages.length > 0 && this.activeLanguageTab >= 0) {
                return this.languages[this.activeLanguageTab].id;
            }
            return this.defaultLanguageId || (this.languages.length > 0 ? this.languages[0].id : null);
        },

        getCities() {
            this.isLoading = true;
            axios.get(this.$apiUrl + '/cities')
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    const raw = data.data;
                    const list = (raw && raw.cities) ? raw.cities : raw;
                    this.cities = Array.isArray(list) ? list : (list && typeof list === 'object' ? Object.values(list) : [])
                }).catch(error => {
                    this.isLoading = false;
                    if (error?.request?.statusText) {
                        this.showError(error.request.statusText);
                    } else if (error.message) {
                        this.showError(error.message);
                    } else {
                        this.showError(__('something_went_wrong'));
                    }
                });
        },
        handleCountryDropdownOutsideClick(event) {
            if (this.countryDropdownOpen && this.$refs.countryDropdown && !this.$refs.countryDropdown.contains(event.target)) {
                this.countryDropdownOpen = false;
            }
        },
        getCountries() {
            axios.get(this.$apiUrl + '/countries', { params: { limit: 250 } })
                .then((response) => {
                    this.countries = response.data.data || [];
                    if (!this.countries.some(c => c.dial_code === this.country_code)) {
                        const india = this.countries.find(c => c.dial_code === '+91');
                        if (india) this.country_code = india.dial_code;
                    }
                })
                .catch(() => {
                    this.countries = [];
                });
        },
        getZones() {
            axios.get(this.$apiUrl + '/loading_slips/zones')
                .then((response) => {
                    const data = response.data;
                    this.zones = (data.data && Array.isArray(data.data)) ? data.data : [];
                }).catch(() => {
                    this.zones = [];
                });
        },

        toggleAddCityForm() {
            this.showAddCityForm = !this.showAddCityForm;
            if (this.showAddCityForm) {
                this.newCity.zone = '';
                this.$nextTick(() => { this.initCityMap(); });
            } else {
                this.resetNewCityForm();
            }
        },

        initCityMap() {
            // cityMapRef is inside v-for (language tabs), so Vue gives us an array
            let mapRef = this.$refs.cityMapRef;
            if (!mapRef) return;
            if (Array.isArray(mapRef)) mapRef = mapRef[0];
            if (!mapRef || !mapRef.$mapPromise) return;
            mapRef.$mapPromise.then((map) => {
                const drawingManager = new google.maps.drawing.DrawingManager({
                    drawingMode: google.maps.drawing.OverlayType.POLYGON,
                    drawingControl: true,
                    drawingControlOptions: {
                        position: google.maps.ControlPosition.TOP_CENTER,
                        drawingModes: [
                            google.maps.drawing.OverlayType.POLYGON,
                            google.maps.drawing.OverlayType.CIRCLE,
                        ]
                    },
                    polygonOptions: { editable: true, strokeColor: '#FF0000', fillColor: '#FF0000', fillOpacity: 0.35 },
                    circleOptions: { fillColor: '#666666', fillOpacity: 0.5, strokeWeight: 1, clickable: true, editable: true, draggable: true }
                });
                drawingManager.setMap(map);
                this.cityDrawingManager = drawingManager;

                google.maps.event.addListener(drawingManager, 'overlaycomplete', (event) => {
                    if (this.cityCurrentOverlay) {
                        this.cityCurrentOverlay.setMap(null);
                    }
                    this.cityCurrentOverlay = event.overlay;
                    if (event.type === 'circle') {
                        this.cityGeolocationType = 'circle';
                        this.cityRadius = event.overlay.getRadius();
                        this.cityVertices = JSON.stringify([{
                            lat: event.overlay.getCenter().lat(),
                            lng: event.overlay.getCenter().lng(),
                        }]);
                    } else {
                        this.cityGeolocationType = 'polygon';
                        this.cityVertices = event.overlay.getPath().getArray();
                    }
                });
            });
        },

        clearCityDrawing() {
            if (this.cityCurrentOverlay) {
                this.cityCurrentOverlay.setMap(null);
                this.cityCurrentOverlay = null;
            }
            this.cityVertices = '';
            this.cityGeolocationType = '';
            this.cityRadius = '';
        },

        setCityPlace(place) {
            if (!place || !place.geometry) return;
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            this.cityMapCenter = { lat, lng };
            this.cityMapMarkers = [{ position: { lat, lng } }];
            this.newCity.latitude = lat;
            this.newCity.longitude = lng;
            this.newCity.name = place.name || this.newCity.name;
            const parts = (place.formatted_address || '').split(',');
            this.newCity.state = parts.length > 1 ? parts[parts.length - 2].trim() : '';
            this.newCity.formatted_address = place.formatted_address || '';
            this.cityInfoWindow = {
                position: { lat, lng },
                open: true,
                template: `<b>${this.newCity.name}</b><br>${this.newCity.formatted_address}`,
            };
        },

        async saveNewCity() {
            if (!this.newCity.name) return this.showError(__('city_name') + ' ' + __('is_required'));
            if (!this.newCity.zone) return this.showError(__('zone_name') + ' ' + __('is_required'));
            if (!this.newCity.latitude || !this.newCity.longitude) return this.showError(__('please_search_and_select_city_on_map'));
            if (!this.cityVertices) return this.showError(__('draw_city_boundary_on_map_required'));

            this.isSavingCity = true;
            try {
                const formData = new FormData();
                for (const key in this.newCity) {
                    formData.append(key, this.newCity[key] ?? '');
                }
                formData.append('language_id', this.defaultLanguageId || 1);
                formData.append('zone', this.newCity.zone);
                formData.append('time_to_travel', 0);
                formData.append('min_amount_for_free_delivery', 0);
                formData.append('delivery_charge_method', 'fixed_charge');
                formData.append('fixed_charge', 0);
                formData.append('geolocation_type', this.cityGeolocationType);
                formData.append('radius', this.cityRadius || '');
                if (this.cityGeolocationType === 'circle') {
                    formData.append('boundary_points', this.cityVertices);
                } else {
                    formData.append('boundary_points', JSON.stringify(this.cityVertices));
                }

                const response = await axios.post(this.$apiUrl + '/cities/save', formData);
                const newId = response.data?.data?.id;
                if (newId) {
                    // Add to cities list so it's selectable in brand-zone assignment
                    this.cities.push({ id: newId, name: this.newCity.name, zone: this.newCity.zone });

                    // If zone is new, add it to zones list
                    const zone = this.newCity.zone;
                    const zoneExists = this.zones.find(z => z.zone === zone);
                    if (!zoneExists) {
                        this.zones.push({ zone, city_count: 1 });
                    } else {
                        zoneExists.city_count = (zoneExists.city_count || 0) + 1;
                    }

                    this.showMessage('success', __('city_saved_successfully'));
                    this.resetNewCityForm();
                    this.showAddCityForm = false;
                    this.getCities();
                } else {
                    this.showError(__('something_went_wrong'));
                }
            } catch (error) {
                const msg = error.response?.data?.message || error.message || __('something_went_wrong');
                this.showError(msg);
            } finally {
                this.isSavingCity = false;
            }
        },

        resetNewCityForm() {
            this.newCity = {
                name: '', latitude: '', longitude: '', state: '', zone: '',
                formatted_address: '', boundary_points: '', geolocation_type: '', radius: '',
            };
            this.cityMapMarkers = [];
            this.cityMapCenter = { lat: 20.5937, lng: 78.9629 };
            this.cityInfoWindow = { position: { lat: 0, lng: 0 }, open: false, template: '' };
            this.clearCityDrawing();
        },

        loadBrandZoneMappings() {
            if (!this.id) return;
            axios.get(this.$apiUrl + '/admin/brand-mappings', { params: { seller_id: this.id, per_page: 500 } })
                .then((response) => {
                    const rows = (response.data && response.data.data) ? response.data.data : [];
                    this.brandZoneRows = rows.map(r => ({
                        brand_id: r.brand_id,
                        brand_name: r.brand ? r.brand.name : '',
                        city_ids: (r.city_ids || []).map(String),
                        cities: r.cities || [],
                    }));
                    this.syncDerivedFromBrandZoneRows();
                })
                .catch(() => { this.brandZoneRows = []; });
        },
        syncDerivedFromBrandZoneRows() {
            this.brand_ids = this.brandZoneRows.map(r => String(r.brand_id));
            const cityIds = new Set();
            this.brandZoneRows.forEach(r => r.city_ids.forEach(id => cityIds.add(String(id))));
            this.city_id = [...cityIds];
        },
        openAddBrandZone() {
            this.editingBrandZoneIndex = null;
            this.brandZoneForm = { brand_id: null, city_ids: [] };
            this.showBrandZoneForm = true;
        },
        editBrandZoneRow(index) {
            this.editingBrandZoneIndex = index;
            const row = this.brandZoneRows[index];
            this.brandZoneForm = { brand_id: row.brand_id, city_ids: [...row.city_ids] };
            this.showBrandZoneForm = true;
        },
        saveBrandZoneRow() {
            if (!this.brandZoneForm.brand_id) {
                return this.showError(__('brand') + ' ' + __('is_required'));
            }
            if (!Array.isArray(this.brandZoneForm.city_ids) || !this.brandZoneForm.city_ids.length) {
                return this.showError(__('select_zones') + ' ' + __('is_required'));
            }
            const brand = this.brands.find(b => String(b.id) === String(this.brandZoneForm.brand_id));
            const cityIds = this.brandZoneForm.city_ids.map(String);
            const cities = this.cities.filter(c => cityIds.includes(String(c.id)));
            const row = {
                brand_id: this.brandZoneForm.brand_id,
                brand_name: brand ? brand.name : '',
                city_ids: cityIds,
                cities,
            };
            if (this.editingBrandZoneIndex !== null) {
                this.brandZoneRows.splice(this.editingBrandZoneIndex, 1, row);
            } else {
                this.brandZoneRows.push(row);
            }
            this.syncDerivedFromBrandZoneRows();
            this.showBrandZoneForm = false;
            this.editingBrandZoneIndex = null;
        },
        removeBrandZoneRow(index) {
            this.brandZoneRows.splice(index, 1);
            this.syncDerivedFromBrandZoneRows();
        },
        getBrands() {

            this.isLoading = true
            axios.get(this.$apiUrl + '/products/brands/get')
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    this.brands = data.data;
                }).catch(error => {
                    this.isLoading = false;
                    if (error?.request?.statusText) {
                        this.showError(error.request.statusText);
                    } else if (error.message) {
                        this.showError(error.message);
                    } else {
                        this.showError(__('something_went_wrong'));
                    }
                });
        },
        getSellerCommission() {
            axios.get(this.$sellerApiUrl + '/seller_commission')
                .then((response) => {
                    let data = response.data;
                    this.commission = data.data.value;
                });
        },

        getStoreSettings() {
            axios.get(this.$apiUrl + '/store_settings')
                .then((response) => {
                    let data = response.data.data;
                    this.store_settings = data.store_settingsObject;

                    // Load store settings values
                    data.store_settings.forEach((item) => {
                        if (item.variable === 'one_seller_cart') {
                            this.store_settings.one_seller_cart = (item.value === '1') ? 1 : 0;
                        }
                        if (item.variable === 'self_pickup_mode') {
                            this.store_settings.self_pickup_mode = (item.value === '1') ? 1 : 0;
                        }
                    });
                });
        },

        setPlace(place) {
            this.currentPlace = place;
            this.addMarker()
        },
        addMarker() {
            if (this.currentPlace) {
                const marker = {
                    lat: this.currentPlace.geometry.location.lat(),
                    lng: this.currentPlace.geometry.location.lng(),
                    draggable: true,
                };
                this.markers.push({ position: marker });
                this.center = marker;

                this.latitude = this.currentPlace.geometry.location.lat();
                this.longitude = this.currentPlace.geometry.location.lng();

                let addressArr = this.currentPlace.formatted_address.split(",");
                this.street = addressArr[0] + " " + addressArr[1];

                // Extract state from Google Places response
                let stateName = "";
                if (this.currentPlace.address_components) {
                    for (let comp of this.currentPlace.address_components) {
                        if (comp.types && comp.types.includes('administrative_area_level_1')) {
                            stateName = comp.long_name;
                            break;
                        }
                    }
                }
                if (!stateName && this.currentPlace.formatted_address) {
                    if (addressArr.length >= 3) {
                        stateName = addressArr[addressArr.length - 2].trim();
                    } else if (addressArr.length === 2) {
                        stateName = addressArr[1].trim();
                    }
                }
                if (stateName) {
                    this.state = stateName;
                }

                this.place_name = this.currentPlace.name;
                this.formatted_address = this.currentPlace.formatted_address;

                this.infoWindow.position = { lat: this.latitude, lng: this.longitude }
                this.infoWindow.template = `<b>${this.place_name}</b><br>${this.formatted_address}`
                this.infoWindow.open = true;
                this.currentPlace = null;
            }
        },

        getCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    let latlng = new google.maps.LatLng(this.latitude, this.longitude);
                    this.mapConfig(latlng);
                });
            } else {
                this.showError("Geolocation is not supported by this browser.");
            }
        },
        handleMapClick(place) {
            this.latitude = place.latLng.lat();
            this.longitude = place.latLng.lng();
            let latlng = place.latLng;
            this.mapConfig(latlng);
        },
        mapConfig(latlng) {
            let vm = this;
            let geocoder = new google.maps.Geocoder;
            geocoder.geocode({ 'location': latlng }, function (results, status) {
                if (status === 'OK') {
                    let clikedPlace = results[0] || results[1];
                    if (clikedPlace) {
                        let addressArr = clikedPlace.formatted_address.split(",");
                        vm.street = addressArr[0] + " " + addressArr[1];

                        // Extract state from Geocode response
                        let stateName = "";
                        if (clikedPlace.address_components) {
                            for (let comp of clikedPlace.address_components) {
                                if (comp.types && comp.types.includes('administrative_area_level_1')) {
                                    stateName = comp.long_name;
                                    break;
                                }
                            }
                        }
                        if (!stateName && clikedPlace.formatted_address) {
                            if (addressArr.length >= 3) {
                                stateName = addressArr[addressArr.length - 2].trim();
                            } else if (addressArr.length === 2) {
                                stateName = addressArr[1].trim();
                            }
                        }
                        if (stateName) {
                            vm.state = stateName;
                        }

                        vm.place_name = addressArr[1] || addressArr[0];
                        vm.formatted_address = clikedPlace.formatted_address;
                        vm.infoWindow.position = { lat: vm.latitude, lng: vm.longitude }
                        vm.infoWindow.template = `<b>${vm.place_name}</b><br>${vm.formatted_address}`
                        vm.infoWindow.open = true;
                        vm.currentPlace = null;

                        vm.markers = [];
                        const marker = {
                            lat: parseFloat(vm.latitude),
                            lng: parseFloat(vm.longitude),
                            draggable: true,
                        }
                        vm.markers.push({ position: marker });
                        vm.center = marker;

                    } else {
                        console.warn('No results found');
                    }
                }
            });
        },

        updateCoordinates(location) {
            this.handleMapClick(location);
        },
        setCityId() {
            this.state = this.city.state;
            this.city_id = this.city.id;
        },
        /**
         * Helper to safely get file input ref (handles array refs from v-for)
         */
        getFileInputRef(refName) {
            const ref = this.$refs[refName];
            if (!ref) {
                return null;
            }
            // If ref is array (from v-for), get first valid element
            if (Array.isArray(ref)) {
                return ref.find(el => el && el.files) || null;
            }
            return ref;
        },

        handleFileStoreLogo() {
            const fileInput = this.getFileInputRef('file_store_logo');
            if (fileInput && fileInput.files && fileInput.files[0]) {
                this.store_logo = fileInput.files[0];
                this.store_logo_url = URL.createObjectURL(this.store_logo);
            }
        },
        dropFileStoreLogo(event) {
            event.preventDefault();
            const fileInput = this.getFileInputRef('file_store_logo');
            if (fileInput) {
                fileInput.files = event.dataTransfer.files;
                this.handleFileStoreLogo(); // Trigger the onChange event manually
            }
            // Clean up
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },

        handleFileNationalIdCard() {
            const fileInput = this.getFileInputRef('file_national_id_card');
            if (fileInput && fileInput.files && fileInput.files[0]) {
                this.national_id_card = fileInput.files[0];
                this.national_id_card_url = URL.createObjectURL(this.national_id_card);
            }
        },

        dropFileNationalIdCard(event) {
            event.preventDefault();
            const fileInput = this.getFileInputRef('file_national_id_card');
            if (fileInput) {
                fileInput.files = event.dataTransfer.files;
                this.handleFileNationalIdCard(); // Trigger the onChange event manually
            }
            // Clean up
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },

        handleFileAddressProof() {
            const fileInput = this.getFileInputRef('file_address_proof');
            if (fileInput && fileInput.files && fileInput.files[0]) {
                this.address_proof = fileInput.files[0];
                this.address_proof_url = URL.createObjectURL(this.address_proof);
                this.address_proof_name = this.address_proof.name;
            }
        },
        dropFileAddressProof(event) {
            event.preventDefault();
            const fileInput = this.getFileInputRef('file_address_proof');
            if (fileInput) {
                fileInput.files = event.dataTransfer.files;
                this.handleFileAddressProof(); // Trigger the onChange event manually
            }
            // Clean up
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },
        validateMobileNumber() {
            const mobileNumber = this.mobile;
            if (!/^\d{1,16}$/.test(mobileNumber)) {
                this.mobilevalidationError = "Mobile Number must be maximum 16 digits numbers.";
            } else {
                this.mobilevalidationError = null;
            }
        },
        validateCommission() {
            if (this.commission < 0 || this.commission > 100) {
                this.commissionvalidationError = "Percentage must be between 0 and 100.";
                this.commission = null;
            } else {
                this.commissionvalidationError = null;
            }
        },
        clearForm() {
            if (this.$refs['my-form']) this.$refs['my-form'].reset();
            Object.assign(this, {
                name: "", email: "", mobile: "", store_url: "", password: "", confirm_password: "",
                store_name: "", street: "", pincode_id: "", city_id: [], brand_ids: [], brandZoneRows: [],
                state: "", remark: "", bank_name: "", account_number: "", bank_ifsc_code: "", account_name: "", upi_id: "", upi_mobile: "", upi_name: "",
                commission: "", tax_name: "", tax_number: "", pan_number: "",
                latitude: "", longitude: "", store_description: "", require_products_approval: 0,
                status: 0, store_logo: "", store_logo_url: "", national_id_card: "",
                national_id_card_url: "", national_id_card_name: "", address_proof: "",
                address_proof_url: "", address_proof_name: "", place_name: "", formatted_address: "",
                markers: [], self_pickup_mode: 0, door_step_mode: 1, pickup_store_address: "",
                pickup_latitude: "", pickup_longitude: "", storeTimings: { opening_time: '09:00', closing_time: '18:00' },
                mobilevalidationError: null, commissionvalidationError: null, upi_idValidationError: null,
                isFormLoaded: false, activeLanguageTab: 0
            });
            this.initializeTranslations();
            this.infoWindow.open = false;
            localStorage.removeItem('seller_form_cache');
        },

        saveCache: function () {
            if (this.id || this.skipCache) return;
            try {
                const defaultLang = this.languages.find(lang => lang.is_default === 1);
                const defaultTranslation = defaultLang && this.translations[defaultLang.id]
                    ? this.translations[defaultLang.id]
                    : null;
                const data = {
                    name: defaultTranslation ? defaultTranslation.name : this.name,
                    email: this.email, mobile: this.mobile, store_url: this.store_url,
                    store_name: defaultTranslation ? defaultTranslation.store_name : this.store_name,
                    street: this.street, pincode_id: this.pincode_id,
                    city_id: this.city_id, brand_ids: this.brand_ids, state: this.state,
                    remark: this.remark, bank_name: this.bank_name, account_number: this.account_number, bank_ifsc_code: this.bank_ifsc_code, account_name: this.account_name, upi_id: this.upi_id, upi_mobile: this.upi_mobile,
                    upi_name: this.upi_name, commission: this.commission,
                    tax_name: this.tax_name, tax_number: this.tax_number, pan_number: this.pan_number,
                    latitude: this.latitude, longitude: this.longitude, place_name: this.place_name,
                    formatted_address: this.formatted_address,
                    store_description: defaultTranslation ? defaultTranslation.store_description : this.store_description,
                    require_products_approval: this.require_products_approval,
                    status: this.status, self_pickup_mode: this.self_pickup_mode, door_step_mode: this.door_step_mode,
                    pickup_store_address: this.pickup_store_address, pickup_latitude: this.pickup_latitude,
                    pickup_longitude: this.pickup_longitude, storeTimings: JSON.parse(JSON.stringify(this.storeTimings)),
                    translations: JSON.parse(JSON.stringify(this.translations)),
                    activeLanguageTab: this.activeLanguageTab,
                    timestamp: Date.now()
                };
                localStorage.setItem('seller_form_cache', JSON.stringify(data));
            } catch (e) { }
        },

        restoreCache: function () {
            try {
                const cached = localStorage.getItem('seller_form_cache');
                if (!cached) return;
                const data = JSON.parse(cached);
                if (data.timestamp && Date.now() - data.timestamp > 120000) {
                    localStorage.removeItem('seller_form_cache');
                    return;
                }
                this.cachedData = data;
                Object.keys(data).forEach(key => {
                    if (key === 'timestamp' || key === 'translations') return;
                    if (key === 'storeTimings' && data.storeTimings) {
                        this.storeTimings = data.storeTimings;
                    } else if (this.hasOwnProperty(key)) {
                        this[key] = data[key] !== undefined ? data[key] : this[key];
                    }
                });
                // Restore translations after languages have been initialized.
                if (data.translations && this.languages && this.languages.length > 0) {
                    this.languages.forEach(language => {
                        if (data.translations[language.id]) {
                            this.$set(this.translations, language.id, {
                                ...this.translations[language.id],
                                ...data.translations[language.id]
                            });
                        }
                    });
                    const defaultLang = this.languages.find(lang => lang.is_default === 1);
                    if (defaultLang && this.translations[defaultLang.id]) {
                        this.name = this.translations[defaultLang.id].name || this.name;
                        this.store_name = this.translations[defaultLang.id].store_name || this.store_name;
                        this.store_description = this.translations[defaultLang.id].store_description || this.store_description;
                    }
                }
                if (this.latitude && this.longitude) {
                    const marker = { lat: parseFloat(this.latitude), lng: parseFloat(this.longitude), draggable: true };
                    this.markers = [{ position: marker }];
                    this.center = marker;
                    this.infoWindow.position = { lat: parseFloat(this.latitude), lng: parseFloat(this.longitude) };
                    this.infoWindow.template = `<b>${this.place_name || 'Location'}</b><br>${this.formatted_address || ''}`;
                }
                if (this.pickup_latitude && this.pickup_longitude) {
                    this.pickupCenter = { lat: parseFloat(this.pickup_latitude), lng: parseFloat(this.pickup_longitude) };
                    this.pickupMarkers = [{ position: { lat: parseFloat(this.pickup_latitude), lng: parseFloat(this.pickup_longitude) } }];
                }
            } catch (e) {
                localStorage.removeItem('seller_form_cache');
            }
        },

        debouncedSave: function () {
            if (this.cacheTimer) clearTimeout(this.cacheTimer);
            this.cacheTimer = setTimeout(() => this.saveCache(), 500);
        },

        onInputFocus() {
            // Set flag when user starts typing
            this.isUserTyping = true;
        },

        onInputBlur() {
            // Reset flag when user stops typing (with a small delay)
            setTimeout(() => {
                this.isUserTyping = false;
            }, 1000);
        },
        getSeller() {
            // Prevent multiple calls and form refilling
            if (this.isFormLoaded || this.isUserTyping) {
                return;
            }

            axios.get(this.$apiUrl + '/sellers/edit/' + this.id)
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    if (data.status === 1) {
                        // Set flag to prevent refilling
                        this.isFormLoaded = true;

                        this.record = data.data

                        // Helper: show empty string when value is null, undefined, or string "null"
                        const emptyIfNull = (val) => (val != null && val !== "null") ? val : "";

                        this.admin_id = this.record.admin.id ?? this.record.admin_id;
                        this.email = this.record.admin.email ?? this.record.email;

                        this.mobile = this.record.mobile;
                        this.country_code = this.record.country_code || "+91";
                        this.store_url = this.record.store_url;

                        this.password = "";
                        this.confirm_password = "";

                        // Load translations from the seller object
                        const updatedTranslations = { ...this.translations };

                        if (this.record.translations && Array.isArray(this.record.translations)) {
                            // Convert array of translation objects to object keyed by language_id
                            this.record.translations.forEach(trans => {
                                const langId = trans.language_id;
                                updatedTranslations[langId] = {
                                    name: emptyIfNull(trans.name),
                                    store_name: emptyIfNull(trans.store_name),
                                    store_description: emptyIfNull(trans.store_description),
                                };
                            });
                        }

                        // For languages without translations, use base table data for default language
                        this.languages.forEach(language => {
                            if (!updatedTranslations[language.id] ||
                                (!updatedTranslations[language.id].name && !updatedTranslations[language.id].store_name)) {
                                if (language.is_default) {
                                    // Default language: use base table data as fallback
                                    updatedTranslations[language.id] = {
                                        name: emptyIfNull(this.record.name),
                                        store_name: emptyIfNull(this.record.store_name),
                                        store_description: emptyIfNull(this.record.store_description),
                                    };
                                }
                            }
                        });

                        // Set default language values for backward compatibility
                        const defaultLang = this.languages.find(lang => lang.is_default === 1);
                        if (defaultLang && updatedTranslations[defaultLang.id]) {
                            this.name = emptyIfNull(updatedTranslations[defaultLang.id].name) || emptyIfNull(this.record.name);
                            this.store_name = emptyIfNull(updatedTranslations[defaultLang.id].store_name) || emptyIfNull(this.record.store_name);
                            this.store_description = emptyIfNull(updatedTranslations[defaultLang.id].store_description) || emptyIfNull(this.record.store_description);
                        } else {
                            this.name = emptyIfNull(this.record.name);
                            this.store_name = emptyIfNull(this.record.store_name);
                            this.store_description = emptyIfNull(this.record.store_description);
                        }

                        // Single assignment for reactivity
                        this.translations = updatedTranslations;
                        this.street = emptyIfNull(this.record.street);
                        this.pincode_id = "";
                        this.city_id = emptyIfNull(this.record.city_id) ? this.record.city_id.split(",") : [];
                        this.brand_ids = Array.isArray(this.record.brand_ids) ? this.record.brand_ids.map(String) : [];
                        this.loadBrandZoneMappings();
                        this.state = emptyIfNull(this.record.state);
                        this.remark = emptyIfNull(this.record.remark);
                        this.bank_name = emptyIfNull(this.record.bank_name);
                        this.account_number = emptyIfNull(this.record.account_number);
                        this.bank_ifsc_code = emptyIfNull(this.record.bank_ifsc_code || this.record.ifsc_code);
                        this.account_name = emptyIfNull(this.record.account_name);
                        this.upi_id = emptyIfNull(this.record.upi_id);
                        this.upi_mobile = emptyIfNull(this.record.upi_mobile);
                        this.upi_name = emptyIfNull(this.record.upi_name);
                        this.commission = this.record.commission;
                        this.tax_name = emptyIfNull(this.record.tax_name);
                        this.tax_number = emptyIfNull(this.record.tax_number);
                        this.pan_number = emptyIfNull(this.record.pan_number);
                        this.latitude = this.record.latitude;
                        this.longitude = this.record.longitude;

                        this.place_name = emptyIfNull(this.record.place_name);
                        this.formatted_address = emptyIfNull(this.record.formatted_address);
                        this.require_products_approval = this.record.require_products_approval;
                        // this.customer_privacy = this.record.customer_privacy;
                        // Sarthi: view_order_otp/assign_delivery_boy/change_order_status_delivered removed, no UI here

                        // Self Pickup fields
                        this.self_pickup_mode = (this.record.self_pickup_mode === null || this.record.self_pickup_mode === undefined) ? 0 : this.record.self_pickup_mode;
                        this.door_step_mode = (this.record.door_step_mode === null || this.record.door_step_mode === undefined) ? 1 : this.record.door_step_mode;
                        this.pickup_store_address = emptyIfNull(this.record.pickup_store_address);
                        this.pickup_latitude = this.record.pickup_latitude || "";
                        this.pickup_longitude = this.record.pickup_longitude || "";

                        // Load store timings
                        if (this.record.pickup_store_timings) {
                            try {
                                const parsedTimings = JSON.parse(this.record.pickup_store_timings);
                                // Handle both old array format and new object format
                                if (Array.isArray(parsedTimings)) {
                                    // Convert old format to new format (use first day's timings)
                                    const firstDay = parsedTimings.find(day => day.is_open);
                                    if (firstDay) {
                                        this.storeTimings = {
                                            opening_time: firstDay.opening_time || '09:00',
                                            closing_time: firstDay.closing_time || '18:00'
                                        };
                                    }
                                } else {
                                    this.storeTimings = parsedTimings;
                                }
                            } catch (e) {
                                console.log('Error parsing store timings:', e);
                            }
                        }

                        // Set pickup map marker if coordinates exist
                        if (this.pickup_latitude && this.pickup_longitude) {
                            this.pickupCenter = {
                                lat: parseFloat(this.pickup_latitude),
                                lng: parseFloat(this.pickup_longitude)
                            };
                            this.pickupMarkers = [{
                                position: {
                                    lat: parseFloat(this.pickup_latitude),
                                    lng: parseFloat(this.pickup_longitude)
                                }
                            }];
                            this.pickupInfoWindow.position = {
                                lat: parseFloat(this.pickup_latitude),
                                lng: parseFloat(this.pickup_longitude)
                            };
                            this.pickupInfoWindow.template = `<b>Pickup Location</b><br>${this.pickup_store_address}`;
                        }

                        this.status = this.record.status;
                        this.store_logo = this.record.store_logo;

                        this.store_logo_url = this.$storageUrl + this.record.logo;
                        this.national_id_card_url = this.$storageUrl + this.record.national_identity_card;
                        this.address_proof_url = this.$storageUrl + this.record.address_proof;


                        const marker = {
                            lat: parseFloat(this.latitude),
                            lng: parseFloat(this.longitude),
                            draggable: true,
                        }
                        this.markers.push({ position: marker });
                        this.center = marker;

                        this.infoWindow.position = { lat: parseFloat(this.latitude), lng: parseFloat(this.longitude) }
                        this.infoWindow.template = `<b>${this.place_name}</b><br>${this.formatted_address}`
                        this.infoWindow.open = true;

                    } else {
                        this.showError(data.message);
                        setTimeout(() => {
                            this.$router.back();
                        }, 1000);
                    }
                }).catch(error => {
                    this.isLoading = false;
                    if (error?.request?.statusText) {
                        this.showError(error.request.statusText);
                    } else if (error.message) {
                        this.showError(error.message);
                    } else {
                        this.showError(__('something_went_wrong'));
                    }
                });
        },

        validateDefaultLanguageForTranslation() {
            const form = this.$refs['my-form'];

            // Trigger native browser validation UI
            if (form && !form.reportValidity()) {
                // Switch to default language tab so error field is visible
                this.$nextTick(() => {
                    this.switchToDefaultLanguageTab();
                });
                return false;
            }

            // Also validate required fields specifically
            return this.validateDefaultLanguage();
        },

        saveRecord: function () {
            // Validate default language fields
            if (!this.validateDefaultLanguage()) {
                return;
            }

            if (!this.isSellerRole && !this.brandZoneRows.length) {
                this.showError(__('please_assign_at_least_one_brand_zone'));
                return;
            }

            this.isLoading = true;
            let vm = this;

            // Collect all languages with translations to save
            const defaultLang = this.languages.find(lang => lang.is_default);
            const allTranslations = [];

            // Add default language translation (required)
            if (defaultLang) {
                const defaultTranslation = this.translations[defaultLang.id];
                allTranslations.push({
                    language_id: defaultLang.id,
                    name: defaultTranslation.name || '',
                    store_name: defaultTranslation.store_name || '',
                    store_description: defaultTranslation.store_description || ''
                });
            }

            // Add other languages that have data
            this.languages.forEach(language => {
                if (language.is_default) return; // Skip default, already added

                const translation = this.translations[language.id];
                const hasData = (translation.name && translation.name.trim() !== '') ||
                    (translation.store_name && translation.store_name.trim() !== '') ||
                    (translation.store_description && translation.store_description.trim() !== '');

                if (hasData) {
                    allTranslations.push({
                        language_id: language.id,
                        name: translation.name || '',
                        store_name: translation.store_name || '',
                        store_description: translation.store_description || ''
                    });
                }
            });

            // Single save call with all translations
            const saveAll = async () => {
                const sellerId = this.id; // For edit mode
                const defaultTranslation = this.translations[defaultLang.id];

                let formData = new FormData();

                // Determine URL
                let url = this.$apiUrl + '/sellers/save';
                if (sellerId) {
                    url = this.$apiUrl + '/sellers/update';
                    formData.append('id', sellerId);
                    formData.append('admin_id', this.admin_id);
                }

                // Send default language_id for backward compatibility
                formData.append('language_id', defaultLang.id);

                // Default language translatable fields (for main table)
                formData.append('name', defaultTranslation.name || '');
                formData.append('store_name', defaultTranslation.store_name || '');
                formData.append('store_description', defaultTranslation.store_description || '');

                // All required fields
                formData.append('email', this.email);
                formData.append('mobile', this.mobile);
                formData.append('country_code', this.country_code);
                formData.append('store_url', this.store_url);

                // Password only for new sellers or when changing
                if (!sellerId) {
                    formData.append('password', this.password);
                    formData.append('confirm_password', this.confirm_password);
                } else if (this.password) {
                    formData.append('password', this.password);
                    formData.append('confirm_password', this.confirm_password);
                }

                // Non-translatable fields
                formData.append('street', this.street);
                formData.append('pincode_id', this.pincode_id);
                if (!this.isSellerRole) {
                    formData.append('brand_zone_mappings', JSON.stringify(
                        this.brandZoneRows.map(r => ({ brand_id: r.brand_id, city_ids: r.city_ids }))
                    ));
                }
                formData.append('state', this.state);
                formData.append('remark', this.remark);
                formData.append('bank_name', this.bank_name || '');
                formData.append('account_number', this.account_number || '');
                formData.append('bank_ifsc_code', this.bank_ifsc_code || '');
                formData.append('ifsc_code', this.bank_ifsc_code || '');
                formData.append('account_name', this.account_name || '');
                formData.append('upi_id', this.upi_id || '');
                formData.append('upi_mobile', this.upi_mobile || '');
                formData.append('upi_name', this.upi_name || '');
                formData.append('commission', this.commission);
                formData.append('tax_name', this.tax_name);
                formData.append('tax_number', this.tax_number);
                formData.append('pan_number', this.pan_number);
                formData.append('latitude', this.latitude);
                formData.append('longitude', this.longitude);
                formData.append('place_name', this.place_name);
                formData.append('formatted_address', this.formatted_address);
                formData.append('require_products_approval', this.require_products_approval);
                formData.append('self_pickup_mode', this.self_pickup_mode);
                formData.append('door_step_mode', this.door_step_mode);
                formData.append('pickup_store_address', this.pickup_store_address);
                formData.append('pickup_latitude', this.pickup_latitude);
                formData.append('pickup_longitude', this.pickup_longitude);
                formData.append('pickup_store_timings', JSON.stringify(this.storeTimings));
                formData.append('status', this.status);

                // Send all translations as JSON array
                formData.append('translations', JSON.stringify(allTranslations));

                // Files (only for new sellers or when updating)
                if (this.store_logo) {
                    formData.append('store_logo', this.store_logo);
                }
                if (this.national_id_card) {
                    formData.append('national_id_card', this.national_id_card);
                }
                if (this.address_proof) {
                    formData.append('address_proof', this.address_proof);
                }

                try {
                    const response = await axios.post(url, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    const apiStatus = response?.data?.status;
                    if (apiStatus !== 1) {
                        const apiMessage = response?.data?.message || __('something_went_wrong');
                        throw new Error(apiMessage);
                    }

                    return response;
                } catch (error) {
                    throw error;
                }
            };

            // Execute single save with all translations
            saveAll()
                .then(() => {
                    vm.skipCache = true;
                    localStorage.removeItem('seller_form_cache');
                    vm.isLoading = false;

                    // Show success message first
                    const successMessage = __('seller_saved_successfully') || 'Seller saved successfully!';
                    vm.showMessage("success", successMessage);

                    // Then redirect after a short delay to ensure toast is visible
                    setTimeout(
                        function () {
                            if (vm.isSellerRole) {
                                vm.$router.push({ path: '/seller/profile' })
                            } else {
                                vm.$router.push({ path: '/sellers' })
                            }
                        }, 1500);
                })
                .catch(error => {
                    vm.isLoading = false;
                    // Laravel validation errors often return 422 with `errors` object
                    if (error?.response?.status === 422 && error?.response?.data?.errors) {
                        const errors = error.response.data.errors;
                        const firstKey = Object.keys(errors)[0];
                        const firstMsg = firstKey && Array.isArray(errors[firstKey]) ? errors[firstKey][0] : null;
                        vm.showError(firstMsg || error.response.data.message || __('something_went_wrong'));
                    } else if (error?.response?.data?.message) {
                        vm.showError(error.response.data.message);
                    } else if (error.request && error.request.statusText) {
                        vm.showError(error.request.statusText);
                    } else if (error?.message) {
                        vm.showError(error.message);
                    } else {
                        vm.showError(__('something_went_wrong'));
                    }
                });
        },

        validateDefaultLanguage() {
            if (!this.defaultLanguageId) {
                this.showError(__('default_language_not_found'));
                return false;
            }

            const defaultTranslation = this.translations[this.defaultLanguageId];

            // Check required fields for default language
            if (!defaultTranslation.name || defaultTranslation.name.trim() === '') {
                this.showError(__('please_fill_name_in_default_language'));
                this.switchToDefaultLanguageTab();
                return false;
            }

            if (!defaultTranslation.store_name || defaultTranslation.store_name.trim() === '') {
                this.showError(__('please_fill_store_name_in_default_language'));
                this.switchToDefaultLanguageTab();
                return false;
            }

            return true;
        },

        switchToDefaultLanguageTab() {
            const defaultLangIndex = this.languages.findIndex(lang => lang.id === this.defaultLanguageId);
            if (defaultLangIndex !== -1) {
                this.activeLanguageTab = defaultLangIndex;
            }
        },

        // Self Pickup methods (similar to EditCity.vue)
        setPickupPlace(place) {
            this.pickupCurrentPlace = place;
            this.addPickupMarker();
        },

        addPickupMarker() {
            if (this.pickupCurrentPlace) {
                const marker = {
                    lat: this.pickupCurrentPlace.geometry.location.lat(),
                    lng: this.pickupCurrentPlace.geometry.location.lng(),
                };
                this.pickupMarkers = [{ position: marker }];
                this.pickupCenter = marker;
                this.pickup_latitude = this.pickupCurrentPlace.geometry.location.lat();
                this.pickup_longitude = this.pickupCurrentPlace.geometry.location.lng();

                // Auto-fill the pickup store address with the full formatted address
                this.pickup_store_address = this.pickupCurrentPlace.formatted_address;

                this.pickupInfoWindow.position = { lat: this.pickup_latitude, lng: this.pickup_longitude };
                this.pickupInfoWindow.template = `<b>${this.pickupCurrentPlace.name}</b><br>${this.pickup_store_address}`;
                this.pickupInfoWindow.open = true;
                this.pickupCurrentPlace = null;
            }
        },

        onPickupMarkerDragEnd(event) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();

            this.pickup_latitude = lat.toString();
            this.pickup_longitude = lng.toString();

            // Update marker position
            this.pickupMarkers = [{
                position: { lat: lat, lng: lng }
            }];

            // Update info window
            this.pickupInfoWindow.position = { lat: lat, lng: lng };
            this.pickupInfoWindow.template = `<b>Selected Location</b><br>Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
            this.pickupInfoWindow.open = true;
        }
    },
    mounted() {
        document.addEventListener('click', this.handleCountryDropdownOutsideClick);
    }
};
</script>
<style scoped>
@import "../../../../node_modules/vue-multiselect/dist/vue-multiselect.min.css";

.country-code-dropdown {
    position: relative;
    flex: 0 0 auto;
    width: 110px;
}
.country-code-toggle {
    width: 100%;
    text-align: left;
    background: #fff;
    cursor: pointer;
}
.country-code-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1050;
    width: 100%;
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

/* Compact thumb for logo/identity/address previews - keeps layout aligned when multiple are shown */
.file-preview-thumb {
    max-height: 80px;
    max-width: 80px;
    width: auto;
    height: auto;
    object-fit: contain;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 4px;
}
</style>
