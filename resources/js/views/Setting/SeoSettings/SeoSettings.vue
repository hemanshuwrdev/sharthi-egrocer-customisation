<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('seo_settings') }}</h3>
            <button class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap"
                @click="create_new=true" v-b-tooltip.hover :title="__('add_seo_page')" v-if="$can('category_create')">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add') }}</span>
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
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getSeoSettings()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                            <b-table
                                :items="translatedSeoSettings"
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
                                small>

                                <template #table-busy>
                                    <div class="text-center text-black my-2">
                                        <b-spinner class="align-middle"></b-spinner>
                                        <strong>{{ __('loading') }}...</strong>
                                    </div>
                                </template>

                                <template #cell(schema_markup)="row">
                                    <div v-if="shouldTruncate(row.item.schema_markup)">
                                        <span v-if="!expandedSchema[row.item.id]">
                                            {{ getTruncatedText(row.item.schema_markup) }}
                                            <a href="#" @click.prevent="toggleSchemaExpansion(row.item.id)" class="text-info">View More</a>
                                        </span>
                                        <span v-else>
                                            {{ row.item.schema_markup }}
                                            <a href="#" @click.prevent="toggleSchemaExpansion(row.item.id)" class="text-info">View Less</a>
                                        </span>
                                    </div>
                                    <span v-else>{{ row.item.schema_markup }}</span>
                                </template>

                                <template #cell(meta_description)="row">
                                    <div v-if="shouldTruncate(row.item.meta_description)">
                                        <span v-if="!expandedMeta[row.item.id]">
                                            {{ getTruncatedText(row.item.meta_description) }}
                                            <a href="#" @click.prevent="toggleMetaExpansion(row.item.id)" class="text-info">View More</a>
                                        </span>
                                        <span v-else>
                                            {{ row.item.meta_description }}
                                            <a href="#" @click.prevent="toggleMetaExpansion(row.item.id)" class="text-info">View Less</a>
                                        </span>
                                    </div>
                                    <span v-else>{{ row.item.meta_description }}</span>
                                </template>

                                <template #cell(og_image)="row">
                                    <img :src="row.item.og_image_url" height="50" />
                                </template>
                               
                                <template #cell(actions)="row">
                                    <div class="list-actions">
                                        <button class="list-action-btn is-edit" @click="edit_record = row.item" v-if="$can('category_update')" v-b-tooltip.hover :title="__('edit')"><i class="fa fa-pencil-alt"></i></button>
                                        <button class="list-action-btn is-delete" @click="deleteSeoSettings(row.index,row.item.id)" v-if="$can('category_delete')" v-b-tooltip.hover :title="__('delete')"><i class="fa fa-trash"></i></button>
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
                    @change="getSeoSettings"
                ></b-pagination>
            </div>
        </div>

        <!-- Add / Edit -->
        <app-edit-record
            v-if="create_new || edit_record"
            :record="edit_record"
            @modalClose="hideModal()"
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
                { key: 'page_type', label: __('page_type'), class: 'text-center', sortable: true, sortDirection: 'desc' },
                { key: 'meta_title', label: __('meta_title'), class: 'text-center', sortable: true },
                { key: 'meta_keyword', label: __('meta_keywords'), class: 'text-center', sortable: true },
                { key: 'schema_markup', label: __('schema_markup'),  class: 'text-center' },
                { key: 'meta_description', label: __('meta_description'),  class: 'text-center' },
                 { key: 'og_image', label: __('og_image'),  class: 'text-center' },
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

            seo_settings: [],
            isLoading: false,
            sectionStyle : 'style_1',
          
            create_new : null,
            edit_record : null,
            settingModalShow:false,
            
            // View more functionality data
            expandedSchema: {},
            expandedMeta: {},
            maxLength: 100,     
    activeLanguages: [],
    currentLanguageId: null,
        }
    },
    computed: {
      
    translatedSeoSettings() {
        if (!this.currentLanguageId) return this.seo_settings;

        return this.seo_settings.map(item => {
            const translated = { ...item };

            if (item.translations && Array.isArray(item.translations)) {
                const t = item.translations.find(
                    tr => tr.language_id === this.currentLanguageId
                );

                if (t) {
                    translated.meta_title =
                        t.meta_title?.trim() !== '' ? t.meta_title : item.meta_title;

                    translated.meta_keyword =
                        t.meta_keyword?.trim() !== '' ? t.meta_keyword : item.meta_keyword;

                    translated.schema_markup =
                        t.schema_markup?.trim() !== '' ? t.schema_markup : item.schema_markup;

                    translated.meta_description =
                        t.meta_description?.trim() !== '' ? t.meta_description : item.meta_description;
                }
            }

            return translated;
        });
    },

        sortOptions() {
            // Create an options list from our fields
            return this.fields
                .filter(f => f.sortable)
                .map(f => {
                    return { text: f.label, value: f.key }
                })
        },
        
    },
    mounted() {
       
    },
    watch: {
        $route(to, from) {
            this.showCreateModal();
        },
        currentPage(newPage) {
            this.getSeoSettings();
        },
        perPage(newPerPage) {
            this.getSeoSettings();
        }
    },
    created: function() {
        this.$eventBus.$on('SeoSettingSaved', (message) => {
        this.showMessage('success', message);
        this.getSeoSettings();
        this.create_new = null;
    });

    this.fetchActiveLanguages().then(() => {
        this.getSeoSettings();
    });
},
    methods: {
        fetchActiveLanguages() {
    return axios.get(this.$apiUrl + '/active_languages')
        .then(response => {
            if (response.data.data && Array.isArray(response.data.data)) {
                this.activeLanguages = response.data.data;

                const appLocale = window.appLocale || 'en';

                let currentLang = this.activeLanguages.find(
                    l => l.code === appLocale
                );

                if (!currentLang) {
                    currentLang = this.activeLanguages.find(
                        l => l.is_default === 1
                    );
                }

                this.currentLanguageId = currentLang ? currentLang.id : null;
            }
        });
},


        getSeoSettings(){

            this.isLoading = true
            const params = {
                offset: this.currentPage,
                limit: this.perPage,
                filter: this.filter
            };
            axios.get(this.$apiUrl + '/seo_settings', { params }) 
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    this.seo_settings = data.data;
                    this.totalRows = data.total
                });
        },
        

        deleteSeoSettings(index, id){
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
                    axios.post(this.$apiUrl + '/seo_settings/delete',postData)
                        .then((response) => {
                            this.isLoading = false
                            let data = response.data;
                            this.seo_settings.splice(index, 1)
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
             this.getSeoSettings();
        },
        
        // View more functionality methods
        toggleSchemaExpansion(id) {
            this.$set(this.expandedSchema, id, !this.expandedSchema[id]);
        },
        
        toggleMetaExpansion(id) {
            this.$set(this.expandedMeta, id, !this.expandedMeta[id]);
        },
        
        shouldTruncate(text) {
            return text && text.length > this.maxLength;
        },
        
        getTruncatedText(text) {
            if (!text) return '';
            return text.length > this.maxLength ? text.substring(0, this.maxLength) + '...' : text;
        },
    }
};
</script>
