<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('store_settings') }}</h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item">
                                    <router-link to="/dashboard">{{ __('dashboard') }}</router-link>
                                </li>
                                <li class="breadcrumb-item active" aria-current="page">{{ __('store_settings') }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <section class="section">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">{{ __('update_system_settings') }}</h4>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12 vertical-tabs-container">
                                <div class="tab-buttons">
                                    <button v-for="(tab, index) in tabs" :key="index" @click="activeTab = tab"
                                        :class="{ 'active': activeTab === tab }">
                                        {{ tab }}
                                    </button>
                                </div>

                                <div class="tab-content">
                                    <div v-if="activeTab === __('store_setting')">
                                        <div class="card">
                                            <div class="card-header">
                                                <h4 class="card-title">{{ __('store_setting') }}</h4>
                                            </div>
                                            <div class="card-body">
                                                <form method="post" enctype="multipart/form-data"
                                                    @submit.prevent="saveStoreBasicSetting" novalidate>

                                                    <b-tabs v-model="activeLanguageTab" content-class="mt-3"
                                                        :lazy="false">
                                                        <b-tab v-for="language in languages" :key="language.id">
                                                            <template #title>
                                                                <span
                                                                    :class="{ 'text-primary font-weight-bold': language.is_default }">
                                                                    {{ language.name }}
                                                                </span>
                                                            </template>

                                                            <!-- Translate buttons (Store setting) -->
                                                            <div class="mb-3"
                                                                v-if="language.is_default && languages.length > 1">
                                                                <b-button size="sm" variant="outline-primary"
                                                                    class="mr-2"
                                                                    @click="translateEmptyStoreSetting(language)"
                                                                    v-b-tooltip.hover
                                                                    title="Only empty fields will be translated."
                                                                    :disabled="loadingEmpty || loadingOverwrite">
                                                                    <span v-if="!loadingEmpty">{{
                                                                        __('translate_empty_fields') }}</span>
                                                                    <b-spinner v-else small></b-spinner>
                                                                </b-button>
                                                                <b-button size="sm" variant="outline-danger"
                                                                    @click="translateOverwriteStoreSetting(language)"
                                                                    v-b-tooltip.hover
                                                                    title="All fields will be translated and overwritten."
                                                                    :disabled="loadingEmpty || loadingOverwrite">
                                                                    <span v-if="!loadingOverwrite">{{
                                                                        __('translate_and_overwrite') }}</span>
                                                                    <b-spinner v-else small></b-spinner>
                                                                </b-button>
                                                                <div v-if="translateSuccessMessage"
                                                                    class="text-success mt-2 font-weight-bold">{{
                                                                        translateSuccessMessage }}</div>
                                                            </div>

                                                            <div class="row">

                                                                <template v-if="language.is_default">
                                                                    <input type="hidden"
                                                                        v-model="store_settings.system_configurations">
                                                                    <input type="hidden"
                                                                        v-model="store_settings.system_timezone_gmt">
                                                                    <input type="hidden"
                                                                        v-model="store_settings.system_configurations_id">
                                                                </template>

                                                                <div class="form-group col-12 col-md-4 mb-3 mt-0"
                                                                    v-if="language.is_default">
                                                                    <label for="app_name">{{ __('app_name') }}:</label>
                                                                    <input type="text" class="form-control" required
                                                                        name="app_name" id="app_name"
                                                                        v-model="store_settings.app_name"
                                                                        placeholder="Name of the App - used in whole system" />

                                                                </div>

                                                                <div class="form-group col-12 col-md-4 mb-3"
                                                                    v-if="language.is_default">
                                                                    <label>{{ __('support_number') }}</label>
                                                                    <input type="text" class="form-control"
                                                                        v-model="store_settings.support_number"
                                                                        inputmode="numeric"
                                                                        @input="validateMobileNumber" />
                                                                    <span v-if="mobilevalidationError" class="error">
                                                                        {{ mobilevalidationError }}
                                                                    </span>
                                                                </div>

                                                                <div class="form-group col-12 col-md-4 mb-3"
                                                                    v-if="language.is_default">
                                                                    <label>{{ __('support_email') }}</label>
                                                                    <input type="email" class="form-control"
                                                                        v-model="store_settings.support_email" />
                                                                </div>

                                                                <div class="col-md-12" v-if="language.is_default">
                                                                    <div class="row">
                                                                        <!-- LOGO -->
                                                                        <div class="form-group col-12 col-md-4 mb-3 mt-0">
                                                                            <label>{{ __('logo') }}</label>
                                                                            <input type="file"
                                                                                :id="`logo_${language.code}`"
                                                                                class="file-input" accept="image/*"
                                                                                @change="onLogoUpload($event)" />
                                                                            <label :for="`logo_${language.code}`"
                                                                                class="file-input-div">
                                                                                <span v-if="Logoerror" class="error">{{
                                                                                    Logoerror }}</span>

                                                                                <template v-if="logo_name">
                                                                                    {{ __('selected_file_name') }} {{
                                                                                        logo_name }}
                                                                                </template>
                                                                                <template v-else>
                                                                                    <i
                                                                                        class="fa fa-cloud-upload-alt fa-2x"></i>
                                                                                    {{
                                                                                        __('drop_files_here_or_click_to_upload')
                                                                                    }}
                                                                                </template>
                                                                            </label>
                                                                            <img v-if="logo_url" :src="logo_url"
                                                                                class="img-fluid store-settings-img-preview" />
                                                                        </div>

                                                                        <!-- FSSAI -->
                                                                        <div class="form-group col-12 col-md-4 mb-3">
                                                                            <label>{{ __('fssai_lic_image') }}</label>
                                                                            <input type="file"
                                                                                :id="`fssaiLicImg_${language.code}`"
                                                                                class="file-input" accept="image/*"
                                                                                @change="onFssaiUpload($event)" />
                                                                            <label :for="`fssaiLicImg_${language.code}`"
                                                                                class="file-input-div">
                                                                                <span v-if="Fssaierror" class="error">{{
                                                                                    Fssaierror }}</span>

                                                                                <template v-if="fssai_lic_img_name">
                                                                                    {{ __('selected_file_name') }} {{
                                                                                        fssai_lic_img_name }}
                                                                                </template>
                                                                                <template v-else>
                                                                                    <i
                                                                                        class="fa fa-cloud-upload-alt fa-2x"></i>
                                                                                    {{
                                                                                        __('drop_files_here_or_click_to_upload')
                                                                                    }}
                                                                                </template>
                                                                            </label>
                                                                            <img v-if="fssai_lic_img_url"
                                                                                :src="fssai_lic_img_url"
                                                                                class="img-fluid store-settings-img-preview" />
                                                                        </div>

                                                                        <!-- PANEL LOGIN BACKGROUND -->
                                                                        <div class="form-group col-12 col-md-4 mb-3">
                                                                            <label>{{ __('panel_login_background_img')
                                                                            }}</label>
                                                                            <input type="file"
                                                                                :id="`panelLoginBgImg_${language.code}`"
                                                                                class="file-input" accept="image/*"
                                                                                @change="onPanelLoginBgUpload($event)" />
                                                                            <label
                                                                                :for="`panelLoginBgImg_${language.code}`"
                                                                                class="file-input-div">
                                                                                <span
                                                                                    v-if="Panel_login_background_imgerror"
                                                                                    class="error">{{
                                                                                        Panel_login_background_imgerror
                                                                                    }}</span>

                                                                                <template
                                                                                    v-if="panel_login_background_img_name">
                                                                                    {{ __('selected_file_name') }} {{
                                                                                        panel_login_background_img_name }}
                                                                                </template>
                                                                                <template v-else>
                                                                                    <i
                                                                                        class="fa fa-cloud-upload-alt fa-2x"></i>
                                                                                    {{
                                                                                        __('drop_files_here_or_click_to_upload')
                                                                                    }}
                                                                                </template>
                                                                            </label>
                                                                            <img v-if="panel_login_background_img_url"
                                                                                :src="panel_login_background_img_url"
                                                                                class="img-fluid store-settings-img-preview" />
                                                                        </div>

                                                                    </div>
                                                                </div>


                                                                <div class="form-group col-md-6">
                                                                    <label>{{ __('copyright_details') }}</label>
                                                                    <textarea class="form-control" rows="4"
                                                                        v-model="storeTranslations.copyright_details[language.code]"
                                                                        :placeholder="__('enter_copyright_details_here')"></textarea>
                                                                </div>

                                                            </div>

                                                        </b-tab>
                                                    </b-tabs>

                                                    <b-button type="submit" variant="primary" :disabled="isLoading"
                                                        v-if="$can('manage_store_settings')">
                                                        {{ __('update') }}
                                                        <b-spinner v-if="isLoading" small></b-spinner>
                                                    </b-button>

                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="activeTab === __('address_setting')">
                                        <div class="card">
                                            <div class="card-header">
                                                <h4 class="card-title">{{ __('store_address_settings') }}</h4>
                                            </div>
                                            <div class="card-body">
                                                <form method="post" enctype="multipart/form-data"
                                                    @submit.prevent="saveAddressSetting">

                                                    <b-tabs v-model="activeLanguageTab" content-class="mt-3"
                                                        :lazy="false">
                                                        <b-tab v-for="language in languages" :key="language.id">
                                                            <template #title>
                                                                <span
                                                                    :class="{ 'text-primary font-weight-bold': language.is_default }">
                                                                    {{ language.name }}
                                                                </span>
                                                            </template>

                                                            <!-- Translate buttons (Store address) -->
                                                            <div class="mb-3"
                                                                v-if="language.is_default && languages.length > 1">
                                                                <b-button size="sm" variant="outline-primary"
                                                                    class="mr-2"
                                                                    @click="translateEmptyAddressSetting(language)"
                                                                    v-b-tooltip.hover
                                                                    title="Only empty fields will be translated."
                                                                    :disabled="loadingEmpty || loadingOverwrite">
                                                                    <span v-if="!loadingEmpty">{{ __('translate_empty_fields') }}</span>
                                                                    <b-spinner v-else small></b-spinner>
                                                                </b-button>
                                                                <b-button size="sm" variant="outline-danger"
                                                                    @click="translateOverwriteAddressSetting(language)"
                                                                    v-b-tooltip.hover
                                                                    title="All fields will be translated and overwritten."
                                                                    :disabled="loadingEmpty || loadingOverwrite">
                                                                    <span v-if="!loadingOverwrite">{{ __('translate_and_overwrite') }}</span>
                                                                    <b-spinner v-else small></b-spinner>
                                                                </b-button>
                                                                <div v-if="translateSuccessMessage"
                                                                    class="text-success mt-2 font-weight-bold">{{
                                                                        translateSuccessMessage }}</div>
                                                            </div>

                                                            <div class="row">
                                                                <div class="form-group col-12 col-md-6 mt-0">
                                                                    <label for="store_address">{{ __('address') }}
                                                                    </label>
                                                                    <textarea class="form-control" name="store_address"
                                                                        id="store_address" rows="2"
                                                                        v-model="addressTranslations.store_address[language.code]"></textarea>
                                                                </div>
                                                                <div class="form-group col-12 col-md-6"
                                                                    v-if="language.is_default">
                                                                    <label for="map_latitude"> {{ __('latitude')
                                                                    }}</label>
                                                                    <input type="text" class="form-control" required
                                                                        name="map_latitude" id="map_latitude"
                                                                        v-model="store_settings.map_latitude"
                                                                        :placeholder='__("latitude")' />

                                                                </div>
                                                                <div class="form-group col-12 col-md-6"
                                                                    v-if="language.is_default">
                                                                    <label for="map_longitude"> {{ __('longitude')
                                                                    }}</label>
                                                                    <input type="text" class="form-control" required
                                                                        name="map_longitude" id="map_longitude"
                                                                        v-model="store_settings.map_longitude"
                                                                        :placeholder="__('longitude')" />
                                                                </div>
                                                                <div class="form-group col-12 col-md-6"
                                                                    v-if="language.is_default">
                                                                    <label for="currency"> {{ __('store_currency')
                                                                    }}(Symbol or
                                                                        Code-$ or USD):</label>
                                                                    <input type="text" class="form-control" required
                                                                        name="currency" id="currency"
                                                                        v-model="store_settings.currency"
                                                                        placeholder="Either Symbol or Code - For Example $ or USD" />
                                                                </div>

                                                                <div class="form-group col-12 col-md-6"
                                                                    v-if="language.is_default">
                                                                    <label for="currency_code"> {{ __('currency_code')
                                                                    }}</label>
                                                                    <select class="form-control form-select" required
                                                                        name="currency_code" id="currency_code"
                                                                        v-model="store_settings.currency_code">
                                                                        <option value="">Select Country Currency Code
                                                                        </option>
                                                                        <option v-for="code in currency_codes"
                                                                            v-if="code.currencyCode !== ''"
                                                                            :value='code.currencyCode'>
                                                                            {{ code.currencyCode + ' - ' +
                                                                                code.countryName }}
                                                                        </option>
                                                                    </select>
                                                                </div>

                                                                <div class="form-group col-12 col-md-6"
                                                                    v-if="language.is_default">
                                                                    <label for="decimal_point">{{ __('decimal_point')
                                                                    }}</label>
                                                                    <select class="form-control form-select" required
                                                                        name="decimal_point" id="decimal_point"
                                                                        v-model="store_settings.decimal_point">
                                                                        <option value="">{{
                                                                            __('select_currency_decimal_point')
                                                                        }}</option>
                                                                        <option value="0">0</option>
                                                                        <option value="1">1</option>
                                                                        <option value="2">2</option>
                                                                    </select>
                                                                </div>

                                                                <div class="form-group col-12 col-md-6"
                                                                    v-if="language.is_default">
                                                                    <label class="system_timezone"
                                                                        for="system_timezone">{{
                                                                            __('system_timezone') }}</label>
                                                                    <select class="form-control form-select"
                                                                        name="system_timezone" id="system_timezone"
                                                                        v-model="store_settings.system_timezone">
                                                                        <option
                                                                            v-for="timezone_option in timezone_options"
                                                                            :value="timezone_option[2]"
                                                                            :data-gmt="timezone_option[1]">
                                                                            {{ timezone_option[2] }} - GMT {{
                                                                                timezone_option[1]
                                                                            }} -
                                                                            {{ timezone_option[0] }}
                                                                        </option>
                                                                    </select>
                                                                </div>

                                                                <div class="form-group col-12 col-md-6"
                                                                    v-if="language.is_default">
                                                                    <label for="city_name">{{
                                                                        __('default_city') }}</label>

                                                                    <multiselect v-model="city" :options="cities"
                                                                        @close="setCityId"
                                                                        placeholder="Select & Search City" label="name"
                                                                        track-by="name" id="city_name" required>
                                                                        <template slot="singleLabel" slot-scope="props">
                                                                            <span class="option__desc">
                                                                                <span class="option__title">{{
                                                                                    props.option.name
                                                                                }}</span>
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

                                                                    <p v-if="cities.length === 0" class="text-muted">
                                                                        {{ __('city_not_found') }}. <router-link
                                                                            target="_blank" class="text-muted"
                                                                            to="/cities/create"
                                                                            v-if="$can('city_create')">Add new city
                                                                            here.</router-link>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </b-tab></b-tabs>
                                                    <div class="row">
                                                        <div class="form-group col-md-6">
                                                            <b-button type="submit" variant="primary"
                                                                :disabled="isLoading"
                                                                v-if="$can('manage_store_settings')">{{ __('update') }}
                                                                <b-spinner v-if="isLoading" small
                                                                    label="Spinning"></b-spinner>
                                                            </b-button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>

                                        </div>

                                    </div>
                                    <div v-if="activeTab === __('other_setting')">
                                        <div class="card">
                                            <div class="card-header">
                                                <h4 class="card-title">{{ __('other_setting') }}</h4>
                                            </div>
                                            <div class="card-body">
                                                <form method="post" enctype="multipart/form-data"
                                                    @submit.prevent="saveOtherSetting">
                                                    <div class="row">

                                                        <div class="form-group col-md-6 mt-0">
                                                            <label for="max_cart_items_count"> {{
                                                                __('maximum_items_allowed_in_cart') }} </label> <i
                                                                class="text-danger">*</i>
                                                            <input type="number" required class="form-control"
                                                                name="max_cart_items_count" id="max_cart_items_count"
                                                                v-model="store_settings.max_cart_items_count"
                                                                placeholder='Maximum Items Allowed In Cart' min='1' />
                                                            <span class="text text-primary font-size-13">( {{
                                                                __('maximum_items_user_can_add_to_cart_at_once')
                                                                }})</span>
                                                        </div>
                                                        <div class="form-group col-md-6">
                                                            <label for="min_order_amount"> {{ __('minimum_order_amount')
                                                                }}</label>
                                                            <input type="number" required class="form-control"
                                                                name="min_order_amount" id="min_order_amount"
                                                                v-model="store_settings.min_order_amount"
                                                                placeholder='Minimum total amount to place order'
                                                                min='1' />
                                                            <span class="text text-primary font-size-13"> ( {{ __('below_this_user_will_not_allowed_to_place_order') }} )</span>
                                                        </div>
                                                        <div class="form-group col-md-6">
                                                            <label for="low_stock_limit">{{ __('low_stock_limit')
                                                                }}</label>
                                                            <input type="number" class="form-control" required
                                                                name="low_stock_limit" id="low_stock_limit"
                                                                v-model="store_settings.low_stock_limit"
                                                                placeholder='Product low stock limit' />
                                                            <span class="text text-primary font-size-13"> ( {{
                                                                __('product_will_be_considered_as_low_stock_if_stock_goes_below_this_limit')
                                                                }} ) </span>
                                                        </div>
                                                        <div class="form-group col-md-6">
                                                            <label for="rating">{{ __('product_rating') }}</label><br>
                                                            <div class="form-check form-switch">
                                                                <input type="checkbox" true-value="1" false-value="0"
                                                                    class="form-check-input" name="rating" id="rating"
                                                                    v-model="store_settings.product_rating">
                                                            </div>
                                                            <span class="text text-primary font-size-13"> ( {{
                                                                __('enable_and_disable_product_rating_system') }} )
                                                            </span>
                                                        </div>
                                                        <div class="form-group col-md-6">
                                                            <label for="few_quantity_left_alert">{{
                                                                __('few_quantity_left_alert') }}</label>
                                                            <input type="number" class="form-control"
                                                                name="few_quantity_left_alert"
                                                                id="few_quantity_left_alert"
                                                                v-model="store_settings.few_quantity_left_alert"
                                                                placeholder='Few Quantity Left Alert' min='1' />
                                                            <span class="text text-primary font-size-13"> ( {{
                                                                __('will_show_few_quantity_left_in_product_cart') }} )
                                                            </span>
                                                        </div>

                                                        <!-- Date format setting - used globally across the app -->
                                                        <div class="form-group col-md-6">
                                                            <label for="date_format">{{ __('date_format') }}</label>
                                                            <select name="date_format" id="date_format"
                                                                v-model="store_settings.date_format"
                                                                class="form-control form-select">
                                                                <option v-for="opt in dateFormatOptions" :key="opt.value"
                                                                    :value="opt.value">{{ opt.label }}</option>
                                                            </select>
                                                            <span class="text text-primary font-size-13"> ({{
                                                                __('date_displayed_everywhere_in_this_format') }})</span>
                                                        </div>

                                                        <!-- Time format setting - used globally across the app -->
                                                        <div class="form-group col-md-6">
                                                            <label for="time_format">{{ __('time_format') }}</label>
                                                            <select name="time_format" id="time_format"
                                                                v-model="store_settings.time_format"
                                                                class="form-control form-select">
                                                                <option v-for="opt in timeFormatOptions" :key="opt.value"
                                                                    :value="opt.value">{{ opt.label }}</option>
                                                            </select>
                                                            <span class="text text-primary font-size-13"> ({{
                                                                __('time_displayed_everywhere_in_this_format') }})</span>
                                                        </div>

                                                        <!-- Country code setting -->
                                                        <div class="form-group col-md-6">
                                                            <label for="country_code">{{ __('country_code') }}</label>
                                                            <select name="country_code" id="country_code"
                                                                v-model="store_settings.country_code"
                                                                @change="onCountryCodeChange"
                                                                class="form-control form-select">
                                                                <option value="">{{ __('select') }}</option>
                                                                <option v-for="opt in countryCodeOptions" :key="opt.value"
                                                                    :value="opt.value">{{ opt.label }}</option>
                                                            </select>
                                                            <span class="text text-primary font-size-13"> ({{
                                                                __('it_will_used_as_default_country_code_for_phone_numbers') }})</span>
                                                        </div>

                                                    </div>
                                                    <div class="row">
                                                        <div class="form-group col-md-6">
                                                            <b-button type="submit" variant="primary"
                                                                :disabled="isLoading"
                                                                v-if="$can('manage_store_settings')">{{ __('update') }}
                                                                <b-spinner v-if="isLoading" small
                                                                    label="Spinning"></b-spinner>
                                                            </b-button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>

                                        </div>

                                    </div>
                                    <div v-if="activeTab === __('delivery_boy_setting')">
                                        <div class="card">
                                            <div class="card-header">
                                                <h4 class="card-title">{{ __('delivery_boy_setting') }}</h4>
                                            </div>
                                            <div class="card-body">
                                                <form method="post" enctype="multipart/form-data"
                                                    @submit.prevent="saveDeliveryBoySetting">
                                                    <div class="row">

                                                        <div class="form-group col-md-6 mt-0">
                                                            <label for="delivery_boy_bonus_settings">{{
                                                                __('bonus_settings') }}</label><br>
                                                            <div class="form-check form-switch">
                                                                <input type="checkbox" true-value="1" false-value="0"
                                                                    class="form-check-input"
                                                                    name="delivery_boy_bonus_settings"
                                                                    id="delivery_boy_bonus_settings"
                                                                    v-model="store_settings.delivery_boy_bonus_settings">
                                                            </div>
                                                        </div>
                                                        <div v-if="store_settings.delivery_boy_bonus_settings == 1"
                                                            class="form-group col-md-6">
                                                            <label for="delivery_boy_bonus_type">{{ __('bonus_type')
                                                                }}</label>
                                                            <select name="delivery_boy_bonus_type"
                                                                id="delivery_boy_bonus_type"
                                                                v-model="store_settings.delivery_boy_bonus_type"
                                                                class="form-control form-select">
                                                                <option value="">{{ __('select') }}</option>
                                                                <option value="1">{{ __('commission') }}</option>
                                                                <option value="0">{{ __('fixed') }}/{{ __('salaried') }}
                                                                </option>
                                                            </select>
                                                        </div>
                                                        <div v-if="store_settings.delivery_boy_bonus_settings == 1 && store_settings.delivery_boy_bonus_type == 1"
                                                            class="form-group col-md-6">
                                                            <label for="delivery_boy_bonus_percentage">{{
                                                                __('delivery_boy_bonus_percentage') }}(%)</label>
                                                            <input type="number" min="0.1" max="100" step="0.1"
                                                                class="form-control"
                                                                name="delivery_boy_bonus_percentage"
                                                                id="delivery_boy_bonus_percentage"
                                                                v-model="store_settings.delivery_boy_bonus_percentage"
                                                                placeholder='Driver Bonus' />
                                                        </div>

                                                        <div v-if="store_settings.delivery_boy_bonus_settings == 1 && store_settings.delivery_boy_bonus_type == 1"
                                                            class="form-group col-md-6">
                                                            <label for="delivery_boy_bonus_min_amount">{{
                                                                __('minimum_bonus_amount') }}</label>
                                                            <input type="number" min="0" step="0.1" required
                                                                class="form-control"
                                                                name="delivery_boy_bonus_min_amount"
                                                                id="delivery_boy_bonus_min_amount"
                                                                v-model="store_settings.delivery_boy_bonus_min_amount"
                                                                placeholder='Minimum bonus amount' />
                                                            <span class="text text-primary font-size-13">{{
                                                                __('set_0_if_you_want_to_remove_limit')
                                                                }}.</span>
                                                        </div>

                                                        <div v-if="store_settings.delivery_boy_bonus_settings == 1 && store_settings.delivery_boy_bonus_type == 1"
                                                            class="form-group col-md-6">
                                                            <label for="delivery_boy_bonus_max_amount">{{
                                                                __('maximum_bonus_amount') }}</label>
                                                            <input type="number" min="0" step="0.1" required
                                                                class="form-control"
                                                                name="delivery_boy_bonus_max_amount"
                                                                id="delivery_boy_bonus_max_amount"
                                                                v-model="store_settings.delivery_boy_bonus_max_amount"
                                                                placeholder='Maximum bonus amount' />
                                                            <span class="text text-primary font-size-13">{{
                                                                __('set_0_if_you_want_to_remove_limit')
                                                                }}.</span>
                                                        </div>

                                                    </div>
                                                    <div class="row">

                                                        <div class="form-group col-md-6">
                                                            <label for="generate_otp">{{ __('Order Delivery OTP System')
                                                                }}</label><br>
                                                            <div class="form-check form-switch">
                                                                <input type="checkbox" true-value="1" false-value="0"
                                                                    class="form-check-input" name="generate_otp"
                                                                    id="generate_otp"
                                                                    v-model="store_settings.generate_otp">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="form-group col-md-6">
                                                            <b-button type="submit" variant="primary"
                                                                :disabled="isLoading"
                                                                v-if="$can('manage_store_settings')">{{ __('update') }}
                                                                <b-spinner v-if="isLoading" small
                                                                    label="Spinning"></b-spinner>
                                                            </b-button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>

                                        </div>
                                    </div>
                                    <div v-if="activeTab === __('app_setting')">
                                        <div class="card">
                                            <div class="card-header">
                                                <h4 class="card-title">{{ __('app_setting') }}</h4>
                                            </div>
                                            <div class="card-body">
                                                <span class=" text text-primary font-size-13">{{
                                                __('in_this_mode_you_can_set_your_app_in_maitenance_and_that_application_will_not_work_till_not_disabled_from_here')
                                                    }}</span>
                                                <form method="post" enctype="multipart/form-data"
                                                    @submit.prevent="saveAppSetting">
                                                    <b-tabs v-model="activeLanguageTab" content-class="mt-3"
                                                        :lazy="false">
                                                        <b-tab v-for="language in languages" :key="language.id">
                                                            <template #title>
                                                                <span
                                                                    :class="{ 'text-primary font-weight-bold': language.is_default }">
                                                                    {{ language.name }}
                                                                </span>
                                                            </template>

                                                            <!-- Translate buttons (App setting) -->
                                                            <div class="mb-3"
                                                                v-if="language.is_default && languages.length > 1">
                                                                <b-button size="sm" variant="outline-primary"
                                                                    class="mr-2"
                                                                    @click="translateEmptyAppSetting(language)"
                                                                    v-b-tooltip.hover
                                                                    title="Only empty fields will be translated."
                                                                    :disabled="loadingEmpty || loadingOverwrite">
                                                                    <span v-if="!loadingEmpty">{{ __('translate_empty_fields') }}</span>
                                                                    <b-spinner v-else small></b-spinner>
                                                                </b-button>
                                                                <b-button size="sm" variant="outline-danger"
                                                                    @click="translateOverwriteAppSetting(language)"
                                                                    v-b-tooltip.hover
                                                                    title="All fields will be translated and overwritten."
                                                                    :disabled="loadingEmpty || loadingOverwrite">
                                                                    <span v-if="!loadingOverwrite">{{ __('translate_and_overwrite') }}</span>
                                                                    <b-spinner v-else small></b-spinner>
                                                                </b-button>
                                                                <div v-if="translateSuccessMessage"
                                                                    class="text-success mt-2 font-weight-bold">{{
                                                                        translateSuccessMessage }}</div>
                                                            </div>

                                                            <div class="row">
                                                                <div class="form-group col-md-6 mt-0">
                                                                    <label for="app_mode_customer">{{ __('customer_app')
                                                                    }}
                                                                        <span class="text text-primary font-size-13">(
                                                                            {{
                                                                                __('enable') }}/{{ __('disable') }}
                                                                            )</span></label><br>
                                                                    <div class="form-check form-switch">
                                                                        <input type="checkbox" true-value="1"
                                                                            false-value="0" class="form-check-input"
                                                                            name="app_mode_customer"
                                                                            id="app_mode_customer"
                                                                            v-model="store_settings.app_mode_customer">
                                                                    </div>

                                                                    <div class="form-floating mb-3"
                                                                        v-if="store_settings.app_mode_customer == 1">
                                                                        <textarea name="message"
                                                                            id="app_mode_customer_remark"
                                                                            v-model="appTranslations.app_mode_customer_remark[language.code]"
                                                                            class="form-control"
                                                                            placeholder="Enter Notification Message Here!"></textarea>
                                                                        <label for="app_mode_customer_remark">{{
                                                                            __('customer_app_remark') }}</label>
                                                                    </div>


                                                                </div>
                                                                <div class="form-group col-md-6">
                                                                    <label for="app_mode_seller">{{ __('seller_app') }}
                                                                        <span class="text text-primary font-size-13">(
                                                                            {{
                                                                                __('enable') }}/{{ __('disable') }}
                                                                            )</span></label><br>
                                                                    <div class="form-check form-switch">
                                                                        <input type="checkbox" true-value="1"
                                                                            false-value="0" class="form-check-input"
                                                                            name="app_mode_seller" id="app_mode_seller"
                                                                            v-model="store_settings.app_mode_seller">
                                                                    </div>
                                                                    <div class="form-floating mb-3"
                                                                        v-if="store_settings.app_mode_seller == 1">
                                                                        <textarea name="message"
                                                                            id="app_mode_seller_remark"
                                                                            v-model="appTranslations.app_mode_seller_remark[language.code]"
                                                                            class="form-control"
                                                                            placeholder="Enter Notification Message Here!"></textarea>
                                                                        <label for="app_mode_seller_remark">{{
                                                                            __('seller_app_remark') }}</label>
                                                                    </div>
                                                                </div>
                                                                <div class="form-group col-md-6">
                                                                    <label for="app_mode_delivery_boy">{{
                                                                        __('delivery_boy_app')
                                                                    }}<span class="text text-primary font-size-13">(
                                                                            {{
                                                                                __('enable') }}/{{ __('disable') }}
                                                                            )</span></label><br>
                                                                    <div class="form-check form-switch">
                                                                        <input type="checkbox" true-value="1"
                                                                            false-value="0" class="form-check-input"
                                                                            name="app_mode_delivery_boy"
                                                                            id="app_mode_delivery_boy"
                                                                            v-model="store_settings.app_mode_delivery_boy">
                                                                    </div>

                                                                    <div class="form-floating mb-3"
                                                                        v-if="store_settings.app_mode_delivery_boy == 1">

                                                                        <textarea name="message"
                                                                            id="app_mode_delivery_boy_remark"
                                                                            v-model="appTranslations.app_mode_delivery_boy_remark[language.code]"
                                                                            class="form-control"
                                                                            placeholder="Enter Notification Message Here!"></textarea>
                                                                        <label for="app_mode_delivery_boy_remark">{{
                                                                            __('delivery_boy_app_remark') }}</label>
                                                                    </div>

                                                                </div>

                                                                <div class="form-group col-md-6"
                                                                    v-if="language.is_default">
                                                                    <label for="playstore_url">{{ __('playstore_url')
                                                                    }}</label><br>
                                                                    <input type="url" class="form-control"
                                                                        name="playstore_url" id="playstore_url"
                                                                        v-model="store_settings.playstore_url"
                                                                        :placeholder='__("playstore_url")' />
                                                                </div>
                                                                <div class="form-group col-md-6"
                                                                    v-if="language.is_default">
                                                                    <label for="appstore_url">{{ __('appstore_url')
                                                                    }}</label><br>
                                                                    <input type="url" class="form-control"
                                                                        name="appstore_url" id="appstore_url"
                                                                        v-model="store_settings.appstore_url"
                                                                        :placeholder='__("appstore_url")' />
                                                                </div>
                                                                <div class="mt-3" v-if="language.is_default">
                                                                    <div class="row">
                                                                        <div class="form-group col-md-6"
                                                                            v-if="language.is_default">
                                                                            <label for="is_version_system_on">{{
                                                                                __('android_version_system_status')
                                                                            }}</label><br>
                                                                            <div class="form-check form-switch">
                                                                                <input type="checkbox" true-value="1"
                                                                                    false-value="0"
                                                                                    class="form-check-input"
                                                                                    name="is_version_system_on"
                                                                                    id="is_version_system_on"
                                                                                    v-model="store_settings.is_version_system_on">
                                                                            </div>
                                                                        </div>

                                                                        <div class="form-group col-md-6"
                                                                            v-if="store_settings.is_version_system_on == 1">
                                                                            <label for="required_force_update">{{
                                                                                __('android_required_force_update')
                                                                            }}</label><br>
                                                                            <div class="form-check form-switch">
                                                                                <input type="checkbox" true-value="1"
                                                                                    false-value="0"
                                                                                    class="form-check-input"
                                                                                    name="required_force_update"
                                                                                    id="required_force_update"
                                                                                    v-model="store_settings.required_force_update">
                                                                            </div>
                                                                        </div>

                                                                        <div class="form-group col-md-6"
                                                                            v-if="store_settings.is_version_system_on == 1">
                                                                            <label for="current_version">{{
                                                                                __('android_current_version_of_app')
                                                                            }}</label>
                                                                            <input type="text" class="form-control"
                                                                                required name="current_version"
                                                                                id="current_version"
                                                                                v-model="store_settings.current_version"
                                                                                placeholder='Current Version' />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div class="mb-3" v-if="language.is_default">
                                                                    <div class="row">
                                                                        <div class="form-group col-md-6">
                                                                            <label for="ios_is_version_system_on">{{
                                                                                __('ios_version_system_status')
                                                                            }}</label><br>
                                                                            <div class="form-check form-switch">
                                                                                <input type="checkbox" true-value="1"
                                                                                    false-value="0"
                                                                                    class="form-check-input"
                                                                                    name="ios_is_version_system_on"
                                                                                    id="ios_is_version_system_on"
                                                                                    v-model="store_settings.ios_is_version_system_on">
                                                                            </div>
                                                                        </div>

                                                                        <div class="form-group col-md-6"
                                                                            v-if="store_settings.ios_is_version_system_on == 1">
                                                                            <label for="ios_required_force_update">{{
                                                                                __('ios_required_force_update')
                                                                            }}</label><br>
                                                                            <div class="form-check form-switch">
                                                                                <input type="checkbox" true-value="1"
                                                                                    false-value="0"
                                                                                    class="form-check-input"
                                                                                    name="ios_required_force_update"
                                                                                    id="ios_required_force_update"
                                                                                    v-model="store_settings.ios_required_force_update">
                                                                            </div>
                                                                        </div>

                                                                        <div class="form-group col-md-6"
                                                                            v-if="store_settings.ios_is_version_system_on == 1">
                                                                            <label for="ios_current_version">{{
                                                                                __('ios_current_version_of_app')
                                                                            }}</label>
                                                                            <input type="text" class="form-control"
                                                                                required name="ios_current_version"
                                                                                id="ios_current_version"
                                                                                v-model="store_settings.ios_current_version"
                                                                                placeholder='IOS Current Version' />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="row">
                                                                <div class="form-group col-md-6">
                                                                    <b-button type="submit" variant="primary"
                                                                        :disabled="isLoading"
                                                                        v-if="$can('manage_store_settings')">{{
                                                                            __('update') }}
                                                                        <b-spinner v-if="isLoading" small
                                                                            label="Spinning"></b-spinner>
                                                                    </b-button>
                                                                </div>
                                                            </div>
                                                        </b-tab></b-tabs>
                                                </form>

                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="activeTab === __('frontend_home_setting')">
                                        <div class="card">
                                            <div class="card-header">
                                                <h4 class="card-title">{{ __('frontend_home_setting') }}</h4>
                                            </div>
                                            <div class="card-body">
                                                <span class=" text text-primary font-size-13">{{
                                                    __('in_this_mode_you_can_set_your_app_web_home_page')
                                                    }}.</span>
                                                <form method="post" enctype="multipart/form-data"
                                                    @submit.prevent="saveFrontendHomeSetting">
                                                    <div class="row">
                                                        <div class="form-group col-md-6 mt-0">
                                                            <label for="">{{ __('display_category_section_in_home_page')
                                                                }}? </label><br>
                                                            <div class="form-check form-switch">
                                                                <input type="checkbox" true-value="1" false-value="0"
                                                                    class="form-check-input"
                                                                    name="is_category_section_in_homepage"
                                                                    id="is_category_section_in_homepage"
                                                                    v-model="store_settings.is_category_section_in_homepage">
                                                            </div>
                                                            <div class="mt-2"
                                                                v-if="store_settings.is_category_section_in_homepage == 1">
                                                                <label for="count_category_section_in_homepage">{{
                                                                    __('count_category_display_in_homepage')
                                                                    }}</label>
                                                                <input type="number" name="message"
                                                                    id="count_category_section_in_homepage" :min="1"
                                                                    :required="store_settings.is_category_section_in_homepage == 1"
                                                                    v-model="store_settings.count_category_section_in_homepage"
                                                                    class="form-control"
                                                                    placeholder="Enter Category Number Here!"
                                                                    @input="validateInput">
                                                                <span v-if="validationCategoryError" class="error">{{
                                                                    validationCategoryError }}</span>
                                                            </div>
                                                        </div>
                                                        <div class="form-group col-md-6">
                                                            <label for="">{{ __('display_brand_section_in_home_page')
                                                                }}? </label><br>
                                                            <div class="form-check form-switch">
                                                                <input type="checkbox" true-value="1" false-value="0"
                                                                    class="form-check-input"
                                                                    name="is_brand_section_in_homepage"
                                                                    id="is_brand_section_in_homepage"
                                                                    v-model="store_settings.is_brand_section_in_homepage">
                                                            </div>
                                                            <div class="mt-2"
                                                                v-if="store_settings.is_brand_section_in_homepage == 1">
                                                                <label for="count_brand_section_in_homepage">{{
                                                                    __('count_brand_display_in_homepage')
                                                                    }}</label>
                                                                <input type="number" name="message"
                                                                    id="count_brand_section_in_homepage" :min="1"
                                                                    :required="store_settings.is_brand_section_in_homepage == 1"
                                                                    v-model="store_settings.count_brand_section_in_homepage"
                                                                    class="form-control"
                                                                    placeholder="Enter Brand Number Here!"
                                                                    @input="validateInput">
                                                                <span v-if="validationBrandError" class="error">{{
                                                                    validationBrandError }}</span>
                                                            </div>
                                                        </div>
                                                        <div class="form-group col-md-6">
                                                            <label for="">{{ __('display_seller_section_in_home_page')
                                                                }}?</label><br>
                                                            <div class="form-check form-switch">
                                                                <input type="checkbox" true-value="1" false-value="0"
                                                                    class="form-check-input"
                                                                    name="is_seller_section_in_homepage"
                                                                    id="is_seller_section_in_homepage"
                                                                    v-model="store_settings.is_seller_section_in_homepage">
                                                            </div>
                                                            <div class="mt-2"
                                                                v-if="store_settings.is_seller_section_in_homepage == 1">
                                                                <label for="count_seller_section_in_homepage">{{
                                                                    __('count_seller_display_in_homepage')
                                                                    }}</label>
                                                                <input type="number" name="message"
                                                                    id="count_seller_section_in_homepage" :min="1"
                                                                    :required="store_settings.is_seller_section_in_homepage == 1"
                                                                    v-model="store_settings.count_seller_section_in_homepage"
                                                                    class="form-control"
                                                                    placeholder="Enter Seller Number Here!"
                                                                    @input="validateInput">
                                                                <span v-if="validationSellerError" class="error">{{
                                                                    validationSellerError }}</span>
                                                            </div>
                                                        </div>
                                                        <div class="form-group col-md-6">
                                                            <label for="">{{ __('display_country_section_in_home_page')
                                                                }}? </label><br>
                                                            <div class="form-check form-switch">
                                                                <input type="checkbox" true-value="1" false-value="0"
                                                                    class="form-check-input"
                                                                    name="is_country_section_in_homepage"
                                                                    id="is_country_section_in_homepage"
                                                                    v-model="store_settings.is_country_section_in_homepage">
                                                            </div>
                                                            <div class="mt-2"
                                                                v-if="store_settings.is_country_section_in_homepage == 1">
                                                                <label for="count_country_section_in_homepage">{{
                                                                    __('count_country_display_in_homepage')
                                                                    }}</label>
                                                                <input type="number" name="message"
                                                                    id="count_country_section_in_homepage" :min="1"
                                                                    :required="store_settings.is_country_section_in_homepage == 1"
                                                                    v-model="store_settings.count_country_section_in_homepage"
                                                                    class="form-control"
                                                                    placeholder="Enter Country Number Here!"
                                                                    @input="validateInput">
                                                                <span v-if="validationCountryError" class="error">{{
                                                                    validationCountryError }}</span>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div class="row">
                                                        <div class="form-group col-md-6">
                                                            <b-button type="submit" variant="primary"
                                                                :disabled="isLoading"
                                                                v-if="$can('manage_store_settings')">{{ __('update') }}
                                                                <b-spinner v-if="isLoading" small
                                                                    label="Spinning"></b-spinner>
                                                            </b-button>
                                                        </div>
                                                    </div>
                                                </form>

                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="activeTab === __('smtp_mail_setting')">
                                        <div class="card">
                                            <div class="card-header">
                                                <h4 class="card-title">{{ __('smtp_mail_setting') }}</h4>
                                            </div>
                                            <div class="card-body">
                                                <form method="post" enctype="multipart/form-data"
                                                    @submit.prevent="saveSmtpMailSetting">
                                                    <div class="row">
                                                        <div class="form-group col-md-6 mt-0">
                                                            <label for="mailer">{{ __('mailer') }}:</label>
                                                            <select class="form-control form-select" required
                                                                name="mailer" id="mailer"
                                                                v-model="store_settings.mailer">
                                                                <option value="smtp">SMTP</option>
                                                                <option value="sendmail">Sendmail</option>
                                                            </select>
                                                            <span class="text text-primary font-size-13">( {{
                                                                __('select_mail_driver') }})</span>
                                                        </div>
                                                        <div class="form-group col-md-6">
                                                            <label for="smtp_from_mail">{{ __('from_email_id')
                                                                }}:</label>
                                                            <input type="text" class="form-control" required
                                                                name="smtp_from_mail" id="smtp_from_mail"
                                                                v-model="store_settings.smtp_from_mail"
                                                                placeholder='From SMTP Email ID' />
                                                            <span class="text text-primary font-size-13">( {{
                                                                __('this_email_id_will_be_used_in_smtp_mail_system')
                                                                }})</span>
                                                        </div>
                                                        <div class="form-group col-md-6">
                                                            <label for="smtp_reply_to">{{ __('reply_to_email_id')
                                                                }}:</label>
                                                            <input type="email" class="form-control" required
                                                                name="smtp_reply_to" id="smtp_reply_to"
                                                                v-model="store_settings.smtp_reply_to"
                                                                placeholder='From SMTP Email ID' />
                                                            <span class="text text-primary font-size-13">({{
                                                                __('this_email_id_will_be_used_in_smtp_mail_system')
                                                                }})</span>
                                                        </div>
                                                        <div class="form-group col-md-6">
                                                            <label for="smtp_email_password">{{
                                                                __('smtp_email_password') }}: </label>
                                                            <input type="text" class="form-control" required
                                                                name="smtp_email_password" id="smtp_email_password"
                                                                v-model="store_settings.smtp_email_password"
                                                                placeholder='Enter your SMTP email password' />
                                                        </div>
                                                        <div class="form-group col-md-6">
                                                            <label for="smtp_host">{{ __('smtp_host') }}: </label>
                                                            <input type="text" class="form-control" required
                                                                name="smtp_host" id="smtp_host"
                                                                v-model="store_settings.smtp_host"
                                                                placeholder='SMTP Host address' />
                                                        </div>
                                                        <div class="form-group col-md-6">
                                                            <label for="smtp_port">{{ __('smtp_port') }}:</label> <span
                                                                class="text text-primary font-size-13"> ( <b>TLS:
                                                                </b>587 <b>SSL: </b>465 )</span>
                                                            <input type="text" class="form-control" required
                                                                name="smtp_port" id="smtp_port"
                                                                v-model="store_settings.smtp_port"
                                                                placeholder='SMTP Port' />

                                                        </div>
                                                        <div class="form-group col-md-6">
                                                            <label for="smtp_content_type">{{
                                                                __('smtp_email_content_type') }}: </label>
                                                            <select name="smtp_content_type" id="smtp_content_type"
                                                                v-model="store_settings.smtp_content_type"
                                                                class="form-control form-select">
                                                                <option value="">{{ __('select_smtp_email_content_tpe')
                                                                    }}</option>
                                                                <option value="html">{{ __('html') }}</option>
                                                                <option value="text">{{ __('text') }}</option>
                                                            </select>
                                                        </div>
                                                        <div class="form-group col-md-6">
                                                            <label for="smtp_encryption_type">{{ __('smtp_encryption')
                                                                }}: </label>
                                                            <select name="smtp_encryption_type"
                                                                id="smtp_encryption_type"
                                                                v-model="store_settings.smtp_encryption_type"
                                                                class="form-control form-select">
                                                                <option value="">{{ __('select_smtp_encryption_type') }}
                                                                </option>
                                                                <option value="tls">{{ __('tls') }}</option>
                                                                <option value="ssl">{{ __('ssl') }}</option>
                                                            </select>
                                                        </div>
                                                    </div>


                                                    <hr>
                                                    <div class="row">
                                                        <h6>{{ __('email_test') }}</h6>
                                                        <div class="form-group col-md-6">
                                                            <div class="input-group">
                                                                <input type="text" class="form-control"
                                                                    name="test_email"
                                                                    v-model="store_settings.test_email"
                                                                    placeholder='Enter Email Address for Test'>
                                                                <b-button type="button" class="m-0" variant="primary"
                                                                    @click="testMail" :disabled="isSendingTestEmail">
                                                                    {{ __('test_mail') }}
                                                                    <b-spinner v-if="isSendingTestEmail" small
                                                                        label="Spinning"></b-spinner>
                                                                </b-button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="form-group col-md-6">
                                                            <b-button type="submit" variant="primary"
                                                                :disabled="isLoading"
                                                                v-if="$can('manage_store_settings')">{{ __('update') }}
                                                                <b-spinner v-if="isLoading" small
                                                                    label="Spinning"></b-spinner>
                                                            </b-button>
                                                        </div>
                                                    </div>
                                                </form>

                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="activeTab === __('third_party_api_credentials')">
                                        <div class="card">
                                            <div class="card-header">
                                                <h4 class="card-title">{{ __('third_party_api_credentials') }}</h4>
                                            </div>
                                            <div class="card-body">
                                                <form method="post" enctype="multipart/form-data"
                                                    @submit.prevent="saveThirdPartyApiSetting">
                                                    <div class="row">
                                                        <div class="form-group col-md-6 mt-0">
                                                            <label for="google_place_api_key">{{ __('place_api_key')
                                                                }}</label>
                                                            <input type="text" class="form-control"
                                                                name="google_place_api_key" id="google_place_api_key"
                                                                :value="shouldHideThirdPartyValues ? '' : store_settings.google_place_api_key"
                                                                @input="!shouldHideThirdPartyValues && (store_settings.google_place_api_key = $event.target.value)"
                                                                :placeholder="shouldHideThirdPartyValues ? __('demo_mode') : 'Google Place Api Key'"
                                                                :readonly="shouldHideThirdPartyValues">
                                                            <input type="hidden" class="form-control" name="apiKey"
                                                                id="apiKey" v-model="store_settings.apiKey"
                                                                placeholder="apiKey">

                                                        </div>
                                                        <div class="form-group col-md-6">
                                                            <label for="google_map_api_key">{{ __('map_api_key')
                                                                }}</label>
                                                            <input type="text" class="form-control"
                                                                name="google_map_api_key" id="google_map_api_key"
                                                                :value="shouldHideThirdPartyValues ? '' : store_settings.google_map_api_key"
                                                                @input="!shouldHideThirdPartyValues && (store_settings.google_map_api_key = $event.target.value)"
                                                                :placeholder="shouldHideThirdPartyValues ? __('demo_mode') : 'Google Map Api Key'"
                                                                :readonly="shouldHideThirdPartyValues">
                                                            <input type="hidden" class="form-control"
                                                                name="googleMapApiKey" id="googleMapApiKey"
                                                                v-model="store_settings.googleMapApiKey"
                                                                placeholder="googleMapApiKey">
                                                        </div>
                                                    </div>

                                                    <div class="row">
                                                        <div class="form-group col-md-6">
                                                            <label for="text_gen_key ">{{ __('gemini_key') }}</label>
                                                            <input type="text" class="form-control" name="text_gen_key"
                                                                id="text_gen_key"
                                                                :value="shouldHideThirdPartyValues ? '' : store_settings.text_gen_key"
                                                                @input="!shouldHideThirdPartyValues && (store_settings.text_gen_key = $event.target.value)"
                                                                :placeholder="shouldHideThirdPartyValues ? __('demo_mode') : 'Gemini Key'"
                                                                :readonly="shouldHideThirdPartyValues">

                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="form-group col-md-6">
                                                            <b-button type="submit" variant="primary"
                                                                :disabled="isLoading || shouldHideThirdPartyValues"
                                                                v-if="$can('manage_store_settings') && ($isDemo != 1 || (login_user && login_user.id === 1))">{{ __('update') }}
                                                                <b-spinner v-if="isLoading" small
                                                                    label="Spinning"></b-spinner>
                                                            </b-button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="activeTab === __('seller_setting')">
                                        <div class="card">
                                            <div class="card-header">
                                                <h4 class="card-title">{{ __('seller_setting') }}</h4>
                                            </div>
                                            <div class="card-body">
                                                <form method="post" enctype="multipart/form-data"
                                                    @submit.prevent="saveSellerSetting">
                                                    <div class=" row -align-items-center">
                                                        <div class="form-group col-md-6 mt-0">
                                                            <label for="one_seller_cart">{{ __('one_seller_cart')
                                                                }}<span class="text text-primary font-size-13">( {{
                                                                    __('enable') }}/{{ __('disable') }}
                                                                    )</span></label><br>
                                                            <div class="form-check form-switch">
                                                                <input type="checkbox" true-value="1" false-value="0"
                                                                    class="form-check-input" name="one_seller_cart"
                                                                    id="one_seller_cart"
                                                                    v-model="store_settings.one_seller_cart">
                                                            </div>
                                                        </div>
                                                        <div class="form-group col-md-6">
                                                            <label for="seller_commission">{{ __('seller_commission')
                                                                }}</label>
                                                            <input type="number" class="form-control"
                                                                name="seller_commission" id="seller_commission"
                                                                v-model="store_settings.seller_commission"
                                                                placeholder="Seller Commission" step="0.1" min="0"
                                                                max="100">
                                                        </div>
                                                        <div class="form-group col-md-6"
                                                            v-if="store_settings.one_seller_cart == 1">
                                                            <label for="self_pickup_mode">{{ __('self_pickup_mode')
                                                                }}<span class="text text-primary font-size-13">( {{
                                                                    __('enable') }}/{{ __('disable') }}
                                                                    )</span></label><br>
                                                            <div class="form-check form-switch">
                                                                <input type="checkbox" true-value="1" false-value="0"
                                                                    class="form-check-input" name="self_pickup_mode"
                                                                    id="self_pickup_mode"
                                                                    v-model="store_settings.self_pickup_mode">
                                                            </div>
                                                            <span class="text text-primary font-size-13">{{
                                                                __('self_pickup_mode_description') }}</span>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="form-group col-md-6">
                                                            <b-button type="submit" variant="primary"
                                                                :disabled="isLoading"
                                                                v-if="$can('manage_store_settings')">{{ __('update') }}
                                                                <b-spinner v-if="isLoading" small
                                                                    label="Spinning"></b-spinner>
                                                            </b-button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="activeTab === __('login_setting')">
                                        <div class="card">
                                            <div class="card-header">
                                                <h4 class="card-title">{{ __('login_setting') }}</h4>
                                            </div>
                                            <div class="card-body">
                                                <form method="post" enctype="multipart/form-data"
                                                    @submit.prevent="saveRecordLoginSetting">
                                                    <div class="row">
                                                        <div class="form-group col-md-6 mb-3">
                                                            <label for="phone_login">{{ __('phone_login') }}
                                                                <span class="text text-primary font-size-13">( {{
                                                                    __('enable') }}/{{ __('disable') }}
                                                                    )</span>
                                                            </label><br>
                                                            <div class="form-check form-switch">
                                                                <input type="checkbox" true-value="1" false-value="0"
                                                                    class="form-check-input" name="phone_login"
                                                                    id="phone_login"
                                                                    v-model="login_settings.phone_login">

                                                            </div>
                                                        </div>
                                                        <div class="form-group col-md-6">
                                                            <label for="google_login">{{ __('google_login') }}
                                                                <span class="text text-primary font-size-13">( {{
                                                                    __('enable') }}/{{ __('disable') }}
                                                                    )</span>
                                                            </label><br>
                                                            <div class="form-check form-switch">
                                                                <input type="checkbox" true-value="1" false-value="0"
                                                                    class="form-check-input" name="google_login"
                                                                    id="google_login"
                                                                    v-model="login_settings.google_login">
                                                            </div>
                                                        </div>
                                                        <div class="form-group col-md-6">
                                                            <label for="apple_login">{{ __('apple_login') }}
                                                                <span class="text text-primary font-size-13">( {{
                                                                    __('enable') }}/{{ __('disable') }}
                                                                    )</span>
                                                            </label><br>
                                                            <div class="form-check form-switch">
                                                                <input type="checkbox" true-value="1" false-value="0"
                                                                    class="form-check-input" name="apple_login"
                                                                    id="apple_login"
                                                                    v-model="login_settings.apple_login">
                                                            </div>
                                                        </div>
                                                        <div class="form-group col-md-6">
                                                            <label for="apple_login">{{ __('email_login') }}
                                                                <span class="text text-primary font-size-13">( {{
                                                                    __('enable') }}/{{ __('disable') }}
                                                                    )</span>
                                                            </label><br>
                                                            <div class="form-check form-switch">
                                                                <input type="checkbox" true-value="1" false-value="0"
                                                                    class="form-check-input" name="email_login"
                                                                    id="email_login"
                                                                    v-model="login_settings.email_login">
                                                            </div>
                                                        </div>
                                                        <div v-if="login_settings.phone_login == '1'"
                                                            class="form-group col-md-6">

                                                            <label for="phone_auth_otp">{{ __('phone_auth_otp') }}
                                                                <small>[ {{ __('enable') }} / {{ __('disable') }} ]
                                                                </small>
                                                            </label><br>
                                                            <div class='form-check form-switch'>
                                                                <input class='form-check-input' id="phone_auth_otp"
                                                                    type='checkbox' true-value="1" false-value="0"
                                                                    v-model="login_settings.phone_auth_otp">
                                                            </div>

                                                        </div>
                                                        <div v-if="login_settings.phone_login == '1'"
                                                            class="form-group col-md-6">

                                                            <label for="phone_auth_password">{{
                                                                __('phone_auth_password') }}
                                                                <small>[ {{ __('enable') }} / {{ __('disable') }} ]
                                                                </small>
                                                            </label><br>
                                                            <div class='form-check form-switch'>
                                                                <input class='form-check-input' id="phone_auth_password"
                                                                    type='checkbox' true-value="1" false-value="0"
                                                                    v-model="login_settings.phone_auth_password">
                                                            </div>

                                                        </div>
                                                        <div v-if="login_settings.phone_auth_otp == '1' || login_settings.phone_auth_password == '1'"
                                                            class="form-group col-md-6">


                                                            <label for="firebase_authentication">{{
                                                                __('firebase_authentication') }}
                                                                <small>[ {{ __('enable') }} / {{ __('disable') }} ]
                                                                </small>
                                                            </label><br>
                                                            <div class='form-check form-switch'>
                                                                <input class='form-check-input'
                                                                    id="firebase_authentication" type='checkbox'
                                                                    true-value="1" false-value="0"
                                                                    v-model="login_settings.firebase_authentication">
                                                            </div>

                                                        </div>

                                                        <div v-if="login_settings.phone_auth_otp == '1' || login_settings.phone_auth_password == '1'"
                                                            class="form-group col-md-6">


                                                            <label for="custom_sms_gateway_otp_based">{{
                                                                __('custom_sms_gateway_otp_based') }}
                                                                <small>[ {{ __('enable') }} / {{ __('disable') }} ]
                                                                </small>
                                                            </label><br>
                                                            <div class='form-check form-switch'>
                                                                <input class='form-check-input'
                                                                    id="custom_sms_gateway_otp_based" type='checkbox'
                                                                    true-value="1" false-value="0"
                                                                    v-model="login_settings.custom_sms_gateway_otp_based">
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div class="row">
                                                        <div class="form-group col-md-6">
                                                            <b-button type="submit" variant="primary"
                                                                :disabled="isLoading"
                                                                v-if="$can('manage_store_settings')">
                                                                {{ __('update') }}
                                                                <b-spinner v-if="isLoading" small
                                                                    label="Spinning"></b-spinner>
                                                            </b-button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>

                                        </div>
                                    </div>
                                    <div v-if="activeTab === __('cart_setting')">
                                        <div class="card">
                                            <div class="card-header">
                                                <h4 class="card-title">{{ __('cart_setting') }}</h4>
                                            </div>
                                            <div class="card-body">
                                                <form method="post" enctype="multipart/form-data"
                                                    @submit.prevent="saveCartSetting">
                                                    <div class="row">
                                                        <div class="form-group col-md-6 mt-0">
                                                            <label for="low_stock_limit">{{ __('cart_notification') }}
                                                            </label> <i class="fa fa-question-circle tooltip-icon">
                                                                <span class="tooltip-text">{{
                                                                    __('product_will_be_add_incart_without_login')
                                                                    }}</span></i>
                                                            <div class="form-check form-switch">
                                                                <input type="checkbox" true-value="1" false-value="0"
                                                                    class="form-check-input" name="cart_notification"
                                                                    id="cart_notification"
                                                                    v-model="store_settings.cart_notification">
                                                            </div>
                                                        </div>
                                                        <div class="form-group col-md-6"
                                                            v-if="store_settings.cart_notification == 1">
                                                            <label for="notification_delay_after_cart_addition"> {{
                                                                __('notification_delay_after_cart_addition') }}</label>
                                                            <i class="text-danger">* </i><i
                                                                class="fa fa-question-circle tooltip-icon"> <span
                                                                    class="tooltip-text">{{
                                                                        __('notification_delay_after_cart_addition_tooltip')
                                                                    }}</span></i>
                                                            <div class="input-group">
                                                                <div class="input-group-prepend">
                                                                    <div class="input-group-text myDivClass"
                                                                        style="height: 42px;">
                                                                        <span class="mySpanClass">{{ __('minutes')
                                                                            }}</span>
                                                                    </div>
                                                                </div>
                                                                <input type="number" style="height: 42px;"
                                                                    class="form-control"
                                                                    name="notification_delay_after_cart_addition"
                                                                    id="notification_delay_after_cart_addition" min="0"
                                                                    v-model="store_settings.notification_delay_after_cart_addition">
                                                            </div>
                                                        </div>
                                                        <div class="form-group col-md-6"
                                                            v-if="store_settings.cart_notification == 1">
                                                            <label for="notification_interval"> {{
                                                                __('notification_interval') }}</label> <i
                                                                class="text-danger">* </i><i
                                                                class="fa fa-question-circle tooltip-icon"> <span
                                                                    class="tooltip-text">{{
                                                                        __('notification_delay_after_cart_addition_tooltip')
                                                                    }}</span></i>
                                                            <div class="input-group">
                                                                <div class="input-group-prepend">
                                                                    <div class="input-group-text myDivClass"
                                                                        style="height: 42px;">
                                                                        <span class="mySpanClass">{{ __('minutes')
                                                                            }}</span>
                                                                    </div>
                                                                </div>
                                                                <input type="number" style="height: 42px;"
                                                                    class="form-control" name="notification_interval"
                                                                    id="notification_interval" min="0"
                                                                    v-model="store_settings.notification_interval">
                                                            </div>
                                                        </div>

                                                        <div class="form-group col-md-6"
                                                            v-if="store_settings.cart_notification == 1">
                                                            <label for="notification_stop_time"> {{
                                                                __('notification_stop_time') }}</label> <i
                                                                class="text-danger">* </i><i
                                                                class="fa fa-question-circle tooltip-icon"> <span
                                                                    class="tooltip-text">{{
                                                                        __('notification_stop_time_tooltip') }}</span></i>
                                                            <div class="input-group">
                                                                <div class="input-group-prepend">
                                                                    <div class="input-group-text myDivClass"
                                                                        style="height: 42px;">
                                                                        <span class="mySpanClass">{{ __('minutes')
                                                                            }}</span>
                                                                    </div>
                                                                </div>
                                                                <input type="number" style="height: 42px;"
                                                                    class="form-control" name="notification_stop_time"
                                                                    id="notification_stop_time" min="0"
                                                                    v-model="store_settings.notification_stop_time">
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div class="row">
                                                        <div class="form-group col-md-6">
                                                            <b-button type="submit" variant="primary"
                                                                :disabled="isLoading"
                                                                v-if="$can('manage_store_settings')">{{ __('update') }}
                                                                <b-spinner v-if="isLoading" small
                                                                    label="Spinning"></b-spinner>
                                                            </b-button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>

                                        </div>

                                    </div>
                                    <div v-if="activeTab === __('refer_earn_setting')">
                                        <div class="card">
                                            <div class="card-header">
                                                <h4 class="card-title">{{ __('refer_earn_setting') }}</h4>
                                            </div>
                                            <div class="card-body">
                                                <form method="post" enctype="multipart/form-data"
                                                    @submit.prevent="saveReferEarnSetting">
                                                    <div class="row">
                                                        <div class="form-group col-md-6 mt-0">
                                                            <label for="referral_min_order_amount">{{
                                                                __('minimum_order_for_referral') }}</label><br>
                                                            <input type="number" class="form-control"
                                                                name="referral_min_order_amount"
                                                                id="referral_min_order_amount"
                                                                v-model="refer_earn_settings.referral_min_order_amount"
                                                                :placeholder='__("minimum_order_for_referral")' />
                                                        </div>
                                                        <div class="form-group col-md-6">
                                                            <label for="referral_credit_first_order">{{
                                                                __('referral_credit_first_order') }}</label><br>
                                                            <input type="number" class="form-control"
                                                                name="referral_credit_first_order"
                                                                id="referral_credit_first_order"
                                                                v-model="refer_earn_settings.referral_credit_first_order"
                                                                :placeholder='__("referral_credit_first_order")' />
                                                        </div>
                                                    </div>

                                                    <div class="row">
                                                        <div class="form-group col-md-6">
                                                            <b-button type="submit" variant="primary"
                                                                :disabled="isLoading"
                                                                v-if="$can('manage_store_settings')">
                                                                {{ __('update') }}
                                                                <b-spinner v-if="isLoading" small
                                                                    label="Spinning"></b-spinner>
                                                            </b-button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>

                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import Auth from '../../Auth.js';
import Multiselect from 'vue-multiselect';
import { VuejsDatatableFactory } from "vuejs-datatable";
import Select2 from "v-select2-component";
import CryptoJS from "crypto-js";
import countryData from '../../../../config/Country.json';


export default {

    components: {
        Multiselect,
    },
    data: function () {
        return {
            addressTranslations: {
                store_address: {}
            },


            storeTranslations: {
                app_name: {},
                copyright_details: {}
            },

            activeTab: 'store_setting',
            appTranslations: {
                app_mode_customer_remark: {},
                app_mode_seller_remark: {},
                app_mode_delivery_boy_remark: {}
            },

            isLoadingLanguages: false,

            languages: [],
            defaultLanguageId: null,
            activeLanguageTab: 0,
            translations: {},

            login_user: Auth.user,
            isLoading: false,
            translateSuccessMessage: '',
            loadingEmpty: false,
            loadingOverwrite: false,
            city: "",
            cities: [],
            store_settings: {},
            countryCodeOptions: countryData.map(c => ({
                value: c.dial_code,
                label: `${c.name} (${c.dial_code})`,
                code: c.code
            })),
            login_settings: {
                phone_login: 0,
                phone_auth_otp: 0,
                phone_auth_password: 0,
                firebase_authentication: 0,
                custom_sms_gateway_otp_based: 0
            },
            refer_earn_settings: {},
            record: null,
            timezone_options: null,
            currency_codes: null,
            logo_url: "",
            logo_name: "",
            panel_login_background_img_url: "",
            panel_login_background_img_name: "",
            fssai_lic_img_url: "",
            fssai_lic_img_name: "",
            isSendingTestEmail: false,
            validationCategoryError: null,
            validationBrandError: null,
            validationSellerError: null,
            validationCountryError: null,
            mobilevalidationError: null,
            Logoerror: null,
            Panel_login_background_imgerror: null,
            Fssaierror: null,
            tabs: [__('store_setting'), __('address_setting'), __('other_setting'), __('delivery_boy_setting'), __('app_setting'), __('frontend_home_setting'), __('smtp_mail_setting'), __('third_party_api_credentials'), __('seller_setting'), __('login_setting'), __('cart_setting'), __('refer_earn_setting')],
            activeTab: __('store_setting'),

            // Base format definitions (value = PHP Carbon format, labelPrefix = before current date)
            dateFormatDefs: [
                { value: 'd-m-Y', labelPrefix: 'DD-MM-YYYY' },
                { value: 'm-d-Y', labelPrefix: 'MM-DD-YYYY' },
                { value: 'Y-m-d', labelPrefix: 'YYYY-MM-DD' },
                { value: 'd/m/Y', labelPrefix: 'DD/MM/YYYY' },
                { value: 'm/d/Y', labelPrefix: 'MM/DD/YYYY' },
                { value: 'd M Y', labelPrefix: 'DD Mon YYYY' },
                { value: 'M d, Y', labelPrefix: 'Mon DD, YYYY' }
            ],
            timeFormatDefs: [
                { value: 'H:i', labelPrefix: '24-hour' },
                { value: 'h:i A', labelPrefix: '12-hour' },
                { value: 'h:i a', labelPrefix: '12-hour' },
                { value: 'H:i:s', labelPrefix: '24-hour with seconds' },
                { value: 'h:i:s A', labelPrefix: '12-hour with seconds' }
            ]
        }
    },

    computed: {
        // Hide third party credential values in demo mode, except for auth user id 1
        shouldHideThirdPartyValues() {
            return this.$isDemo == 1 && (!this.login_user || this.login_user.id !== 1);
        },
        // Date format options with current date preview
        dateFormatOptions() {
            const now = new Date();
            const pad = (n) => String(n).padStart(2, '0');
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const d = pad(now.getDate());
            const m = pad(now.getMonth() + 1);
            const Y = now.getFullYear();
            const M = months[now.getMonth()];
            const formatters = {
                'd-m-Y': `${d}-${m}-${Y}`,
                'm-d-Y': `${m}-${d}-${Y}`,
                'Y-m-d': `${Y}-${m}-${d}`,
                'd/m/Y': `${d}/${m}/${Y}`,
                'm/d/Y': `${m}/${d}/${Y}`,
                'd M Y': `${d} ${M} ${Y}`,
                'M d, Y': `${M} ${d}, ${Y}`
            };
            return this.dateFormatDefs.map(opt => ({
                value: opt.value,
                label: `${opt.labelPrefix} (${formatters[opt.value]})`
            }));
        },
        // Time format options with current time preview
        timeFormatOptions() {
            const now = new Date();
            const pad = (n) => String(n).padStart(2, '0');
            const h24 = now.getHours();
            const h12 = h24 % 12 || 12;
            const i = pad(now.getMinutes());
            const s = pad(now.getSeconds());
            const A = h24 >= 12 ? 'PM' : 'AM';
            const a = h24 >= 12 ? 'pm' : 'am';
            const formatters = {
                'H:i': `${pad(h24)}:${i}`,
                'h:i A': `${pad(h12)}:${i} ${A}`,
                'h:i a': `${pad(h12)}:${i} ${a}`,
                'H:i:s': `${pad(h24)}:${i}:${s}`,
                'h:i:s A': `${pad(h12)}:${i}:${s} ${A}`
            };
            return this.timeFormatDefs.map(opt => ({
                value: opt.value,
                label: `${opt.labelPrefix} (${formatters[opt.value]})`
            }));
        }
    },

    watch: {
        'login_settings.phone_auth_otp': function (newValue) {
            if (newValue == 1) {
                this.login_settings.phone_auth_password = 0;
                this.login_settings.phone_auth_otp = 1;
            }
        },
        'login_settings.phone_auth_password': function (newValue) {
            if (newValue == 1) {
                this.login_settings.phone_auth_otp = 0;
                this.login_settings.phone_auth_password = 1;
            }
        },
        'login_settings.firebase_authentication': function (newValue) {
            if (newValue == 1) {
                this.login_settings.custom_sms_gateway_otp_based = 0;
                this.login_settings.firebase_authentication = 1;
            }
        },
        'login_settings.custom_sms_gateway_otp_based': function (newValue) {
            if (newValue == 1) {
                this.login_settings.firebase_authentication = 0;
                this.login_settings.custom_sms_gateway_otp_based = 1;
            }
        },
        'store_settings.google_place_api_key'(newValue) {
            this.store_settings.apiKey = newValue;
        },
        'store_settings.google_map_api_key'(newValue) {
            this.store_settings.googleMapApiKey = newValue;
        },
        'store_settings.one_seller_cart'(newValue) {
            if (newValue == 0) {
                this.store_settings.self_pickup_mode = 0;
            }
        }
    },
    created() {
        this.bootstrap();
    },

    methods: {
        onCountryCodeChange() {
            const selected = this.countryCodeOptions.find(opt => opt.value === this.store_settings.country_code);
            this.store_settings.nation_code = selected ? selected.code : '';
        },
        onLogoUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            this.logo_file = file;              // <-- ADD THIS
            this.logo_name = file.name;
            this.logo_url = URL.createObjectURL(file);
            this.Logoerror = '';
        },

        onFssaiUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            this.fssai_lic_img_file = file;
            this.fssai_lic_img_name = file.name;
            this.fssai_lic_img_url = URL.createObjectURL(file);
            this.Fssaierror = '';
        },

        onPanelLoginBgUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            this.panel_login_background_img_file = file;
            this.panel_login_background_img_name = file.name;
            this.panel_login_background_img_url = URL.createObjectURL(file);
            this.Panel_login_background_imgerror = '';
        },

        async bootstrap() {
            try {
                this.isLoading = true;
                await this.fetchActiveLanguages();
                await this.getCities();
                await this.getStoreSetting();

            } finally {
                this.isLoading = false;
            }
        },

        safeJson(value) {
            if (!value) return null;

            try {
                const parsed = JSON.parse(value);
                return typeof parsed === 'object' ? parsed : null;
            } catch (e) {
                return null; // not JSON
            }
        },

        dropFile(event) {
            event.preventDefault();
            this.$refs.logo.files = event.dataTransfer.files;
            this.handleLogoUpload();
            // Clean up
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },
        dropFileFssaiLicImg(event) {
            event.preventDefault();

            this.$refs.fssai_lic_img.files = event.dataTransfer.files;
            this.handleFssaiLicImgUpload(); // Trigger the onChange event manually
            // Clean up
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },
        dropFilePanelLoginackground_imgImg(event) {
            event.preventDefault();

            this.$refs.panel_login_background_img.files = event.dataTransfer.files;
            this.handlePanelLoginBackgroundImgUpload(); // Trigger the onChange event manually
            // Clean up
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },
        handleLogoUpload: function () {
            const file = this.$refs.logo.files[0];

            // Reset previous error message
            this.error = null;

            // Check if a file was selected
            if (!file) return;

            // Perform image validation
            const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp", "image/svg+xml"];
            if (!validTypes.includes(file.type)) {
                this.Logoerror = "Invalid file type. Please upload a JPEG, PNG, JPG,  GIF, WEBP or SVG image.";
                return;
            }

            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                this.Logoerror = "File size exceeds the maximum allowed limit (2MB).";
                return;
            }

            // Create a URL for the uploaded image and display it
            this.store_settings.logo = this.$refs.logo.files[0];
            this.logo_url = URL.createObjectURL(this.store_settings.logo);
            this.logo_name = this.store_settings.logo.name;
        },
        handleFssaiLicImgUpload: function () {
            const file = this.$refs.fssai_lic_img.files[0];

            // Reset previous error message
            this.error = null;

            // Check if a file was selected
            if (!file) return;

            // Perform image validation
            const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp", "image/svg+xml"];
            if (!validTypes.includes(file.type)) {
                this.Fssaierror = "Invalid file type. Please upload a JPEG, PNG, JPG,  GIF, WEBP or SVG image.";
                return;
            }

            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                this.Fssaierror = "File size exceeds the maximum allowed limit (2MB).";
                return;
            }
            this.store_settings.fssai_lic_img = this.$refs.fssai_lic_img.files[0];
            this.fssai_lic_img_url = URL.createObjectURL(this.store_settings.fssai_lic_img);
            this.fssai_lic_img_name = this.store_settings.fssai_lic_img.name;
        },
        handlePanelLoginBackgroundImgUpload: function () {
            const file = this.$refs.panel_login_background_img.files[0];

            // Reset previous error message
            this.error = null;

            // Check if a file was selected
            if (!file) return;

            // Perform image validation
            const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp", "image/svg+xml"];
            if (!validTypes.includes(file.type)) {
                this.Panel_login_background_imgerror = "Invalid file type. Please upload a JPEG, PNG, JPG,  GIF, WEBP or SVG image.";
                return;
            }

            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                this.Panel_login_background_imgerror = "File size exceeds the maximum allowed limit (2MB).";
                return;
            }

            // Create a URL for the uploaded image and display it
            this.store_settings.panel_login_background_img = this.$refs.panel_login_background_img.files[0];
            this.panel_login_background_img_url = URL.createObjectURL(this.store_settings.panel_login_background_img);
            this.panel_login_background_img_name = this.store_settings.panel_login_background_img.name;
        },
        validateInput() {
            const count_category_section_in_homepage = this.store_settings.count_category_section_in_homepage;
            if (count_category_section_in_homepage < 1) {
                this.validationCategoryError = "Category count must be greater than 0.";
            } else {
                this.validationCategoryError = null;
            }
            const count_brand_section_in_homepage = this.store_settings.count_brand_section_in_homepage;
            if (count_brand_section_in_homepage < 1) {
                this.validationBrandError = "Brand count must be greater than 0.";
            } else {
                this.validationBrandError = null;
            }
            const count_seller_section_in_homepage = this.store_settings.count_seller_section_in_homepage;
            if (count_seller_section_in_homepage < 1) {
                this.validationSellerError = "Seller count must be greater than 0.";
            } else {
                this.validationSellerError = null;
            }
            const count_country_section_in_homepage = this.store_settings.count_country_section_in_homepage;
            if (count_country_section_in_homepage < 1) {
                this.validationCountryError = "Country count must be greater than 0.";
            } else {
                this.validationCountryError = null;
            }
        },
        validateMobileNumber() {
            const mobileNumber = this.store_settings.support_number;
            if (!/^\d{1,16}$/.test(mobileNumber)) {
                this.mobilevalidationError = "Support Number must be maximum 16 digits numbers.";
                this.store_settings.support_number = null;
            } else {
                this.mobilevalidationError = null;
            }
        },
        getCities() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/cities')
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    this.cities = data.data.cities || []

                    if (this.deliveryBoys.id) {
                        this.city = this.cities.filter((item) => {
                            return item.id === this.record.city_id;
                        });
                    }
                }).catch(error => {
                    this.isLoading = false;
                    if (error.request.statusText) {
                        this.showError(error.request.statusText);
                    } else if (error.message) {
                        this.showError(error.message);
                    } else {
                        this.showError("Something went wrong!");
                    }
                })
        },
        // Get selected city id: city can be object (from multiselect) or array (from getStoreSetting filter)
        setCityId() {
            const c = Array.isArray(this.city) ? this.city[0] : this.city;
            this.store_settings.default_city_id = (c && c.id != null) ? c.id : 0;
        },

        getStoreSetting() {
            let url = this.$apiUrl + '/store_settings';
            let vm = this;
            axios.get(url).then((response) => {
                this.store_settings = response.data.data.store_settingsObject;

                this.timezone_options = response.data.data.timezone_options;
                this.currency_codes = response.data.data.currency_code.country;

                this.record = response.data.data.store_settings;
                this.record.map((item, index) => {

                    if (item.value === '0' || item.value === '1') {
                        this.store_settings[item.variable] = (item.value === '0') ? 0 : 1;
                    } else {
                        this.store_settings[item.variable] = item.value;
                    }
                });

                // Sync nation_code from country_code on load
                if (this.store_settings.country_code && !this.store_settings.nation_code) {
                    const matched = this.countryCodeOptions.find(opt => opt.value === this.store_settings.country_code);
                    if (matched) {
                        this.store_settings.nation_code = matched.code;
                    }
                }

                this.login_record = response.data.data.login_settings;
                // Guard: login_record must be an array before mapping
                if (Array.isArray(this.login_record)) {
                    this.login_record.map((item, index) => {

                        if (item.value === '0' || item.value === '1') {
                            this.login_settings[item.variable] = (item.value === '0') ? 0 : 1;
                        } else {
                            this.login_settings[item.variable] = item.value;
                        }
                    });
                }

                this.refer_earn_record = response.data.data.refer_earn_settings;
                // Guard: refer_earn_record must be an array before mapping
                if (Array.isArray(this.refer_earn_record)) {
                    this.refer_earn_record.map((item, index) => {

                        if (item.value === '0' || item.value === '1') {
                            this.refer_earn_settings[item.variable] = (item.value === '0') ? 0 : 1;
                        } else {
                            this.refer_earn_settings[item.variable] = item.value;
                        }
                    });
                }

                // Single object for multiselect; filter() returned array and broke setCityId (array.id is undefined)
                const matched = this.cities.find((item) => item.id === parseInt(this.store_settings.default_city_id, 10));
                this.city = matched || null;

                if (this.store_settings.logo != "") {
                    this.logo_url = this.$storageUrl + this.store_settings.logo;
                } else {
                    this.logo_url = this.$baseUrl + '/images/logo.png';
                }
                if (this.store_settings.fssai_lic_img != "") {
                    this.fssai_lic_img_url = this.$storageUrl + this.store_settings.fssai_lic_img;
                } else {
                    this.fssai_lic_img_url = this.$baseUrl + '/images/fssai_lic_img.png';
                }
                if (this.store_settings.panel_login_background_img != "") {
                    this.panel_login_background_img_url = this.$storageUrl + this.store_settings.panel_login_background_img;
                } else {
                    this.panel_login_background_img_url = this.$baseUrl + '/images/panel_login_background_img.png';
                }
                // Guard against null/undefined before replace — a crash here aborts the whole callback
                const copyrightRaw = this.store_settings.copyright_details
                    ? this.store_settings.copyright_details.replace(/<br\s*\/?>/g, '\n')
                    : '';

                const secretKey = "ewgrrtoecaemr";

                // Decrypt google_place_api_key (wrap in try/catch — throws if not valid AES encrypted)
                try {
                    if (this.store_settings.google_place_api_key) {
                        const bytes = CryptoJS.AES.decrypt(this.store_settings.google_place_api_key, secretKey);
                        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
                        if (decrypted) this.store_settings.google_place_api_key = decrypted;
                    }
                } catch (e) { console.warn('google_place_api_key decrypt failed:', e); }

                // Decrypt google_map_api_key
                try {
                    if (this.store_settings.google_map_api_key) {
                        const mapBytes = CryptoJS.AES.decrypt(this.store_settings.google_map_api_key, secretKey);
                        const decryptedMap = mapBytes.toString(CryptoJS.enc.Utf8);
                        if (decryptedMap) this.store_settings.google_map_api_key = decryptedMap;
                    }
                } catch (e) { console.warn('google_map_api_key decrypt failed:', e); }

                const copyrightJson = this.safeJson(copyrightRaw);

                if (Array.isArray(this.languages) && this.languages.length) {

                    this.languages.forEach(lang => {

                        if (copyrightJson) {
                            // Apply br-replace per language value (safe — applied to text, not raw JSON)
                            const val = (copyrightJson[lang.code] || '').replace(/<br\s*\/?>/g, '\n');
                            this.$set(
                                this.storeTranslations.copyright_details,
                                lang.code,
                                val
                            );
                        } else {
                            this.$set(
                                this.storeTranslations.copyright_details,
                                lang.code,
                                lang.is_default ? (copyrightRaw || '') : ''
                            );
                        }

                    });
                }

                this.addressTranslations.store_address = {};

                const storeAddressRaw = this.store_settings.store_address || '';
                const storeAddressJson = this.safeJson(storeAddressRaw);

                if (Array.isArray(this.languages) && this.languages.length) {

                    this.languages.forEach(lang => {

                        if (storeAddressJson) {
                            this.$set(
                                this.addressTranslations.store_address,
                                lang.code,
                                storeAddressJson[lang.code] || ''
                            );
                        } else {
                            this.$set(
                                this.addressTranslations.store_address,
                                lang.code,
                                lang.is_default ? (storeAddressRaw || '') : ''
                            );
                        }

                    });

                }

                const remarkFields = [
                    'app_mode_customer_remark',
                    'app_mode_seller_remark',
                    'app_mode_delivery_boy_remark'
                ];

                if (Array.isArray(this.languages) && this.languages.length) {

                    remarkFields.forEach(field => {

                        // Always initialize object
                        if (!this.appTranslations[field]) {
                            this.$set(this.appTranslations, field, {});
                        }

                        const rawValue = this.store_settings[field] || '';
                        const jsonValue = this.safeJson(rawValue);

                        this.languages.forEach(lang => {

                            if (jsonValue) {

                                this.$set(
                                    this.appTranslations[field],
                                    lang.code,
                                    jsonValue[lang.code] || ''
                                );
                            } else {

                                this.$set(
                                    this.appTranslations[field],
                                    lang.code,
                                    lang.is_default ? (rawValue || '') : ''
                                );
                            }

                        });

                    });

                }
            });
        },

        saveAppSetting() {
            this.isLoading = true;

            const formData = new FormData();

            // Normal fields
            const normalFields = [
                'app_mode_customer', 'app_mode_seller', 'app_mode_delivery_boy',
                'playstore_url', 'appstore_url',
                'is_version_system_on', 'required_force_update', 'current_version',
                'ios_is_version_system_on', 'ios_required_force_update', 'ios_current_version'
            ];

            normalFields.forEach(field => {
                if (this.store_settings[field] !== undefined) {
                    formData.append(field, this.store_settings[field]);
                }
            });

            // Default language required check
            const defaultLang = this.languages.find(lang => lang.is_default);

            // Remark is only required when its corresponding toggle is ON
            const conditionalRequiredFields = [
                { key: 'app_mode_customer_remark', label: 'Customer Remark', toggle: 'app_mode_customer' },
                { key: 'app_mode_seller_remark', label: 'Seller Remark', toggle: 'app_mode_seller' },
                { key: 'app_mode_delivery_boy_remark', label: 'Driver Remark', toggle: 'app_mode_delivery_boy' },
            ];

            for (let field of conditionalRequiredFields) {
                // Skip validation if the toggle is off
                if (this.store_settings[field.toggle] != 1) continue;
                const value = this.appTranslations[field.key]?.[defaultLang.code];
                if (!value || !value.trim()) {
                    this.showError(`${field.label} (default language) is required!`);
                    this.isLoading = false;
                    return;
                }
            }

            // Helper to clean multilingual content (default required, others optional)
            const cleanLangObject = (obj = {}) => {
                const cleaned = {};
                Object.keys(obj).forEach(lang => {
                    let value = obj[lang];
                    if (typeof value === 'string') {
                        value = value.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
                    }
                    // Default language must exist, others can be empty
                    cleaned[lang] = value || '';
                });
                return cleaned;
            };

            // Append multilingual fields
            formData.append(
                'app_mode_customer_remark',
                JSON.stringify(cleanLangObject(this.appTranslations.app_mode_customer_remark))
            );

            formData.append(
                'app_mode_seller_remark',
                JSON.stringify(cleanLangObject(this.appTranslations.app_mode_seller_remark))
            );

            formData.append(
                'app_mode_delivery_boy_remark',
                JSON.stringify(cleanLangObject(this.appTranslations.app_mode_delivery_boy_remark))
            );


            axios.post(this.$apiUrl + '/store_settings/save_app_setting', formData)
                .then(res => {
                    if (res.data.status === 1) {
                        this.showMessage('success', res.data.message);
                        this.getStoreSetting();

                        setTimeout(() => {
                            this.$swal.close();
                            this.isLoading = false;
                            this.$router.push({ path: '/store_settings' });
                        }, 2000);
                    } else {
                        this.showError(res.data.message);
                        this.isLoading = false;
                    }
                })
                .catch(error => {
                    this.isLoading = false;
                    if (error?.response?.data?.message) {
                        this.showError(error.response.data.message);
                    } else if (error.message) {
                        this.showError(error.message);
                    } else {
                        this.showError(__('something_went_wrong'));
                    }
                });
        },

        // Save other settings

        saveOtherSetting: function () {
            this.isLoading = true;

            let formData = new FormData();

            // Add only other settings (includes date/time format for global display)
            const otherFields = [
                'max_cart_items_count', 'min_order_amount', 'low_stock_limit', 'product_rating', 'few_quantity_left_alert',
                'date_format', 'time_format', 'country_code', 'nation_code'
            ];

            otherFields.forEach(field => {
                if (this.store_settings[field] !== undefined) {
                    formData.append(field, this.store_settings[field]);
                }
            });

            let url = this.$apiUrl + '/store_settings/save_other_setting';
            let vm = this;
            axios.post(url, formData).then(res => {
                let data = res.data;
                if (data.status === 1) {
                    this.showMessage("success", data.message);
                    this.getStoreSetting();
                    setTimeout(
                        function () {
                            vm.$swal.close();
                            vm.isLoading = false;
                            vm.$router.push({ path: '/store_settings' });
                        }, 2000);
                } else {
                    vm.showError(data.message);
                    vm.isLoading = false;
                }
            }).catch(error => {
                this.isLoading = false;
                if (error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError("Something went wrong!");
                }
                vm.isLoading = false;
            });
        },

        // Save delivery boy settings
        saveDeliveryBoySetting: function () {
            this.isLoading = true;

            let formData = new FormData();

            // Add only delivery boy settings
            const deliveryBoyFields = [
                'delivery_boy_bonus_settings', 'delivery_boy_bonus_type',
                'delivery_boy_bonus_percentage', 'delivery_boy_bonus_min_amount',
                'delivery_boy_bonus_max_amount', 'generate_otp'
            ];

            deliveryBoyFields.forEach(field => {
                if (this.store_settings[field] !== undefined) {
                    formData.append(field, this.store_settings[field]);
                }
            });

            let url = this.$apiUrl + '/store_settings/save_delivery_boy_setting';
            let vm = this;
            axios.post(url, formData).then(res => {
                let data = res.data;
                if (data.status === 1) {
                    this.showMessage("success", data.message);
                    this.getStoreSetting();
                    setTimeout(
                        function () {
                            vm.$swal.close();
                            vm.isLoading = false;
                            vm.$router.push({ path: '/store_settings' });
                        }, 2000);
                } else {
                    vm.showError(data.message);
                    vm.isLoading = false;
                }
            }).catch(error => {
                this.isLoading = false;
                if (error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError("Something went wrong!");
                }
                vm.isLoading = false;
            });
        },

        // Save app settings
        saveStoreBasicSetting() {
            this.isLoading = true;

            const formData = new FormData();

            // Normal fields (default only)
            const normalFields = [
                'app_name',
                'system_configurations', 'system_timezone_gmt', 'system_configurations_id',
                'support_number', 'support_email'
            ];

            normalFields.forEach(field => {
                if (this.store_settings[field] !== undefined) {
                    formData.append(field, this.store_settings[field]);
                }
            });

            // Default language required check
            const defaultLang = this.languages.find(lang => lang.is_default);

            if (!this.storeTranslations.copyright_details[defaultLang.code]) {
                this.showError('Copyright Details (default language) are required!');
                this.isLoading = false;
                return;
            }

            // Multilingual fields
            const cleanLangObject = (obj = {}) => {
                const cleaned = {};
                Object.keys(obj).forEach(lang => {
                    let value = obj[lang];
                    if (typeof value === 'string') {
                        value = value.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
                    }
                    cleaned[lang] = value || '';
                });
                return cleaned;
            };

            //   formData.append('app_name', JSON.stringify(cleanLangObject(this.storeTranslations.app_name)));
            formData.append('copyright_details', JSON.stringify(cleanLangObject(this.storeTranslations.copyright_details)));

            // Files (default language only)
            if (this.logo_file) formData.append('logo', this.logo_file);
            if (this.fssai_lic_img_file) formData.append('fssai_lic_img', this.fssai_lic_img_file);
            if (this.panel_login_background_img_file) formData.append('panel_login_background_img', this.panel_login_background_img_file);

            axios.post(this.$apiUrl + '/store_settings/save_store_basic_setting', formData)
                .then(res => {
                    if (res.data.status === 1) {
                        this.showMessage('success', res.data.message);
                        this.getStoreSetting();
                    } else {
                        this.showError(res.data.message);
                    }
                    this.isLoading = false;
                })
                .catch(err => {
                    this.isLoading = false;
                    this.showError(err?.response?.data?.message || err.message || __('something_went_wrong'));
                });
        },

        // Save address settings (store address, map, currency, timezone, default city)
        saveAddressSetting() {
            this.isLoading = true;
            const vm = this;

            // Ensure default_city_id is set from multiselect before submit
            this.setCityId();

            const formData = new FormData();

            // Translatable: store_address as JSON
            const cleanLangObject = (obj = {}) => {
                const cleaned = {};
                Object.keys(obj).forEach(lang => {
                    let value = obj[lang];
                    if (typeof value === 'string') {
                        value = value.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
                    }
                    cleaned[lang] = value || '';
                });
                return cleaned;
            };
            formData.append('store_address', JSON.stringify(cleanLangObject(this.addressTranslations.store_address)));

            // Non-translatable address fields
            const addressFields = [
                'map_latitude', 'map_longitude', 'currency', 'currency_code',
                'decimal_point', 'system_timezone', 'default_city_id'
            ];
            addressFields.forEach(field => {
                if (this.store_settings[field] !== undefined) {
                    formData.append(field, this.store_settings[field]);
                }
            });

            axios.post(this.$apiUrl + '/store_settings/save_address_setting', formData)
                .then(res => {
                    if (res.data.status === 1) {
                        this.showMessage('success', res.data.message);
                        this.getStoreSetting();
                    } else {
                        this.showError(res.data.message);
                    }
                    vm.isLoading = false;
                })
                .catch(err => {
                    vm.isLoading = false;
                    this.showError(err?.response?.data?.message || err.message || __('something_went_wrong'));
                });
        },

        // Save frontend home settings
        saveFrontendHomeSetting: function () {
            this.isLoading = true;

            let formData = new FormData();

            // Add only frontend home settings
            const frontendHomeFields = [
                'is_category_section_in_homepage', 'count_category_section_in_homepage',
                'is_brand_section_in_homepage', 'count_brand_section_in_homepage',
                'is_seller_section_in_homepage', 'count_seller_section_in_homepage',
                'is_country_section_in_homepage', 'count_country_section_in_homepage'
            ];

            frontendHomeFields.forEach(field => {
                if (this.store_settings[field] !== undefined) {
                    formData.append(field, this.store_settings[field]);
                }
            });

            let url = this.$apiUrl + '/store_settings/save_frontend_home_setting';
            let vm = this;
            axios.post(url, formData).then(res => {
                let data = res.data;
                if (data.status === 1) {
                    this.showMessage("success", data.message);
                    this.getStoreSetting();
                    setTimeout(
                        function () {
                            vm.$swal.close();
                            vm.isLoading = false;
                            vm.$router.push({ path: '/store_settings' });
                        }, 2000);
                } else {
                    vm.showError(data.message);
                    vm.isLoading = false;
                }
            }).catch(error => {
                this.isLoading = false;
                if (error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError("Something went wrong!");
                }
                vm.isLoading = false;
            });
        },

        // Save SMTP mail settings
        saveSmtpMailSetting: function () {
            this.isLoading = true;

            let formData = new FormData();

            // Add only SMTP mail settings
            const smtpFields = [
                'mailer', 'smtp_from_mail', 'smtp_reply_to', 'smtp_email_password', 'smtp_host',
                'smtp_port', 'smtp_content_type', 'smtp_encryption_type'
            ];

            smtpFields.forEach(field => {
                if (this.store_settings[field] !== undefined) {
                    formData.append(field, this.store_settings[field]);
                }
            });

            let url = this.$apiUrl + '/store_settings/save_smtp_mail_setting';
            let vm = this;
            axios.post(url, formData).then(res => {
                let data = res.data;
                if (data.status === 1) {
                    this.showMessage("success", data.message);
                    this.getStoreSetting();
                    setTimeout(
                        function () {
                            vm.$swal.close();
                            vm.isLoading = false;
                            vm.$router.push({ path: '/store_settings' });
                        }, 2000);
                } else {
                    vm.showError(data.message);
                    vm.isLoading = false;
                }
            }).catch(error => {
                this.isLoading = false;
                if (error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError("Something went wrong!");
                }
                vm.isLoading = false;
            });
        },

        // Save third party API settings
        saveThirdPartyApiSetting: function () {
            this.isLoading = true;

            let formData = new FormData();

            const apiFields = ['google_place_api_key', 'google_map_api_key', 'apiKey', 'googleMapApiKey', 'text_gen_key'];

            apiFields.forEach(field => {
                if (this.store_settings[field] !== undefined) {
                    let value = this.store_settings[field];

                    // Only encrypt google_place_api_key and google_map_api_key
                    // apiKey and googleMapApiKey should remain unencrypted (original values)
                    if ((field === "google_place_api_key" || field === "google_map_api_key") && value) {
                        const secretKey = "ewgrrtoecaemr";
                        value = CryptoJS.AES.encrypt(value, secretKey).toString();
                    }

                    formData.append(field, value);
                }
            });

            let url = this.$apiUrl + '/store_settings/save_third_party_api_setting';
            let vm = this;
            axios.post(url, formData).then(res => {
                let data = res.data;
                if (data.status === 1) {
                    this.showMessage("success", data.message);
                    this.getStoreSetting();
                    setTimeout(
                        function () {
                            vm.$swal.close();
                            vm.isLoading = false;
                            vm.$router.push({ path: '/store_settings' });
                        }, 2000);
                } else {
                    vm.showError(data.message);
                    vm.isLoading = false;
                }
            }).catch(error => {
                this.isLoading = false;
                if (error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError("Something went wrong!");
                }
                vm.isLoading = false;
            });
        },

        // Save seller settings
        saveSellerSetting: function () {
            this.isLoading = true;

            let formData = new FormData();

            // Add only seller settings
            const sellerFields = ['one_seller_cart', 'seller_commission', 'self_pickup_mode'];

            sellerFields.forEach(field => {
                if (this.store_settings[field] !== undefined) {
                    formData.append(field, this.store_settings[field]);
                }
            });

            let url = this.$apiUrl + '/store_settings/save_seller_setting';
            let vm = this;
            axios.post(url, formData).then(res => {
                let data = res.data;
                if (data.status === 1) {
                    this.showMessage("success", data.message);
                    this.getStoreSetting();
                    setTimeout(
                        function () {
                            vm.$swal.close();
                            vm.isLoading = false;
                            vm.$router.push({ path: '/store_settings' });
                        }, 2000);
                } else {
                    vm.showError(data.message);
                    vm.isLoading = false;
                }
            }).catch(error => {
                this.isLoading = false;
                if (error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError("Something went wrong!");
                }
                vm.isLoading = false;
            });
        },

        // Save cart settings
        saveCartSetting: function () {
            this.isLoading = true;

            let formData = new FormData();

            // Add only cart settings
            const cartFields = [
                'cart_notification', 'notification_delay_after_cart_addition',
                'notification_interval', 'notification_stop_time'
            ];

            cartFields.forEach(field => {
                if (this.store_settings[field] !== undefined) {
                    formData.append(field, this.store_settings[field]);
                }
            });

            let url = this.$apiUrl + '/store_settings/save_cart_setting';
            let vm = this;
            axios.post(url, formData).then(res => {
                let data = res.data;
                if (data.status === 1) {
                    this.showMessage("success", data.message);
                    this.getStoreSetting();
                    setTimeout(
                        function () {
                            vm.$swal.close();
                            vm.isLoading = false;
                            vm.$router.push({ path: '/store_settings' });
                        }, 2000);
                } else {
                    vm.showError(data.message);
                    vm.isLoading = false;
                }
            }).catch(error => {
                this.isLoading = false;
                if (error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError("Something went wrong!");
                }
                vm.isLoading = false;
            });
        },

        saveRecordLoginSetting: function () {
            this.isLoading = true;

            let login_settingsObject = this.login_settings;
            let formData = new FormData();
            for (let key in login_settingsObject) {
                formData.append(key, login_settingsObject[key]);
            }

            let url = this.$apiUrl + '/store_settings/save_login_setting';
            let vm = this;
            axios.post(url, formData).then(res => {
                let data = res.data;
                if (data.status === 1) {
                    this.showMessage("success", data.message);
                    this.getStoreSetting();
                    setTimeout(
                        function () {
                            vm.$swal.close();
                            vm.isLoading = false;
                            window.location.reload();
                            vm.$router.push({ path: '/store_settings' });
                        }, 2000);
                } else {
                    vm.showError(data.message);
                    vm.isLoading = false;
                }
            }).catch(error => {
                this.isLoading = false;
                if (error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError("Something went wrong!");
                }
                vm.isLoading = false;
            });
        },
        saveReferEarnSetting: function () {
            this.isLoading = true;

            let refer_earn_settingsObject = this.refer_earn_settings;
            let formData = new FormData();
            for (let key in refer_earn_settingsObject) {
                formData.append(key, refer_earn_settingsObject[key]);
            }

            let url = this.$apiUrl + '/store_settings/save_refer_earn_setting';
            let vm = this;
            axios.post(url, formData).then(res => {
                let data = res.data;
                if (data.status === 1) {
                    this.showMessage("success", data.message);
                    this.getStoreSetting();
                    setTimeout(
                        function () {
                            vm.$swal.close();
                            vm.isLoading = false;
                            window.location.reload();
                            vm.$router.push({ path: '/store_settings' });
                        }, 2000);
                } else {
                    vm.showError(data.message);
                    vm.isLoading = false;
                }
            }).catch(error => {
                this.isLoading = false;
                if (error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError("Something went wrong!");
                }
                vm.isLoading = false;
            });
        },

        // Test mail uses smtp_from_mail as SMTP username. For Gmail that must be your Gmail address; for SendGrid use host smtp.sendgrid.net and username "apikey".
        testMail: function () {

            let data = {
                'mailer': this.store_settings.mailer,
                'email': this.store_settings.test_email,
                'host': this.store_settings.smtp_host,
                'username': this.store_settings.smtp_from_mail,
                'password': this.store_settings.smtp_email_password,
                'port': this.store_settings.smtp_port,
                'encryption': this.store_settings.smtp_encryption_type,
                'support_email': this.store_settings.support_email,
                'app_name': this.store_settings.app_name,
            };

            let url = this.$apiUrl + '/store_settings/test_mail';
            let vm = this;
            vm.isSendingTestEmail = true;
            axios.post(url, data).then(res => {
                vm.isSendingTestEmail = false;
                let data = res.data;
                if (data.status === 1) {
                    this.showMessage("success", data.message);
                } else {
                    vm.showError(data.message);
                    vm.isLoading = false;
                }
            }).catch(error => {
                vm.isSendingTestEmail = false;
                if (error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError("Something went wrong!");
                }
            })
        },

        fetchActiveLanguages() {
            if (this.languages.length) {
                return Promise.resolve(this.languages);
            }

            this.isLoadingLanguages = true;

            return axios.get(this.$apiUrl + '/active_languages')
                .then(res => {
                    this.languages = res.data.data || [];

                    const def = this.languages.find(l => l.is_default == 1);
                    this.defaultLanguageId = def ? def.id : null;

                    // init empty translation shells ONCE
                    this.initTranslationShells();

                    return this.languages;
                })
                .finally(() => {
                    this.isLoadingLanguages = false;
                });
        },
        initTranslationShells() {
            this.languages.forEach(lang => {
                this.$set(this.storeTranslations.app_name, lang.code, '');
                this.$set(this.storeTranslations.copyright_details, lang.code, '');

                this.$set(this.appTranslations.app_mode_customer_remark, lang.code, '');
                this.$set(this.appTranslations.app_mode_seller_remark, lang.code, '');
                this.$set(this.appTranslations.app_mode_delivery_boy_remark, lang.code, '');
            });
        },

        _translateCodeKeyed(sourceData, applyTo, fields, emptyOnly) {
            const defaultLang = this.languages.find(l => l.is_default);
            if (!defaultLang || !defaultLang.code) {
                this.showError(__('default_language_data_missing') || 'Default language not found');
                return Promise.reject();
            }
            if (Object.keys(sourceData).length === 0) {
                this.showError(__('default_language_data_missing') || 'No content in default language to translate');
                return Promise.reject();
            }

            if (emptyOnly) {
                let hasEmptyField = false;
                for (const field of fields) {
                    const targetObj = applyTo[field];
                    if (!targetObj || typeof targetObj !== 'object') continue;

                    for (const lang of this.languages) {
                        if (lang.is_default) continue;
                        const val = targetObj[lang.code];
                        if (!val || String(val).trim() === '') {
                            hasEmptyField = true;
                            break;
                        }
                    }
                    if (hasEmptyField) break;
                }

                if (!hasEmptyField) {
                    this.showError(__('translation_error_all_fields_filled') || 'All fields already have values. There is nothing to translate.');
                    return Promise.reject();
                }
            }

            this.translateSuccessMessage = '';
            if (emptyOnly) this.loadingEmpty = true; else this.loadingOverwrite = true;
            return axios.post(this.$apiUrl + '/' + (emptyOnly ? 'languages/translate-empty' : 'languages/translate-overwrite'), {
                target_language: defaultLang.code,
                data: sourceData
            })
                .then(res => {
                    const allTranslations = res.data.data || {};
                    this.languages.forEach(lang => {
                        if (lang.is_default) return;
                        const translated = allTranslations[lang.code];
                        if (!translated) return;
                        fields.forEach(field => {
                            const val = translated[field];
                            if (val == null) return;
                            if (applyTo[field] && typeof applyTo[field] === 'object') {
                                if (emptyOnly && applyTo[field][lang.code]) return;
                                this.$set(applyTo[field], lang.code, val);
                            }
                        });
                    });
                    this.translateSuccessMessage = emptyOnly
                        ? (__('translation_completed_successfully') || 'Translation completed successfully')
                        : (__('translation_overwritten_successfully') || 'Translation overwritten successfully');
                    setTimeout(() => { this.translateSuccessMessage = ''; }, 5000);
                })
                .catch(err => {
                    const msg = err.response?.data?.message || err.message || __('something_went_wrong');
                    this.showError(msg);
                    throw err;
                })
                .finally(() => {
                    if (emptyOnly) this.loadingEmpty = false; else this.loadingOverwrite = false;
                });
        },

        translateEmptyStoreSetting(language) {
            if (!language || !language.is_default) return;
            const code = this.languages.find(l => l.is_default)?.code;
            if (!code) return;
            const source = { copyright_details: this.storeTranslations.copyright_details[code] || '' };
            const applyTo = { copyright_details: this.storeTranslations.copyright_details };
            this._translateCodeKeyed(source, applyTo, ['copyright_details'], true);
        },
        translateOverwriteStoreSetting(language) {
            if (!language || !language.is_default) return;
            const code = this.languages.find(l => l.is_default)?.code;
            if (!code) return;
            const source = { copyright_details: this.storeTranslations.copyright_details[code] || '' };
            const applyTo = { copyright_details: this.storeTranslations.copyright_details };
            this._translateCodeKeyed(source, applyTo, ['copyright_details'], false);
        },

        translateEmptyAddressSetting(language) {
            if (!language || !language.is_default) return;
            const code = this.languages.find(l => l.is_default)?.code;
            if (!code) return;
            const source = { store_address: this.addressTranslations.store_address[code] || '' };
            const applyTo = { store_address: this.addressTranslations.store_address };
            this._translateCodeKeyed(source, applyTo, ['store_address'], true);
        },
        translateOverwriteAddressSetting(language) {
            if (!language || !language.is_default) return;
            const code = this.languages.find(l => l.is_default)?.code;
            if (!code) return;
            const source = { store_address: this.addressTranslations.store_address[code] || '' };
            const applyTo = { store_address: this.addressTranslations.store_address };
            this._translateCodeKeyed(source, applyTo, ['store_address'], false);
        },

        translateEmptyAppSetting(language) {
            if (!language || !language.is_default) return;
            const code = this.languages.find(l => l.is_default)?.code;
            if (!code) return;
            const source = {
                app_mode_customer_remark: this.appTranslations.app_mode_customer_remark[code] || '',
                app_mode_seller_remark: this.appTranslations.app_mode_seller_remark[code] || '',
                app_mode_delivery_boy_remark: this.appTranslations.app_mode_delivery_boy_remark[code] || ''
            };
            const applyTo = this.appTranslations;
            this._translateCodeKeyed(source, applyTo, ['app_mode_customer_remark', 'app_mode_seller_remark', 'app_mode_delivery_boy_remark'], true);
        },
        translateOverwriteAppSetting(language) {
            if (!language || !language.is_default) return;
            const code = this.languages.find(l => l.is_default)?.code;
            if (!code) return;
            const source = {
                app_mode_customer_remark: this.appTranslations.app_mode_customer_remark[code] || '',
                app_mode_seller_remark: this.appTranslations.app_mode_seller_remark[code] || '',
                app_mode_delivery_boy_remark: this.appTranslations.app_mode_delivery_boy_remark[code] || ''
            };
            const applyTo = this.appTranslations;
            this._translateCodeKeyed(source, applyTo, ['app_mode_customer_remark', 'app_mode_seller_remark', 'app_mode_delivery_boy_remark'], false);
        },

    },

    mounted() {
    }

}
</script>
<style scoped>
@import "../../../../node_modules/vue-multiselect/dist/vue-multiselect.min.css";

.file-input-div {
    word-break: break-all;
    overflow-wrap: break-word;
}

/* Limit Store Setting tab image preview size (Logo, FSSAI, Panel login background) */
.store-settings-img-preview {
    max-width: 200px;
    max-height: 150px;
    object-fit: contain;
    display: block;
    margin-top: 0.5rem;
}

</style>
