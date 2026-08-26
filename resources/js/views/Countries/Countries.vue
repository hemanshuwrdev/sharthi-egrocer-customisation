<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('countries') }}</h3>
            <router-link to="/countries/create" class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap"
                v-if="$can('country_create')">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add') }}</span>
            </router-link>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input id="filter-input" v-model="filter" type="search"
                        :placeholder="__('search')"></b-form-input>
                </div>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getRecords()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>
            <div class="table-responsive">
                <b-table :items="translatedCountries" :fields="fields" :current-page="currentPage"
                    :per-page="perPage" :filter="filter" :filter-included-fields="filterOn"
                    :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection"
                    :bordered="true" :busy="isLoading" stacked="md" show-empty small>
                    <template #table-busy>
                        <div class="text-center text-black my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>{{ __('loading') }}...</strong>
                        </div>
                    </template>

                    <template #cell(id)="row">
                        {{ row.item.id }}
                    </template>
                    <template #cell(logo)="row">
                        <p v-if="row.item.logo === ''"> {{ __('no_image') }}</p>
                        <img :src="$storageUrl + row.item.logo" height="50" v-else />
                    </template>
                    <template #cell(is_default)="row">
                        <span v-if="row.item.is_default == 1" class="badge bg-success">{{ __('yes')
                            }}</span>
                        <span v-else class="badge bg-danger">{{ __('no') }}</span>
                    </template>

                    <template #cell(status)="row">
                        <span class='badge bg-success' v-if="row.item.status == 1">{{ __('active') }}</span>
                        <span class='badge bg-danger' v-if="row.item.status == 0">{{ __('deactive')
                            }}</span>
                    </template>

                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <button v-if="$can('country_update')" class="list-action-btn is-edit"
                                @click="edit_record = row.item" v-b-tooltip.hover :title="__('edit')"><i
                                    class="fa fa-pencil-alt"></i></button>
                            <button v-if="$can('country_delete')" class="list-action-btn is-delete"
                                @click="deleteRecord(row.index, row.item.id)" v-b-tooltip.hover
                                :title="__('delete')"><i class="fa fa-trash"></i></button>
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
        <app-edit-record v-if="create_new || edit_record" :record="edit_record"
            @modalClose="hideModal()"></app-edit-record>
    </div>

</template>
<script>

import EditRecord from './Edit.vue';
import axios from "axios";


export default {
    components: {
        'app-edit-record': EditRecord,
    },
    data: function () {
        return {
            fields: [
                { key: 'id', label: __('id'), class: 'text-center', sortable: true, sortDirection: 'asc' },
                { key: 'name', label: __('name'), class: 'text-center', sortable: true, sortDirection: 'asc' },
                { key: 'dial_code', label: __('dial_code'), class: 'text-center' },
                { key: 'code', label: __('code'), class: 'text-center' },
                { key: 'logo', label: __('logo'), class: 'text-center' },
                { key: 'status', label: __('status'), class: 'text-center', sortable: true, sortDirection: 'asc' },
                { key: 'actions', label: __('actions') }
            ],
            totalRows: 1,
            currentPage: 1,
            perPage: this.$perPage,
            pageOptions: this.$pageOptions,
            sortBy: 'id',
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,
            filterOn: [],
            page: 1,
            isLoading: false,
            sectionStyle: 'style_1',
            max_visible_units: 12,
            max_col_in_single_row: 3,
            countries: [],
            sortBySL: 'id',
            sortDescSL: false,
            sortDirectionSL: 'asc',
            isSystemRefreshing: false,
            create_new: null,
            edit_record: null,
            currentLanguageId: null,
            activeLanguages: [],

        }
    },
    computed: {
        translatedCountries() {
            const list = Array.isArray(this.countries) ? this.countries : [];

            if (!this.currentLanguageId || list.length === 0) {
                return list;
            }

            return list.map(country => {
                const translatedCountry = { ...country };

                if (country.translations && Array.isArray(country.translations)) {
                    const translation = country.translations.find(
                        t => t.language_id === this.currentLanguageId
                    );

                    if (translation && translation.name && translation.name.trim() !== '') {
                        translatedCountry.name = translation.name;
                    }
                }

                return translatedCountry;
            });
        },

        sortOptions() {
            // Create an options list from our fields
            return this.fields
                .filter(f => f.sortable)
                .map(f => {
                    return { text: f.label, value: f.key }
                })
        }
    },

    watch: {
        $route(to, from) {
            this.showCreateModal();
        }
    },
    created() {
        this.showCreateModal();

        this.recordSavedHandler = (message) => {
            this.showMessage('success', message);
            this.fetchActiveLanguages().then(() => {
                this.getRecords();
            });
            this.create_new = null;
        };
        this.$eventBus.$on('recordSaved', this.recordSavedHandler);

        this.fetchActiveLanguages().then(() => {
            this.getRecords();
        });
    },

    beforeDestroy() {
        this.$eventBus.$off('recordSaved', this.recordSavedHandler);
    },

    methods: {

        fetchActiveLanguages() {
            return axios.get(this.$apiUrl + '/active_languages')
                .then(response => {
                    if (response.data.data && Array.isArray(response.data.data)) {
                        this.activeLanguages = response.data.data;

                        const appLocale = window.appLocale || 'en';

                        const currentLanguage = this.activeLanguages.find(
                            lang => lang.code === appLocale
                        );

                        if (currentLanguage) {
                            this.currentLanguageId = currentLanguage.id;
                        } else {
                            const defaultLanguage = this.activeLanguages.find(
                                lang => lang.is_default === 1
                            );
                            if (defaultLanguage) {
                                this.currentLanguageId = defaultLanguage.id;
                            }
                        }
                    }
                })
                .catch(error => {
                    console.error('Error loading languages:', error);
                });
        },

        getRecords() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/countries', {
            }).then((response) => {
                this.isLoading = false
                let data = response.data;
                this.countries = data.data;
                this.totalRows = this.countries.length
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
        deleteRecord(index, id) {
            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('you_want_be_able_to_revert_this'),
                confirmButtonText: __('yes_sure'),
                cancelButtonText: __('cancel'),
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
                    axios.post(this.$apiUrl + '/countries/delete', postData)
                        .then((response) => {
                            this.isLoading = false
                            let data = response.data;
                            if (data.status === 1) {
                                // Find the index of the country in the array based on its id
                                const indexOfDeletedCountry = this.countries.findIndex(country => country.id === postData.id);

                                if (indexOfDeletedCountry !== -1) {
                                    // If the country is found in the array, remove it
                                    this.countries.splice(indexOfDeletedCountry, 1);
                                    this.showMessage('success', data.message);
                                } else {
                                    console.error("Country not found in the array.");
                                }
                            } else {
                                this.showError(data.message);
                            }
                        }).catch(error => {
                            vm.isLoading = false;
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
            this.$router.push({ path: '/countries' });
        },
    }
};
</script>
