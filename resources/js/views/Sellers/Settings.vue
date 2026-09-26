<template>
    <div>
        <div class="page-heading">
            <div class="row mb-3">
                <div class="col-12">
                    <h3>{{ __('thermal_print_settings') }}</h3>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h4>{{ __('thermal_print_settings') }}</h4>
                </div>

                <div class="card-body">
                    <div class="row">

                        <!-- Logo Upload -->
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

                        <!-- Paper Size -->
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

            <!-- Sarthi: Payment Collection Methods -->
            <div class="card mt-4">
                <div class="card-header">
                    <h4>{{ __('Payment Collection Methods') }}</h4>
                </div>
                <div class="card-body">
                    <p class="text-muted font-size-13">{{ __('Toggle the methods your drivers can use to collect payment. Methods disabled by admin cannot be enabled.') }}</p>
                    <div class="row">
                        <div class="form-group col-md-3" v-for="method in paymentMethods" :key="method.method">
                            <label>{{ __(method.method.charAt(0).toUpperCase() + method.method.slice(1)) }}</label><br>
                            <div class="form-check form-switch">
                                <input type="checkbox" true-value="1" false-value="0"
                                    class="form-check-input"
                                    v-model="method.is_enabled"
                                    :disabled="!method.is_editable"
                                    :title="!method.is_editable ? __('Disabled by admin') : ''"
                                >
                            </div>
                            <small v-if="!method.is_editable" class="text-danger">{{ __('Disabled by admin') }}</small>
                            <div v-if="method.method === 'cash'" class="mt-2">
                                <label class="font-size-13 text-muted">{{ __('Cash discount %') }}</label>
                                <input type="number" min="0" max="100" step="0.01"
                                    class="form-control form-control-sm"
                                    v-model="method.discount_percent"
                                    :disabled="!method.is_editable || !method.is_enabled"
                                    :placeholder="__('e.g. 2')"
                                >
                                <small class="text-muted">{{ __('Knocked off final_total when the retailer pays cash, so cash is always the cheapest option.') }}</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <b-button variant="primary" :disabled="isPaymentLoading" @click="savePaymentMethods">
                        {{ __('save') }}
                        <b-spinner small v-if="isPaymentLoading"></b-spinner>
                    </b-button>
                </div>
            </div>

            <div class="card mt-4">
                <div class="card-header">
                    <h4>{{ __('order_settings') }}</h4>
                </div>

                <div class="card-body">
                    <div class="row">
                        <div class="form-group col-md-6">
                            <label for="order_cutoff_time">{{ __('order_cutoff_time') }}</label>
                            <input type="time" class="form-control"
                                id="order_cutoff_time"
                                v-model="order_cutoff_time"
                                placeholder="15:00" />
                            <span class="text text-primary font-size-13">({{
                                __('orders_at_or_before_this_time_get_next_day_delivery_after_get_day_after')
                                }})</span>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="min_order_amount">{{ __('min_order_amount') }}</label>
                            <input type="number" min="0" step="0.01" class="form-control"
                                id="min_order_amount"
                                v-model="min_order_amount"
                                :placeholder="__('optional')" />
                            <span class="text text-primary font-size-13">({{
                                __('minimum_cart_total_required_for_a_retailer_to_place_an_order')
                                }})</span>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="delivery_otp_enabled">{{ __('delivery_otp_enabled') }}</label><br>
                            <div class="form-check form-switch">
                                <input type="checkbox" class="form-check-input"
                                    id="delivery_otp_enabled"
                                    v-model="delivery_otp_enabled" />
                            </div>
                            <span class="text text-primary font-size-13">({{
                                __('driver_must_enter_the_retailers_otp_to_mark_an_order_delivered_not_the_login_otp')
                                }})</span>
                        </div>
                    </div>
                </div>

                <div class="card-footer">
                    <b-button variant="primary" :disabled="isOrderLoading" @click="saveOrderSettings">
                        {{ __('save') }}
                        <b-spinner small v-if="isOrderLoading"></b-spinner>
                    </b-button>
                </div>
            </div>

            <div class="card mt-4">
                <div class="card-header">
                    <h4>{{ __('invoice_settings') }}</h4>
                </div>

                <div class="card-body">
                    <p class="text-muted font-size-13">{{ __('invoice_settings_hint') }}</p>
                    <div class="row">
                        <div class="form-group col-md-4">
                            <label for="invoice_prefix">{{ __('invoice_prefix') }}</label>
                            <input type="text" class="form-control" id="invoice_prefix"
                                v-model="invoice_prefix" :placeholder="__('optional')" />
                        </div>
                        <div class="form-group col-md-4">
                            <label for="invoice_next_number">{{ __('invoice_number') }}</label>
                            <input type="number" min="1" class="form-control" id="invoice_next_number"
                                v-model.number="invoice_next_number" placeholder="1" />
                        </div>
                        <div class="form-group col-md-4">
                            <label for="invoice_suffix">{{ __('invoice_suffix') }}</label>
                            <input type="text" class="form-control" id="invoice_suffix"
                                v-model="invoice_suffix" :placeholder="__('optional')" />
                        </div>
                    </div>
                    <p class="text-muted font-size-13 mb-0">
                        {{ __('preview') }}: <strong>{{ invoiceNumberPreview }}</strong>
                    </p>
                </div>

                <div class="card-footer">
                    <b-button variant="primary" :disabled="isInvoiceLoading" @click="saveInvoiceSettings">
                        {{ __('save') }}
                        <b-spinner small v-if="isInvoiceLoading"></b-spinner>
                    </b-button>
                </div>
            </div>

            <div class="card mt-4">
                <div class="card-header">
                    <h4>{{ __('loading_slip_settings') }}</h4>
                </div>

                <div class="card-body">
                    <p class="text-muted font-size-13">{{ __('loading_slip_settings_hint') }}</p>
                    <div class="row">
                        <div class="form-group col-md-4">
                            <label for="loading_slip_prefix">{{ __('loading_slip_prefix') }}</label>
                            <input type="text" class="form-control" id="loading_slip_prefix"
                                v-model="loading_slip_prefix" :placeholder="__('optional')" />
                        </div>
                        <div class="form-group col-md-4">
                            <label for="loading_slip_next_number">{{ __('loading_slip_number') }}</label>
                            <input type="number" min="1" class="form-control" id="loading_slip_next_number"
                                v-model.number="loading_slip_next_number" placeholder="1" />
                        </div>
                        <div class="form-group col-md-4">
                            <label for="loading_slip_suffix">{{ __('loading_slip_suffix') }}</label>
                            <input type="text" class="form-control" id="loading_slip_suffix"
                                v-model="loading_slip_suffix" :placeholder="__('optional')" />
                        </div>
                    </div>
                    <p class="text-muted font-size-13 mb-0">
                        {{ __('preview') }}: <strong>{{ loadingSlipNumberPreview }}</strong>
                    </p>
                </div>

                <div class="card-footer">
                    <b-button variant="primary" :disabled="isLoadingSlipSettingsLoading" @click="saveLoadingSlipSettings">
                        {{ __('save') }}
                        <b-spinner small v-if="isLoadingSlipSettingsLoading"></b-spinner>
                    </b-button>
                </div>
            </div>

            <div class="card mt-4">
                <div class="card-header">
                    <h4>{{ __('credit_note_settings') }}</h4>
                </div>

                <div class="card-body">
                    <p class="text-muted font-size-13">{{ __('credit_note_settings_hint') }}</p>
                    <div class="row">
                        <div class="form-group col-md-4">
                            <label for="credit_note_prefix">{{ __('credit_note_prefix') }}</label>
                            <input type="text" class="form-control" id="credit_note_prefix"
                                v-model="credit_note_prefix" :placeholder="__('optional')" />
                        </div>
                        <div class="form-group col-md-4">
                            <label for="credit_note_next_number">{{ __('credit_note_number') }}</label>
                            <input type="number" min="1" class="form-control" id="credit_note_next_number"
                                v-model.number="credit_note_next_number" placeholder="1" />
                        </div>
                        <div class="form-group col-md-4">
                            <label for="credit_note_suffix">{{ __('credit_note_suffix') }}</label>
                            <input type="text" class="form-control" id="credit_note_suffix"
                                v-model="credit_note_suffix" :placeholder="__('optional')" />
                        </div>
                    </div>
                    <p class="text-muted font-size-13 mb-0">
                        {{ __('preview') }}: <strong>{{ creditNoteNumberPreview }}</strong>
                    </p>
                </div>

                <div class="card-footer">
                    <b-button variant="primary" :disabled="isCreditNoteLoading" @click="saveCreditNoteSettings">
                        {{ __('save') }}
                        <b-spinner small v-if="isCreditNoteLoading"></b-spinner>
                    </b-button>
                </div>
            </div>

            <!-- Sarthi: Sensitive Operations Password -->
            <div class="card mt-4">
                <div class="card-header">
                    <h4>{{ __('Sensitive Operations Password') }}</h4>
                </div>
                <div class="card-body">
                    <p class="text-muted font-size-13">
                        {{ __('This password gates risky corrections (like editing a driver\'s recorded payment method) so only you can authorize them, even if staff have access to this panel.') }}
                    </p>

                    <template v-if="!sensitivePasswordIsSet">
                        <div class="row">
                            <div class="form-group col-md-6">
                                <label>{{ __('Password') }}</label>
                                <input type="password" class="form-control" v-model="sensitiveNewPassword" autocomplete="new-password" />
                            </div>
                            <div class="form-group col-md-6">
                                <label>{{ __('Confirm Password') }}</label>
                                <input type="password" class="form-control" v-model="sensitiveConfirmPassword" autocomplete="new-password" />
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="row">
                            <div class="form-group col-md-4">
                                <template v-if="!sensitiveForgotMode">
                                    <label>{{ __('Old Password') }}</label>
                                    <input type="password" class="form-control" v-model="sensitiveOldPassword" autocomplete="current-password" />
                                    <a href="javascript:void(0)" class="small" @click="startSensitiveForgotMode">{{ __('forgot_password') }}?</a>
                                </template>
                                <template v-else>
                                    <label>{{ __('OTP') }}</label>
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
                            <div class="form-group col-md-4">
                                <label>{{ __('New Password') }}</label>
                                <input type="password" class="form-control" v-model="sensitiveNewPassword" autocomplete="new-password" />
                            </div>
                            <div class="form-group col-md-4">
                                <label>{{ __('Confirm New Password') }}</label>
                                <input type="password" class="form-control" v-model="sensitiveConfirmPassword" autocomplete="new-password" />
                            </div>
                        </div>
                    </template>
                </div>
                <div class="card-footer">
                    <b-button variant="primary" :disabled="isSensitiveLoading" @click="saveSensitivePassword">
                        {{ sensitiveForgotMode ? __('reset_password') : (sensitivePasswordIsSet ? __('change_password') : __('set_password')) }}
                        <b-spinner small v-if="isSensitiveLoading"></b-spinner>
                    </b-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import Auth from '../../Auth.js';

