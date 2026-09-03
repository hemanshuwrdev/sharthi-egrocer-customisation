<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('units_list') }}</h3>
            <button class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap"
                @click="create_new = true" v-if="$can('units')">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add_unit') }}</span>
            </button>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input id="filter-input" v-model="filter" type="search"
                        :placeholder="__('search')"></b-form-input>
                </div>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')"
                    @click="getUnits()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                <b-table :items="translatedUnits" :fields="fields" :current-page="currentPage"
                    :per-page="perPage" :filter="filter" :filter-included-fields="filterOn"
                    :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection"
                    :bordered="true" :busy="isLoading" stacked="md" show-empty small>


                    <template #table-busy>
                        <div class="text-center text-black my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>{{ __('loading') }}...</strong>
                        </div>
                    </template>

                    <template #cell(parent_id)="row">
                        <p v-if="row.item.parent_id !== null">{{ row.item.parent_id }}</p>
                        <p v-else>-</p>
                    </template>

                    <template #cell(conversion)="row">
                        <p v-if="row.item.conversion !== null">{{ row.item.conversion }}</p>
                        <p v-else>-</p>
                    </template>

                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <button class="list-action-btn is-edit" @click="edit_record = row.item"
                                v-if="$can('units')" v-b-tooltip.hover :title="__('edit')"><i
                                    class="fa fa-pencil-alt"></i></button>
                            <button class="list-action-btn is-delete" @click="deleteUnit(row.index, row.item.id)"
                                v-if="$can('units')" v-b-tooltip.hover :title="__('delete')"><i class="fa fa-trash"></i></button>
                        </div>
                    </template>

                </b-table>
            </div>

            <div class="list-footer">
                <div class="list-perpage">
                    <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right"
                        label-size="sm" class="mb-0">
                        <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"
                            size="sm" class="form-control form-select"></b-form-select>
                    </b-form-group>
                </div>
                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
                    align="fill" size="sm" class="list-pagination"></b-pagination>
            </div>
        </div>
        <!-- Add / Edit -->
        <app-edit-record v-if="create_new || edit_record" :key="edit_record ? edit_record.id : 'new'"
            :record="edit_record" :units="units" :current-language-id="currentLanguageId"
            :default-language-id="defaultLanguageId" @saved="onUnitSaved" @modalClose="hideModal()"></app-edit-record>
    </div>
</template>
<script>

import EditRecord from './Edit';
export default {
    components: {
        'app-edit-record': EditRecord,
    },
    data: function () {
        return {
            fields: [
                { key: 'id', label: __('id'), sortable: true, sortDirection: 'desc' },
                { key: 'name', label: __('name'), sortable: true, class: 'text-center' },
                { key: 'short_code', label: __('short_code'), sortable: true, class: 'text-center' },
                { key: 'parent_id', label: __('parent_id'), class: 'text-center' },
                { key: 'conversion', label: __('conversion'), class: 'text-center' },
                { key: 'actions', label: __('actions'), class: 'text-center' }
            ],
            totalRows: 1,
            currentPage: 1,
            perPage: this.$perPage,
            pageOptions: this.$pageOptions,
            sortBy: '',
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,
            filterOn: [],
            page: 1,

            units: [],
            isLoading: false,
            sectionStyle: 'style_1',
            max_visible_units: 12,
            max_col_in_single_row: 3,
            create_new: null,
            edit_record: null,
            currentLanguageId: null,
            activeLanguages: [],
            defaultLanguageId: null,

        }
    },
    computed: {
        translatedUnits() {
            if (!this.units.length) return this.units;

            return this.units.map(unit => {
                const u = { ...unit };

                if (!Array.isArray(unit.translations)) {
                    return u;
                }

                const currentTranslation = unit.translations.find(
                    t => t.language_id === this.currentLanguageId
                );

                const defaultTranslation = unit.translations.find(
                    t => t.language_id === this.defaultLanguageId
                );

                if (currentTranslation?.name?.trim()) {
                    u.name = currentTranslation.name;
                } else if (defaultTranslation?.name?.trim()) {
                    u.name = defaultTranslation.name;
                }

                if (currentTranslation?.short_code?.trim()) {
                    u.short_code = currentTranslation.short_code;
                } else if (defaultTranslation?.short_code?.trim()) {
                    u.short_code = defaultTranslation.short_code;
                }

                return u;
            });
        }
        ,
        sortOptions() {
            // Create an options list from our fields
            return this.fields
                .filter(f => f.sortable)
                .map(f => {
                    return { text: f.label, value: f.key }
                })
        }
    },
    mounted() {


        // Set the initial number of items
        this.totalRows = this.units.length
    },
    created: function () {
        this.$eventBus.$on('unitSaved', (message) => {
            this.showMessage('success', message);
            this.getUnits();
        });

        this.fetchActiveLanguages().then(() => {
            this.getUnits();
        });
    },
    methods: {
        fetchActiveLanguages() {
            return axios.get(this.$apiUrl + '/active_languages')
                .then(response => {
                    if (Array.isArray(response.data.data)) {
                        this.activeLanguages = response.data.data;

                        const appLocale = window.appLocale || 'en';

                        const currentLang = this.activeLanguages.find(
                            l => l.code === appLocale
                        );

                        const defaultLang = this.activeLanguages.find(
                            l => l.is_default === 1
                        );

                        this.currentLanguageId = currentLang?.id || defaultLang?.id || null;
                        this.defaultLanguageId = defaultLang?.id || null;
                    }
                })
                .catch(err => console.error(err));
        }
        ,

        getUnits() {

            this.isLoading = true;

            axios.get(this.$apiUrl + '/units')
                .then((response) => {

                    this.isLoading = false;

                    let data = response.data;
                    this.units = data.data;
                    this.totalRows = this.units.length;
                })
                .catch(error => {
                    console.error('units API error', error);
                });
        }
        ,
        deleteUnit(index, id) {
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
                    axios.post(this.$apiUrl + '/units/delete', postData)
                        .then((response) => {
                            this.isLoading = false
                            let data = response.data;
                            this.units.splice(index, 1);

                            this.showMessage("success", data.message);
                        });
                }
            });
        },
        addUnitSettings() {
            let postData = {
                add_unit_settings: 1,
                cat_style: this.sectionStyle,
                max_visible_units: this.max_visible_units,
                max_col_in_single_row: this.max_col_in_single_row
            }

            axios.post(this.$apiUrl + '/units/saveUnitSettings', postData)
                .then((response) => {

                    let data = response.data;

                    this.showMessage("success", data.message);
                });
        },

        onUnitSaved(message) {
            this.showMessage(
                'success',
                message || __('unit_saved_successfully')
            );
            this.getUnits();
            this.hideModal();
        },

        hideModal() {
            this.create_new = false
            this.edit_record = false
        },
    }
};
</script>
