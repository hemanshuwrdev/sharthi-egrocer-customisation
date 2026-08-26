<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('languages') }}</h3>
            <div class="page-head-actions">
                <button class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap"
                    @click="showSupportedLanguages = true">
                    <span>{{ __('supported_languages_list') }}</span>
                </button>

                <b-modal v-model="showSupportedLanguages" size="lg"
                    :title="__('supported_languages_list')" scrollable no-close-on-backdrop no-fade
                    static>
                    <b-container fluid>
                        <b-row class="mb-2">
                            <b-col cols="12" lg="4" offset-lg="8">
                                <h6 class="box-title">{{ __('search') }}</h6>
                                <b-form-input id="filter-input" v-model="filterSL" type="search"
                                    :placeholder="__('search')"></b-form-input>
                            </b-col>
                        </b-row>

                        <b-table sticky-header hover stacked="md" show-empty small :bordered="true"
                            :items="supported_languages" :fields="supported_languages_fields"
                            :filter="filterSL" :sort-by.sync="sortBySL" :sort-desc.sync="sortDescSL"
                            :sort-direction="sortDirectionSL">
                        </b-table>

                    </b-container>
                    <template #modal-footer>
                        <b-button variant="danger" size="sm" class="float-right"
                            @click="showSupportedLanguages = false">
                            {{ __('close') }}
                        </b-button>
                    </template>
                </b-modal>

                <router-link to="/languages/create" class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap"
                    v-if="$can('language_create')">
                    <i class="fa fa-plus" aria-hidden="true"></i>
                    <span>{{ __('add') }}</span>
                </router-link>
            </div>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
                <!-- Download Sample Files Section -->
                <div>
                    <h6 class="box-title mb-2">{{ __('download_sample_files') }}</h6>
                    <div class="d-flex flex-wrap" style="gap: 8px;">
                        <button class="btn btn-sm btn-outline-primary"
                            @click="downloadSampleFile('customer.json', getSystemTypeName(1))">
                            <i class="fa fa-download"></i> {{ __('customer_app') }}
                        </button>
                        <button class="btn btn-sm btn-outline-primary"
                            @click="downloadSampleFile('partner.json', getSystemTypeName(2))">
                            <i class="fa fa-download"></i> {{ __('partner_app') }}
                        </button>
                        <button class="btn btn-sm btn-outline-primary"
                            @click="downloadSampleFile('web.json', getSystemTypeName(3))">
                            <i class="fa fa-download"></i> {{ __('website') }}
                        </button>
                        <button class="btn btn-sm btn-outline-primary"
                            @click="downloadSampleFile('panel.json', getSystemTypeName(4))">
                            <i class="fa fa-download"></i> {{ __('admin_panel') }}
                        </button>
                    </div>
                </div>
                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input id="filter-input" v-model="filter" type="search"
                        :placeholder="__('search')"></b-form-input>
                </div>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getRecords()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>
            <!-- Simple table showing languages -->
            <div class="table-responsive">
                <b-table :items="groupedLanguages" :fields="languageFields" :current-page="currentPage"
                    :per-page="perPage" :filter="filter" :filter-included-fields="filterOn"
                    :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection"
                    :bordered="true" :busy="isLoading" stacked="md" show-empty small>
                    <template #table-busy>
                        <div class="text-center text-black my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>{{ __('loading') }}...</strong>
                        </div>
                    </template>

                    <template #cell(name)="row">
                        <span>{{ row.item.name }}</span>
                    </template>

                    <template #cell(is_default)="row">
                        <span v-if="row.item.has_default" class="badge bg-success">{{ __('yes')
                            }}</span>
                        <span v-else class="badge bg-danger">{{ __('no') }}</span>
                    </template>

                    <template #cell(status)="row">
                        <span v-if="row.item.status == 1" class="badge bg-success">{{ __('active')
                            }}</span>
                        <span v-else class="badge bg-danger">{{ __('inactive') }}</span>
                    </template>

                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <button v-if="$can('language_update')" class="list-action-btn is-edit"
                                @click="openEditModal(row.item)" v-b-tooltip.hover :title="__('edit')">
                                <i class="fa fa-pencil-alt"></i>
                            </button>
                            <button v-if="$can('language_delete')" class="list-action-btn is-delete"
                                @click="deleteLanguageGroup(row.item)" v-b-tooltip.hover
                                :title="__('delete')">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </template>
                </b-table>
            </div>
            <div class="list-footer">
                <div class="list-perpage">
                    <b-form-group :label="__('per_page')" label-for="per-page-select"
                        label-align-sm="right" label-size="sm" class="mb-0">
                        <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"
                            size="sm" class="form-control form-select"></b-form-select>
                    </b-form-group>
                </div>
                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
                    align="fill" size="sm" class="list-pagination"></b-pagination>
            </div>
        </div>

        <!-- Add / Edit -->
        <app-edit-record v-if="create_new || edit_record" :record="edit_record" :system_types="system_types"
            :supported_languages="supported_languages" @modalClose="hideModal()"></app-edit-record>

        <!-- Edit Language Modal - Shows supported language, display name, is_default, and 4 Edit buttons -->
        <b-modal ref="edit-language-modal" :title="__('edit_language')" @hidden="closeEditModal" size="lg" scrollable
            no-close-on-backdrop no-fade static>
            <div v-if="selectedLanguageGroup" class="row">
                <div class="form-group col-md-6">
                    <label for="edit_supported_language">{{ __('supported_language') }}</label>
                    <input type="text" id="edit_supported_language" class="form-control"
                        :value="selectedLanguageGroup.name + ' (' + selectedLanguageGroup.code + ')'" readonly>
                </div>

                <div class="form-group col-md-6">
                    <label for="edit_display_name">{{ __('display_name') }}<span class="text-danger">*</span></label>
                    <input type="text" id="edit_display_name" class="form-control" v-model="editDisplayName"
                        :placeholder="__('enter_display_name')">
                </div>

                <div class="form-group col-md-6">
                    <input name="edit_is_default" id="edit_is_default" v-model="editIsDefault" true-value="1"
                        false-value="0" type="checkbox" class="form-check-input">
                    <label for="edit_is_default" class="form-check-label ms-2">{{ __('set_as_a_default_language')
                        }}</label>
                </div>

                <div class="form-group col-md-6">
                    <label>{{ __('status') }}</label>
                    <div class="text-left mt-1">
                        <b-form-radio-group v-model="editStatus" :options="[
                            { text: __('deactivate'), 'value': 0 },
                            { text: __('activate'), 'value': 1 },
                        ]" buttons button-variant="outline-primary" required></b-form-radio-group>
                    </div>
                </div>

                <div class="form-group col-md-12">
                    <label class="mb-2">{{ __('edit_json_data_for_system_types') }}:</label>
                    <div class="row">
                        <div class="col-md-6 mb-2" v-for="systemType in system_types" :key="systemType.id">
                            <button class="btn btn-primary btn-block"
                                @click="openJsonEditModal(systemType, selectedLanguageGroup)">
                                <i class="fa fa-pencil-alt"></i> {{ __('edit') }} {{ systemType.name }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <template #modal-footer>
                <b-button variant="primary" @click="saveLanguageSettings" :disabled="isSaving">
                    {{ __('save') }}
                    <b-spinner v-if="isSaving" small label="Spinning"></b-spinner>
                </b-button>
                <b-button variant="secondary" @click="closeEditModal">{{ __('cancel') }}</b-button>
            </template>
        </b-modal>

        <app-json-edit v-if="jsonEditRecord" :record="jsonEditRecord" :system_type="jsonEditSystemType"
            @modalClose="closeJsonEditModal" @jsonSaved="closeEditModal"></app-json-edit>
    </div>

</template>
<script>

import EditRecord from './Edit.vue';
import JsonEdit from './JsonEdit.vue';
import axios from "axios";


export default {
    components: {
        'app-edit-record': EditRecord,
        'app-json-edit': JsonEdit,
    },
    data: function () {
        return {
            fields: [
                { key: 'id', label: __('id'), class: 'text-center', sortable: true, sortDirection: 'desc' },
                { key: 'name', label: __('name'), class: 'text-center' },
                { key: 'code', label: __('code'), class: 'text-center' },
                { key: 'is_default', label: __('default'), class: 'text-center' },
                { key: 'actions', label: __('actions'), class: 'text-center' }
            ],
            languageFields: [
                { key: 'name', label: __('language'), class: 'text-center text-nowrap', sortable: true },
                { key: 'code', label: __('code'), class: 'text-center text-nowrap', sortable: true },
                { key: 'is_default', label: __('default'), class: 'text-center text-nowrap', sortable: true },
                { key: 'status', label: __('status'), class: 'text-center text-nowrap', sortable: true },
                { key: 'actions', label: __('actions'), class: 'text-center text-nowrap' }
            ],
            totalRows: 1,
            currentPage: 1,
            perPage: this.$perPage,
            pageOptions: this.$pageOptions,
            sortBy: 'id',
            sortDesc: true,
            sortDirection: 'desc',
            filter: null,
            filterOn: ['name', 'code'],
            page: 1,

            isLoading: false,
            sectionStyle: 'style_1',
            max_visible_units: 12,
            max_col_in_single_row: 3,

            languages: [],
            system_types: [],
            system_type: "",
            supported_languages: [],
            supported_languages_fields: [
                { key: 'id', label: __('id'), class: 'text-center', sortable: true, sortDirection: 'asc' },
                { key: 'name', label: __('name'), class: 'text-center' },
                { key: 'code', label: __('code'), class: 'text-center' },
                { key: 'type', label: __('type'), class: 'text-center' }
            ],
            sortBySL: 'id',
            sortDescSL: false,
            sortDirectionSL: 'asc',
            filterSL: null,
            showSupportedLanguages: false,
            isSystemRefreshing: false,


            create_new: null,
            edit_record: null,
            selectedLanguageGroup: null,
            editDisplayName: '',
            editIsDefault: 0,
            editStatus: 1,
            isSaving: false,
            jsonEditRecord: null,
            jsonEditSystemType: null,
        }
    },
    computed: {
        sortOptions() {
            // Create an options list from our fields
            return this.fields
                .filter(f => f.sortable)
                .map(f => {
                    return { text: f.label, value: f.key }
                })
        },
        groupedLanguages() {
            const grouped = {};

            this.languages.forEach(lang => {
                const key = lang.supported_language_id;

                if (!grouped[key]) {
                    grouped[key] = {
                        id: lang.supported_language_id,
                        supported_language_id: lang.supported_language_id,
                        name: lang.name,
                        code: lang.code,
                        type: lang.type,
                        display_name: lang.display_name,
                        has_default: false,
                        status: lang.status,
                        languages: []
                    };
                }

                grouped[key].languages.push(lang);

                if (lang.is_default == 1) {
                    grouped[key].has_default = true;
                }
            });

            return Object.values(grouped).sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
        }
    },
    mounted() {
        // Set the initial number of items
        this.totalRows = this.groupedLanguages.length
    },
    watch: {
        $route(to, from) {
            this.showCreateModal();
        },
        groupedLanguages: {
            handler(newVal) {
                this.totalRows = newVal.length;
            },
            immediate: true
        }
    },
    created: function () {
        this.showCreateModal();
        this.$eventBus.$on('recordSaved', (message) => {
            this.showMessage('success', message);
            this.getRecords();
            this.create_new = null;
        });
        this.getRecords();
        this.getSupportedLanguages();
    },
    methods: {

        getRecords() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/languages')
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    this.languages = data.data || [];
                }).catch(error => {
                    this.isLoading = false;
                    if (error?.request?.statusText) {
                        this.showError(error.request.statusText);
                    } else if (error.message) {
                        this.showError(error.message);
                    } else {
                        this.showError("Something went wrong!");
                    }
                });
        },
        getSupportedLanguages() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/languages/supported_languages')
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;

                    this.system_types = data.data.system_types;
                    this.system_types = this.system_types; // this line is remove System type admin panel.

                    this.supported_languages = data.data.supported_languages;
                }).catch(error => {
                    this.isLoading = false;
                    if (error?.request?.statusText) {
                        this.showError(error.request.statusText);
                    } else if (error.message) {
                        this.showError(error.message);
                    } else {
                        this.showError("Something went wrong!");
                    }
                });
        },
        downloadJSON(row) {
            const data = this.convertInJsonData(row.json_data);

            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = row.code + '.json';
            link.click();

            // Clean up the object URL
            URL.revokeObjectURL(url);
        },

        convertInJsonData(data) {
            data = JSON.parse(data);
            if (Array.isArray(data)) {
                data = data[0];
            }
            return data;
        },

        deleteRecord(index, id) {
            this.$swal.fire({
                title: "Are you Sure?",
                text: "You want be able to revert this",
                confirmButtonText: "Yes, Sure",
                cancelButtonText: "Cancel",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#37a279',
                cancelButtonColor: '#d33',
            }).then(result => {
                if (result.value) {
                    this.isLoading = true
                    let postData = {
                        id: id
                    }
                    axios.post(this.$apiUrl + '/languages/delete', postData)
                        .then((response) => {
                            this.isLoading = false

                            let data = response.data;


                            if (data.status === 1) {
                                this.getRecords();
                                this.showMessage('success', data.message);
                            } else {
                                this.showError(data.message);
                            }

                        }).catch(error => {
                            this.isLoading = false;
                            if (error?.request?.statusText) {
                                this.showError(error.request.statusText);
                            } else if (error.message) {
                                this.showError(error.message);
                            } else {
                                this.showError("Something went wrong!");
                            }
                        });
                }
            });
        },

        showCreateModal() {
            let create = this.$route.params.create;
            if (create) {
                this.create_new = true;
            }
        },
        hideModal() {
            this.create_new = false
            this.edit_record = false
            this.$router.push({ path: '/languages' });
        },
        openEditModal(languageGroup) {
            this.selectedLanguageGroup = languageGroup;
            this.editDisplayName = languageGroup.display_name || '';
            this.editIsDefault = languageGroup.has_default ? 1 : 0;
            // Get status from the first language in the group (all should have the same status)
            this.editStatus = languageGroup.languages[0]?.status ?? 1;
            this.$refs['edit-language-modal'].show();
        },
        closeEditModal() {
            this.selectedLanguageGroup = null;
            this.editDisplayName = '';
            this.editIsDefault = 0;
            this.editStatus = 1;
            this.$refs['edit-language-modal'].hide();
        },
        openJsonEditModal(systemType, languageGroup) {
            const langRecord = languageGroup.languages.find(l => l.system_type == systemType.id);

            if (langRecord) {
                this.jsonEditRecord = langRecord;
                this.jsonEditSystemType = systemType;
            } else {
                this.jsonEditRecord = {
                    id: null,
                    supported_language_id: languageGroup.supported_language_id,
                    system_type: systemType.id,
                    json_data: '{}',
                    display_name: languageGroup.display_name,
                    is_default: 0,
                    status: 1
                };
                this.jsonEditSystemType = systemType;
            }
        },
        closeJsonEditModal() {
            this.jsonEditRecord = null;
            this.jsonEditSystemType = null;
            this.getRecords();
        },
        saveLanguageSettings() {
            if (!this.selectedLanguageGroup) return;

            this.isSaving = true;

            const updatePromises = this.selectedLanguageGroup.languages.map(lang => {
                const formData = new FormData();
                formData.append('id', lang.id);
                formData.append('system_type', lang.system_type);
                formData.append('supported_language', lang.supported_language_id);
                formData.append('display_name', this.editDisplayName);
                formData.append('json_data', lang.json_data);
                formData.append('is_default', this.editIsDefault);
                formData.append('status', this.editStatus);

                return axios.post(this.$apiUrl + '/languages/update', formData);
            });

            Promise.all(updatePromises)
                .then(responses => {
                    for (let i = 0; i < responses.length; i++) {
                        const response = responses[i];
                        const data = response.data;

                        if (data.status !== 1) {
                            this.isSaving = false;
                            const errorMessage = data.message || __('something_went_wrong');
                            this.showError(errorMessage);
                            return;
                        }
                    }

                    this.isSaving = false;
                    const message = responses[0]?.data?.message || __('language_updated_successfully');
                    this.showMessage('success', message);
                    this.closeEditModal();
                    this.getRecords();
                })
                .catch(error => {
                    this.isSaving = false;

                    let errorMessage = __('something_went_wrong');

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
        },
        // Get system type name by ID
        getSystemTypeName(systemTypeId) {
            const systemType = this.system_types.find(st => st.id == systemTypeId);
            return systemType ? systemType.name : '';
        },
        downloadSampleFile(fileName, systemTypeName) {
            const fileUrl = this.$baseUrl + '/sample-file/' + fileName;

            // Create a temporary anchor element to trigger download
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName;
            link.target = '_blank';

            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show success message
            this.showMessage('success', __('sample_file_downloaded') + ': ' + systemTypeName);
        },
        deleteLanguageGroup(languageGroup) {
            const languageIds = languageGroup.languages.map(l => l.id);
            const languageName = languageGroup.name;

            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('you_will_not_be_able_to_revert_this'),
                confirmButtonText: __('yes_sure'),
                cancelButtonText: __('cancel'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#37a279',
                cancelButtonColor: '#d33',
            }).then(result => {
                if (result.value) {
                    this.isLoading = true;
                    // Delete all languages for this group
                    let deletePromises = languageIds.map(id => {
                        return axios.post(this.$apiUrl + '/languages/delete', { id: id });
                    });

                    Promise.all(deletePromises)
                        .then((responses) => {
                            this.isLoading = false;
                            this.getRecords();
                            const failedResponse = responses.find(r => r.data && r.data.status !== 1);
                            if (failedResponse) {
                                this.showError(failedResponse.data.message || __('something_went_wrong'));
                            } else {
                                const message = responses[0]?.data?.message || __('language_deleted_successfully');
                                this.showMessage('success', message);
                            }
                        })
                        .catch(error => {
                            this.isLoading = false;
                            this.getRecords();
                            if (error.response && error.response.data && error.response.data.message) {
                                this.showError(error.response.data.message);
                            } else {
                                this.showError(__('something_went_wrong'));
                            }
                        });
                }
            });
        },
    },
    beforeDestroy() {
        this.$eventBus.$off('recordSaved');
    }
};
</script>
