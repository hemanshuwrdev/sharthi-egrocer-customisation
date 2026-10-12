<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('my_products') }}</h3>
            <div class="page-head-actions">
                <button type="button" class="ui-iconbtn" v-b-tooltip.hover :title="__('refresh')" @click="getRecords()">
                    <i class="fa fa-sync-alt" :class="{ 'fa-spin': isLoading }" aria-hidden="true"></i>
                </button>

                <b-dropdown right no-caret variant="outline-secondary" toggle-class="ui-iconbtn" menu-class="ui-colmenu"
                    v-b-tooltip.hover :title="__('columns')">
                    <template #button-content>
                        <i class="fa fa-th-list" aria-hidden="true"></i>
                    </template>
                    <li class="ui-colmenu__title">{{ __('columns') }}</li>
                    <li v-for="field in fields" :key="field.key">
                        <label class="ui-colmenu__item" :for="'col_' + field.key">
                            <input type="checkbox" :id="'col_' + field.key"
                                :disabled="visibleFields.length == 1 && field.visible"
                                v-model="field.visible" class="form-check-input">
                            {{ field.label }}
                        </label>
                    </li>
                </b-dropdown>
            </div>
        </div>

        <!-- Filters: everything on one line, search grows to fill the space -->
        <div class="ui-filters">
            <div class="ui-search">
                <i class="fa fa-search" aria-hidden="true"></i>
                <input id="filter-input" v-model="filter" type="text" :placeholder="__('search_by_name_sku_hsn')"
                    :aria-label="__('search')" @input="onFilterChange()">
                <button v-if="filter" type="button" class="ui-search__clear" :title="__('Clear')" @click="clearSearch()">
                    <i class="fa fa-times"></i>
                </button>
            </div>

            <select v-model="brandFilter" @change="applyFilters()" class="ui-select" :aria-label="__('brand')">
                <option :value="null">{{ tr('all_brands', 'All brands') }}</option>
                <option v-for="b in availableBrands" :key="b.id" :value="b.id">{{ b.name }}</option>
            </select>

            <select v-model="categoryFilter" @change="applyFilters()" class="ui-select" :aria-label="__('category')">
                <option :value="null">{{ __('all_categories') }}</option>
                <option v-for="c in availableCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>

            <select v-model="activeFilter" @change="applyFilters()" class="ui-select" :aria-label="__('status')">
                <option :value="null">{{ __('all_products') }}</option>
                <option value="1">{{ __('activated_only') }}</option>
                <option value="0">{{ __('deactivated_only') }}</option>
            </select>

            <select v-model="stockStatusFilter" @change="applyFilters()" class="ui-select" :aria-label="__('stock')">
                <option :value="null">{{ __('all_stock_levels') }}</option>
                <option value="in_stock">{{ __('in_stock') }}</option>
                <option value="low_stock">{{ __('low_stock') }}</option>
                <option value="sold_out">{{ __('sold_out') }}</option>
            </select>

            <div class="ui-range">
                <input v-model="minPriceFilter" type="number" min="0" :placeholder="__('min_price')"
                    :aria-label="__('min_price')" @change="applyFilters()">
                <span>&ndash;</span>
                <input v-model="maxPriceFilter" type="number" min="0" :placeholder="__('max_price')"
                    :aria-label="__('max_price')" @change="applyFilters()">
            </div>

            <button v-if="hasActiveFilters" type="button" class="ui-linkbtn" v-b-tooltip.hover :title="__('Clear all filters')" @click="clearAllFilters()">
                <i class="fa fa-times-circle"></i> {{ __('Clear') }}
            </button>
        </div>

        <div class="list-surface">
            <div class="table-responsive">
                <b-table :items="rows" :fields="visibleFields" :bordered="false" borderless hover :busy="isLoading"
                    stacked="md" show-empty>
                    <template #table-busy>
                        <div class="mp-busy">
                            <b-spinner class="align-middle" small></b-spinner>
                            <strong>{{ __('loading') }}...</strong>
                        </div>
                    </template>

                    <template #empty>
                        <div class="ui-empty">
                            <div class="ui-empty__icon"><i class="fa fa-box-open"></i></div>
                            <template v-if="noBrandsAssigned">
                                <h3>{{ __('No brands assigned') }}</h3>
                                <p>{{ __('no_brands_assigned_yet') }}</p>
                            </template>
                            <template v-else>
                                <h3>{{ __('no_products_found') }}</h3>
                                <p v-if="hasActiveFilters">{{ __('Nothing matches these filters. Try changing or clearing them.') }}</p>
                            </template>
                            <button v-if="hasActiveFilters && !noBrandsAssigned" type="button" class="mp-btn" @click="clearAllFilters()">
                                <i class="fa fa-times"></i> {{ __('Clear all filters') }}
                            </button>
                        </div>
                    </template>

                    <template #cell(product_variant_id)="row">
                        <span class="mp-id">#{{ row.item.product_variant_id }}</span>
                    </template>

                    <template #cell(image)="row">
                        <img v-if="row.item.image" :src="$storageUrl + row.item.image" class="ui-thumb mp-zoom"
                            @click="openLightbox($storageUrl + row.item.image)" alt="Image" />
                        <span v-else class="ui-thumb mp-thumb--blank"><i class="fa fa-box"></i></span>
                    </template>

                    <template #cell(name)="row">
                        <div class="mp-name">
                            <strong :title="row.item.master_product_name">{{ row.item.master_product_name }}</strong>
                            <div v-if="row.item.brand || row.item.is_free_only" class="mp-name__meta">
                                <span v-if="row.item.brand" class="ui-tag">{{ row.item.brand }}</span>
                                <span v-if="row.item.is_free_only" class="ui-pill ui-tone--purple">{{ tr('free_item', 'Free item') }}</span>
                            </div>
                        </div>
                    </template>


                    <template #cell(sku)="row">
                        <span v-if="row.item.sku">{{ row.item.sku }}</span>
                        <span v-else class="ui-dash">—</span>
                    </template>

                    <template #cell(unit)="row">
                        <span v-if="row.item.unit" class="ui-tag">{{ row.item.unit }}</span>
                        <span v-else class="ui-dash">—</span>
                    </template>

                    <template #cell(secondary_unit)="row">
                        <span v-if="row.item.secondary_unit_value && row.item.secondary_unit" class="ui-nowrap">
                            {{ row.item.secondary_unit_value }} / {{ row.item.secondary_unit }}
                        </span>
                        <span v-else class="ui-dash">—</span>
                    </template>

                    <template #cell(mrp)="row">
                        <div class="mp-money">
                            <span v-if="$currency">{{ $currency }}</span>
                            <input type="number" min="0" step="0.01" :disabled="row.item.is_free_only"
                                class="mp-input" v-model.number="row.item.mrp" />
                        </div>
                    </template>

                    <template #cell(selling_price)="row">
                        <div class="d-flex align-items-center gap-2">
                            <div class="mp-money">
                                <span v-if="$currency">{{ $currency }}</span>
                                <input type="number" min="0" step="0.01" :disabled="row.item.is_free_only"
                                    class="mp-input" v-model.number="row.item.selling_price" />
                            </div>
                            <i v-if="innerPackPriceHint(row.item)" class="fa fa-info-circle mp-info"
                                v-b-tooltip.hover :title="innerPackPriceHint(row.item)"></i>
                        </div>
                    </template>

                    <template #cell(stock)="row">
                        <input type="number" min="0" step="0.001"
                            class="mp-input mp-input--plain" v-model.number="row.item.stock" />
                    </template>

                    <template #cell(allow_loose_qty)="row">
                        <div class="form-check form-switch mp-switch">
                            <input class="form-check-input" type="checkbox" role="switch"
                                v-model="row.item.allow_loose_qty" :disabled="row.item.is_free_only"
                                :title="__('allow_loose_qty_hint')" />
                        </div>
                    </template>

                    <template #cell(cancelable_status)="row">
                        <div class="form-check form-switch mp-switch">
                            <input class="form-check-input" type="checkbox" role="switch"
                                v-model="row.item.cancelable_status" :disabled="row.item.is_free_only"
                                :title="__('cancelable_hint')" />
                        </div>
                    </template>

                    <template #cell(return_status)="row">
                        <div class="d-flex flex-column align-items-start gap-2">
                            <div class="form-check form-switch mp-switch">
                                <input class="form-check-input" type="checkbox" role="switch"
                                    v-model="row.item.return_status" :disabled="row.item.is_free_only"
                                    :title="__('returnable_hint')" />
                            </div>
                            <div v-if="row.item.return_status" class="d-flex align-items-center gap-2">
                                <input type="number" min="1" step="1"
                                    class="mp-input mp-input--plain mp-input--days" :disabled="row.item.is_free_only"
                                    v-model.number="row.item.return_days" />
                                <span class="mp-muted">{{ __('days') }}</span>
                            </div>
                        </div>
                    </template>

                    <template #head(max_qty)>
                        <div class="max-qty-head">
                            <div>{{ __('max') }}</div>
                            <div>
                                {{ __('allowed_qty') }}
                                <i class="fa fa-info-circle" v-b-tooltip.hover :title="__('max_allowed_qty_hint')"></i>
                            </div>
                        </div>
                    </template>

                    <template #cell(max_qty)="row">
                        <div class="max-qty-cell">
                            <select class="mp-input mp-input--plain max-qty-select" :disabled="row.item.is_free_only" v-model="row.item.max_qty_mode"
                                @change="row.item.max_qty_mode || (row.item.max_qty_value = null)">
                                <option :value="null">{{ __('no_limit') }}</option>
                                <option value="per_order">{{ __('per_order') }}</option>
                                <option value="per_day">{{ __('per_day') }}</option>
                            </select>
                            <input v-if="row.item.max_qty_mode" type="number" class="mp-input mp-input--plain max-qty-input" :disabled="row.item.is_free_only"
                                min="1" step="1" v-model.number="row.item.max_qty_value" />
                            <div v-if="row.item.max_qty_mode" class="max-qty-hint">
                                {{ __('max_quantity_allowed') }}<br>
                                {{ row.item.max_qty_mode === 'per_day' ? __('per_day') : __('per_order') }}
                            </div>
                        </div>
                    </template>

                    <template #cell(slab_count)="row">
                        <button type="button" class="mp-slabs" :class="{ 'mp-slabs--set': slabCount(row.item) }"
                            @click="openSlabs(row.item)" :disabled="row.item.is_free_only">
                            <i class="fa fa-list"></i>
                            {{ slabCount(row.item) }}
                        </button>
                    </template>

                    <template #cell(min_qty)="row">
                        <input type="number" min="1" step="1"
                            class="mp-input mp-input--plain mp-input--narrow"
                            placeholder="—" :disabled="row.item.is_free_only"
                            v-model.number="row.item.min_qty" />
                    </template>

                    <template #cell(status)="row">
                        <div class="form-check form-switch mp-switch">
                            <input class="form-check-input" type="checkbox" role="switch"
                                :checked="row.item.status == 1"
                                @change="toggleStatus(row.item, $event)">
                        </div>
                    </template>

                    <template #cell(is_free_only)="row">
                        <div class="form-check form-switch mp-switch">
                            <input class="form-check-input" type="checkbox" role="switch"
                                :checked="row.item.is_free_only"
                                @change="onFreeItemToggle(row.item, $event)"
                                :title="tr('free_item_hint', 'Free item only: schemes can give it away, but it is hidden from the app and cannot be bought separately, so it has no price (prices are set to 0 on Save).')" />
                        </div>
                    </template>

                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <button type="button" class="mp-save" @click="saveRow(row.item)"
                                :disabled="row.item._saving" v-b-tooltip.hover :title="__('save')">
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
                    <b-form-group :label="__('per_page')" label-for="per-page-select"
                        label-align-sm="right" label-size="sm" class="mb-0">
                        <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"
                            size="sm" class="form-control form-select"></b-form-select>
                    </b-form-group>
                </div>
                <span class="mp-count">{{ rangeText(currentPage, perPage, totalRows) }}</span>
                <b-pagination v-if="totalRows > perPage" v-model="currentPage" :total-rows="totalRows"
                    :per-page="perPage" size="sm" class="list-pagination my-0"></b-pagination>
            </div>
        </div>

        <!-- Slab Pricing Modal -->
        <b-modal v-model="slabModalOpen" :title="__('slab_prices')" hide-footer size="lg" no-close-on-backdrop>
            <div v-if="slabTarget">
                <p class="mb-3">
                    <strong>{{ slabTarget.master_product_name }}</strong>
                    <span class="text-muted">— {{ __('sku') }}: {{ slabTarget.sku || '—' }}</span>
                </p>
                <div v-if="slabTarget.secondary_unit_value && !slabTarget.allow_loose_qty" class="alert alert-info py-2 px-3 mb-3">
                    <i class="fa fa-info-circle"></i>
                    {{ __('slab_moq_hint').replace(':moq', slabTarget.secondary_unit_value) }}
                </div>
                <table class="table table-bordered">
                    <thead class="table-light">
                        <tr>
                            <th>{{ __('min_qty') }}</th>
                            <th>{{ __('max_qty') }}</th>
                            <th>{{ __('price') }}</th>
                            <th style="width:60px;"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(s, idx) in slabDraft" :key="idx">
                            <td><input type="number" min="1" class="form-control" v-model.number="s.min_qty" /></td>
                            <td><input type="number" min="1" class="form-control" v-model.number="s.max_qty"
                                    :placeholder="__('open_ended')" /></td>
                            <td><input type="number" min="0" step="0.01" class="form-control" v-model.number="s.price" /></td>
                            <td>
                                <button class="btn btn-sm btn-danger" @click="removeSlab(idx)">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                        <tr v-if="!slabDraft.length">
                            <td colspan="4" class="text-center text-muted">{{ __('no_slabs_yet') }}</td>
                        </tr>
                    </tbody>
                </table>
                <button class="btn btn-outline-primary btn-sm" @click="addSlab">
                    <i class="fa fa-plus"></i> {{ __('add_slab') }}
                </button>
                <div class="text-end mt-3">
                    <button class="btn btn-secondary me-2" @click="slabModalOpen = false">{{ __('cancel') }}</button>
                    <button class="btn btn-primary" @click="saveSlabs" :disabled="slabSaving">
                        {{ __('save') }} <b-spinner small v-if="slabSaving"></b-spinner>
                    </button>
                </div>
                <p v-if="!slabTarget.seller_product_id" class="text-warning mt-3 small">
                    <i class="fa fa-info-circle"></i> {{ __('save_price_first_before_slabs') }}
                </p>
            </div>
        </b-modal>
    </div>
