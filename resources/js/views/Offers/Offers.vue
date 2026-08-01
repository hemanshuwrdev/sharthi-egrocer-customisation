<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('new_offers_for_customers') }} </h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><router-link to="/dashboard">{{ __('dashboard') }}</router-link></li>
                                <li class="breadcrumb-item active" aria-current="page">{{ __('new_offers_for_customers') }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <section class="section">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title"> {{ __('new_offer_section') }}</h4>
                        <span class="pull-right">
                            <button class="btn btn-primary"  @click="create_new=true" v-if="$can('new_offer_image_create')"> {{ __('add_offer') }}</button>
                        </span>
                    </div>
                    <div class="card-body">

                        <b-row class="mb-2">
                            <b-col md="3" offset-md="8">
                                <h6 class="box-title">{{ __('search') }}</h6>
                                <b-form-input
                                    id="filter-input"
                                    v-model="filter"
                                    type="search"
                                    :placeholder="__('search')"
                                ></b-form-input>
                            </b-col>
                            <b-col md="1" class="text-center">
                                <button class="btn btn-primary btn_refresh" v-b-tooltip.hover :title="__('refresh')" @click="getOffers()">
                                    <i class="fa fa-refresh" aria-hidden="true"></i>
                                </button>
                            </b-col>
                        </b-row>
                        <b-table
                            :items="translatedOffers"
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
                            <template #cell(type)="row">
                                <p v-if="row.item.type ==='default'"> {{ __('default') }}</p>
                                <p v-if="row.item.type ==='category'"> {{ __('category') }}</p>
                                <p v-if="row.item.type ==='product'"> {{ __('product') }}</p>
                                <p v-if="row.item.type ==='offer_url'"> {{ __('offer_url') }}</p>
                            </template>
                            <template #cell(type_name)="row">
                                <a v-if="row.item.type ==='offer_url'" :href="row.item.offer_url" target="_blank" >LINK</a>
                                <p v-else> {{ getTranslatedTypeName(row.item) }}</p>
                            </template>
                            <template #cell(position)="row">
                                <p v-if="row.item.position ==='below_slider'"> {{ __('below_slider') }}</p>
                                <p v-if="row.item.position ==='below_category'"> {{ __('below_category') }}</p>
                                <p v-if="row.item.position ==='below_section'"> {{ __('below_section') }}</p>
                                <p v-if="row.item.position ==='top'"> {{ __('top') }}</p>
                            </template>
                            <template #cell(section_position)="row">
                                <p v-if="row.item.position ==='below_section'">{{ row.item.section_title }}</p>
                                <p v-else>-</p>
                            </template>
                            <template #cell(image)="row">
                                <p v-if="!row.item.image_url"> {{ __('no_image') }}</p>
                                <img :src="row.item.image_url" height="50" v-else class="img-thumbnail shadow-sm"/>
                            </template>

                            <template #cell(actions)="row">
                                <button class="btn btn-sm btn-primary" @click="edit_record = row.item" v-if="$can('home_slider_image_update')" v-b-tooltip.hover :title="__('edit')"><i class="fa fa-pencil-alt"></i></button>
                                <button class="btn btn-sm btn-danger" @click="deleteOffer(row.index,row.item.id)" v-if="$can('new_offer_image_delete')" v-b-tooltip.hover :title="__('delete')"><i class="fa fa-trash"></i></button>
                                <button class="btn btn-sm btn-primary" @click="toggleRowDetails(row)">
                                    <i v-if="row.detailsShowing" class="fa fa-eye-slash"></i>
                                    <i v-else class="fa fa-eye" v-b-tooltip.hover :title="__('view')"></i>
                                </button>
                            </template>

                            <template #row-details="row">
                                <b-card no-body class="p-4 bg-white shadow-sm">
                                    <div class="d-flex align-items-center mb-3">
                                        <h5 class="text-primary mb-0 me-3"><i class="fa fa-info-circle me-1"></i> {{ __('information') }}</h5>
                                        <div class="h-line flex-grow-1 bg-light" style="height: 1px;"></div>
                                    </div>
                                    
                                    <div class="row g-4">
                                        <!-- Column 1 -->
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label class="text-muted small text-uppercase fw-bold d-block">{{ __('id') }}</label>
                                                <span class="fs-6">#{{ row.item.id }}</span>
                                            </div>
                                            <div class="mb-3">
                                                <label class="text-muted small text-uppercase fw-bold d-block">{{ __('type') }}</label>
                                                <span class="fs-6">{{ row.item.type }}</span>
                                            </div>
                                            <div class="mb-0">
                                                <label class="text-muted small text-uppercase fw-bold d-block">{{ __('type_id') }}</label>
                                                <span class="fs-6">{{ row.item.type_id }}</span>
                                            </div>
                                        </div>

                                        <!-- Column 2 -->
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label class="text-muted small text-uppercase fw-bold d-block">{{ __('name') }}</label>
                                                <span class="fs-6">{{ row.item.type_name && row.item.type_name.trim() !== '' ? row.item.type_name : '-' }}</span>
                                            </div>
                                            <div class="mb-3">
                                                <label class="text-muted small text-uppercase fw-bold d-block">{{ __('slug') }}</label>
                                                <span class="fs-6">{{ row.item.type_slug && row.item.type_slug.trim() !== '' ? row.item.type_slug : '-' }}</span>
                                            </div>
                                            <div class="mb-0" v-if="row.item.offer_url">
                                                <label class="text-muted small text-uppercase fw-bold d-block">URL</label>
                                                <a :href="row.item.offer_url" target="_blank" class="text-break">{{ row.item.offer_url }}</a>
                                            </div>
                                        </div>

                                        <!-- Column 3 -->
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label class="text-muted small text-uppercase fw-bold d-block">{{ __('position') }}</label>
                                                <span class="fs-6">{{ getPositionLabel(row.item.position) }}</span>
                                            </div>
                                            <div class="mb-3">
                                                <label class="text-muted small text-uppercase fw-bold d-block">{{ __('section_position') }}</label>
                                                <span class="fs-6">{{ row.item.section_position }}</span>
                                            </div>
                                            <div class="mb-0" v-if="row.item.section_title">
                                                <label class="text-muted small text-uppercase fw-bold d-block">{{ __('section_title') }}</label>
                                                <span class="fs-6">{{ row.item.section_title }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mt-4 pt-3 border-top" v-if="row.item.image_url">
                                        <label class="text-muted small text-uppercase fw-bold d-block mb-2">{{ __('image_preview') }}</label>
                                        <img :src="row.item.image_url" class="img-fluid rounded border shadow-sm" style="max-height: 250px;" @error="handleImageError">
                                    </div>
                                </b-card>
                            </template>


                        </b-table>
                        <b-row>
                            <b-col  md="2" class="my-1">
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
                            </b-col>
                            <b-col  md="4" class="my-1" offset-md="6">
                                <b-pagination
                                    v-model="currentPage"
                                    :total-rows="totalRows"
                                    :per-page="perPage"
                                    align="fill"
                                    size="sm"
                                    class="my-0"
                                ></b-pagination>
                            </b-col>
                        </b-row>

                    </div>
                </div>
            </section>
        </div>
        <!-- Add / Edit -->
        <app-edit-record
            v-if="create_new || edit_record"
            :record="edit_record"
            :sections="sections"
            :categories="translatedCategories"
            :products="translatedProducts"
            @modalClose="hideModal()"
        ></app-edit-record>
    </div>
</template>
<script>
import EditRecord from './Edit';
import axios from "axios";
export default {
    components: {
        'app-edit-record' : EditRecord,
    },
    data: function() {
        return {

            fields: [
                { key: 'id', label: __('id'), class: 'text-center', sortable: true, sortDirection: 'desc' },
                {key: 'type', label: __('type'), sortable: true, class: 'text-center'},
                {key: 'type_name', label: __('name'), sortable: true, class: 'text-center'},
                { key: 'image', label:  __('image'),  class: 'text-center' },
                { key: 'position', label:  __('position'),  class: 'text-center' },
                { key: 'section_position', label: __('select_position'),  class: 'text-center' },
                { key: 'actions', label:  __('actions') }
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

            isLoading: false,
            sectionStyle : 'style_1',
            max_visible_units : 12,
            max_col_in_single_row : 3,
            create_new : null,
            edit_record : null,
            offers:[],
            section:[],
            categories: [],
            products: [],
            visibleOfferId: null,
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
                    return { text: f.label, value: f.key }
                })
        },
        // Computed property to translate offers for datatable
        translatedOffers: function() {
            if (!this.currentLanguageId || this.offers.length === 0) {
                return this.offers;
            }

            return this.offers.map(offer => {
                const translatedOffer = { ...offer };
                // Update type_name using our translation method
                translatedOffer.type_name = this.getTranslatedTypeName(offer);
                // Unified accordion status
                translatedOffer._showDetails = (offer.id === this.visibleOfferId);
                return translatedOffer;
            });
        },
        // Computed property to translate products for dropdown
        translatedProducts: function() {
            if (!this.currentLanguageId || this.products.length === 0) {
                return this.products;
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
            if (!this.currentLanguageId || this.categories.length === 0) {
                return this.categories;
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
    },
    mounted() {
        // Set the initial number of items
        this.totalRows = this.offers.length
    },
    watch: {
        $route(to, from) {
            this.showCreateModal();
        }
    },
    created: function() {
        this.showCreateModal();
        this.$eventBus.$on('offerSaved', (message) => {
            this.showMessage("success", message);
            this.getOffers();
            this.create_new = null;
        });
        // Load languages first so we know currentLanguageId before mapping translations
        this.fetchActiveLanguages().then(() => {
            this.getOffers();
            this.getCategories();
            this.getProducts();
        }).catch(() => {
            this.getOffers();
            this.getCategories();
            this.getProducts();
        });
    },
    methods: {
        getPositionLabel(position) {
            const labels = {
                below_slider: __('below_slider'),
                below_category: __('below_category'),
                below_section: __('below_section'),
                top: __('top'),
            };
            return labels[position] || position;
        },
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
        getTranslatedTypeName(offer) {
            // If no language is set yet, return the base name
            if (!this.currentLanguageId || !this.activeLanguages.length) {
                return offer.type_name || '';
            }

            // Get default language ID for fallback
            const defaultLanguage = this.activeLanguages.find(lang => lang.is_default === 1);
            const defaultLanguageId = defaultLanguage ? defaultLanguage.id : null;

            // Handle product type
            if (offer.type === 'product' && offer.product) {
                // Check if translations array exists
                if (offer.product.translations && Array.isArray(offer.product.translations) && offer.product.translations.length > 0) {
                    // First try to find translation for current language
                    let translation = offer.product.translations.find(
                        t => t.language_id === this.currentLanguageId
                    );

                    // If not found, try default language
                    if (!translation && defaultLanguageId) {
                        translation = offer.product.translations.find(
                            t => t.language_id === defaultLanguageId
                        );
                    }

                    // Use translation name if available and not empty
                    if (translation && translation.name && translation.name.trim() !== '') {
                        return translation.name;
                    }
                }
                // Fallback to product name or type_name
                return offer.product.name || offer.type_name || '';
            } 
            // Handle category type
            else if (offer.type === 'category' && offer.category) {
                // Check if translations array exists
                if (offer.category.translations && Array.isArray(offer.category.translations) && offer.category.translations.length > 0) {
                    // First try to find translation for current language
                    let translation = offer.category.translations.find(
                        t => t.language_id === this.currentLanguageId
                    );

                    // If not found, try default language
                    if (!translation && defaultLanguageId) {
                        translation = offer.category.translations.find(
                            t => t.language_id === defaultLanguageId
                        );
                    }

                    // Use translation name if available and not empty
                    if (translation && translation.name && translation.name.trim() !== '') {
                        return translation.name;
                    }
                }
                // Fallback to category name or type_name
                return offer.category.name || offer.type_name || '';
            }

            // Fallback to type_name for other types (offer_url, default, etc.)
            return offer.type_name || '';
        },
        getOffers(){
            this.isLoading = true
            axios.get(this.$apiUrl + '/offers')
                .then((response) => {
                    this.isLoading = false
                    // Ensure offers have proper structure with translations
                    this.offers = (response.data.data.offers || []).map(offer => {
                        // Ensure product and category objects exist and have translations
                        if (offer.product && !offer.product.translations) {
                            offer.product.translations = [];
                        }
                        if (offer.category && !offer.category.translations) {
                            offer.category.translations = [];
                        }
                        return offer;
                    });
                    this.sections = response.data.data.sections;
                    this.totalRows = this.offers.length
                });
        },
        getCategories() {
            this.isLoading = true
            let url = this.$apiUrl + '/categories?status=1';
            axios.get(url)
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    this.categories = data.data
                });
        },
        getProducts() {

            this.isLoading = true
            let url = this.$apiUrl + '/products';
            axios.get(url)
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    this.products = data.data.products
                });
        },
        deleteOffer(index, id){
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
                    axios.post(this.$apiUrl + '/offers/delete',postData)
                        .then((response) => {
                            this.isLoading = false
                            this.offers.splice(index, 1)
                            this.showMessage('success', response.data.message);
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
            this.$router.push({path: '/offers'});
        },
        toggleRowDetails(row) {
            if (this.visibleOfferId === row.item.id) {
                this.visibleOfferId = null;
            } else {
                this.visibleOfferId = row.item.id;
            }
        },
        handleImageError(event) {
            // Fallback strategy if image_url fails
            const offer = this.offers.find(o => o.image_url === event.target.src);
            if (offer && offer.image) {
                event.target.src = this.$storageUrl + offer.image;
            }
        }
    }
};
</script>
