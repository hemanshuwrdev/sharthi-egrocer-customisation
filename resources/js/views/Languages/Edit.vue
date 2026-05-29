<template>
    <b-modal ref="my-modal" :title="modal_title" @hidden="$emit('modalClose')" size="lg" scrollable no-close-on-backdrop
        no-fade static>
        <div slot="modal-footer">
            <b-button variant="primary" @click="$refs['dummy_submit'].click()" :disabled="isLoading">{{ __('save') }}
                <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
            </b-button>
            <b-button variant="secondary" @click="hideModal">{{ __('cancel') }}</b-button>
        </div>
        <form ref="my-form" @submit.prevent="saveRecord">

            <div class="row">
                <!-- System Type - Only show when editing (id exists) -->
                <div class="form-group" v-if="id">
                    <label for="seller">{{ __('system_type') }}</label>
                    <select name="seller" id="seller" v-model="system_type" class="form-control form-select" disabled>
                        <option value="">{{ __('select_system_type') }}</option>
                        <option v-for="item in system_types" :value="item.id">{{ item.name }}</option>
                    </select>
                    <small class="text-muted">{{ __('system_type_cannot_be_changed_when_editing') }}</small>
                </div>
                <div class="row">
                    <div class="form-group col-12 col-lg-6">
                        <label for="supported_language">{{ __('supported_language') }}</label><span
                            class="text-danger">*</span>
                        <select name="supported_language" id="supported_language" v-model="supported_language"
                            class="form-control form-select" :disabled="id">
                            <option value="">{{ __('select_supported_language') }}</option>
                            <option v-for="item in supported_languages" :value="item.id">{{ item.name }}</option>
                        </select>
                        <small v-if="id" class="text-muted">{{ __('supported_language_cannot_be_changed_when_editing')
                            }}</small>
                    </div>

                    <div class="form-group col-12 col-lg-6">
                        <label for="display_name">{{ __('display_name') }}<span class="text-danger">*</span></label>
                        <input name="display_name" id="display_name" v-model="display_name" class="form-control" :placeholder="__('display_name')">
                    </div>
                </div>
                <!-- When creating (no id), show JSON file inputs for all system types -->
                <template v-if="!id">

                    <div class="form-group col-12 col-lg-6" v-for="systemType in system_types" :key="systemType.id">
                        <label :for="'json_file_' + systemType.id">{{ __('json_file') }} - {{ systemType.name }} <span
                                class="text-danger">*</span></label>
                        <span v-if="getError('json_data_' + systemType.id)" class="text-danger d-block mb-1">{{
                            getError('json_data_' + systemType.id) }}</span>

                        <!-- Theme's drag-and-drop file upload -->
                        <input type="file" :name="'json_file_' + systemType.id" :id="'json_file_' + systemType.id"
                            accept="application/json" v-on:change="handleFileUpload($event, systemType.id)"
                            :ref="'json_file_' + systemType.id" class="file-input">
                        <div class="file-input-div bg-gray-100"
                            @click="() => { const ref = $refs['json_file_' + systemType.id]; if (ref && ref[0]) ref[0].click(); }"
                            @drop="dropFile($event, systemType.id)" @dragover="$dragoverFile"
                            @dragleave="$dragleaveFile">
                            <template v-if="jsonFileNames['json_file_' + systemType.id]">
                                <label>{{ __('selected_file_name') }}: {{ jsonFileNames['json_file_' + systemType.id]
                                    }}</label>
                            </template>
                            <template v-else>
                                <label><i class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                <label>{{ __('drop_files_here_or_click_to_upload') }}</label>
                            </template>
                        </div>

                        <div class="form-group mt-2" v-if="getJsonData('json_data_' + systemType.id)">
                            <label :for="'json_data_' + systemType.id">{{ __('json_data') }} - {{ systemType.name
                                }}</label>
                            <textarea readonly class="form-control" rows="5"
                                :value="getJsonData('json_data_' + systemType.id)" :name="'json_data_' + systemType.id"
                                :id="'json_data_' + systemType.id"></textarea>
                        </div>
                    </div>
                </template>

                <!-- When editing (id exists), show single JSON file input with theme's drag-and-drop -->
                <template v-else>
                    <div class="form-group">
                        <label for="json_file">{{ __('json_file') }}</label>
                        <span v-if="error" class="text-danger d-block mb-1">{{ error }}</span>

                        <input type="file" name="json_file" id="json_file" accept="application/json"
                            v-on:change="handleFileUpload($event)" ref="json_file" class="file-input">
                        <div class="file-input-div bg-gray-100" @click="$refs.json_file.click()"
                            @drop="dropFile($event)" @dragover="$dragoverFile" @dragleave="$dragleaveFile">
                            <template v-if="json_file && json_file.name">
                                <label>{{ __('selected_file_name') }}: {{ json_file.name }}</label>
                            </template>
                            <template v-else>
                                <label><i class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                <label>{{ __('drop_files_here_or_click_to_upload') }}</label>
                            </template>
                        </div>

                        <div class="form-group mt-2" v-if="json_data">
                            <label for="json_data">{{ __('json_data') }}</label>
                            <textarea readonly class="form-control" rows="10" v-model="json_data" name="json_data"
                                id="json_data">{{ json_data
                                }}</textarea>
                        </div>
                    </div>
                </template>
                <div class="form-group">
                    <input name="is_default" id="is_default" v-model="is_default" true-value="1" false-value="0"
                        :checked="is_default" type="checkbox" class="form-check-input">
                    <label for="is_default">{{ __('set_as_a_default_language') }}</label>
                </div>
                <div class="form-group">
                    <label>{{ __('status') }}</label>
                    <div class="col-md-9 text-left mt-1">
                        <b-form-radio-group v-model="status" :options="[
                            { text: __('deactivate'), 'value': 0 },
                            { text: __('activate'), 'value': 1 },
                        ]" buttons button-variant="outline-primary" required></b-form-radio-group>
                    </div>
                </div>
            </div>
            <button ref="dummy_submit" style="display:none;"></button>
        </form>
    </b-modal>
