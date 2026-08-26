<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('categories') }}</h3>
            <button class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap"
                @click="create_new=true" v-if="$can('category_create')">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add_category') }}</span>
            </button>
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
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getCategories()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                <b-table
                    :items="translatedCategories"
                    :fields="fields"
                    :filter="filter"
                    :filter-included-fields="filterOn"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :sort-direction="sortDirection"
                    :bordered="true"
                    :busy="isLoading"
                    stacked="md"
                    show-empty
                    small
                    :empty-text="__('no_records_to_show')"
                    :empty-filtered-text="__('no_records_to_show')">

                    <template #table-busy>
                        <div class="text-center text-black my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>{{ __('loading') }}...</strong>
                        </div>
                    </template>

                    <template #cell(image)="row">
                        <img :src="row.item.image_url" height="50" />
                    </template>
                    <template #cell(status)="row">
                        <span class='badge bg-success' v-if="row.item.status == 1">{{ __('activate') }}</span>
                        <span class='badge bg-danger' v-if="row.item.status == 0">{{ __('deactivate') }}</span>
                    </template>
                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <button class="list-action-btn is-edit" @click="edit_record = row.item" v-if="$can('category_update')" v-b-tooltip.hover :title="__('edit')"><i class="fa fa-pencil-alt"></i></button>
                            <button class="list-action-btn is-delete" @click="deleteCategory(row.index,row.item.id)" v-if="$can('category_delete')" v-b-tooltip.hover :title="__('delete')"><i class="fa fa-trash"></i></button>
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
                    @change="getCategories"
                ></b-pagination>
            </div>
        </div>

        <!-- Add / Edit -->
        <app-edit-record
            v-if="create_new || edit_record"
            :record="edit_record"
            @modalClose="hideModal()"
            @saved="onCategorySaved"
        ></app-edit-record>
    </div>

</template>
<script>

import EditRecord from './Edit.vue';
export default {
    components: {
        'app-edit-record' : EditRecord,
    },
    data: function() {
        return {
            fields: [
                { key: 'id', label: __('id'), class: 'text-center', sortable: true, sortDirection: 'asc' },
                { key: 'parent_id', label: __('parent_id'), class: 'text-center', sortable: true, sortDirection: 'desc' },
                { key: 'name', label: __('name'), class: 'text-center', sortable: true },
                { key: 'subtitle', label: __('subtitle'), class: 'text-center', sortable: true },
                { key: 'image', label: __('image'),  class: 'text-center' },
                { key: 'status', label: __('status'),  class: 'text-center' },
                { key: 'actions', label: __('actions'), class: 'text-center'}
            ],
            totalRows: 1,
            currentPage: 1,
            perPage: this.$perPage,
            pageOptions: this.$pageOptions,
            sortBy: 'id',
            sortDesc: true,
            sortDirection: 'asc',
            filter: null,
            filterOn: [],
            page: 1,

            categories: [],
            isLoading: false,
            sectionStyle : 'style_1',
            max_visible_categories : 12,
            max_col_in_single_row : 3,
            create_new : null,
            edit_record : null,
            settingModalShow:false,
            currentLanguageId: null,
            activeLanguages: []
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
        filteredCategories: function() {
            const list = Array.isArray(this.categories) ? this.categories : [];
            const query = this.filter ? this.filter.toLowerCase() : '';
            return list.filter(category => {
                const name = (category.name || '').toString().toLowerCase();
                const subtitle = (category.subtitle || '').toString().toLowerCase();
                return name.includes(query) || subtitle.includes(query);
            });
        },
        // Computed property to transform categories with translated fields based on current app_locale
        translatedCategories: function() {
            // Guard: ensure categories is an array to avoid "Cannot read properties of undefined (reading 'length')"
            const list = Array.isArray(this.categories) ? this.categories : [];
            if (!this.currentLanguageId || list.length === 0) {
                return list;
            }

            // Transform each category to use translated fields
            return list.map(category => {
                const translatedCategory = { ...category };

                if (category.translations && Array.isArray(category.translations)) {
                    const translation = category.translations.find(
                        t => t.language_id === this.currentLanguageId
                    );

                    // Use translated name if available and not empty, otherwise fallback to main table name
                    if (translation && translation.name && translation.name.trim() !== '') {
                        translatedCategory.name = translation.name;
                    }

                    // Use translated subtitle if available and not empty, otherwise fallback to main table subtitle
                    if (translation && translation.subtitle && translation.subtitle.trim() !== '') {
                        translatedCategory.subtitle = translation.subtitle;
                    }
                }
                return translatedCategory;
            });
        },
    },
    mounted() {
    },
    watch: {
        $route(to, from) {
            this.showCreateModal();
        },
        currentPage(newPage) {
            this.getCategories();
        },
        perPage(newPerPage) {
            this.getCategories();
        },
        filter(newFilter, oldFilter) {
            this.currentPage = 1;
            this.getCategories();
        }
    },
    created: function() {
        this.showCreateModal();
        this.fetchActiveLanguages().then(() => {
            this.getCategories();
        });
    },
    methods: {
        fetchActiveLanguages() {
            return axios.get(this.$apiUrl + '/active_languages')
                .then(response => {
                    if (response.data.data && Array.isArray(response.data.data)) {
                        this.activeLanguages = response.data.data;
                        
                        const appLocale = window.appLocale || 'en';
                        
                        // Find language ID for current app_locale code
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

        getCategories(){

            this.isLoading = true
            const params = {
                offset: this.currentPage,
                limit: this.perPage,
                filter: this.filter
            };
            axios.get(this.$apiUrl + '/categories', { params })
                .then((response) => {
                    this.isLoading = false;
                    const data = response.data || {};
                    // Always set to array so .length and table empty state work; avoid undefined
                    this.categories = Array.isArray(data.data) ? data.data : [];
                    this.totalRows = typeof data.total === 'number' ? data.total : 0;
                })
                .catch(() => {
                    this.isLoading = false;
                    this.categories = [];
                    this.totalRows = 0;
                });
        },


        deleteCategory(index, id){
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
                        id : id
                    }
                    axios.post(this.$apiUrl + '/categories/delete',postData)
                        .then((response) => {
                            this.isLoading = false
                            let data = response.data;
                            this.categories.splice(index, 1)
                            this.showMessage('success', data.message);
                        });
                }
            });
        },
        showCreateModal(){
            let create = this.$route.params.create;
            if(create){
                this.create_new = true;
            }
        },
        hideModal() {
            this.create_new = false
            this.edit_record = false
            this.$router.push({path: '/manage_categories'});
        },
        // Called when Edit modal saves; show toast once and refresh list
        onCategorySaved(message) {
            this.showMessage('success', message);
            this.getCategories();
            this.create_new = null;
        },
    }
};
</script>
