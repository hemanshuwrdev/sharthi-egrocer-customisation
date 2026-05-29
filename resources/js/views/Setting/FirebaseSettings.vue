<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('firebase_settings') }}</h3> 
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><router-link to="/dashboard">{{ __('dashboard') }}</router-link></li>
                                <li class="breadcrumb-item active" aria-current="page">{{ __('firebase_settings') }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <section class="section">
                <form id="api_key_form" method="post" enctype="multipart/form-data" @submit.prevent="saveRecord">
                    <div class="card">
                     
                        <div class="card-body">
                            <div class="row">
                                <h4 class="card-title">{{ __('firebase_setup_keys') }}</h4>
                                <label><span class="text-danger text-xs">*</span> {{ __('required_fields') }}.</label>
                                <div class="divider"><div class="divider-text">{{ __('firebase_setup_keys_form') }}</div></div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="firebase_apiKey">{{ __('apikey') }}<span class="text-danger text-xs">*</span></label>
                                        <input type="text" class="form-control" name="firebase_apiKey" id="firebase_apiKey" v-model="firebase.firebase_apiKey" :placeholder="__('apikey')">
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="authDomain">{{ __('authdomain') }}<span class="text-danger text-xs">*</span></label>
                                        <input type="text" class="form-control" name="authDomain" id="authDomain" v-model="firebase.authDomain" :placeholder="__('authdomain')">
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="projectId">{{ __('projectid') }} <span class="text-danger text-xs">*</span></label>
                                        <input type="text" class="form-control" name="projectId" id="projectId" v-model="firebase.projectId" :placeholder="__('projectid')">
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="storageBucket">{{ __('storagebucket') }}<span class="text-danger text-xs">*</span></label>
                                        <input type="text" class="form-control" name="storageBucket" id="storageBucket" v-model="firebase.storageBucket" :placeholder="__('storagebucket')">
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="messagingSenderId"> {{ __('messagingsenderid') }}<span class="text-danger text-xs">*</span></label>
                                        <input type="text" class="form-control" name="messagingSenderId" id="messagingSenderId" v-model="firebase.messagingSenderId" :placeholder="__('messagingsenderid')">
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="appId"> {{ __('appid') }}<span class="text-danger text-xs">*</span></label>
                                        <input type="text" class="form-control" name="appId" id="appId" v-model="firebase.appId" :placeholder="__('appid')">
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="measurementId">{{ __('measurementid') }}<span class="text-danger text-xs">*</span></label>
                                        <input type="text" class="form-control" name="measurementId" id="measurementId" v-model="firebase.measurementId" :placeholder="__('measurementid')">
                                    </div>
                                </div>



                                <div class="divider">
                                    <div class="divider-text">{{ __('firebase_json_file_upload') }}</div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="jsonFile">{{ __('firebase_json_file') }} 
                                            <span v-if="fileExists" class="text-success ms-2">
                                                <i class="fa fa-check-circle"></i> {{ __('file_exists') }}
                                            </span>
                                            <span v-else class="text-danger ms-2">
                                                <i class="fa fa-times-circle"></i> {{ __('file_not_exists') }}
                                            </span>
                                        </label>
                                        <p class="text-muted mb-1">
                                            {{ __('supported_formats') }}: JSON
                                        </p>
                                        <span v-if="jsonFileError" class="error">{{ jsonFileError }}</span>
                                        <input
                                            type="file"
                                            name="jsonFile"
                                            id="jsonFile"
                                            ref="jsonFile"
                                            class="file-input"
                                            accept=".json,application/json"
                                            @change="handleFileUpload"
                                        />
                                        <div
                                            class="file-input-div bg-gray-100"
                                            @click="triggerJsonClick"
                                            @drop="dropJsonFile"
                                            @dragover="$dragoverFile"
                                            @dragleave="$dragleaveFile"
                                        >
                                            <template v-if="firebase.jsonFile && firebase.jsonFile.name">
                                                <label>{{ __('selected_file_name') }} {{ firebase.jsonFile.name }}</label>
                                            </template>
                                            <template v-else>
                                                <label><i class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                                <label>{{ __('drop_files_here_or_click_to_upload') }}</label>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <b-button type="submit" variant="primary" :disabled="isLoading">{{ __('update') }}
                                <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
                            </b-button>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    </div>
</template>
<script>
import axios from "axios";

export default {
    data: function () {
        return {
            isLoading: false,
            fileExists: false,

            editorConfig: {},
            firebase: {
                firebase_apiKey:"",
                authDomain:"",
                databaseURL:"",
                projectId:"",
                storageBucket:"",
                messagingSenderId:"",
                appId:"",
                measurementId:"",
                firebase_vapid_key:"",
                jsonFile:"",

            },
            record: null,
            jsonFileError: null
        }
    },
    created: function () {
        if(this.$isDemo != 1) {
            this.getFirebaseData();
        }
    },
    methods: {
        getFirebaseData() {
            axios.get(this.$apiUrl + '/firebase').then((response) => {
                if(response.data.data) {
                    this.record = response.data.data;
                    this.record.map((item, index) => {
                        if (item.variable === 'file_exists') {
                            // Handle file existence status
                            this.fileExists = (item.value === '1');
                        } else if (item.value === '0' || item.value === '1') {
                            this.firebase[item.variable] = (item.value === '0') ? 0 : 1;
                        } else {
                            this.firebase[item.variable] = item.value;
                        }
                    });
                }
            }).catch(error => {
                if (error.request.statusText) {
                    this.showError(error.request.statusText);
                }else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError(__('something_went_wrong'));
                }
            });
        },

        triggerJsonClick() {
            const ref = this.$refs.jsonFile;
            const input = Array.isArray(ref) ? ref[0] : ref;
            if (input && typeof input.click === 'function') {
                input.click();
            }
        },

        dropJsonFile(event) {
            event.preventDefault();
            const ref = this.$refs.jsonFile;
            const input = Array.isArray(ref) ? ref[0] : ref;
            if (!input) return;
            input.files = event.dataTransfer.files;
            this.handleFileUpload();
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },

        handleFileUpload() {
            const ref = this.$refs.jsonFile;
            const input = Array.isArray(ref) ? ref[0] : ref;
            const file = input && input.files ? input.files[0] : null;
            if (!file) return;

            this.jsonFileError = null;

            // Simple type check for JSON
            const validTypes = ['application/json', '.json'];
            if (file.type && !validTypes.includes(file.type)) {
                this.jsonFileError = this.__('invalid_json_file_type');
                return;
            }

            this.firebase.jsonFile = file;
            this.fileExists = true;
        },

        saveRecord: function(){
            this.isLoading = true;

            let object = this.firebase;
            let formData = new FormData();
            for (let key in object) {
                formData.append(key, object[key]);
            }

            let url = this.$apiUrl + '/firebase/save';
            let vm = this;

            axios.post(url, formData).then(res => {

                let data = res.data;
                if (data.status === 1) {
                    this.showMessage("success", data.message);
                    // Refresh data to get updated file status
                    vm.getFirebaseData();
                    setTimeout(
                        function() {
                            vm.$swal.close();
                            vm.$router.push({path:'/firebase-settings'});
                            vm.isLoading = false;
                        }, 100);
                }else{
                    vm.showError(data.message);
                    vm.isLoading = false;
                }


            }).catch(error => {
                if (error.request.statusText) {
                    this.showError(error.request.statusText);
                }else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError(__('something_went_wrong'));
                }
                vm.isLoading = true;
            });

        }
    }
}
</script>
