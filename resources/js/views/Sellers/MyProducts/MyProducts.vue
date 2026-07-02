<template>
    <div>
        <div class="page-heading">
            <div class="row">
                <div class="col-12 col-md-6 order-md-1 order-last">
                    <h3>{{ __('my_products') }}</h3>
                </div>
                <div class="col-12 col-md-6 order-md-2 order-first">
                    <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item">
                                <router-link to="/seller/dashboard">{{ __('dashboard') }}</router-link>
                            </li>
                            <li class="breadcrumb-item active" aria-current="page">{{ __('my_products') }}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div class="row">
                <div class="col-12 col-md-12 order-md-1 order-last">
                    <div class="card">

                        <div class="card-header">
                            <h4>{{ __('my_products') }}</h4>
                        </div>

                        <div class="card-body">
                            <b-row class="mb-3">
                                <b-col md="3" class="mb-3">
                                    <h6 class="box-title">{{ __('brand') }}</h6>
                                    <select v-model="brandFilter" @change="getRecords()" class="form-control form-select">
                                        <option :value="null">{{ __('all') }}</option>
                                        <option v-for="b in availableBrands" :key="b.id" :value="b.id">{{ b.name }}</option>
                                    </select>
                                </b-col>
                                <b-col md="3" class="mb-3">
                                    <h6 class="box-title">{{ __('status') }}</h6>
                                    <select v-model="activeFilter" @change="getRecords()" class="form-control form-select">
                                        <option :value="null">{{ __('all_products') }}</option>
                                        <option value="1">{{ __('activated_only') }}</option>
                                    </select>
                                </b-col>
                                <b-col md="3" class="mb-3">
                                    <h6 class="box-title">{{ __('search') }}</h6>
                                    <b-form-input id="filter-input" v-model="filter" type="search"
                                        :placeholder="__('search_by_name_sku_hsn')" @input="onFilterChange()"></b-form-input>
                                </b-col>
                                <b-col md="3" class="text-center mb-3 d-flex align-items-end justify-content-end">
                                    <div class="btn-group btn_tool" role="group">
                                        <button type="button" class="btn btn-primary" v-b-tooltip.hover
                                            :title="__('refresh')" @click="getRecords()">
                                            <i class="fa fa-refresh" aria-hidden="true"></i>
                                        </button>
                                        <b-dropdown dropleft menu-class="w-100 border dropdownOverflow"
                                            v-b-tooltip.hover :title="__('columns')">
                                            <template #button-content>
                                                <i class="fa fa-th-list"></i>
                                            </template>
                                            <li class="m-1" v-for="field in fields" :key="field.key">
                                                <input type="checkbox" :id="'col_' + field.key"
                                                    :disabled="visibleFields.length == 1 && field.visible"
                                                    v-model="field.visible" class="form-check-input">
                                                <label :for="'col_' + field.key">{{ field.label }}</label>
                                                <b-dropdown-divider></b-dropdown-divider>
                                            </li>
                                        </b-dropdown>
                                    </div>
                                </b-col>
                            </b-row>

                            <div v-if="!isLoading && !rows.length" class="alert alert-info">
                                {{ __('no_brands_assigned_yet') }}
                            </div>

                            <div class="table-responsive">
                                <b-table :items="rows" :fields="visibleFields" :bordered="true" :busy="isLoading"
                                    stacked="md" show-empty small>
                                    <template #table-busy>
                                        <div class="text-center text-black my-2">
                                            <b-spinner class="align-middle"></b-spinner>
                                            <strong>{{ __('loading') }}...</strong>
                                        </div>
                                    </template>

                                    <template #cell(product_variant_id)="row">
                                        {{ row.item.product_variant_id }}
                                    </template>

                                    <template #cell(image)="row">
                                        <img v-if="row.item.image" :src="$storageUrl + row.item.image"
                                            @click="openLightbox($storageUrl + row.item.image)" alt="Image"
                                            height="50" style="cursor:pointer;" />
                                        <span v-else class="text-muted">—</span>
                                        <FsLightbox :toggler="toggler" :sources="lightboxSources" :onClose="handleClose"></FsLightbox>
                                    </template>

                                    <template #cell(name)="row">
                                        <strong>{{ row.item.master_product_name }}</strong>
                                        <div class="text-muted small" v-if="row.item.parent_company">
                                            {{ row.item.parent_company }}
                                        </div>
                                    </template>

                                    <template #cell(brand)="row">
                                        {{ row.item.brand || '—' }}
                                    </template>

                                    <template #cell(sku)="row">
                                        {{ row.item.sku || '—' }}
                                    </template>

                                    <template #cell(unit)="row">
                                        <span v-if="row.item.weight">{{ row.item.weight }}</span>
                                        <span v-if="row.item.unit"> {{ row.item.unit }}</span>
                                        <span v-if="!row.item.weight && !row.item.unit">—</span>
                                    </template>

                                    <template #cell(secondary_unit)="row">
                                        <span v-if="row.item.secondary_unit_value && row.item.secondary_unit">
                                            {{ row.item.secondary_unit_value }} / {{ row.item.secondary_unit }}
                                        </span>
                                        <span v-else>—</span>
                                    </template>

                                    <template #cell(mrp)="row">
                                        <input type="number" min="0" step="0.01"
                                            class="form-control form-control-sm" v-model.number="row.item.mrp" />
                                    </template>

                                    <template #cell(selling_price)="row">
                                        <input type="number" min="0" step="0.01"
                                            class="form-control form-control-sm" v-model.number="row.item.selling_price" />
                                    </template>

                                    <template #cell(stock)="row">
                                        <input type="number" min="0" step="0.001"
                                            class="form-control form-control-sm" v-model.number="row.item.stock" />
                                    </template>



                                    <template #cell(slab_count)="row">
                                        <button class="btn btn-sm btn-outline-secondary" @click="openSlabs(row.item)">
                                            <i class="fa fa-list"></i>
                                            {{ row.item.slab_prices ? row.item.slab_prices.length : 0 }}
                                        </button>
                                    </template>

                                    <template #cell(status)="row">
                                        <div class="form-check form-switch d-flex justify-content-center">
                                            <input class="form-check-input" type="checkbox" role="switch"
                                                :checked="row.item.status == 1"
                                                @change="toggleStatus(row.item, $event)">
                                        </div>
                                    </template>

                                    <template #cell(actions)="row">
                                        <button class="btn btn-sm btn-primary" @click="saveRow(row.item)"
                                            :disabled="row.item._saving" v-b-tooltip.hover :title="__('save')">
                                            <b-spinner small v-if="row.item._saving"></b-spinner>
                                            <i v-else class="fa fa-save"></i>
                                        </button>
                                    </template>
                                </b-table>
                            </div>

                            <b-row>
                                <b-col md="2">
                                    <label>
                                        <b-form-group :label="__('per_page')" label-for="per-page-select"
                                            label-align-sm="right" label-size="sm" class="mb-0">
                                            <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"
                                                size="sm" class="form-control form-select"></b-form-select>
                                        </b-form-group>
                                    </label>
                                </b-col>
                                <b-col md="4" offset-md="6">
                                    <label>{{ __('total_records') }} :- {{ totalRows }}</label>
                                    <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
                                        align="fill" size="sm" class="my-0"></b-pagination>
                                </b-col>
                            </b-row>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Slab Pricing Modal -->
        <b-modal v-model="slabModalOpen" :title="__('slab_prices')" hide-footer size="lg" no-close-on-backdrop>
            <div v-if="slabTarget">
                <p class="mb-3">
                    <strong>{{ slabTarget.master_product_name }}</strong>
                    <span class="text-muted">— {{ __('sku') }}: {{ slabTarget.sku || '—' }}</span>
                </p>
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

