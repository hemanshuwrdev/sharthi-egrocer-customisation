<template>

    <div class="list-page">

        <div class="page-head">
            <h3 class="page-head-title">{{ __('home_slider_images') }}</h3>
            <button class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap"
                @click="create_new=true" v-if="$can('home_slider_image_create')">
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
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getSliders()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>
            <div class="table-responsive">
            <b-table
                :items="translatedSliders"
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


                <template #cell(image)="row">
                    <img :src="row.item.image_url" height="50"/>
                </template>
                <template #cell(type_name)="row">
                    {{ getTranslatedTypeName(row.item) }}
                </template>
                <template #cell(status)="row">
                    <span v-if="row.item.status === 1" class="badge bg-success">{{ __('active') }}</span>
                    <span v-else class="badge bg-danger">{{ __('deactive') }}</span>
                </template>

                <template #cell(actions)="row">
                    <div class="list-actions">
                        <button class="list-action-btn is-edit" @click="edit_record = row.item" v-if="$can('home_slider_image_update')" v-b-tooltip.hover :title="__('edit')"><i class="fa fa-pencil-alt"></i></button>
                        <button class="list-action-btn is-delete" @click="deleteSlider(row.index,row.item.id)" v-if="$can('home_slider_image_delete')" v-b-tooltip.hover :title="__('delete')"><i class="fa fa-trash"></i></button>
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
            v-if="create_new || edit_record"
            :record="edit_record"
            :categories="translatedCategories"
            :products="translatedProducts"
            @modalClose="hideModal()"
        ></app-edit-record>
    </div>

</template>
<script>
import {VuejsDatatableFactory} from 'vuejs-datatable';
import EditRecord from './Edit.vue';
import axios from "axios";


