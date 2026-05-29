<template>
    <div>
        <div class="page-heading">
            <div class="row">
                <div class="col-12 col-md-6 order-md-1 order-last">
                    <h3>{{ __('stock_management') }}</h3>
                </div>
                <div class="col-12 col-md-6 order-md-2 order-first">
                    <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><router-link to="/dashboard">{{ __('dashboard') }}</router-link>
                            </li>
                            <li class="breadcrumb-item active" aria-current="page">{{ __('stock_management') }}</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12 col-md-12 order-md-1 order-last">
                <div class="card">
                    <div class="card-body">
                        <b-row class="mb-2">
                            <b-col md="3" offset-md="8">
                                <h6 class="box-title">{{ __('search') }}</h6>
                                <b-form-input id="filter-input" v-model="filter" type="search"
                                    :placeholder="__('search')" @input="getRecords()"></b-form-input>
                            </b-col>
                            <b-col md="1" class="text-center">
                                <button class="btn btn-primary btn_refresh" v-b-tooltip.hover :title="__('refresh')"
                                    @click="getRecords()">
                                    <i class="fa fa-refresh" aria-hidden="true"></i>
                                </button>
                            </b-col>
                        </b-row>
                        <div class="table-responsive">
                            <b-table :key="tableKey" :items="groupedProducts" :fields="fields"
                                :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection"
                                :bordered="true" :busy="isLoading" stacked="md" show-empty small
                                primary-key="product_variant_id">

                                <!-- ID column -->
                                <template #cell(product_variant_id)="row">

                                    {{ row.item.product_variant_id }}

                                </template>

                                <!-- Product Name column with rowspan -->
                                <template #cell(name)="row">
                                    {{ getTranslatedProductName(row.item) }}
                                </template>

                                <!-- Variant column -->
                                <template #cell(variant)="row">

                                    {{ getTranslatedVariant(row.item) }}

                                </template>

                                <!-- Type column with rowspan for 'loose' type products -->
                                <template #cell(type)="row">
                                    {{ row.item.type }}
                                </template>

                                <template #cell(image_url)="row">
                                    <img :src="row.item.image_url" alt="Image" class="img-thumbnail" width="100"
                                        @click="openLightbox(row.item.image_url)" />
                                    <FsLightbox :toggler="toggler" :sources="lightboxSources" :onClose="handleClose">
                                    </FsLightbox>
                                </template>


                                <!-- Stock column -->
                                <template #cell(stock)="row">

                                    <div
                                        v-if="edit_record && edit_record.product_variant_id === row.item.product_variant_id">
                                        <b-form-input v-model="edit_record.stock" type="number" min="0"
                                            @keyup.enter="updateStock(row.item.product_variant_id)"></b-form-input>
                                    </div>
                                    <div v-else>
                                        {{ row.item.stock }}
                                    </div>

                                </template>

                                <!-- Status column -->
                                <template #cell(pv_status)="row">

                                    <span v-if="row.item.pv_status == 1" class="badge bg-success">{{ __('available') }}</span>
                                    <span v-else class="badge bg-danger">{{ __('sold_out') }}</span>

                                </template>

                                <!-- Actions column -->
                                <template #cell(actions)="row">

                                    <button
                                        v-if="edit_record && edit_record.product_variant_id === row.item.product_variant_id"
                                        class="btn btn-sm btn-success"
                                        @click="updateStock(row.item.product_variant_id)">
                                        <i class="fa fa-check"></i>
                                    </button>
                                    <button v-else class="btn btn-sm btn-primary" @click="edit_record = { ...row.item }"
                                        v-b-tooltip.hover :title="__('edit')">
                                        <i class="fa fa-pencil-alt"></i>
                                    </button>

                                </template>
                            </b-table>
                        </div>
                        <b-row>
                            <b-col md="2" class="my-1">
                                <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right"
                                    label-size="sm" class="mb-0">
                                    <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"
                                        size="sm" class="form-control form-select"></b-form-select>
                                </b-form-group>
                            </b-col>
                            <b-col md="4" class="my-1" offset-md="6">
                                <label>{{ __('total_records') }} :- {{ totalRows }} </label>
                                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
                                    align="fill" size="sm" class="my-0"></b-pagination>
                            </b-col>
                        </b-row>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { VuejsDatatableFactory } from 'vuejs-datatable';
import FsLightbox from "fslightbox-vue";
import axios from "axios";