export default {
    components: { FsLightbox },
    data() {
        return {
            fields: [
                { key: 'product_variant_id', label: __('id'), visible: true, class: 'text-center' },
                { key: 'image', label: __('image'), visible: true, class: 'text-center' },
                { key: 'name', label: __('name'), visible: true, class: 'text-start' },
                { key: 'brand', label: __('brand'), visible: true, class: 'text-center' },
                { key: 'sku', label: __('sku'), visible: false, class: 'text-center' },
                { key: 'unit', label: __('unit'), visible: true, class: 'text-center' },
                { key: 'secondary_unit', label: __('secondary_unit'), visible: false, class: 'text-center' },
                { key: 'mrp', label: __('mrp') + (this.$currency ? ' (' + this.$currency + ')' : ''), visible: true, class: 'text-center' },
                { key: 'selling_price', label: __('selling_price') + (this.$currency ? ' (' + this.$currency + ')' : ''), visible: true, class: 'text-center' },
                { key: 'stock', label: __('stock'), visible: true, class: 'text-center' },
                { key: 'slab_count', label: __('slabs'), visible: true, class: 'text-center' },
                { key: 'status', label: __('status'), visible: true, class: 'text-center' },
                { key: 'actions', label: __('actions'), visible: true, class: 'text-center' },
            ],
            rows: [],
            totalRows: 0,
            currentPage: 1,
            perPage: this.$perPage || 25,
            pageOptions: this.$pageOptions || [10, 25, 50, 100],
            filter: null,
            filterDebounce: null,
            brandFilter: null,
            activeFilter: null,
            availableBrands: [],
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
    },
    created() {
        this.getRecords();
    },
    watch: {
        currentPage() { this.getRecords(); },
        perPage() { this.getRecords(); },
    },
    methods: {
        onFilterChange() {
            clearTimeout(this.filterDebounce);
            this.filterDebounce = setTimeout(() => this.getRecords(), 250);
        },
        getRecords() {
            this.isLoading = true;
            axios.get(this.$sellerApiUrl + '/products', {
                params: {
                    page: this.currentPage,
                    per_page: this.perPage,
                    filter: this.filter,
                    brand_id: this.brandFilter,
                    active_only: this.activeFilter,
                },
            }).then(res => {
                this.isLoading = false;
                const data = res.data.data || [];
                this.rows = data.map(r => ({ ...r, _saving: false }));
                this.totalRows = res.data.total || 0;
                this.collectBrands();
            }).catch(() => { this.isLoading = false; });
        },
        collectBrands() {
            const seen = new Set();
            const list = [];
            this.rows.forEach(r => {
                if (r.brand_id && !seen.has(r.brand_id)) {
                    seen.add(r.brand_id);
                    list.push({ id: r.brand_id, name: r.brand });
                }
            });
            this.availableBrands = list;
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
            this.slabDraft.push({ min_qty: null, max_qty: null, price: null });
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
