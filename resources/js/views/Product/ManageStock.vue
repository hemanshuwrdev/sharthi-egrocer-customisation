<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('stock_management') }}</h3>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input id="filter-input" v-model="filter" type="search"
                        :placeholder="__('search')" @input="getRecords()"></b-form-input>
                </div>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')"
                    @click="getRecords()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
                <button class="btn btn-sm btn-primary" :disabled="isBulkSaving || !groupedProducts.length"
                    @click="saveAllStock()">
                    <b-spinner small v-if="isBulkSaving"></b-spinner>
                    <i v-else class="fa fa-save"></i>
                    {{ __('bulk_save') }}
                </button>
            </div>
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
                                    <b-form-input v-model.number="row.item.stock" type="number" min="0"
                                        :disabled="row.item._saving"
                                        @keyup.enter="saveStockRow(row.item)"></b-form-input>
                                </template>

                                <!-- Status column -->
                                <template #cell(pv_status)="row">

                                    <span v-if="row.item.pv_status == 1" class="badge bg-success">{{ __('available') }}</span>
                                    <span v-else class="badge bg-danger">{{ __('sold_out') }}</span>

                                </template>

                                <!-- Actions column -->
                                <template #cell(actions)="row">
                                    <div class="list-actions">
                                        <button class="list-action-btn" :disabled="row.item._saving"
                                            @click="saveStockRow(row.item)"
                                            v-b-tooltip.hover :title="__('save')">
                                            <b-spinner small v-if="row.item._saving"></b-spinner>
                                            <i v-else class="fa fa-check"></i>
                                        </button>
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
                { key: 'actions', label: __('actions'), class: 'text-center' }
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
            isBulkSaving: false,
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
                    this.groupedProducts = list.map(r => ({ ...r, _saving: false }));
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
        // Saves one row's stock in place (no full-list refetch, so it plays
        // well with saveAllStock() looping over every row without resetting
        // the others mid-loop).
        saveStockRow(row) {
            if (row.stock < 0) {
                this.showMessage('error', __('stock_must_be_positive'));
                return Promise.resolve();
            }
            row._saving = true;
            return axios.post(this.$apiUrl + '/products/update_variant_stock', {
                id: row.product_variant_id,
                stock: row.stock
            }).then((response) => {
                row._saving = false;
                if (response.data.status === 1) {
                    this.showMessage('success', response.data.message);
                } else {
                    this.showMessage('error', response.data.message);
                }
            }).catch(() => {
                row._saving = false;
                this.showMessage('error', __('update_failed'));
            });
        },
        // Saves every currently loaded row's stock, one request at a time
        // (reusing saveStockRow's own payload/response handling per row), so
        // stock for the whole page can be updated without clicking save on
        // each product one by one.
        async saveAllStock() {
            if (this.isBulkSaving || !this.groupedProducts.length) return;
            this.isBulkSaving = true;
            for (const row of this.groupedProducts) {
                await this.saveStockRow(row);
            }
            this.isBulkSaving = false;
        }
    }
};
</script>