</template>

<script>
import axios from "axios";
import FsLightbox from "fslightbox-vue";

// __() hands back the key itself when the language DB has no entry for it yet, so new
// wording would show as a raw key until someone edits the language JSON — fall back to English.
const tr = (key, fallback) => {
    const t = __(key);
    return t && t !== key ? t : fallback;
};

export default {
    components: { FsLightbox },
    data() {
        return {
            fields: [
                { key: 'product_variant_id', label: __('id'), visible: true, class: 'text-center', thStyle: { width: '60px' } },
                { key: 'image', label: __('image'), visible: true, class: 'text-center', thStyle: { width: '70px' } },
                { key: 'name', label: __('name'), visible: true, class: 'text-start', thStyle: { minWidth: '220px' } },
                { key: 'sku', label: __('sku'), visible: false, class: 'text-center' },
                { key: 'unit', label: __('per_unit'), visible: true, class: 'text-center' },
                { key: 'secondary_unit', label: __('secondary_unit'), visible: false, class: 'text-center' },
                { key: 'mrp', label: __('mrp') + (this.$currency ? ' (' + this.$currency + ')' : ''), visible: true, class: 'text-center' },
                { key: 'selling_price', label: __('selling_price') + (this.$currency ? ' (' + this.$currency + ')' : ''), visible: true, class: 'text-center' },
                { key: 'stock', label: __('stock'), visible: true, class: 'text-center' },
                { key: 'allow_loose_qty', label: __('allow_loose_qty'), visible: false, class: 'text-center' },
                { key: 'max_qty', label: __('max_allowed_qty'), visible: false, class: 'text-center', thStyle: { minWidth: '165px', width: '165px' } },
                { key: 'cancelable_status', label: __('cancelable'), visible: false, class: 'text-center', thStyle: { width: '100px' } },
                { key: 'return_status', label: __('returnable'), visible: false, class: 'text-center', thStyle: { width: '100px' } },
                { key: 'slab_count', label: __('slabs'), visible: true, class: 'text-center', thStyle: { width: '80px' } },
                { key: 'min_qty', label: __('min_quantity'), visible: false, class: 'text-center', thStyle: { minWidth: '95px', width: '95px' } },
                { key: 'status', label: __('status'), visible: true, class: 'text-center', thStyle: { width: '90px' } },
                { key: 'is_free_only', label: tr('free_item', 'Free item'), visible: false, class: 'text-center', thStyle: { width: '90px' } },
                { key: 'actions', label: __('actions'), visible: true, class: 'text-center', thStyle: { width: '80px' } },
            ],
            rows: [],
            totalRows: 0,
            currentPage: 1,
            perPage: this.$perPage || 25,
            pageOptions: this.$pageOptions || [10, 25, 50, 100],
            filter: null,
            filterDebounce: null,
            brandFilter: null,
            categoryFilter: null,
            activeFilter: null,
            stockStatusFilter: null,
            minPriceFilter: null,
            maxPriceFilter: null,
            masterProductIdFilter: this.$route.query.master_product_id || null,
            availableBrands: [],
            availableCategories: [],
            noBrandsAssigned: false,
            isLoading: false,

            toggler: false,
            lightboxSources: [],

            slabModalOpen: false,
            slabTarget: null,
            slabDraft: [],
            slabSaving: false,
        };
    },
    computed: {
        visibleFields() {
            return this.fields.filter(f => f.visible);
        },
        hasActiveFilters() {
            const set = v => v !== null && v !== undefined && v !== '';
            return set(this.filter) || set(this.brandFilter) || set(this.categoryFilter) || set(this.activeFilter)
                || set(this.stockStatusFilter) || set(this.minPriceFilter) || set(this.maxPriceFilter);
        },
    },
    created() {
        this.getRecords();
        this.getBrands();
        this.getCategories();
    },
    watch: {
        currentPage() { this.getRecords(); },
        perPage() { this.getRecords(); },
    },
    methods: {
        tr,
        // Ticking "Free item": the product is never sold, so it has no price. Zero MRP and selling price
        // right away (the server enforces the same on save) and remember what was there, so ticking it
        // by mistake and unticking again before Save puts the prices back.
        onFreeItemToggle(row, event) {
            const on = event.target.checked;
            this.$set(row, 'is_free_only', on);
            if (on) {
                this.$set(row, '_pricesBeforeFree', { mrp: row.mrp, selling_price: row.selling_price });
                row.mrp = 0;
                row.selling_price = 0;
            } else if (row._pricesBeforeFree) {
                row.mrp = row._pricesBeforeFree.mrp;
                row.selling_price = row._pricesBeforeFree.selling_price;
                row._pricesBeforeFree = null;
            }
        },
        innerPackPriceHint(item) {
            const step = parseFloat(item.secondary_unit_value) || 0;
            const price = parseFloat(item.selling_price) || 0;
            if (step <= 1 || !item.selling_price) {
                return '';
            }
            const innerPrice = (price * step).toFixed(2);
            const currency = this.$currency ? this.$currency + ' ' : '';
            return __('inner_pack_price_hint') + ': ' + currency + innerPrice +
                (item.secondary_unit ? ' / ' + item.secondary_unit : '') +
                ' (' + step + (item.unit ? ' ' + item.unit : '') + ')';
        },
        slabCount(item) {
            return item.slab_prices ? item.slab_prices.length : 0;
        },
        rangeText(page, perPage, total) {
            if (!total) return '';
            const from = (page - 1) * perPage + 1;
            const to = Math.min(page * perPage, total);
            return from + '-' + to + ' / ' + total;
        },
        // A changed filter always starts again from page 1; the currentPage watcher does the fetch
        // when that moves us, otherwise fetch directly (never both, or the list loads twice).
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
        clearAllFilters() {
            this.filter = null;
            this.brandFilter = null;
            this.categoryFilter = null;
            this.activeFilter = null;
            this.stockStatusFilter = null;
            this.minPriceFilter = null;
            this.maxPriceFilter = null;
            this.applyFilters();
        },
        getRecords() {
            this.isLoading = true;
            axios.get(this.$sellerApiUrl + '/products', {
                params: {
                    page: this.currentPage,
                    per_page: this.perPage,
                    filter: this.filter,
                    brand_id: this.brandFilter,
                    category_id: this.categoryFilter,
                    active_only: this.activeFilter,
                    type: this.stockStatusFilter,
                    min_price: this.minPriceFilter,
                    max_price: this.maxPriceFilter,
                    master_product_id: this.masterProductIdFilter,
                },
            }).then(res => {
                this.isLoading = false;
                const data = res.data.data || [];
                this.rows = data.map(r => ({ ...r, _saving: false }));
                this.totalRows = res.data.total || 0;
                // Explicit backend flag — an empty result can also just mean the current
                // filter/search matched nothing, which isn't the same thing.
                this.noBrandsAssigned = !!res.data.no_brands_assigned;
            }).catch(() => { this.isLoading = false; });
        },
        getBrands() {
            // Fetched independently of the product list/filters/pagination — this used
            // to be derived from whatever rows were on the current page (collectBrands()),
            // so filtering or paging down to a handful of rows made brands silently
            // disappear from their own filter dropdown.
            axios.get(this.$sellerApiUrl + '/products/filter_brands')
                .then(res => { this.availableBrands = res.data.data || []; })
                .catch(() => {});
        },
        getCategories() {
            // Fetched independently of the product list/filters — same reasoning as
            // the brand list should have used all along: an options list derived
            // from the currently filtered rows shrinks to empty the moment a filter
            // matches nothing, which would make the dropdown itself look broken.
            axios.get(this.$sellerApiUrl + '/products/filter_categories')
                .then(res => { this.availableCategories = res.data.data || []; })
                .catch(() => {});
        },

        openLightbox(src) {
            this.lightboxSources = [src];
            this.toggler = !this.toggler;
        },
        handleClose() { this.toggler = false; },

        saveRow(row) {
            row._saving = true;
            axios.post(this.$sellerApiUrl + '/products/update', {
                product_variant_id: row.product_variant_id,
                mrp: row.mrp,
                selling_price: row.selling_price,
                stock: row.stock,
                status: row.status,
                is_free_only: row.is_free_only ? 1 : 0,
                allow_loose_qty: row.allow_loose_qty ? 1 : 0,
                min_qty: row.min_qty != null && row.min_qty !== '' ? row.min_qty : null,
                max_qty_mode: row.max_qty_mode || '',
                max_qty_value: row.max_qty_mode && row.max_qty_value != null ? row.max_qty_value : '',
                cancelable_status: row.cancelable_status ? 1 : 0,
                return_status: row.return_status ? 1 : 0,
                return_days: row.return_status && row.return_days ? row.return_days : 1,
            }).then(res => {
                row._saving = false;
                if (res.data.status) {
                    if (res.data.data && res.data.data.seller_product_id) {
                        row.seller_product_id = res.data.data.seller_product_id;
                    }
                    this.showMessage('success', res.data.message || __('product_updated_successfully'));
                } else {
                    this.showError(res.data.message);
                }
            }).catch(err => {
                row._saving = false;
                const msg = (err.response && err.response.data && err.response.data.message) || __('something_went_wrong');
                this.showError(msg);
            });
        },
        toggleStatus(row, event) {
            const newStatus = event.target.checked ? 1 : 0;
            row.status = newStatus;
            axios.post(this.$sellerApiUrl + '/products/toggle_status', {
                product_variant_id: row.product_variant_id,
                status: newStatus,
            }).catch(err => {
                row.status = newStatus === 1 ? 0 : 1;
                const msg = (err.response && err.response.data && err.response.data.message) || __('something_went_wrong');
                this.showError(msg);
            });
        },

        openSlabs(row) {
            this.slabTarget = row;
            this.slabDraft = (row.slab_prices || []).map(s => ({ ...s }));
            this.slabModalOpen = true;
        },
        addSlab() {
            const isLoose = !!(this.slabTarget && this.slabTarget.allow_loose_qty);
            const step = isLoose ? 0 : (parseFloat(this.slabTarget && this.slabTarget.secondary_unit_value) || 0);
            const defaultMinQty = (!this.slabDraft.length && step > 0) ? step : null;
            this.slabDraft.push({ min_qty: defaultMinQty, max_qty: null, price: null });
        },
        removeSlab(idx) {
            this.slabDraft.splice(idx, 1);
        },
        saveSlabs() {
            if (!this.slabTarget.seller_product_id) {
                this.showError(__('save_price_first_before_slabs'));
                return;
            }
            for (const s of this.slabDraft) {
                if (!s.min_qty || !s.price) {
                    this.showError(__('slab_min_qty_and_price_required'));
                    return;
                }
                if (s.max_qty && s.max_qty <= s.min_qty) {
                    this.showError(__('slab_max_qty_must_be_greater_than_min_qty'));
                    return;
                }
            }
            const step = this.slabTarget.allow_loose_qty ? 0 : (parseFloat(this.slabTarget.secondary_unit_value) || 0);
            const sorted = this.slabDraft.slice().sort((a, b) => a.min_qty - b.min_qty);
            if (step > 0) {
                if (sorted[0].min_qty !== step) {
                    this.showError(__('slab_must_start_at_moq').replace(':moq', step));
                    return;
                }
                for (let i = 0; i < sorted.length; i++) {
                    const s = sorted[i];
                    const isLast = i === sorted.length - 1;
                    if (!s.max_qty && !isLast) {
                        this.showError(__('only_last_slab_can_be_open_ended'));
                        return;
                    }
                }
            }
            for (let i = 1; i < sorted.length; i++) {
                const prevMax = sorted[i - 1].max_qty;
                const curMin = sorted[i].min_qty;
                const curMax = sorted[i].max_qty;
                if (prevMax === null || curMin <= prevMax) {
                    this.showError(__('slab_ranges_must_be_contiguous'));
                    return;
                }
                if (step > 0) {
                    // The next orderable quantity after the previous slab's max must
                    // fall inside this slab — otherwise it's an orderable amount that
                    // no slab prices.
                    const nextReachable = Math.ceil((prevMax + 1) / step) * step;
                    const inRange = nextReachable >= curMin && (curMax === null || nextReachable <= curMax);
                    if (!inRange) {
                        this.showError(__('slab_ranges_must_be_contiguous'));
                        return;
                    }
                } else if (prevMax + 1 !== curMin) {
                    this.showError(__('slab_ranges_must_be_contiguous'));
                    return;
                }
            }
            this.slabSaving = true;
            axios.post(this.$sellerApiUrl + '/products/save_slabs', {
                seller_product_id: this.slabTarget.seller_product_id,
                slabs: this.slabDraft,
            }).then(res => {
                this.slabSaving = false;
                if (res.data.status) {
                    this.slabTarget.slab_prices = this.slabDraft.slice();
                    this.slabModalOpen = false;
                    this.showMessage('success', res.data.message || __('slab_prices_saved_successfully'));
                } else {
                    this.showError(res.data.message);
                }
            }).catch(err => {
                this.slabSaving = false;
                const msg = (err.response && err.response.data && err.response.data.message) || __('something_went_wrong');
                this.showError(msg);
            });
        },
    },
};
</script>