export default {
    components: {
        VuejsDatatableFactory,
        'app-edit-record': EditRecord,
    },
    data: function () {
        return {
            create_new: false,
            fields: [
                {key: 'id', label: __('id'), sortable: true, sortDirection: 'desc'},
                {key: 'type', label: __('type'), sortable: true, class: 'text-center'},
                {key: 'type_name', label: __('name'), sortable: true, class: 'text-center'},
                {key: 'image', label: __('image'), class: 'text-center'},
                {key: 'status', label: __('status'), class: 'text-center'},
                {key: 'actions', label: __('actions'), class: 'text-center' }
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

            sliders: [],
            isLoading: false,
            sectionStyle: 'style_1',
            max_visible_sliders: 12,
            max_col_in_single_row: 3,
            edit_record: null,
            categories: [],
            products: [],
            // Language handling for translations
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
                    return {text: f.label, value: f.key}
                })
        },
        // Computed property to translate products for dropdown
        translatedProducts: function() {
            if (!this.products || !Array.isArray(this.products) || this.products.length === 0 || !this.currentLanguageId) {
                return this.products || [];
            }

            // Get default language ID for fallback
            const defaultLanguage = this.activeLanguages.find(lang => lang.is_default === 1);
            const defaultLanguageId = defaultLanguage ? defaultLanguage.id : null;

            return this.products.map(product => {
                const translatedProduct = { ...product };
                let translatedName = product.name; // Fallback to main table name

                if (product.translations && Array.isArray(product.translations)) {
                    // First try to find translation for current language
                    let translation = product.translations.find(
                        t => t.language_id === this.currentLanguageId
                    );

                    // If not found, try default language
                    if (!translation && defaultLanguageId) {
                        translation = product.translations.find(
                            t => t.language_id === defaultLanguageId
                        );
                    }

                    // Use translation name if available and not empty
                    if (translation && translation.name && translation.name.trim() !== '') {
                        translatedName = translation.name;
                    }
                }

                translatedProduct.name = translatedName;
                return translatedProduct;
            });
        },
        // Computed property to translate categories for dropdown
        translatedCategories: function() {
            if (!this.categories || !Array.isArray(this.categories) || this.categories.length === 0 || !this.currentLanguageId) {
                return this.categories || [];
            }

            // Get default language ID for fallback
            const defaultLanguage = this.activeLanguages.find(lang => lang.is_default === 1);
            const defaultLanguageId = defaultLanguage ? defaultLanguage.id : null;

            return this.categories.map(category => {
                const translatedCategory = { ...category };
                let translatedName = category.name; // Fallback to main table name

                if (category.translations && Array.isArray(category.translations)) {
                    // First try to find translation for current language
                    let translation = category.translations.find(
                        t => t.language_id === this.currentLanguageId
                    );

                    // If not found, try default language
                    if (!translation && defaultLanguageId) {
                        translation = category.translations.find(
                            t => t.language_id === defaultLanguageId
                        );
                    }

                    // Use translation name if available and not empty
                    if (translation && translation.name && translation.name.trim() !== '') {
                        translatedName = translation.name;
                    }
                }

                translatedCategory.name = translatedName;
                return translatedCategory;
            });
        },
        // Computed property to translate sliders for datatable
        translatedSliders: function() {
            if (!this.currentLanguageId || this.sliders.length === 0) {
                return this.sliders;
            }

            return this.sliders.map(slider => {
                const translatedSlider = { ...slider };
                // Update type_name using our translation method
                translatedSlider.type_name = this.getTranslatedTypeName(slider);
                return translatedSlider;
            });
        },
    },
    mounted() {
        // Set the initial number of items
        this.totalRows = this.sliders.length
    },
    watch: {
        $route(to, from) {
            this.showCreateModal();
        }
    },
    created: function () {
        this.showCreateModal();
        this.$eventBus.$on('SliderSaved', (message) => {
            this.showMessage('success', message);
            this.getSliders();
        });
        // Load languages first so we know currentLanguageId before mapping translations
        this.fetchActiveLanguages().then(() => {
            this.getSliders();
            this.getCategories();
            this.getProducts();
        }).catch(() => {
            this.getSliders();
            this.getCategories();
            this.getProducts();
        });
    },
    methods: {
        // Fetch active languages and set current language ID
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
        // Get translated type name (product or category name) with fallback logic
        getTranslatedTypeName(slider) {
            // If no language is set yet, return the base name
            if (!this.currentLanguageId || !this.activeLanguages.length) {
                return slider.type_name || '';
            }

            // Get default language ID for fallback
            const defaultLanguage = this.activeLanguages.find(lang => lang.is_default === 1);
            const defaultLanguageId = defaultLanguage ? defaultLanguage.id : null;

            // Handle product type
            if (slider.type === 'product' && slider.product) {
                // Check if translations array exists
                if (slider.product.translations && Array.isArray(slider.product.translations) && slider.product.translations.length > 0) {
                    // First try to find translation for current language
                    let translation = slider.product.translations.find(
                        t => t.language_id === this.currentLanguageId
                    );

                    // If not found, try default language
                    if (!translation && defaultLanguageId) {
                        translation = slider.product.translations.find(
                            t => t.language_id === defaultLanguageId
                        );
                    }

                    // Use translation name if available and not empty
                    if (translation && translation.name && translation.name.trim() !== '') {
                        return translation.name;
                    }
                }
                // Fallback to product name or type_name
                return slider.product.name || slider.type_name || '';
            } 
            // Handle category type
            else if (slider.type === 'category' && slider.category) {
                // Check if translations array exists
                if (slider.category.translations && Array.isArray(slider.category.translations) && slider.category.translations.length > 0) {
                    // First try to find translation for current language
                    let translation = slider.category.translations.find(
                        t => t.language_id === this.currentLanguageId
                    );

                    // If not found, try default language
                    if (!translation && defaultLanguageId) {
                        translation = slider.category.translations.find(
                            t => t.language_id === defaultLanguageId
                        );
                    }

                    // Use translation name if available and not empty
                    if (translation && translation.name && translation.name.trim() !== '') {
                        return translation.name;
                    }
                }
                // Fallback to category name or type_name
                return slider.category.name || slider.type_name || '';
            }

            // Fallback to type_name for other types (slider_url, etc.)
            return slider.type_name || '';
        },
        getSliders() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/home_slider_images')
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    // Ensure sliders have proper structure with translations
                    this.sliders = (data.data || []).map(slider => {
                        // Ensure product and category objects exist and have translations
                        if (slider.product && !slider.product.translations) {
                            slider.product.translations = [];
                        }
                        if (slider.category && !slider.category.translations) {
                            slider.category.translations = [];
                        }
                        return slider;
                    });
                    this.totalRows = this.sliders.length
                });
        },
        getCategories() {
            this.isLoading = true
            let url = this.$apiUrl + '/categories?status=1';
            axios.get(url)
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    this.categories = data.data || []
                });
        },
        getProducts() {
            this.isLoading = true
            let url = this.$apiUrl + '/products';
            axios.get(url)
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    this.products = data.data.products || []
                });
        },
        deleteSlider(index, id) {
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
                    axios.post(this.$apiUrl + '/home_slider_images/delete', postData)
                        .then((response) => {
                            this.isLoading = false
                            let data = response.data;
                            this.sliders.splice(index, 1)
                            this.showMessage("success", data.message);
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
            this.$router.push({path: '/home_sliders'});
        },

    }
};
</script>