export default {
    data() {
        return {
            login_user: Auth.user,
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
            isInvoiceLoading: false,
            invoice_prefix: "",
            invoice_suffix: "",
            invoice_next_number: 1,
            isLoadingSlipSettingsLoading: false,
            loading_slip_prefix: "",
            loading_slip_suffix: "",
            loading_slip_next_number: 1,
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
        }
    },

    created() {
        this.getSettings();
        this.getOrderSettings();
        this.getPaymentMethods();
        this.getInvoiceSettings();
        this.getLoadingSlipSettings();
        this.getCreditNoteSettings();
        this.getSensitivePasswordStatus();
    },

    computed: {
        invoiceNumberPreview() {
            const padded = String(this.invoice_next_number || 1).padStart(4, '0');
            return `${this.invoice_prefix || ''}${padded}${this.invoice_suffix || ''}`;
        },
        creditNoteNumberPreview() {
            const padded = String(this.credit_note_next_number || 1).padStart(4, '0');
            return `${this.credit_note_prefix || ''}${padded}${this.credit_note_suffix || ''}`;
        },
        loadingSlipNumberPreview() {
            const padded = String(this.loading_slip_next_number || 1).padStart(4, '0');
            return `${this.loading_slip_prefix || ''}${padded}${this.loading_slip_suffix || ''}`;
        },
    },

    methods: {

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
                        this.paymentMethods = res.data.data.methods.map(m => ({
                            ...m,
                            is_enabled: m.is_enabled ? 1 : 0,
                            discount_percent: m.discount_percent ?? 0
                        }));
                    }
                })
                .catch(() => {});
        },

        savePaymentMethods() {
            this.isPaymentLoading = true;
            let formData = new FormData();
            this.paymentMethods.forEach(m => {
                formData.append(m.method, m.is_editable ? m.is_enabled : 0);
                if (m.method === 'cash') {
                    formData.append('cash_discount_percent', m.discount_percent || 0);
                }
            });
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
</style>
