<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('manage_cities') }}</h3>
            <router-link to="/cities/create" class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap"
                v-if="$can('city_create')">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add') }}</span>
            </router-link>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input
                        id="filter-input"
                        v-model="filter"
                        type="search"
                        :placeholder="__('search')"
                    ></b-form-input>
                </div>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getRecords()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>
            <div class="table-responsive">



                <b-table
                    id="my-table"
                    ref="table"

                    head-variant="unset"

                    :items="translatedCities"
                    :fields="fields"

                    :filter="filter"
                    :filter-included-fields="filterOn"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :sort-direction="sortDirection"
                    @sort-changed="getRecords"
                    :bordered="true"
                    :busy="isLoading"

                    stacked="md"
                    show-empty
                    small
                    empty-text="There are no zones to show"
                    :key="tableKey"
                >
                    <template #table-busy>
                        <div class="text-center text-black my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>{{ __('loading') }}...</strong>
                        </div>
                    </template>
                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <router-link
                                :to="{ name: 'EditCity',params: { id: row.item.id, record : row.item }}"
                                v-b-tooltip.hover :title="__('edit')" class="list-action-btn is-edit"
                                v-if="$can('city_update')">
                                <i class="fa fa-pencil-alt"></i>
                            </router-link>
                            <button class="list-action-btn is-delete" v-b-tooltip.hover :title="__('delete')"
                                    @click="deleteRecord(row.index,row.item.id)"
                                    v-if="$can('city_delete')">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </template>
                </b-table>
            </div>
            <div class="list-footer">
                <div class="list-perpage">
                    <b-form-group
                        :label="__('per_page')"
                        label-for="per-page-select"
                        label-align-sm="right"
                        label-size="sm"
                        class="mb-0">
                        <b-form-select
                            id="per-page-select"
                            v-model="perPage"
                            :options="pageOptions"
                            size="sm"
                            class="form-control form-select"
                        ></b-form-select>
                    </b-form-group>
                </div>

                <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    align="fill"
                    size="sm"
                    class="list-pagination"
                    @change="getRecords"
                ></b-pagination>
            </div>
        </div>

    </div>

</template>
<script>
import {VuejsDatatableFactory} from 'vuejs-datatable';
import axios from "axios";
import moment from "moment";
import { computed } from 'vue';

export default {
    components: {
        VuejsDatatableFactory,
    },
    data: function () {
        return {
            isLoading: false,

            fields: [
                {key: 'id', label: __('id'), sortable: true, sortDirection: 'desc'},
                {key: 'name', label: __('name'), sortable: true, sortDirection: 'desc'},
                {key: 'zone', label: __('zone'), sortable: true, sortDirection: 'desc'},
                {key: 'state', label: __('state'), sortable: true, sortDirection: 'desc'},
                {key: 'latitude', label: __('latitude'), sortable: true, sortDirection: 'desc'},
                {key: 'longitude', label: __('longitude'), sortable: true, sortDirection: 'desc'},
                {key: 'geolocation_type', label: __('geolocation_type'), sortable: true, sortDirection: 'desc'},
                {key: 'actions', label: __('actions'), class: 'text-center' }
            ],

            totalRows: 1,

            currentPage: 1,
            perPage: this.$perPage,
            pageOptions: this.$pageOptions,
            offset: 0,

            sortBy: 'id',
            sortDesc: true,
            sortDirection: 'desc',

            filter: null,
            filterOn: [],

            cities: [],
            tableKey: 0, // For forcing table re-render
            currentLanguageId: null,
            activeLanguages: [],
        }
    },
    mounted() {
    },
created() {
    this.fetchActiveLanguages().then(() => {
        this.getRecords();
    });
},
computed: {
    translatedCities() {
        if (!this.currentLanguageId || !Array.isArray(this.cities)) return this.cities;

        return this.cities.map(city => {
            const c = { ...city };
            if (city.translations && Array.isArray(city.translations)) {
                const translation = city.translations.find(t => t.language_id === this.currentLanguageId);
                if (translation && translation.zone && translation.zone.trim() !== '') {
                    c.zone = translation.zone;
                }
            }
            return c;
        });
    }
},

    watch: {
        currentPage(newPage) {
            this.getRecords();
        },
        perPage(newPerPage) {
            this.getRecords();
        },
        filter(newFilter, oldFilter) {
            this.currentPage = 1;
            this.getRecords();
        }
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
                        if (defaultLanguage) this.currentLanguageId = defaultLanguage.id;
                    }
                }
            }).catch(err => console.error('Error loading languages:', err));
    },

        getRecords() {
            this.isLoading = true
            let vm = this;

            // Calculate proper offset for CityApiController
            const calculatedOffset = this.perPage * (this.currentPage - 1);

            const params = {
                offset: calculatedOffset,
                limit: this.perPage,
                search: this.filter,
                sort_by: this.sortBy,
                sort_dir: this.sortDirection
            };

            axios.get(this.$apiUrl + '/cities', { params })
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    
                    // Handle the nested response structure from CityApiController
                    this.cities = data.data.cities || [];
                    this.totalRows = data.data.total || 0;
                    
                    // Force table re-render
                    this.tableKey++;

                }).catch(error => {
                vm.isLoading = false;
                
                if (error?.request?.statusText) {
                    this.showError(error?.request?.statusText);
                }else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError(__('something_went_wrong'));
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
                    axios.post(this.$apiUrl + '/cities/delete', postData)
                        .then((response) => {
                            this.isLoading = false
                            let data = response.data;
                            this.cities.splice(index, 1)
                            this.showMessage('success', data.message);
                        });
                }
            });
        },
    }
};
</script>
