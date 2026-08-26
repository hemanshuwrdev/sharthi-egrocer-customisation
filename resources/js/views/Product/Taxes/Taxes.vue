<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('taxes') }}</h3>
            <button class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap" @click="edit_record=true">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add_tax') }}</span>
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
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getRecords()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                <b-table
                    :items="translatedTaxes"
                    :fields="fields"
                    :current-page="currentPage"
                    :per-page="perPage"
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

                    <template #cell(id)="row">
                        {{ row.item.id }}
                    </template>

                    <template #cell(image)="row">
                        <p v-if="row.item.image ===''">No Image</p>
                        <img :src="$storageUrl + row.item.image" height="50" v-else/>
                    </template>

                    <template #cell(status)="row">
                        <span v-if="row.item.status == 1" class="badge bg-success">{{ __('active') }}</span>
                        <span v-else class="badge bg-danger">{{ __('deactive') }}</span>
                    </template>

                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <button class="list-action-btn is-edit" @click="edit_record = row.item" v-b-tooltip.hover :title="__('edit')"><i class="fa fa-pencil-alt"></i></button>
                            <button class="list-action-btn is-delete" @click="deleteRecord(row.index,row.item.id)" v-b-tooltip.hover :title="__('delete')"><i class="fa fa-trash"></i></button>
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
                ></b-pagination>
            </div>
        </div>

        <!-- Add / Edit -->
        <app-edit-record
            v-if="edit_record"
            :record="edit_record" 
            @modalClose="edit_record = null"
        ></app-edit-record>
    </div>

</template>
<script>
import { VuejsDatatableFactory } from 'vuejs-datatable';
import EditRecord from './Edit.vue';


export default {
    components: {
            VuejsDatatableFactory,
            'app-edit-record' : EditRecord,
    },
    data: function() {
        return {
            fields: [
                { key: 'id', label: __('id'), class: 'text-center', sortable: true, sortDirection: 'desc' },
                { key: 'title', label: __('title'),  class: 'text-center' },
                { key: 'percentage', label: __('percentage'),  class: 'text-center' },
                { key: 'status', label: __('status'),  class: 'text-center' },
                { key: 'actions', label: __('actions') }
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

            sectionStyle : 'style_1',
            max_visible_units : 12,
            max_col_in_single_row : 3,

            taxes: [],
            isLoading: false,
            create_new : null,
            edit_record : null,
                        settingModalShow:false,
            currentLanguageId: null,
            activeLanguages: []

        }
    },
    computed: {
    translatedTaxes() {
        if (!this.currentLanguageId || this.taxes.length === 0) {
            return this.taxes;
        }

        return this.taxes.map(tax => {
            const translatedTax = { ...tax };

            if (tax.translations && Array.isArray(tax.translations)) {
                const translation = tax.translations.find(
                    t => t.language_id === this.currentLanguageId
                );

                if (translation && translation.title && translation.title.trim() !== '') {
                    translatedTax.title = translation.title;
                }
            }

            return translatedTax;
        });
    }
}
,   
    created: function() {
        this._recordSavedHandler = (message) => {
            this.showMessage('success', message);
            this.getRecords();
        };
        this.$eventBus.$on('recordSaved', this._recordSavedHandler);

        this.fetchActiveLanguages().then(() => {
            this.getRecords();
        });
    },
    beforeDestroy: function() {
        this.$eventBus.$off('recordSaved', this._recordSavedHandler);
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

        getRecords(){
            this.isLoading = true
            axios.get(this.$apiUrl + '/products/taxes')
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    this.taxes = data.data;
                    this.totalRows = this.taxes.length
                });
        },
        deleteRecord(index, id){
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
                    axios.post(this.$apiUrl + '/products/taxes/delete',postData)
                        .then((response) => {
                            this.isLoading = false
                            let data = response.data;
                            this.taxes.splice(index, 1)
                            //this.showSuccess(data.message);
                            this.showMessage('success', data.message);
                        });
                }
            });
        },
    }
};
</script>