export default {
    components: {
        VuejsDatatableFactory,
        FsLightbox,
    },
    data() {
        return {
            fields: [
                { key: 'product_variant_id', label: __('id'), class: 'text-center', sortable: true, sortDirection: 'desc' },
                { key: 'image_url', label: __('image'), class: 'text-center' },
                { key: 'name', label: __('name'), class: 'text-center' },
                { key: 'variant', label: __('variant'), class: 'text-center' },
                { key: 'type', label: __('type'), class: 'text-center' },
                { key: 'stock', label: __('stock'), class: 'text-center' },
                { key: 'pv_status', label: __('status'), class: 'text-center' },
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
            filterOn: ['name'],
            isLoading: false,
            products: [],
            edit_record: null,
            groupedProducts: [],
            lightboxSources: [],
            toggler: false,
            tableKey: 0,
            // Language handling for translations
            currentLanguageId: null,
            activeLanguages: []
        }
    },
    created() {
        this.$eventBus.$on('recordSaved', (message) => {
            this.showMessage('success', message);
            this.getRecords();
        });
        // Load languages first so we know currentLanguageId before mapping translations
        this.fetchActiveLanguages().then(() => {
            this.getRecords();
        }).catch(() => {
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
        // Get translated product name with fallback logic (guards so rendering never throws)
        getTranslatedProductName(product) {
            if (!product) return '';
            if (!this.currentLanguageId || !product.translations) {
                return product.name != null ? String(product.name) : '';
            }

            // Get default language ID for fallback
            const defaultLanguage = this.activeLanguages.find(lang => lang.is_default === 1);
            const defaultLanguageId = defaultLanguage ? defaultLanguage.id : null;

            if (Array.isArray(product.translations)) {
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
                    return translation.name;
                }
            }

            return product.name != null ? String(product.name) : '';
        },
        // Get translated variant (measurement + unit) with fallback logic (guards so rendering never throws)
        getTranslatedVariant(product) {
            const measurement = (product && product.measurement != null) ? String(product.measurement) : '';
            if (!product || !this.currentLanguageId) {
                return measurement;
            }

            // Get default language ID for fallback
            const defaultLanguage = this.activeLanguages.find(lang => lang.is_default === 1);
            const defaultLanguageId = defaultLanguage ? defaultLanguage.id : null;

            // Try to translate unit if unit_translations exist
            let translatedUnit = null;
            if (product.unit_translations && Array.isArray(product.unit_translations)) {
                // First try to find translation for current language
                let unitTranslation = product.unit_translations.find(
                    t => t.language_id === this.currentLanguageId
                );

                // If not found, try default language
                if (!unitTranslation && defaultLanguageId) {
                    unitTranslation = product.unit_translations.find(
                        t => t.language_id === defaultLanguageId
                    );
                }

                // Use translated short_code if available and not empty
                if (unitTranslation && unitTranslation.short_code && unitTranslation.short_code.trim() !== '') {
                    translatedUnit = unitTranslation.short_code;
                }
            }

            // If we have a translated unit, replace it in the measurement string
            if (translatedUnit && product.stock_unit && measurement) {
                return measurement.replace(product.stock_unit, translatedUnit);
            }

            return measurement;
        },
        openLightbox(image) {

            this.lightboxSources = [image];
            this.toggler = !this.toggler;
        },
        handleClose() {
            this.lightboxSources = null;
            this.toggler = false;

        },
        getRecords() {
            this.isLoading = true;
            axios.get(this.$apiUrl + '/products/get_product_variants', {
                params: {
                    page: this.currentPage,
                    per_page: this.perPage,
                    filter: this.filter
                }
            }).then((response) => {
                this.isLoading = false;
                const res = response.data;
                const ok = (res.status === 1 || res.status === '1') && res.data != null;
                if (ok) {
                    const raw = res.data;
                    const list = Array.isArray(raw) ? raw : (raw && typeof raw === 'object' ? Object.values(raw) : []);
                    this.groupedProducts = list.slice();
                    this.totalRows = typeof res.total === 'number' ? res.total : (res.total ? parseInt(res.total, 10) : 0);
                    this.tableKey += 1;
                } else {
                    this.groupedProducts = [];
                    this.totalRows = 0;
                }
            }).catch((err) => {
                this.isLoading = false;
                this.groupedProducts = [];
                this.totalRows = 0;
                this.showMessage('error', err.response && err.response.data && err.response.data.message ? err.response.data.message : __('something_went_wrong'));
            });
        },
        updateStock(product_variant_id) {
            if (this.edit_record.stock < 0) {
                this.showMessage('error', __('stock_must_be_positive'));
                return;
            }
            this.isLoading = true;
            axios.post(this.$apiUrl + '/products/update_variant_stock', {
                id: product_variant_id,
                stock: this.edit_record.stock
            }).then((response) => {
                this.isLoading = false;
                if (response.data.status === 1) {
                    this.showMessage('success', response.data.message);
                    this.getRecords(); // Refresh data after updating stock
                } else {
                    this.showMessage('error', response.data.message);
                }
                this.edit_record = null; // Reset edit state

            }).catch(() => {
                this.isLoading = false;
                this.showMessage('error', __('update_failed'));
            });
        }
    }
};
</script>
