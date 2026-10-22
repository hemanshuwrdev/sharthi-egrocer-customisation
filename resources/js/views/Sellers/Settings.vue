<template>
    <div>
        <div class="page-heading">
            <div class="row mb-3">
                <div class="col-12">
                    <!-- <h3>{{ __('thermal_print_settings') }}</h3> -->
                    <h3>{{ __('settings') }}</h3>
                </div>
            </div>

            <!-- HIDDEN for now (thermal printing not in use). To bring the Thermal Print Settings card back, delete
                 this comment's opening and closing markers. It has a logo upload (left) and a paper width choice (right);
                 the script below (loading, saving, saveSettings) is untouched.
            <div class="card">
                <div class="card-header">
                    <h4>{{ __('thermal_print_settings') }}</h4>
                </div>

                <div class="card-body">
                    <div class="row">

                        <div class="form-group col-md-6">
                            <label>{{ __('thermal_invoice_logo') }}</label>

                            <input type="file" accept="image/*" ref="file_thermal_logo" class="file-input"
                                @change="handleThermalLogo">

                            <div class="file-input-div bg-gray-100" @click="$refs.file_thermal_logo.click()"
                                @drop="dropThermalLogo" @dragover="$dragoverFile" @dragleave="$dragleaveFile">

                                <template v-if="thermal_logo && thermal_logo.name">
                                    <label>{{ __('selected_file_name') }}: {{ thermal_logo.name }}</label>
                                </template>

                                <template v-else>
                                    <label><i class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                    <label>{{ __('drag_and_drop_to_upload_image') }}</label>
                                </template>
                            </div>

                            <div class="row mt-2" v-if="thermal_logo_url">
                                <div class="col-md-4">
                                    <img :src="thermal_logo_url" class="custom-image" />
                                </div>
                            </div>
                        </div>

                        <div class="form-group col-md-6">
                            <label>{{ __('thermal_paper_width') }}</label>

                            <b-form-radio-group v-model="thermal_paper_width" :options="paperOptions" buttons
                                button-variant="outline-primary">
                            </b-form-radio-group>
                        </div>

                    </div>
                </div>

                <div class="card-footer">
                    <b-button variant="primary" :disabled="isLoading" @click="saveSettings">
                        {{ __('save') }}
                        <b-spinner small v-if="isLoading"></b-spinner>
                    </b-button>
                </div>

            </div>
            -->

            <div class="text-muted mb-3">{{ __('Manage how orders, payments and documents work for your store.') }}</div>

            <b-tabs v-model="activeTab" pills nav-class="settings-tabs mb-3" content-class="mt-1">

                <!-- Orders & Payments -->
                <b-tab>
                    <template #title>
                        <span class="tab-title"><i class="fa fa-shopping-cart me-2"></i>{{ __('Orders & Payments') }}</span>
                    </template>

                    <div class="row g-3">
                        <div class="col-xl-5">
                            <div class="card settings-card h-100">
                                <div class="settings-card-head">
                                    <span class="settings-icon"><i class="fa fa-clipboard-list"></i></span>
                                    <h5 class="mb-0">{{ __('order_settings') }}</h5>
                                </div>

                                <div class="card-body pt-0">
                                    <div class="setting-row">
                                        <div class="setting-text">
                                            <label for="order_cutoff_time" class="setting-title">{{ __('order_cutoff_time') }}</label>
                                            <div class="setting-hint">{{ __('orders_at_or_before_this_time_get_next_day_delivery_after_get_day_after') }}</div>
                                        </div>
                                        <div class="setting-control">
                                            <input type="time" class="form-control"
                                                id="order_cutoff_time"
                                                v-model="order_cutoff_time"
                                                placeholder="15:00" />
                                        </div>
                                    </div>

                                    <div class="setting-row">
                                        <div class="setting-text">
                                            <label for="min_order_amount" class="setting-title">{{ __('min_order_amount') }}</label>
                                            <div class="setting-hint">{{ __('minimum_cart_total_required_for_a_retailer_to_place_an_order') }}</div>
                                        </div>
                                        <div class="setting-control">
                                            <input type="number" min="0" step="0.01" class="form-control"
                                                id="min_order_amount"
                                                v-model="min_order_amount"
                                                :placeholder="__('optional')" />
                                        </div>
                                    </div>

                                    <div class="setting-row">
                                        <div class="setting-text">
                                            <label for="delivery_otp_enabled" class="setting-title">{{ __('delivery_otp_enabled') }}</label>
                                            <div class="setting-hint">{{ __('driver_must_enter_the_retailers_otp_to_mark_an_order_delivered_not_the_login_otp') }}</div>
                                        </div>
                                        <div class="setting-control setting-control-switch">
                                            <div class="form-check form-switch m-0">
                                                <input type="checkbox" class="form-check-input"
                                                    id="delivery_otp_enabled"
                                                    v-model="delivery_otp_enabled" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="settings-card-foot">
                                    <b-button variant="primary" :disabled="isOrderLoading" @click="saveOrderSettings">
                                        {{ __('save') }}
                                        <b-spinner small v-if="isOrderLoading"></b-spinner>
                                    </b-button>
                                </div>
                            </div>
                        </div>

                        <!-- Sarthi: Payment Collection Methods -->
                        <div class="col-xl-7">
                            <div class="card settings-card h-100">
                                <div class="settings-card-head">
                                    <span class="settings-icon"><i class="fa fa-wallet"></i></span>
                                    <h5 class="mb-0">{{ __('Payment Collection Methods') }}</h5>
                                </div>
                                <div class="card-body pt-0">
                                    <p class="setting-hint">{{ __('Toggle the methods your drivers can use to collect payment. Methods disabled by admin cannot be enabled.') }}</p>
                                    <div class="row g-3">
                                        <div class="col-sm-6" v-for="method in paymentMethods" :key="method.method">
                                            <div class="method-tile h-100"
                                                :class="{ 'is-on': method.is_enabled == 1, 'is-locked': !method.is_editable }">
                                                <div class="d-flex align-items-center justify-content-between gap-2">
                                                    <div class="d-flex align-items-center gap-2">
                                                        <span class="method-icon"><i :class="methodIcon(method.method)"></i></span>
                                                        <span class="fw-semibold">{{ methodLabel(method.method) }}</span>
                                                    </div>
                                                    <div class="form-check form-switch m-0">
                                                        <input type="checkbox" true-value="1" false-value="0"
                                                            class="form-check-input"
                                                            v-model="method.is_enabled"
                                                            :disabled="!method.is_editable"
                                                            :title="!method.is_editable ? __('Disabled by admin') : ''"
                                                        >
                                                    </div>
                                                </div>
                                                <small v-if="!method.is_editable" class="text-danger d-block mt-2">{{ __('Disabled by admin') }}</small>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- One instant-payment discount shared by Cash and Bank -->
                                    <div class="mt-4">
                                        <div class="row g-3">
                                            <div class="col-md-5">
                                                <label class="form-label small text-muted mb-1">{{ __('Cash / Bank discount %') }}</label>
                                                <input type="number" min="0" max="100" step="0.01"
                                                    class="form-control form-control-sm"
                                                    v-model="instantDiscountPercent"
                                                    :disabled="!instantDiscountEditable"
                                                    :placeholder="__('e.g. 2')"
                                                >
                                            </div>
                                            <div class="col-md-7">
                                                <label class="form-label small text-muted mb-1">{{ __('Discount Applicable On') }}</label>
                                                <select class="form-select form-select-sm"
                                                    v-model="cashDiscountApplicableOn"
                                                    :disabled="!instantDiscountEditable">
                                                    <option value="driver">{{ __('Driver App only (On delivery)') }}</option>
                                                    <option value="both">{{ __('Both (Driver on delivery & Salesman collection)') }}</option>
                                                    <option value="salesman">{{ __('Salesman App only (Collection)') }}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <small class="setting-hint d-block mt-2">{{ __('Knocked off the order total when the retailer pays the whole amount in one go by Cash or Bank. No discount if the payment is split across types.') }}</small>
                                    </div>

                                </div>
                                <div class="settings-card-foot">
                                    <b-button variant="primary" :disabled="isPaymentLoading" @click="savePaymentMethods">
                                        {{ __('save') }}
                                        <b-spinner small v-if="isPaymentLoading"></b-spinner>
                                    </b-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </b-tab>

                <!-- Document numbering -->
                <b-tab>
                    <template #title>
                        <span class="tab-title"><i class="fa fa-hashtag me-2"></i>{{ __('Document numbering') }}</span>
                    </template>

                    <p class="setting-hint mb-3">{{ __('Choose how each document number looks. The preview shows the next number that will be issued.') }}</p>
                    <div class="row g-3">
                    <div class="col-lg-4">
                        <div class="card settings-card h-100">
                            <div class="settings-card-head">
                                <span class="settings-icon"><i class="fa fa-file-invoice"></i></span>
                                <h5 class="mb-0">{{ __('invoice_settings') }}</h5>
                            </div>
                            <div class="card-body pt-0">
                                <p class="setting-hint">{{ __('invoice_settings_hint') }}</p>
                                <div class="row g-3">
                                    <div class="col-6">
                                        <label for="invoice_prefix" class="form-label">{{ __('invoice_prefix') }}</label>
                                        <input type="text" class="form-control" id="invoice_prefix"
                                            v-model="invoice_prefix" :placeholder="__('optional')" />
                                    </div>
                                    <div class="col-6">
                                        <label for="invoice_suffix" class="form-label">{{ __('invoice_suffix') }}</label>
                                        <input type="text" class="form-control" id="invoice_suffix"
                                            v-model="invoice_suffix" :placeholder="__('optional')" />
                                    </div>
                                    <div class="col-12">
                                        <label for="invoice_next_number" class="form-label">{{ __('invoice_number') }}</label>
                                        <input type="number" min="1" class="form-control" id="invoice_next_number"
                                            v-model.number="invoice_next_number" placeholder="1" />
                                    </div>
                                </div>
                                <div class="series-preview mt-3">
                                    <span class="text-muted small">{{ __('preview') }}</span>
                                    <strong>{{ invoiceNumberPreview }}</strong>
                                </div>
                            </div>
                            <div class="settings-card-foot">
                                <b-button variant="primary" :disabled="isInvoiceLoading" @click="saveInvoiceSettings">
                                    {{ __('save') }}
                                    <b-spinner small v-if="isInvoiceLoading"></b-spinner>
                                </b-button>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card settings-card h-100">
                            <div class="settings-card-head">
                                <span class="settings-icon"><i class="fa fa-truck"></i></span>
                                <h5 class="mb-0">{{ __('loading_slip_settings') }}</h5>
                            </div>
                            <div class="card-body pt-0">
                                <p class="setting-hint">{{ __('loading_slip_settings_hint') }}</p>
                                <div class="row g-3">
                                    <div class="col-6">
                                        <label for="loading_slip_prefix" class="form-label">{{ __('loading_slip_prefix') }}</label>
                                        <input type="text" class="form-control" id="loading_slip_prefix"
                                            v-model="loading_slip_prefix" :placeholder="__('optional')" />
                                    </div>
                                    <div class="col-6">
                                        <label for="loading_slip_suffix" class="form-label">{{ __('loading_slip_suffix') }}</label>
                                        <input type="text" class="form-control" id="loading_slip_suffix"
                                            v-model="loading_slip_suffix" :placeholder="__('optional')" />
                                    </div>
                                    <div class="col-12">
                                        <label for="loading_slip_next_number" class="form-label">{{ __('loading_slip_number') }}</label>
                                        <input type="number" min="1" class="form-control" id="loading_slip_next_number"
                                            v-model.number="loading_slip_next_number" placeholder="1" />
                                    </div>
                                </div>
                                <div class="series-preview mt-3">
                                    <span class="text-muted small">{{ __('preview') }}</span>
                                    <strong>{{ loadingSlipNumberPreview }}</strong>
                                </div>
                            </div>
                            <div class="settings-card-foot">
                                <b-button variant="primary" :disabled="isLoadingSlipSettingsLoading" @click="saveLoadingSlipSettings">
                                    {{ __('save') }}
                                    <b-spinner small v-if="isLoadingSlipSettingsLoading"></b-spinner>
                                </b-button>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card settings-card h-100">
                            <div class="settings-card-head">
                                <span class="settings-icon"><i class="fa fa-undo-alt"></i></span>
                                <h5 class="mb-0">{{ __('credit_note_settings') }}</h5>
                            </div>
                            <div class="card-body pt-0">
                                <p class="setting-hint">{{ __('credit_note_settings_hint') }}</p>
                                <div class="row g-3">
                                    <div class="col-6">
                                        <label for="credit_note_prefix" class="form-label">{{ __('credit_note_prefix') }}</label>
                                        <input type="text" class="form-control" id="credit_note_prefix"
                                            v-model="credit_note_prefix" :placeholder="__('optional')" />
                                    </div>
                                    <div class="col-6">
                                        <label for="credit_note_suffix" class="form-label">{{ __('credit_note_suffix') }}</label>
                                        <input type="text" class="form-control" id="credit_note_suffix"
                                            v-model="credit_note_suffix" :placeholder="__('optional')" />
                                    </div>
                                    <div class="col-12">
                                        <label for="credit_note_next_number" class="form-label">{{ __('credit_note_number') }}</label>
                                        <input type="number" min="1" class="form-control" id="credit_note_next_number"
                                            v-model.number="credit_note_next_number" placeholder="1" />
                                    </div>
                                </div>
                                <div class="series-preview mt-3">
                                    <span class="text-muted small">{{ __('preview') }}</span>
                                    <strong>{{ creditNoteNumberPreview }}</strong>
                                </div>
                            </div>
                            <div class="settings-card-foot">
                                <b-button variant="primary" :disabled="isCreditNoteLoading" @click="saveCreditNoteSettings">
                                    {{ __('save') }}
                                    <b-spinner small v-if="isCreditNoteLoading"></b-spinner>
                                </b-button>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card settings-card h-100">
                            <div class="settings-card-head">
                                <span class="settings-icon"><i class="fa fa-file-signature"></i></span>
                                <h5 class="mb-0">{{ __('signature_settings') }}</h5>
                            </div>
                            <div class="card-body pt-0">
                                <p class="setting-hint">{{ __('signature_settings_hint') }}</p>
                                <input type="file" accept="image/png,image/jpeg,image/webp" ref="file_signature"
                                    class="d-none" @change="handleSignaturePicked">
                                <div class="signature-drop" :class="{ 'is-over': signatureDragOver }"
                                    @click="$refs.file_signature.click()"
                                    @dragover.prevent="signatureDragOver = true"
                                    @dragleave="signatureDragOver = false"
                                    @drop.prevent="dropSignature">
                                    <img v-if="signaturePreviewUrl" :src="signaturePreviewUrl" class="signature-drop__img" alt="" />
                                    <template v-else>
                                        <i class="fa fa-cloud-upload-alt fa-2x"></i>
                                        <span>{{ __('signature_upload_prompt') }}</span>
                                    </template>
                                </div>
                                <p class="text-muted small mt-2 mb-0" v-if="signature_file && signature_file.name">
                                    {{ __('selected_file_name') }} {{ signature_file.name }}
                                </p>
                                <p class="text-muted small mt-2 mb-0" v-else-if="!signature_image">
                                    {{ __('signature_not_set_hint') }}
                                </p>
                            </div>
                            <div class="settings-card-foot">
                                <b-button variant="primary" :disabled="isSignatureLoading || !signature_file" @click="saveSignature">
                                    {{ __('save') }}
                                    <b-spinner small v-if="isSignatureLoading"></b-spinner>
                                </b-button>
                                <b-button variant="outline-danger" class="ms-2" v-if="signature_image && !signature_file"
                                    :disabled="isSignatureLoading" @click="removeSignature">
                                    {{ __('remove') }}
                                </b-button>
                                <b-button variant="outline-secondary" class="ms-2" v-if="signature_file"
                                    :disabled="isSignatureLoading" @click="clearPickedSignature">
                                    {{ __('cancel') }}
                                </b-button>
                            </div>
                        </div>
                    </div>
                    </div>
                </b-tab>

                <!-- Notifications: which order status changes send a mail / an SMS (moved here from the old /seller/settings page) -->
                <b-tab>
                    <template #title>
                        <span class="tab-title"><i class="fa fa-bell me-2"></i>{{ __('Notifications') }}</span>
                    </template>

                    <div class="row">
                        <div class="col-xl-8">
                            <form @submit.prevent="saveMailSetting">
                                <div class="card settings-card">
                                    <div class="settings-card-head">
                                        <span class="settings-icon"><i class="fa fa-envelope"></i></span>
                                        <h5 class="mb-0">{{ __('order_mail_settings') }}</h5>
                                    </div>
                                    <div class="card-body pt-0">
                                        <p class="setting-hint">{{ __('Choose which order updates send a mail or an SMS.') }}</p>

                                        <div class="notify-row notify-row--head">
                                            <span>{{ __('order_status') }}</span>
                                            <span class="text-center">{{ __('mail') }}</span>
                                            <span class="text-center">{{ __('sms') }}</span>
                                        </div>
                                        <div v-for="status in statuses" :key="status.id" class="notify-row">
                                            <label class="notify-label">{{ getStatusDisplayName(status) }}</label>
                                            <div class="form-check form-switch m-0 d-flex justify-content-center">
                                                <input class="form-check-input" type="checkbox" :id="'checkbox_mail_' + status.id"
                                                    :value="status.id" v-model="mail_statuses">
                                            </div>
                                            <div class="form-check form-switch m-0 d-flex justify-content-center">
                                                <input class="form-check-input" type="checkbox" :id="'checkbox_sms_' + status.id"
                                                    :value="status.id" v-model="sms_statuses">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="settings-card-foot">
                                        <b-button type="submit" variant="primary" :disabled="isNotifyLoading">
                                            {{ __('save') }}
                                            <b-spinner small v-if="isNotifyLoading"></b-spinner>
                                        </b-button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </b-tab>

                <!-- Security -->
                <b-tab>
                    <template #title>
                        <span class="tab-title"><i class="fa fa-lock me-2"></i>{{ __('Security') }}</span>
                    </template>

                    <!-- Sarthi: Sensitive Operations Password -->
                    <div class="row">
                        <div class="col-xl-8">
                            <div class="card settings-card">
                                <div class="settings-card-head">
                                    <span class="settings-icon"><i class="fa fa-key"></i></span>
                                    <h5 class="mb-0">{{ __('Sensitive Operations Password') }}</h5>
                                </div>
                                <div class="card-body pt-0">
                                    <p class="setting-hint">
                                        {{ __('This password gates risky corrections (like editing a driver\'s recorded payment method) so only you can authorize them, even if staff have access to this panel.') }}
                                    </p>

                                    <template v-if="!sensitivePasswordIsSet">
                                        <div class="row g-3">
                                            <div class="col-md-6">
                                                <label class="form-label">{{ __('Password') }}</label>
                                                <input type="password" class="form-control" v-model="sensitiveNewPassword" autocomplete="new-password" />
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label">{{ __('Confirm Password') }}</label>
                                                <input type="password" class="form-control" v-model="sensitiveConfirmPassword" autocomplete="new-password" />
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="row g-3">
                                            <div class="col-md-4">
                                                <template v-if="!sensitiveForgotMode">
                                                    <label class="form-label">{{ __('Old Password') }}</label>
                                                    <input type="password" class="form-control" v-model="sensitiveOldPassword" autocomplete="current-password" />
                                                    <a href="javascript:void(0)" class="small" @click="startSensitiveForgotMode">{{ __('forgot_password') }}?</a>
                                                </template>
                                                <template v-else>
                                                    <label class="form-label">{{ __('OTP') }}</label>
                                                    <input type="text" class="form-control" v-model="sensitiveOtp" maxlength="6" inputmode="numeric" autocomplete="one-time-code" />
                                                    <span class="small">
                                                        <a href="javascript:void(0)" @click="cancelSensitiveForgotMode">{{ __('cancel') }}</a>
                                                        &nbsp;|&nbsp;
                                                        <a href="javascript:void(0)"
                                                            :class="{ 'text-muted': otpResendCooldown > 0 }"
                                                            @click="otpResendCooldown === 0 && sendSensitiveOtp()">
                                                            {{ otpResendCooldown > 0 ? __('resend_code') + ' (' + otpResendCooldown + 's)' : __('resend_code') }}
                                                        </a>
                                                    </span>
                                                </template>
                                            </div>
                                            <div class="col-md-4">
                                                <label class="form-label">{{ __('New Password') }}</label>
                                                <input type="password" class="form-control" v-model="sensitiveNewPassword" autocomplete="new-password" />
                                            </div>
                                            <div class="col-md-4">
                                                <label class="form-label">{{ __('Confirm New Password') }}</label>
                                                <input type="password" class="form-control" v-model="sensitiveConfirmPassword" autocomplete="new-password" />
                                            </div>
                                        </div>
                                    </template>
                                </div>
                                <div class="settings-card-foot">
                                    <b-button variant="primary" :disabled="isSensitiveLoading" @click="saveSensitivePassword">
                                        {{ sensitiveForgotMode ? __('reset_password') : (sensitivePasswordIsSet ? __('change_password') : __('set_password')) }}
                                        <b-spinner small v-if="isSensitiveLoading"></b-spinner>
                                    </b-button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Login username and password (moved here from the old /seller/settings page) -->
                    <div class="row mt-3">
                        <div class="col-xl-8">
                            <form @submit.prevent="saveCredentials">
                                <div class="card settings-card">
                                    <div class="settings-card-head">
                                        <span class="settings-icon"><i class="fa fa-user-lock"></i></span>
                                        <h5 class="mb-0">{{ __('change_username_and_password') }}</h5>
                                    </div>
                                    <div class="card-body pt-0">
                                        <div class="row g-3">
                                            <div class="col-md-6">
                                                <label class="form-label" for="login_username">{{ __('username') }}</label>
                                                <input type="text" id="login_username" v-model="credentials.username" class="form-control"
                                                    :placeholder="__('username')" autocomplete="username" required />
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label" for="login_current_password">{{ __('current_password') }}</label>
                                                <input type="password" id="login_current_password" v-model="credentials.current_password" class="form-control"
                                                    :placeholder="__('current_password')" autocomplete="current-password" required />
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label" for="login_new_password">{{ __('new_password') }}</label>
                                                <input type="password" id="login_new_password" v-model="credentials.password" class="form-control"
                                                    :placeholder="__('new_password')" autocomplete="new-password" required />
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label" for="login_confirm_password">{{ __('confirm_new_password') }}</label>
                                                <input type="password" id="login_confirm_password" v-model="credentials.confirm_password" class="form-control"
                                                    :placeholder="__('confirm_new_password')" autocomplete="new-password" required />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="settings-card-foot">
                                        <b-button type="submit" variant="primary" :disabled="isCredentialsLoading">
                                            {{ __('save') }}
                                            <b-spinner small v-if="isCredentialsLoading"></b-spinner>
                                        </b-button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Delete account -->
                    <div class="row mt-3">
                        <div class="col-xl-8">
                            <div class="card settings-card settings-card--danger">
                                <div class="settings-card-head">
                                    <span class="settings-icon settings-icon--danger"><i class="fa fa-exclamation-triangle"></i></span>
                                    <h5 class="mb-0">{{ __('delete_account') }}</h5>
                                </div>
                                <div class="card-body pt-0">
                                    <p class="setting-hint mb-0">{{ __('Permanently delete your distributor account. This cannot be undone.') }} {{ __('We will email a confirmation code to your registered address first.') }}</p>
                                </div>
                                <div class="settings-card-foot">
                                    <button type="button" class="btn btn-danger" :disabled="isDeletingAccount" @click="deleteAccount">
                                        {{ __('delete_account') }}
                                        <b-spinner small v-if="isDeletingAccount"></b-spinner>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </b-tab>

                <!-- My Profile: the same profile form the old My Profile page used, loaded only when this tab is opened -->
                <b-tab lazy>
                    <template #title>
                        <span class="tab-title"><i class="fa fa-user me-2"></i>{{ __('my_profile') }}</span>
                    </template>

                    <seller-profile-form embedded></seller-profile-form>
                </b-tab>

            </b-tabs>

            <!-- Delete account, step by step: a code is emailed first and the account is only deleted once it is entered.
                 The body sits in .ui-modern because modals mount outside the seller layout root. -->
            <b-modal v-model="deleteModalShow" hide-header hide-footer centered no-close-on-backdrop size="md" body-class="p-0"
                @hidden="resetDeleteFlow">
                <div class="ui-modern del-modal">
                    <div class="del-modal__head">
                        <span class="ui-tile ui-tone--red"><i class="fa fa-exclamation-triangle"></i></span>
                        <div class="del-modal__title">
                            <h5>{{ __('delete_account') }}</h5>
                            <p>{{ __('Permanently delete your distributor account. This cannot be undone.') }}</p>
                        </div>
                        <button type="button" class="del-modal__close" @click="deleteModalShow = false" aria-label="Close">&times;</button>
                    </div>

                    <!-- sending the first code -->
                    <div v-if="deleteSending && !deleteSentTo" class="del-modal__state">
                        <b-spinner small></b-spinner> {{ __('Sending a code to your email...') }}
                    </div>

                    <!-- no code could be sent (not allowed, no email on file, mail problem) -->
                    <div v-else-if="deleteBlocked" class="del-modal__notice ui-tone--red">
                        <i class="fa fa-info-circle"></i><span>{{ deleteBlocked }}</span>
                    </div>

                    <!-- enter the code -->
                    <div v-else class="del-modal__body">
                        <p class="del-modal__lead">
                            {{ __('We sent a 6-digit code to') }} <strong>{{ deleteSentTo }}</strong>.
                            {{ __('Enter it below to delete your account.') }}
                        </p>
                        <input ref="deleteOtpInput" v-model="deleteOtp" type="text" inputmode="numeric" maxlength="6"
                            autocomplete="one-time-code" class="ui-control del-otp" placeholder="------"
                            :aria-label="__('Verification code')" @input="deleteOtp = deleteOtp.replace(/\D/g, '')"
                            @keyup.enter="confirmDeleteAccount" />
                        <p v-if="deleteError" class="ui-error del-modal__error">{{ deleteError }}</p>
                        <div class="del-modal__resend">
                            <span v-if="deleteCooldown > 0" class="text-muted">{{ __('resend_code') }} ({{ deleteCooldown }}s)</span>
                            <a v-else href="javascript:void(0)" :class="{ 'text-muted': deleteSending }" @click="sendDeleteOtp">{{ __('resend_code') }}</a>
                        </div>
                    </div>

                    <div class="del-modal__actions">
                        <button type="button" class="btn btn-light border" @click="deleteModalShow = false">
                            {{ deleteBlocked ? __('close') : __('cancel') }}
                        </button>
                        <button v-if="!deleteBlocked && deleteSentTo" type="button" class="btn btn-danger"
                            :disabled="deleteOtp.length !== 6 || isDeletingAccount" @click="confirmDeleteAccount">
                            <b-spinner small v-if="isDeletingAccount"></b-spinner>
                            {{ __('Delete permanently') }}
                        </button>
                    </div>
                </div>
            </b-modal>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import Auth from '../../Auth.js';

