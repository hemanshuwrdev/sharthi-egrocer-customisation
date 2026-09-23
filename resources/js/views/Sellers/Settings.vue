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
            isPaymentLoading: false,
            paymentMethods: [],
            isInvoiceLoading: false,
            invoice_prefix: "",
            invoice_suffix: "",
            invoice_next_number: 1,
        }
    },

    created() {
        this.getSettings();
        this.getOrderSettings();
        this.getPaymentMethods();
        this.getInvoiceSettings();
    },

    computed: {
        invoiceNumberPreview() {
            const padded = String(this.invoice_next_number || 1).padStart(4, '0');
            return `${this.invoice_prefix || ''}${padded}${this.invoice_suffix || ''}`;
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
        }
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
