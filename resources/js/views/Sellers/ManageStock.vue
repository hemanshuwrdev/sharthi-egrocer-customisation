<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('stock_management') }}</h3>
            <button type="button" class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap"
                :disabled="isBulkSaving || !groupedProducts.length" @click="saveAllStock()">
                <b-spinner small v-if="isBulkSaving"></b-spinner>
                <i v-else class="fa fa-save" aria-hidden="true"></i>
                <span>{{ __('bulk_save') }}</span>
            </button>
        </div>

        <div class="ui-filters">
            <div class="ui-search">
                <i class="fa fa-search" aria-hidden="true"></i>
                <input id="filter-input" v-model="filter" type="text" :placeholder="__('search')" :aria-label="__('search')"
                    @input="onFilterChange()">
                <button v-if="filter" type="button" class="ui-search__clear" :title="__('Clear')" @click="clearSearch()">
                    <i class="fa fa-times"></i>
                </button>
            </div>
            <button type="button" class="ui-iconbtn" v-b-tooltip.hover :title="__('refresh')" @click="getRecords()">
                <i class="fa fa-sync-alt" :class="{ 'fa-spin': isLoading }" aria-hidden="true"></i>
            </button>
        </div>

        <div class="list-surface">
            <div class="table-responsive">
                <b-table :key="tableKey" :items="groupedProducts" :fields="fields"
                    :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection"
                    :bordered="false" borderless hover :busy="isLoading" stacked="md" show-empty
                    primary-key="product_variant_id">

                    <template #table-busy>
                        <div class="ui-busy">
                            <b-spinner class="align-middle" small></b-spinner>
                            <strong>{{ __('loading') }}...</strong>
                        </div>
                    </template>

                    <template #empty>
                        <div class="ui-empty">
                            <div class="ui-empty__icon"><i class="fa fa-boxes"></i></div>
                            <h3>{{ __('No products found') }}</h3>
                            <p>{{ filter ? __('Nothing matches this search. Try changing or clearing it.') : __('Products you sell will show up here.') }}</p>
                            <button v-if="filter" type="button" class="ui-btn" @click="clearSearch()">
                                <i class="fa fa-times"></i> {{ __('Clear search') }}
                            </button>
                        </div>
                    </template>

                    <!-- ID column -->
                    <template #cell(product_variant_id)="row">
                        <span class="ui-id">#{{ row.item.product_variant_id }}</span>
                    </template>

                    <template #cell(image_url)="row">
                        <img v-if="row.item.image_url" :src="row.item.image_url" alt="Image" class="ui-thumb ui-zoom"
                            @click="openLightbox(row.item.image_url)" />
                        <span v-else class="ui-thumb ui-thumb--blank"><i class="fa fa-box"></i></span>
                    </template>

                    <!-- Product name column -->
                    <template #cell(name)="row">
                        <strong class="ui-strong">{{ getTranslatedProductName(row.item) }}</strong>
                    </template>

                    <!-- Variant column -->
                    <template #cell(variant)="row">
                        <div v-if="getTranslatedVariant(row.item)" class="ui-cell">
                            <strong>{{ getTranslatedVariant(row.item) }}</strong>
                            <span v-if="row.item.sku">{{ __('sku') }}: {{ row.item.sku }}</span>
                        </div>
                        <strong v-else-if="row.item.sku" class="ui-strong">{{ row.item.sku }}</strong>
                        <span v-else class="ui-dash">—</span>
                    </template>

                    <!-- Type column -->
                    <template #cell(type)="row">
                        <span v-if="row.item.type" class="ui-tag">{{ row.item.type }}</span>
                        <span v-else class="ui-dash">—</span>
                    </template>

                    <!-- Stock column -->
                    <template #cell(stock)="row">
                        <input v-model.number="row.item.stock" type="number" min="0" class="ui-input"
                            :disabled="row.item._saving" @keyup.enter="saveStockRow(row.item)" />
                    </template>

                    <!-- Status column -->
                    <template #cell(pv_status)="row">
                        <span v-if="row.item.pv_status == 1" class="badge bg-success">{{ __('available') }}</span>
                        <span v-else class="badge bg-danger">{{ __('sold_out') }}</span>
                    </template>

                    <!-- Actions column -->
                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <button type="button" class="ui-save" :disabled="row.item._saving"
                                @click="saveStockRow(row.item)" v-b-tooltip.hover :title="__('save')">
                                <b-spinner small v-if="row.item._saving"></b-spinner>
                                <i v-else class="fa fa-save"></i>
                            </button>
                        </div>
                    </template>
                </b-table>
            </div>

            <!-- One lightbox for the whole table (it used to be rendered inside every image cell) -->
            <FsLightbox :toggler="toggler" :sources="lightboxSources" :onClose="handleClose"></FsLightbox>

            <div class="list-footer">
                <div class="list-perpage">
                    <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right"
                        label-size="sm" class="mb-0">
                        <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"
                            size="sm" class="form-control form-select"></b-form-select>
                    </b-form-group>
                </div>
                <span class="ui-count">{{ rangeText(currentPage, perPage, totalRows) }}</span>
                <b-pagination v-if="totalRows > perPage" v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
                    size="sm" class="list-pagination my-0"></b-pagination>
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
            filterDebounce: null,
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
        rangeText(page, perPage, total) {
            if (!total) return '';
            const from = (page - 1) * perPage + 1;
            const to = Math.min(page * perPage, total);
            return from + '-' + to + ' / ' + total;
        },
        // A changed search starts again from page 1; the currentPage watcher does the fetch when that
        // moves us, otherwise fetch directly (never both, or the list loads twice).
        applyFilters() {
            if (this.currentPage !== 1) {
                this.currentPage = 1;
            } else {
                this.getRecords();
            }
        },
        onFilterChange() {
            clearTimeout(this.filterDebounce);
            this.filterDebounce = setTimeout(() => this.applyFilters(), 250);
        },
        clearSearch() {
            this.filter = null;
            this.applyFilters();
        },
        openLightbox(image) {

            this.lightboxSources = [image];
            this.toggler = !this.toggler;
        },
        handleClose() {
            this.lightboxSources = [];
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
