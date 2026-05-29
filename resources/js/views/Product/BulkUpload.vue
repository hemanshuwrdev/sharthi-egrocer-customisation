<template>
    <div>
        <div class="page-heading">
            <div class="row">
                <div class="col-12 col-md-6 order-md-1 order-last">
                    <h3>{{ __('bulk_upload') }}</h3>
                </div>
                <div class="col-12 col-md-6 order-md-2 order-first">
                    <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item" v-if="isSellerRoute">
                                <router-link to="/seller/dashboard">{{ __('dashboard') }}</router-link>
                            </li>
                            <li class="breadcrumb-item" v-else>
                                <router-link to="/dashboard">{{ __('dashboard') }}</router-link>
                            </li>
                            <li class="breadcrumb-item active" aria-current="page">
                                {{ __('bulk_upload') }}
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div class="row">
                <div class="col-12 col-md-12 order-md-1 order-last">
                    <div class="card">
                        <div class="card-header">
                            <h4>{{ __('product_bulk_upload_form') }}</h4>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-info">
                                <p>{{
                                    __('always_download_and_use_new_sample_file_if_you_did_updated_admin_panel_version')
                                    }}</p>
                                <p>{{ __('read_and_follow_instructions_carefully_before_proceed') }}</p>
                                <p>{{ __('before_uploading_the_file_please_check_all_the_data_fields_are_correct') }}</p>
                            </div>
                            <div class="row" v-if="rowErrors.length">
                                <div class="col-12">
                                    <div class="alert alert-danger" ref="rowErrorsAlert">
                                        <p class="mb-2">{{ __('validation_failed_for_some_rows_please_review_and_fix_the_following') }}</p>
                                        <div class="table-responsive">
                                            <table class="table table-sm table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th class="text-white" style="width: 80px;">{{ __('row') }}</th>
                                                        <th class="text-white">{{ __('errors') }}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="item in rowErrors" :key="'row-' + item.row">
                                                        <td class="text-white">{{ item.row }}</td>
                                                        <td>
                                                            <ul class="mb-0 ps-3">
                                                                <li v-for="err in item.errors" :key="err"
                                                                    class="text-white">{{ err }}</li>
                                                            </ul>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <!-- form start -->
                                <form method="post" ref="my-form" @submit.prevent="saveRecord"
                                    enctype="multipart/form-data">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="upload_file">{{ __('upload_file') }} {{ __('excel_file')
                                                }}</label>
                                            <p class="text-muted mb-1">
                                                {{ __('supported_formats') }}: XLSX, XLS
                                            </p>
                                            <span v-if="fileError" class="error">{{ fileError }}</span>
                                            <input
                                                type="file"
                                                name="upload_file"
                                                id="upload_file"
                                                ref="file_csv"
                                                class="file-input"
                                                accept=".xlsx,.xls"
                                                @change="handleFileUpload"
                                            />
                                            <div
                                                class="file-input-div bg-gray-100"
                                                @click="triggerFileClick"
                                                @drop="dropFile"
                                                @dragover="$dragoverFile"
                                                @dragleave="$dragleaveFile"
                                            >
                                                <template v-if="file && file.name">
                                                    <label>{{ __('selected_file_name') }} {{ file.name }}</label>
                                                </template>
                                                <template v-else>
                                                    <label><i class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                                    <label>{{ __('drop_files_here_or_click_to_upload') }}</label>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <button type="submit" class="btn btn-primary" id="submit_btn" name="btnAdd"
                                            :disabled="isLoading">
                                            <i class="fa fa-upload" v-if="!isLoading"></i> {{ __('upload') }}
                                            <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
                                        </button>
                                        <button type="reset" class="btn btn btn-secondary">
                                            <i class="fa fa-undo" aria-hidden="true"></i> {{ __('clear') }}
                                        </button>
                                        <button type="button" class='btn btn-info' @click="downloadProductDataExcel">
                                            <em class='fa fa-download'></em>
                                            {{ __('download_sample_file') }}</button>
                                        <a :href="instructionsFileurl" class='btn btn-warning' download> <em
                                                class='fa fa-download'></em>
                                            {{ __('download_instructions') }}</a>
                                    </div>
                                </form>
                                <!-- form end -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";

export default {
    data: function () {
        return {
            isLoading: false,

            instructionsFileurl: this.$baseUrl + '/sample-file/products.txt',
            file: null,
            fileError: null,
            rowErrors: [],
        }
    },
    computed: {
        isSellerRoute() {
            // Use this.$route to access the current route
            return this.$route.path.startsWith('/seller/');
        },
    },
    created: function () {

    },
    mounted() {

    },
    methods: {
        triggerFileClick() {
            const ref = this.$refs.file_csv;
            const input = Array.isArray(ref) ? ref[0] : ref;
            if (input && typeof input.click === 'function') {
                input.click();
            }
        },
        dropFile(event) {
            event.preventDefault();
            const ref = this.$refs.file_csv;
            const input = Array.isArray(ref) ? ref[0] : ref;
            if (!input) return;
            input.files = event.dataTransfer.files;
            this.handleFileUpload();
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },
        handleFileUpload() {
            const ref = this.$refs.file_csv;
            const input = Array.isArray(ref) ? ref[0] : ref;
            const file = input && input.files ? input.files[0] : null;
            if (!file) return;
            this.fileError = null;
            const validExtensions = ['.xlsx', '.xls'];
            const name = file.name ? file.name.toLowerCase() : '';
            if (!validExtensions.some(ext => name.endsWith(ext))) {
                this.fileError = this.__('invalid_excel_file_type');
                return;
            }
            this.file = file;
            this.rowErrors = [];
        },
        downloadProductDataExcel() {
            axios({
                url: this.$apiUrl + '/products/download_sample_file_excel',
                method: 'get',
                responseType: 'blob',
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'products_sample.xlsx');
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);
            }).catch(error => {
                if (error.request && error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError("Something went wrong!");
                }
            });
        },
        saveRecord: function () {
            let vm = this;
            this.isLoading = true;
            let formData = new FormData();
            formData.append('file', this.file);
            let url = this.$apiUrl + '/products/bulk_upload';
            axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                let data = res.data;
                if (data.status === 1) {
                    this.showMessage("success", data.message);
                    this.$refs.file_csv.value = null;
                    this.file = null;
                    this.rowErrors = [];
                    vm.isLoading = false;
                } else {
                    if (Array.isArray(data.data) && data.data.length) {
                        vm.showError(data.message || 'Validation failed for some rows.');
                        vm.rowErrors = data.data;
                    } else {
                        vm.rowErrors = [{
                            row: '—',
                            errors: [data.message || 'An unexpected error occurred. Please check your data and try again.']
                        }];
                    }
                    vm.$nextTick(() => {
                        if (vm.$refs.rowErrorsAlert && typeof vm.$refs.rowErrorsAlert.scrollIntoView === 'function') {
                            vm.$refs.rowErrorsAlert.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        } else {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    });
                    vm.isLoading = false;
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
    }
};
</script>