</template>

<script>
import axios from 'axios';

export default {
    props: ['record', 'system_types', 'supported_languages'],
    data: function () {
        return {
            isLoading: false,

            id: this.record ? this.record.id : null,
            system_type: this.record ? this.record.system_type : "",
            supported_language: this.record ? this.record.supported_language_id : "",
            display_name: this.record ? this.record.display_name : "",
            json_file: "",
            json_data: this.record ? this.record.json_data : "",
            is_default: this.record ? this.record.is_default : 0,
            status: this.record ? this.record.status : 1,
            error: null,
            jsonDataObjects: {},
            errors: {},
            jsonFileNames: {},
        };
    },
    computed: {
        modal_title: function () {
            let title = this.id ? __('edit_language') : __('add_language');
            return title;
        },
    },

    methods: {
        showModal() {
            this.$refs['my-modal'].show()
        },
        hideModal() {
            this.$refs['my-modal'].hide()
        },
        getError(key) {
            return this.errors[key] || '';
        },
        getJsonData(key) {
            return this.jsonDataObjects[key] || '';
        },

        handleFileUpload(event, systemTypeId = null) {
            if (systemTypeId) {
                const fileInput = event.target;
                const file = fileInput.files[0];

                if (!file) {
                    return;
                }

                const fileNameKey = 'json_file_' + systemTypeId;
                this.$set(this.jsonFileNames, fileNameKey, file.name);

                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const jsonData = JSON.parse(reader.result);
                        const jsonDataKey = 'json_data_' + systemTypeId;
                        this.$set(this.jsonDataObjects, jsonDataKey, JSON.stringify(jsonData, null, 2));
                        this.$set(this.errors, jsonDataKey, "");
                    } catch (error) {
                        const jsonDataKey = 'json_data_' + systemTypeId;
                        this.$set(this.errors, jsonDataKey, "Invalid JSON file. Please upload a valid JSON file.");
                        this.$set(this.jsonDataObjects, jsonDataKey, "");
                        this.$set(this.jsonFileNames, fileNameKey, "");
                        event.target.value = "";
                    }
                };
                reader.readAsText(file);
            } else {
                this.json_file = this.$refs.json_file.files[0];

                if (!this.json_file) {
                    return;
                }

                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const jsonData = JSON.parse(reader.result);
                        this.json_data = JSON.stringify(jsonData);
                        this.error = "";
                    } catch (error) {
                        this.error = "Invalid JSON file. Please upload a valid JSON file.";
                        this.json_data = "";
                        this.json_file = null;
                        event.target.value = "";
                    }
                };
                reader.readAsText(this.json_file);
            }
        },
        dropFile(event, systemTypeId = null) {
            event.preventDefault();

            if (systemTypeId) {
                const ref = this.$refs['json_file_' + systemTypeId];
                if (ref && ref[0]) {
                    const fileInput = ref[0];
                    fileInput.files = event.dataTransfer.files;
                    this.handleFileUpload({ target: fileInput }, systemTypeId);
                }
            } else {
                if (this.$refs.json_file) {
                    this.$refs.json_file.files = event.dataTransfer.files;
                    this.handleFileUpload({ target: this.$refs.json_file });
                }
            }

            if (event.currentTarget) {
                event.currentTarget.classList.add('bg-gray-100');
                event.currentTarget.classList.remove('bg-green-300');
            }
        },
        saveRecord: function () {
            let vm = this;

            if (!this.supported_language) {
                this.showError("Supported language is required.");
                return;
            }

            if (!this.id) {
                let hasAllJsonData = true;
                let missingSystemTypes = [];

                this.system_types.forEach(systemType => {
                    const jsonDataKey = 'json_data_' + systemType.id;
                    if (!this.jsonDataObjects[jsonDataKey]) {
                        hasAllJsonData = false;
                        missingSystemTypes.push(systemType.name);
                    }
                });

                if (!hasAllJsonData) {
                    this.showError("Please upload JSON files for all system types. Missing: " + missingSystemTypes.join(", "));
                    return;
                }
            } else {
                if (!this.json_data) {
                    this.showError("JSON data is required.");
                    return;
                }
            }

            this.isLoading = true;
            let formData = new FormData();

            if (this.id) {
                formData.append('id', this.id);
                formData.append('system_type', this.system_type);
                formData.append('supported_language', this.supported_language);
                formData.append('display_name', this.display_name);
                formData.append('json_data', this.json_data);
                formData.append('is_default', this.is_default);
                formData.append('status', this.status);

                let url = this.$apiUrl + '/languages/update';
                axios.post(url, formData).then(res => {
                    let data = res.data;
                    if (data.status === 1) {
                        this.$eventBus.$emit('recordSaved', data.message);
                        vm.$router.push({ path: '/languages' });
                        this.hideModal();
                    } else {
                        vm.showError(data.message);
                        vm.isLoading = false;
                    }
                }).catch(error => {
                    vm.isLoading = false;

                    let errorMessage = "Something went wrong!";

                    if (error.response && error.response.data) {
                        if (error.response.data.message) {
                            errorMessage = error.response.data.message;
                        } else if (error.response.data.error) {
                            errorMessage = error.response.data.error;
                        }
                    } else if (error.request && error.request.statusText) {
                        errorMessage = error.request.statusText;
                    } else if (error.message) {
                        errorMessage = error.message;
                    }

                    this.showError(errorMessage);
                });
            } else {
                formData.append('supported_language', this.supported_language);
                formData.append('display_name', this.display_name);
                formData.append('is_default', this.is_default);
                formData.append('status', this.status);

                this.system_types.forEach(systemType => {
                    const jsonDataKey = 'json_data_' + systemType.id;
                    if (this.jsonDataObjects[jsonDataKey]) {
                        formData.append(jsonDataKey, this.jsonDataObjects[jsonDataKey]);
                    }
                });

                let url = this.$apiUrl + '/languages/save';
                axios.post(url, formData).then(res => {
                    let data = res.data;
                    if (data.status === 1) {
                        this.$eventBus.$emit('recordSaved', data.message);
                        vm.$router.push({ path: '/languages' });
                        this.hideModal();
                    } else {
                        vm.showError(data.message);
                        vm.isLoading = false;
                    }
                }).catch(error => {
                    vm.isLoading = false;

                    let errorMessage = "Something went wrong!";

                    if (error.response && error.response.data) {
                        if (error.response.data.message) {
                            errorMessage = error.response.data.message;
                        } else if (error.response.data.error) {
                            errorMessage = error.response.data.error;
                        }
                    } else if (error.request && error.request.statusText) {
                        errorMessage = error.request.statusText;
                    } else if (error.message) {
                        errorMessage = error.message;
                    }

                    this.showError(errorMessage);
                });
            }
        }
    },
    mounted() {
        this.showModal();
    }
}
</script>

<style scoped>
.image_preview {
    margin-top: 5px;
}
</style>