// tab order = b-tabs index; "?tab=profile" in the URL opens that tab (used by the My Profile menu link)
const TAB_KEYS = ['orders', 'numbering', 'notifications', 'security', 'profile'];

export default {
    components: {
        SellerProfileForm: () => import('../Seller/EditSeller.vue'),
    },
    data() {
        return {
            login_user: Auth.user,
            activeTab: 0,
            isLoading: false,
            thermal_paper_width: 80,
            thermal_logo: "",
            thermal_logo_url: "",
            paperOptions: [
                { text: ' 58 mm', value: 58 },
                { text: ' 80 mm', value: 80 },
                { text: ' 112 mm', value: 112 },
                { text: ' 152 mm', value: 152 }
            ],
            isOrderLoading: false,
            order_cutoff_time: "",
            min_order_amount: "",
            delivery_otp_enabled: true,
            isPaymentLoading: false,
            paymentMethods: [],
            instantDiscountPercent: 0,
            cashDiscountApplicableOn: 'driver',
            isInvoiceLoading: false,
            invoice_prefix: "",
            invoice_suffix: "",
            invoice_next_number: 1,
            isLoadingSlipSettingsLoading: false,
            loading_slip_prefix: "",
            loading_slip_suffix: "",
            loading_slip_next_number: 1,
            isSignatureLoading: false,
            signature_image: "",
            signature_file: null,
            signaturePickedUrl: "",
            signatureDragOver: false,
            isCreditNoteLoading: false,
            credit_note_prefix: "",
            credit_note_suffix: "",
            credit_note_next_number: 1,
            isSensitiveLoading: false,
            sensitivePasswordIsSet: false,
            sensitiveOldPassword: "",
            sensitiveNewPassword: "",
            sensitiveConfirmPassword: "",
            sensitiveForgotMode: false,
            sensitiveOtp: "",
            isSendingOtp: false,
            otpResendCooldown: 0,
            otpCooldownTimer: null,

            // Notifications tab (order mail / SMS per status)
            statuses: [],
            mail_statuses: [],
            mobile_statuses: [],
            sms_statuses: [],
            isNotifyLoading: false,
            notificationsLoaded: false,

            // Security tab: login credentials + account deletion
            credentials: {
                username: Auth.user.username,
                current_password: "",
                password: "",
                confirm_password: "",
            },
            isCredentialsLoading: false,

            // Delete account (2FA by email)
            isDeletingAccount: false,
            deleteModalShow: false,
            deleteSending: false,
            deleteSentTo: '',
            deleteBlocked: '',
            deleteOtp: '',
            deleteError: '',
            deleteCooldown: 0,
            deleteTimer: null,
        }
    },

    created() {
        // open on the tab the user was last on (a per-browser convenience; fine if storage is blocked)
        const fromUrl = TAB_KEYS.indexOf(this.$route.query.tab);
        if (fromUrl >= 0) {
            this.activeTab = fromUrl;
        } else {
            try {
                const saved = TAB_KEYS.indexOf(window.localStorage.getItem('sarthi_seller_settings_tab_key'));
                if (saved >= 0) this.activeTab = saved;
            } catch (e) {}
        }
        this.ensureNotificationsLoaded();
        this.getSettings();
        this.getOrderSettings();
        this.getPaymentMethods();
        this.getInvoiceSettings();
        this.getLoadingSlipSettings();
        this.getCreditNoteSettings();
        this.getSignatureSettings();
        this.getSensitivePasswordStatus();
    },

    beforeDestroy() {
        if (this.deleteTimer) clearInterval(this.deleteTimer);
    },

    watch: {
        activeTab(index) {
            try { window.localStorage.setItem('sarthi_seller_settings_tab_key', TAB_KEYS[index]); } catch (e) {}
            this.ensureNotificationsLoaded();
            // keep the address in step with the tab, so a refresh or a shared link lands on it
            if (this.$route.query.tab !== TAB_KEYS[index]) {
                const nav = this.$router.replace({ query: Object.assign({}, this.$route.query, { tab: TAB_KEYS[index] }) });
                if (nav && nav.catch) nav.catch(() => {});
            }
        },
        // the top-menu "My Profile" link while this page is already open
        '$route.query.tab'(tab) {
            const index = TAB_KEYS.indexOf(tab);
            if (index >= 0 && index !== this.activeTab) this.activeTab = index;
        },
    },

    computed: {
        // The shared Cash / Bank discount can be edited while at least one of the two is on and allowed.
        instantDiscountEditable() {
            return this.paymentMethods.some(m =>
                (m.method === 'cash' || m.method === 'upi') && m.is_editable && m.is_enabled == 1);
        },
        invoiceNumberPreview() {
            const padded = String(this.invoice_next_number || 1).padStart(4, '0');
            return `${this.invoice_prefix || ''}${padded}${this.invoice_suffix || ''}`;
        },
        creditNoteNumberPreview() {
            const padded = String(this.credit_note_next_number || 1).padStart(4, '0');
            return `${this.credit_note_prefix || ''}${padded}${this.credit_note_suffix || ''}`;
        },
        // what the signature card shows: the file just picked, else the saved one
        signaturePreviewUrl() {
            if (this.signaturePickedUrl) return this.signaturePickedUrl;
            return this.signature_image ? this.$storageUrl + this.signature_image : '';
        },
        loadingSlipNumberPreview() {
            const padded = String(this.loading_slip_next_number || 1).padStart(4, '0');
            return `${this.loading_slip_prefix || ''}${padded}${this.loading_slip_suffix || ''}`;
        },
    },

    methods: {

        // ================= NOTIFICATIONS (order mail / SMS) =================
        // loaded the first time the tab is opened, so the page start-up stays light
        ensureNotificationsLoaded() {
            if (this.notificationsLoaded || TAB_KEYS[this.activeTab] !== 'notifications') return;
            this.notificationsLoaded = true;
            this.getOrderStatus();
            this.getMailSetting();
        },
        /**
         * Status label for display. API returns status_name as object by lang code { en: "...", hi: "..." }.
         * Picks current app locale; fallback to status.status.
         */
        getStatusDisplayName(status) {
            if (!status) return '';
            const sn = status.status_name;
            if (sn == null) return status.status || '';
            if (typeof sn === 'string') return sn.trim() || status.status || '';
            if (typeof sn === 'object' && !Array.isArray(sn)) {
                const appLocale = window.appLocale || window.localStorage.getItem('lang') || 'en';
                const forLocale = sn[appLocale];
                if (forLocale != null && String(forLocale).trim() !== '') return String(forLocale).trim();
                const first = Object.values(sn).find(val => val != null && String(val).trim() !== '');
                return first != null ? String(first).trim() : (status.status || '');
            }
            return status.status || '';
        },
        getOrderStatus() {
            this.isNotifyLoading = true;
            Promise.all([
                axios.get(this.$apiUrl + '/order_statuses'),
                axios.get(this.$apiUrl + '/order_statuses/self_pickup')
            ])
                .then(([orderResponse, selfPickResponse]) => {
                    this.isNotifyLoading = false;
                    // self-pickup statuses 1, 7 and 8 duplicate the normal ones, so they are left out
                    const selfPickStatuses = selfPickResponse.data.data.filter(item => ![1, 7, 8].includes(item.id));
                    this.statuses = [...orderResponse.data.data, ...selfPickStatuses];
                })
                .catch(error => {
                    this.isNotifyLoading = false;
                    if (error.request && error.request.statusText) {
                        this.showError(error.request.statusText);
                    } else if (error.message) {
                        this.showError(error.message);
                    } else {
                        this.showError(__('something_went_wrong'));
                    }
                });
        },
        getMailSetting() {
            axios.get(this.$apiUrl + '/mail_settings').then((response) => {
                // rebuilt from scratch so a reload after saving never doubles up
                const mail = [], mobile = [], sms = [];
                response.data.data.forEach((status) => {
                    if (status.mail_status === 1) mail.push(status.order_status_id);
                    if (status.mobile_status === 1) mobile.push(status.order_status_id);
                    if (status.sms_status === 1) sms.push(status.order_status_id);
                });
                this.mail_statuses = mail;
                this.mobile_statuses = mobile;
                this.sms_statuses = sms;
            }).catch(error => {
                if (error.request && error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError(__('something_went_wrong'));
                }
            });
        },
        saveMailSetting() {
            this.isNotifyLoading = true;
            let formData = new FormData();
            this.statuses.forEach((status) => {
                formData.append('status_ids[]', status.id);
                formData.append('mail_statuses[]', this.mail_statuses.includes(status.id) ? "1" : "0");
                formData.append('mobile_statuses[]', this.mobile_statuses.includes(status.id) ? "1" : "0");
                formData.append('sms_statuses[]', this.sms_statuses.includes(status.id) ? "1" : "0");
            });
            axios.post(this.$apiUrl + '/mail_settings/save', formData).then(res => {
                this.isNotifyLoading = false;
                if (res.data.status === 1) {
                    this.showMessage("success", res.data.message);
                    this.getMailSetting();
                } else {
                    this.showError(res.data.message);
                }
            }).catch(error => {
                this.isNotifyLoading = false;
                if (error.request && error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError(__('something_went_wrong'));
                }
            });
        },

        // ================= LOGIN USERNAME / PASSWORD =================
        saveCredentials() {
            this.isCredentialsLoading = true;
            axios.post(this.$apiUrl + '/system_users/change_password', this.credentials).then(res => {
                this.isCredentialsLoading = false;
                if (res.data.status === 1) {
                    this.showMessage("success", res.data.message);
                    // Update Auth.user.username in memory and localStorage so the header reflects immediately
                    Auth.user.username = this.credentials.username;
                    window.localStorage.setItem('user', JSON.stringify(Auth.user));
                    this.$router.push('/seller');
                } else {
                    this.showError(res.data.message);
                }
            }).catch(error => {
                this.isCredentialsLoading = false;
                if (error.request && error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError(__('something_went_wrong'));
                }
            });
        },

        // ================= DELETE ACCOUNT (email code, then delete) =================
        deleteAccount() {
            this.resetDeleteFlow();
            this.deleteModalShow = true;
            this.sendDeleteOtp();
        },
        resetDeleteFlow() {
            if (this.deleteTimer) { clearInterval(this.deleteTimer); this.deleteTimer = null; }
            this.deleteCooldown = 0;
            this.deleteSending = false;
            this.deleteSentTo = '';
            this.deleteBlocked = '';
            this.deleteOtp = '';
            this.deleteError = '';
        },
        startDeleteCooldown(seconds) {
            if (this.deleteTimer) clearInterval(this.deleteTimer);
            this.deleteCooldown = Math.max(0, parseInt(seconds, 10) || 0);
            if (!this.deleteCooldown) return;
            this.deleteTimer = setInterval(() => {
                this.deleteCooldown--;
                if (this.deleteCooldown <= 0) {
                    clearInterval(this.deleteTimer);
                    this.deleteTimer = null;
                }
            }, 1000);
        },
        // asks the server to email a code (it also refuses up front when the account could not be deleted anyway)
        sendDeleteOtp() {
            if (this.deleteSending || this.deleteCooldown > 0) return;
            this.deleteSending = true;
            this.deleteError = '';
            axios.post(this.$sellerApiUrl + '/delete_seller_account/send_otp')
                .then(res => {
                    this.deleteSending = false;
                    const body = res.data || {};
                    if (body.status === 1 && body.data) {
                        this.deleteSentTo = body.data.email;
                        this.startDeleteCooldown(body.data.resend_after);
                        this.deleteOtp = '';
                        this.focusDeleteOtp();
                    } else if (body.data && body.data.code_pending) {
                        // asked again too soon: the code sent a moment ago still works
                        this.deleteSentTo = body.data.email;
                        this.startDeleteCooldown(body.data.resend_after);
                        this.focusDeleteOtp();
                    } else if (this.deleteSentTo) {
                        this.deleteError = body.message || __('something_went_wrong');
                    } else {
                        this.deleteBlocked = body.message || __('something_went_wrong');
                    }
                })
                .catch(() => {
                    this.deleteSending = false;
                    if (this.deleteSentTo) {
                        this.deleteError = __('something_went_wrong');
                    } else {
                        this.deleteBlocked = __('something_went_wrong');
                    }
                });
        },
        focusDeleteOtp() {
            this.$nextTick(() => {
                const el = this.$refs.deleteOtpInput;
                if (el && el.focus) el.focus();
            });
        },
        confirmDeleteAccount() {
            if (this.deleteOtp.length !== 6 || this.isDeletingAccount) return;
            this.isDeletingAccount = true;
            this.deleteError = '';
            axios.post(this.$sellerApiUrl + '/delete_seller_account', { otp: this.deleteOtp })
                .then(response => {
                    this.isDeletingAccount = false;
                    if (response.data.status === 1) {
                        this.deleteModalShow = false;
                        this.showSuccess(response.data.message);
                        Auth.logout();
                        setTimeout(() => { this.$router.push('/login'); }, 1500);
                    } else {
                        // wrong or expired code, or the account can no longer be deleted: stay here and say why
                        this.deleteError = response.data.message || __('something_went_wrong');
                        this.deleteOtp = '';
                        this.focusDeleteOtp();
                    }
                })
                .catch(error => {
                    this.isDeletingAccount = false;
                    this.deleteError = (error.response && error.response.data && error.response.data.message)
                        || (error.request && error.request.statusText) || error.message || __('something_went_wrong');
                });
        },

        methodLabel(method) {
            // label only: the method key stays 'upi' everywhere else (saving, the driver app, exports)
            if (method === 'upi') return this.__('Bank');
            return this.__(method.charAt(0).toUpperCase() + method.slice(1));
        },
        methodIcon(method) {
            return {
                cash: 'fa fa-money-bill-alt',
                upi: 'fa fa-mobile-alt',
                cheque: 'fa fa-money-check-alt',
                signature: 'fa fa-file-signature',
            }[method] || 'fa fa-credit-card';
        },

        // ================= LOAD SETTINGS =================
        getSettings() {
            axios.get(this.$sellerApiUrl + '/seller/thermal-settings')
                .then(res => {
                    if (res.data.status && res.data.data) {
                        const settings = res.data.data;


                        if (settings.thermal_paper_width) {
                            this.thermal_paper_width = parseInt(settings.thermal_paper_width);
                        }


                        if (settings.invoice_logo) {

                            this.thermal_logo_url = this.$storageUrl + settings.invoice_logo;
                        }
                    }
                })
                .catch(() => {
                    this.showError('Failed to load thermal settings');
                });
        },

        // ================= FILE UPLOAD =================
        handleThermalLogo() {
            this.thermal_logo = this.$refs.file_thermal_logo.files[0];
            this.thermal_logo_url = URL.createObjectURL(this.thermal_logo);
        },

        dropThermalLogo(event) {
            event.preventDefault();
            this.$refs.file_thermal_logo.files = event.dataTransfer.files;
            this.handleThermalLogo();
        },

        // ================= SAVE SETTINGS =================
        saveSettings() {
            this.isLoading = true;

            let formData = new FormData();
            formData.append('thermal_paper_width', this.thermal_paper_width);
            if (this.thermal_logo) {
                formData.append('invoice_logo', this.thermal_logo);
            }

            axios.post(this.$sellerApiUrl + '/seller/thermal-settings/save', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then(res => {
                    if (res.data.status) {
                        this.showMessage('success', __(res.data.message));
                    } else {
                        this.showError(res.data.message || 'Failed to save');
                    }
                    this.isLoading = false;
                })
                .catch(() => {
                    this.showError('Failed to save settings');
                    this.isLoading = false;
                });
        },

        // ================= ORDER SETTINGS =================
        getOrderSettings() {
            axios.get(this.$sellerApiUrl + '/order-settings')
                .then(res => {
                    if (res.data.status && res.data.data) {
                        this.order_cutoff_time = res.data.data.order_cutoff_time || "";
                        this.min_order_amount = res.data.data.min_order_amount ?? "";
                        this.delivery_otp_enabled = res.data.data.delivery_otp_enabled !== undefined
                            ? !!res.data.data.delivery_otp_enabled
                            : true;
                    }
                })
                .catch(() => {
                    this.showError('Failed to load order settings');
                });
        },

        // ================= PAYMENT METHODS =================
        getPaymentMethods() {
            axios.get(this.$sellerApiUrl + '/payment_methods')
                .then(res => {
                    if (res.data.status && res.data.data) {
                        // The list says "bank" (what the apps use); this page is built on the key "upi".
                        this.paymentMethods = res.data.data.methods.map(m => ({
                            ...m,
                            method: m.method === 'bank' ? 'upi' : m.method,
                            is_enabled: m.is_enabled ? 1 : 0
                        }));
                        // cash and bank rows carry the same shared %
                        const cash = res.data.data.methods.find(m => m.method === 'cash');
                        this.instantDiscountPercent = cash && cash.discount_percent ? cash.discount_percent : 0;
                        this.cashDiscountApplicableOn = res.data.data.cash_discount_applicable_on || 'driver';
                    }
                })
                .catch(() => {});
        },

        savePaymentMethods() {
            this.isPaymentLoading = true;
            let formData = new FormData();
            this.paymentMethods.forEach(m => {
                formData.append(m.method, m.is_editable ? m.is_enabled : 0);
            });
            // one shared Cash / Bank discount (stored as cash_discount_percent)
            formData.append('cash_discount_percent', this.instantDiscountPercent || 0);
            formData.append('cash_discount_applicable_on', this.cashDiscountApplicableOn || 'driver');
            axios.post(this.$sellerApiUrl + '/payment_methods/save', formData)
                .then(res => {
                    if (res.data.status) {
                        this.showMessage('success', __(res.data.message));
                    } else {
                        this.showError(res.data.message || 'Failed to save');
                    }
                    this.isPaymentLoading = false;
                })
                .catch(() => {
                    this.showError('Failed to save');
                    this.isPaymentLoading = false;
                });
        },

        saveOrderSettings() {
            this.isOrderLoading = true;

            let formData = new FormData();
            formData.append('order_cutoff_time', this.order_cutoff_time || '');
            formData.append('min_order_amount', this.min_order_amount || '');
            formData.append('delivery_otp_enabled', this.delivery_otp_enabled ? 1 : 0);

            axios.post(this.$sellerApiUrl + '/order-settings/save', formData)
                .then(res => {
                    if (res.data.status) {
                        this.showMessage('success', __(res.data.message));
                    } else {
                        this.showError(res.data.message || 'Failed to save');
                    }
                    this.isOrderLoading = false;
                })
                .catch(() => {
                    this.showError('Failed to save order settings');
                    this.isOrderLoading = false;
                });
        },

        // ================= SIGNATURE (printed above "Authorised Signatory") =================
        getSignatureSettings() {
            axios.get(this.$sellerApiUrl + '/signature-settings')
                .then(res => {
                    if (res.data.status && res.data.data) {
                        this.signature_image = res.data.data.signature_image || "";
                    }
                })
                .catch(() => {
                    this.showError('Failed to load signature settings');
                });
        },

        pickSignature(file) {
            if (!file) return;
            // same limits the server enforces, caught here first so the user isn't made to wait for a rejection
            if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) {
                this.showError(__('signature_must_be_png_jpg_webp'));
                return;
            }
            if (file.size > 1024 * 1024) {
                this.showError(__('signature_image_too_large'));
                return;
            }
            this.clearPickedSignature();
            this.signature_file = file;
            this.signaturePickedUrl = URL.createObjectURL(file);
        },

        handleSignaturePicked(event) {
            this.pickSignature(event.target.files[0]);
            event.target.value = '';
        },

        dropSignature(event) {
            this.signatureDragOver = false;
            this.pickSignature(event.dataTransfer.files[0]);
        },

        clearPickedSignature() {
            if (this.signaturePickedUrl) URL.revokeObjectURL(this.signaturePickedUrl);
            this.signature_file = null;
            this.signaturePickedUrl = "";
        },

        saveSignature() {
            if (!this.signature_file) return;
            this.isSignatureLoading = true;

            let formData = new FormData();
            formData.append('signature', this.signature_file);

            axios.post(this.$sellerApiUrl + '/signature-settings/save', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then(res => {
                    if (res.data.status) {
                        this.showMessage('success', __(res.data.message));
                        this.clearPickedSignature();
                        this.getSignatureSettings();
                    } else {
                        this.showError(res.data.message || 'Failed to save');
                    }
                    this.isSignatureLoading = false;
                })
                .catch(() => {
                    this.showError('Failed to save signature');
                    this.isSignatureLoading = false;
                });
        },

        removeSignature() {
            this.isSignatureLoading = true;

            let formData = new FormData();
            formData.append('remove', 1);

            axios.post(this.$sellerApiUrl + '/signature-settings/save', formData)
                .then(res => {
                    if (res.data.status) {
                        this.showMessage('success', __(res.data.message));
                        this.signature_image = "";
                    } else {
                        this.showError(res.data.message || 'Failed to remove');
                    }
                    this.isSignatureLoading = false;
                })
                .catch(() => {
                    this.showError('Failed to remove signature');
                    this.isSignatureLoading = false;
                });
        },

        // ================= INVOICE SETTINGS =================
        getInvoiceSettings() {
            axios.get(this.$sellerApiUrl + '/invoice-settings')
                .then(res => {
                    if (res.data.status && res.data.data) {
                        this.invoice_prefix = res.data.data.invoice_prefix || "";
                        this.invoice_suffix = res.data.data.invoice_suffix || "";
                        this.invoice_next_number = res.data.data.invoice_next_number || 1;
                    }
                })
                .catch(() => {
                    this.showError('Failed to load invoice settings');
                });
        },

        saveInvoiceSettings() {
            this.isInvoiceLoading = true;

            let formData = new FormData();
            formData.append('invoice_prefix', this.invoice_prefix || '');
            formData.append('invoice_suffix', this.invoice_suffix || '');
            formData.append('invoice_next_number', this.invoice_next_number || 1);

            axios.post(this.$sellerApiUrl + '/invoice-settings/save', formData)
                .then(res => {
                    if (res.data.status) {
                        this.showMessage('success', __(res.data.message));
                    } else {
                        this.showError(res.data.message || 'Failed to save');
                    }
                    this.isInvoiceLoading = false;
                })
                .catch(() => {
                    this.showError('Failed to save invoice settings');
                    this.isInvoiceLoading = false;
                });
        },

        getLoadingSlipSettings() {
            axios.get(this.$sellerApiUrl + '/loading-slip-settings')
                .then(res => {
                    if (res.data.status && res.data.data) {
                        this.loading_slip_prefix = res.data.data.loading_slip_prefix || "";
                        this.loading_slip_suffix = res.data.data.loading_slip_suffix || "";
                        this.loading_slip_next_number = res.data.data.loading_slip_next_number || 1;
                    }
                })
                .catch(() => {
                    this.showError('Failed to load loading slip settings');
                });
        },

        saveLoadingSlipSettings() {
            this.isLoadingSlipSettingsLoading = true;

            let formData = new FormData();
            formData.append('loading_slip_prefix', this.loading_slip_prefix || '');
            formData.append('loading_slip_suffix', this.loading_slip_suffix || '');
            formData.append('loading_slip_next_number', this.loading_slip_next_number || 1);

            axios.post(this.$sellerApiUrl + '/loading-slip-settings/save', formData)
                .then(res => {
                    if (res.data.status) {
                        this.showMessage('success', __(res.data.message));
                    } else {
                        this.showError(res.data.message || 'Failed to save');
                    }
                    this.isLoadingSlipSettingsLoading = false;
                })
                .catch(() => {
                    this.showError('Failed to save loading slip settings');
                    this.isLoadingSlipSettingsLoading = false;
                });
        },

        getCreditNoteSettings() {
            axios.get(this.$sellerApiUrl + '/credit-note-settings')
                .then(res => {
                    if (res.data.status && res.data.data) {
                        this.credit_note_prefix = res.data.data.credit_note_prefix || "";
                        this.credit_note_suffix = res.data.data.credit_note_suffix || "";
                        this.credit_note_next_number = res.data.data.credit_note_next_number || 1;
                    }
                })
                .catch(() => {
                    this.showError('Failed to load credit note settings');
                });
        },

        saveCreditNoteSettings() {
            this.isCreditNoteLoading = true;

            let formData = new FormData();
            formData.append('credit_note_prefix', this.credit_note_prefix || '');
            formData.append('credit_note_suffix', this.credit_note_suffix || '');
            formData.append('credit_note_next_number', this.credit_note_next_number || 1);

            axios.post(this.$sellerApiUrl + '/credit-note-settings/save', formData)
                .then(res => {
                    if (res.data.status) {
                        this.showMessage('success', __(res.data.message));
                    } else {
                        this.showError(res.data.message || 'Failed to save');
                    }
                    this.isCreditNoteLoading = false;
                })
                .catch(() => {
                    this.showError('Failed to save credit note settings');
                    this.isCreditNoteLoading = false;
                });
        },

        // ================= SENSITIVE OPERATIONS PASSWORD =================
        getSensitivePasswordStatus() {
            axios.get(this.$sellerApiUrl + '/sensitive-password')
                .then(res => {
                    if (res.data.status && res.data.data) {
                        this.sensitivePasswordIsSet = !!res.data.data.is_set;
                    }
                })
                .catch(() => {});
        },

        startSensitiveForgotMode() {
            this.sensitiveForgotMode = true;
            this.sensitiveOldPassword = '';
            this.sendSensitiveOtp();
        },

        cancelSensitiveForgotMode() {
            this.sensitiveForgotMode = false;
            this.sensitiveOtp = '';
            if (this.otpCooldownTimer) {
                clearInterval(this.otpCooldownTimer);
                this.otpCooldownTimer = null;
            }
            this.otpResendCooldown = 0;
        },

        sendSensitiveOtp() {
            if (this.isSendingOtp || this.otpResendCooldown > 0) return;
            this.isSendingOtp = true;

            axios.post(this.$sellerApiUrl + '/sensitive-password/send-otp')
                .then(res => {
                    if (res.data.status) {
                        this.showMessage('success', __(res.data.message));
                        this.otpResendCooldown = 60;
                        if (this.otpCooldownTimer) clearInterval(this.otpCooldownTimer);
                        this.otpCooldownTimer = setInterval(() => {
                            this.otpResendCooldown--;
                            if (this.otpResendCooldown <= 0) {
                                clearInterval(this.otpCooldownTimer);
                                this.otpCooldownTimer = null;
                            }
                        }, 1000);
                    } else {
                        this.showError(res.data.message || 'Failed to send OTP');
                    }
                    this.isSendingOtp = false;
                })
                .catch(() => {
                    this.showError('Failed to send OTP');
                    this.isSendingOtp = false;
                });
        },

        saveSensitivePassword() {
            this.isSensitiveLoading = true;

            let formData = new FormData();
            if (this.sensitiveForgotMode) {
                formData.append('otp', this.sensitiveOtp || '');
                formData.append('new_password', this.sensitiveNewPassword || '');
                formData.append('confirm_new_password', this.sensitiveConfirmPassword || '');
            } else if (this.sensitivePasswordIsSet) {
                formData.append('old_password', this.sensitiveOldPassword || '');
                formData.append('new_password', this.sensitiveNewPassword || '');
                formData.append('confirm_new_password', this.sensitiveConfirmPassword || '');
            } else {
                formData.append('password', this.sensitiveNewPassword || '');
                formData.append('confirm_password', this.sensitiveConfirmPassword || '');
            }

            const endpoint = this.sensitiveForgotMode ? '/sensitive-password/reset-with-otp' : '/sensitive-password/save';

            axios.post(this.$sellerApiUrl + endpoint, formData)
                .then(res => {
                    if (res.data.status) {
                        this.showMessage('success', __(res.data.message));
                        this.sensitivePasswordIsSet = true;
                        this.sensitiveOldPassword = '';
                        this.sensitiveNewPassword = '';
                        this.sensitiveConfirmPassword = '';
                        this.cancelSensitiveForgotMode();
                    } else {
                        this.showError(res.data.message || 'Failed to save');
                    }
                    this.isSensitiveLoading = false;
                })
                .catch(() => {
                    this.showError('Failed to save');
                    this.isSensitiveLoading = false;
                });
        },
    }
}
</script>

<style scoped>
.custom-image {
    height: auto;
    width: 60%;
    border: 1px solid #ddd;
    padding: 5px;
}

/* tabs: same pill look as the Export Center */
::v-deep .settings-tabs {
    flex-wrap: wrap;
    gap: 8px;
    border-bottom: 0;
}

::v-deep .settings-tabs .nav-link {
    border: 1px solid rgba(128, 128, 128, 0.3);
    border-radius: 10px;
    padding: 10px 18px;
    font-weight: 600;
    font-size: 13.5px;
    color: #64748b;
    background: transparent;
}

::v-deep .settings-tabs .nav-link:hover {
    border-color: rgba(128, 128, 128, 0.55);
}

::v-deep .settings-tabs .nav-link.active {
    background: rgba(var(--brand-rgb, 4, 42, 95), 0.12);
    border-color: var(--brand, #042A5F);
    color: var(--brand, #042A5F);
}

.settings-card {
    border: 1px solid rgba(128, 128, 128, 0.22);
    border-radius: 14px;
}

.settings-card-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 18px 20px 14px;
}

.settings-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: rgba(37, 99, 235, 0.1);
    color: #2563eb;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.settings-icon--danger {
    background: rgba(239, 68, 68, 0.12);
    color: #dc2626;
}

.settings-card--danger {
    border-color: rgba(239, 68, 68, 0.35);
}

/* delete-account window (colours come from the --ui-* tokens of .ui-modern) */
.del-modal { color: var(--ui-text); }
.del-modal__head { display: flex; align-items: flex-start; gap: 14px; padding: 22px 22px 14px; }
.del-modal__title { flex: 1 1 auto; min-width: 0; }
.del-modal__title h5 { margin: 0 0 4px; font-size: 18px; font-weight: 800; letter-spacing: -0.01em; color: var(--ui-text); }
.del-modal__title p { margin: 0; font-size: 14px; line-height: 1.45; color: var(--ui-muted); }
.del-modal__close {
    flex-shrink: 0; width: 32px; height: 32px; margin: -4px -6px 0 0; border: 0; border-radius: 10px; background: transparent;
    font-size: 24px; line-height: 1; color: var(--ui-muted); cursor: pointer;
}
.del-modal__close:hover { background: var(--ui-soft); color: var(--ui-text); }
.del-modal__state { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 26px 22px; font-size: 14px; color: var(--ui-muted); }
.del-modal__body { padding: 4px 22px 0; }
.del-modal__lead { margin: 0 0 14px; font-size: 14px; line-height: 1.5; color: var(--ui-text); }
.del-modal .del-otp { height: 54px; text-align: center; font-size: 24px; font-weight: 700; letter-spacing: 0.5em; padding-left: 0.5em; font-variant-numeric: tabular-nums; }
.del-modal__error { margin-top: 10px; }
.del-modal__resend { margin-top: 12px; font-size: 13px; }
.del-modal__notice {
    display: flex; align-items: flex-start; gap: 10px; margin: 4px 22px 0; padding: 12px 14px; border-radius: 12px;
    font-size: 13.5px; font-weight: 600; background: var(--tone-bg); color: var(--tone-fg);
}
.del-modal__notice i { margin-top: 2px; }
.del-modal__actions { display: flex; justify-content: flex-end; gap: 10px; padding: 18px 22px 22px; }
.del-modal__actions .btn { min-width: 120px; height: 44px; border-radius: 12px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
@media (max-width: 575px) {
    .del-modal__actions { flex-direction: column-reverse; }
    .del-modal__actions .btn { width: 100%; }
}

/* notifications: status name, then a mail switch and an SMS switch */
.notify-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 72px 72px;
    align-items: center;
    gap: 8px;
    padding: 11px 0;
    border-bottom: 1px solid rgba(128, 128, 128, 0.15);
}

.notify-row:last-child {
    border-bottom: 0;
}

.notify-row--head {
    padding-top: 4px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #6c757d;
}

.notify-label {
    margin: 0;
    font-weight: 600;
}

.settings-card-foot {
    padding: 14px 20px;
    border-top: 1px solid rgba(128, 128, 128, 0.18);
    display: flex;
    justify-content: flex-end;
}

.setting-hint {
    color: #6c757d;
    font-size: 12.5px;
    line-height: 1.45;
}

/* a setting = text on the left, its control on the right */
.setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 0;
    border-bottom: 1px solid rgba(128, 128, 128, 0.15);
}

