<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('brands') }}</h3>
            <button class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap" @click="edit_record=true">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add_brand') }}</span>
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
                        @input="getRecords()"
                    ></b-form-input>
                </div>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getRecords()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                <b-table
                    :items="translatedBrands"
                    :fields="fields"
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
                        <p v-if="row.item.image ===''">{{ __('no_image') }}</p>
                        <img :src="$storageUrl + row.item.image" height="50" v-else />
                    </template>

                    <template #cell(status)="row">
                        <span v-if="row.item.status == 1" class="badge bg-success">{{ __('active') }}</span>
                        <span v-else class="badge bg-danger">{{ __('deactive') }}</span>
                    </template>

                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <button class="list-action-btn is-edit" @click="edit_record = row.item" v-b-tooltip.hover :title="__('edit')">
                                <i class="fa fa-pencil-alt"></i>
                            </button>
                            <button class="list-action-btn is-delete" @click="deleteRecord(row.index, row.item.id)" v-b-tooltip.hover :title="__('delete')">
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
                ></b-pagination>
            </div>
        </div>

        <!-- Add / Edit -->
        <app-edit-record
            v-if="edit_record"
            :record="edit_record"
            @modalClose="edit_record = null"
            @saved="onBrandSaved"
        ></app-edit-record>
    </div>
</template>

<script>
import { VuejsDatatableFactory } from 'vuejs-datatable';
import EditRecord from './Edit.vue';

export default {
    components: {
        VuejsDatatableFactory,
        'app-edit-record': EditRecord,
    },
    data() {
        return {
            fields: [
                { key: 'id', label: __('id'), class: 'text-center', sortable: true, sortDirection: 'desc' },
                { key: 'name', label: __('name'), class: 'text-center' },
                { key: 'image', label: __('image'), class: 'text-center' },
                { key: 'status', label: __('status'), class: 'text-center', formatter: (value) => {
                    return value == 1 ? __('active') : __('deactive');
                }},
                { key: 'actions', label: __('actions') }
            ],
            totalRows: 0,
            currentPage: 1,
            perPage: this.$perPage || 10,
            pageOptions: this.$pageOptions || [5, 10, 15, 20],
            sortBy: '',
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,
            filterOn: ['id', 'name', 'status'],
            isLoading: false,
            brands: [],
            edit_record: null,
             currentLanguageId: null,
            activeLanguages: []
            
        }
    },

    computed: {
    translatedBrands() {
        if (!this.currentLanguageId || this.brands.length === 0) {
            return this.brands;
        }

        return this.brands.map(brand => {
            const translatedBrand = { ...brand };

            if (brand.translations && Array.isArray(brand.translations)) {
               const translation = brand.translations.find(
    t => Number(t.language_id) === Number(this.currentLanguageId)
);
if (translation && translation.name && translation.name.trim() !== '') {
                    translatedBrand.name = translation.name;
                }
            }

            return translatedBrand;
        });
    }
}
,
    created()  {
    this.fetchActiveLanguages().then(() => {
        this.getRecords();
    });
},
    watch: {
         currentPage() {
            this.getRecords();
        },
        perPage() {
            this.getRecords();
        }
    },
    methods: {


        fetchActiveLanguages() {
            console.log("data fetch");
            
    return axios.get(this.$apiUrl + '/active_languages')
        .then(response => {
            this.activeLanguages = response.data.data || [];

            const appLocale = window.appLocale || 'en';

            const currentLanguage = this.activeLanguages.find(
                lang => lang.code === appLocale
            );

            if (currentLanguage) {
                this.currentLanguageId = currentLanguage.id;
            } else {
                const defaultLang = this.activeLanguages.find(l => l.is_default === 1);
                if (defaultLang) {
                    this.currentLanguageId = defaultLang.id;
                }
            }

            console.log('Languages:', this.activeLanguages);
console.log('Current language ID:', this.currentLanguageId);

        });
},

        getRecords() {
            
            this.isLoading = true;
            axios.get(this.$apiUrl + '/products/brands', {
                params: {
                    page: this.currentPage,
                    per_page: this.perPage,
                    filter: this.filter
                }
            }).then((response) => {
                this.isLoading = false;
                const data = response.data;
                this.brands = data.data;
                this.totalRows = data.total;
           
            }).catch(() => {
                this.isLoading = false;
            });
        },
        onBrandSaved(message) {
            this.showMessage('success', message);
            this.getRecords();
            this.edit_record = null;
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
                    this.isLoading = true;
                    axios.post(this.$apiUrl + '/products/brands/delete', { id })
                        .then((response) => {
                            this.isLoading = false;
                            this.brands.splice(index, 1);
                            this.showMessage('success', response.data.message);
                        }).catch(() => {
                            this.isLoading = false;
                        });
                }
            });
        },
    }
};
</script>