<style scoped>
/* Colours come from the --ui-* tokens that modern.css defines on .ui-modern (the seller layout) */
.mp-busy { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 36px 0; color: var(--ui-muted); font-size: 14px; }
.mp-muted { font-size: 13px; color: var(--ui-muted); }
.mp-id { font-size: 13px; font-weight: 600; color: var(--ui-muted); white-space: nowrap; }
.mp-zoom { cursor: zoom-in; }
.mp-thumb--blank { display: flex; align-items: center; justify-content: center; color: var(--ui-slate); font-size: 16px; }

/* name + brand / free-item tags */
.mp-name { display: flex; flex-direction: column; gap: 4px; min-width: 180px; }
.mp-name strong { font-size: 14px; font-weight: 700; color: var(--ui-text); }
.mp-name__meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }

/* inline-edit inputs */
.mp-input {
    height: 38px; width: 100%; padding: 0 10px; border-radius: 10px; border: 1px solid var(--ui-border);
    background: var(--ui-card); color: var(--ui-text); font-size: 14px; outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.mp-input:focus { border-color: var(--ui-primary); box-shadow: 0 0 0 3px var(--ui-primary-soft); }
.mp-input:disabled { background: var(--ui-soft); color: var(--ui-muted); cursor: not-allowed; }
.mp-input--plain { min-width: 84px; max-width: 110px; }
.mp-input--narrow { min-width: 70px; max-width: 90px; }
.mp-input--days { min-width: 64px; width: 70px; }
/* currency prefix + input that read as one field */
.mp-money {
    display: flex; align-items: center; min-width: 100px; max-width: 130px; height: 38px; padding-left: 10px; border-radius: 10px;
    border: 1px solid var(--ui-border); background: var(--ui-card); color: var(--ui-muted); font-size: 13px; font-weight: 600;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.mp-money:focus-within { border-color: var(--ui-primary); box-shadow: 0 0 0 3px var(--ui-primary-soft); }
.mp-money .mp-input { border: 0; box-shadow: none; background: transparent; padding-left: 6px; height: 100%; }
.mp-money .mp-input:disabled { background: transparent; }
.mp-info { color: var(--ui-slate); cursor: help; }

/* switches line up under their (left-aligned) column header */
.mp-switch { margin: 0; min-height: 0; }

/* slab count button */
.mp-slabs {
    display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 12px; border-radius: 10px;
    border: 1px solid var(--ui-border); background: var(--ui-card); color: var(--ui-muted); font-size: 13px; font-weight: 600; cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
.mp-slabs:hover:not(:disabled) { background: var(--ui-soft); color: var(--ui-text); }
.mp-slabs--set { background: var(--ui-blue-bg); border-color: transparent; color: var(--ui-blue-fg); }
.mp-slabs:disabled { opacity: 0.5; cursor: not-allowed; }

/* row save */
.mp-save {
    width: 38px; height: 38px; display: inline-flex; align-items: center; justify-content: center; padding: 0; border: 0; border-radius: 10px;
    background: var(--ui-primary); color: #fff; font-size: 14px; cursor: pointer; transition: filter 0.15s ease;
}
.mp-save:hover:not(:disabled) { filter: brightness(0.92); }
.mp-save:disabled { opacity: 0.7; cursor: default; }

/* empty-state button */
.mp-btn {
    display: inline-flex; align-items: center; gap: 8px; height: 40px; margin-top: 8px; padding: 0 16px; border-radius: 12px;
    border: 1px solid var(--ui-border); background: var(--ui-card); color: var(--ui-text); font-size: 13.5px; font-weight: 600; cursor: pointer;
}
.mp-btn:hover { background: var(--ui-soft); }

/* footer count sits right after the page-size picker */
.mp-count { flex: 1; font-size: 13px; color: var(--ui-muted); white-space: nowrap; }

/* max allowed qty */
.max-qty-head {
    text-align: left;
    line-height: 1.3;
}

.max-qty-cell {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    min-width: 150px;
    padding: 4px 0;
}

.max-qty-select,
.max-qty-input {
    width: 100%;
    max-width: none;
}

.max-qty-hint {
    font-size: 12px;
    color: var(--ui-muted);
    line-height: 1.4;
}

@media (max-width: 767px) {
    .mp-count { flex: none; margin-left: auto; }
    .mp-name { min-width: 0; }
    .mp-input--plain, .mp-input--narrow { max-width: none; }
}
</style>