.setting-row:last-child {
    border-bottom: 0;
}

.setting-text {
    flex: 1 1 220px;
    min-width: 0;
}

.setting-title {
    font-weight: 600;
    margin-bottom: 2px;
    display: block;
}

.setting-control {
    flex: 0 0 150px;
}

.setting-control-switch {
    flex: 0 0 auto;
}

/* payment method tiles */
.method-tile {
    border: 1px solid rgba(128, 128, 128, 0.3);
    border-radius: 12px;
    padding: 14px 16px;
    transition: border-color 0.15s, background 0.15s;
}

.method-tile.is-on {
    border-color: var(--brand, #042A5F);
    background: rgba(var(--brand-rgb, 4, 42, 95), 0.07);
}

.method-tile.is-locked {
    opacity: 0.65;
}

.method-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(128, 128, 128, 0.14);
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.method-tile.is-on .method-icon {
    background: rgba(var(--brand-rgb, 4, 42, 95), 0.2);
    color: var(--brand, #042A5F);
}

/* signature upload box */
.signature-drop {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 120px;
    padding: 12px;
    border: 2px dashed rgba(128, 128, 128, 0.45);
    border-radius: 10px;
    background: rgba(128, 128, 128, 0.06);
    color: var(--text-muted, #6c757d);
    text-align: center;
    cursor: pointer;
    transition: border-color .15s, background .15s;
}

.signature-drop:hover,
.signature-drop.is-over {
    border-color: var(--brand, #042A5F);
    background: rgba(var(--brand-rgb, 4, 42, 95), 0.08);
}

/* white card behind the image so a transparent PNG is judged the way it will print */
.signature-drop__img {
    max-width: 100%;
    max-height: 90px;
    padding: 6px 10px;
    border-radius: 6px;
    background: #fff;
}

/* numbering preview chip */
.series-preview {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 10px;
    background: rgba(128, 128, 128, 0.1);
}

.series-preview strong {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 1.05rem;
}

@media (max-width: 575px) {
    .setting-control {
        flex: 1 1 100%;
    }
}
</style>
