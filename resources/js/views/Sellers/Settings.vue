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
            ]
        }
    },

    created() {
        this.getSettings();
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
