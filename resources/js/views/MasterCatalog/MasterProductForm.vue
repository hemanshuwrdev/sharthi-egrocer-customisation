<template>
    <div>
        <div class="page-heading">
            <div class="row">
                <div class="col-12 col-md-6 order-md-1 order-last">
                    <h3>{{ isEdit ? __('edit_master_product') : __('add_master_product') }}</h3>
                </div>
                <div class="col-12 col-md-6 order-md-2 order-first">
                    <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item">
                                <router-link to="/dashboard">{{ __('dashboard') }}</router-link>
                            </li>
                            <li class="breadcrumb-item">
                                <router-link to="/master_catalog/products">{{ __('master_catalog') }}</router-link>
                            </li>
                            <li class="breadcrumb-item active" aria-current="page">
                                {{ isEdit ? __('edit') : __('add') }}
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>

        <form @submit.prevent="save">
            <!-- Product details -->
            <div class="card">
                <div class="card-header">
                    <h4>{{ __('product_details') }}</h4>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="form-group col-md-6">
                            <label class="required">{{ __('name') }}</label>
                            <input type="text" class="form-control" v-model="product.name" required />
                        </div>

                        <!-- Parent Company (searchable + inline create) -->
                        <div class="form-group col-md-6 position-relative">
                            <label>{{ __('parent_company') }}</label>
                            <input
                                type="text"
                                class="form-control"
                                v-model="pcQuery"
                                @input="onPcInput"
                                @focus="pcDropdownOpen = true"
                                @blur="onPcBlur"
                                :placeholder="__('search_or_create')"
                                autocomplete="off" />
                            <ul v-if="pcDropdownOpen" class="list-group position-absolute w-100 shadow-sm" style="z-index: 50; max-height: 240px; overflow-y: auto;">
                                <li
                                    v-for="pc in pcResults"
                                    :key="pc.id"
                                    class="list-group-item list-group-item-action py-2"
                                    @mousedown.prevent="selectParentCompany(pc)">
                                    {{ pc.name }}
                                </li>
                                <li
                                    v-if="pcQuery && !pcExactMatch"
                                    class="list-group-item list-group-item-action py-2 text-primary"
                                    @mousedown.prevent="createParentCompany">
                                    <i class="fa fa-plus"></i> {{ __('create') }} "{{ pcQuery }}" {{ __('as_new_parent_company') }}
                                </li>
                                <li v-if="!pcResults.length && !pcQuery" class="list-group-item text-muted py-2">
                                    {{ __('start_typing_to_search') }}
                                </li>
                            </ul>
                        </div>

                        <div class="form-group col-md-6">
                            <label>{{ __('brand') }}</label>
                            <select class="form-control" v-model="product.brand_id">
                                <option :value="null">-- {{ __('select') }} --</option>
                                <option v-for="b in brands" :key="b.id" :value="b.id">{{ b.name }}</option>
                            </select>
                        </div>

                        <div class="form-group col-md-6">
                            <label>{{ __('category') }}</label>
                            <select class="form-control" v-model="product.category_id">
                                <option :value="null">-- {{ __('select') }} --</option>
                                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                            </select>
                        </div>

                        <div class="form-group col-md-6">
                            <label>{{ __('tax') }}</label>
                            <select class="form-control" v-model="product.tax_id">
                                <option :value="null">-- {{ __('select') }} --</option>
                                <option v-for="t in taxes" :key="t.id" :value="t.id">{{ t.title }} ({{ t.percentage }}%)</option>
                            </select>
                        </div>

                        <div class="form-group col-md-6">
                            <label>{{ __('hsn_code') }}</label>
                            <input type="text" class="form-control" v-model="product.hsn" />
                        </div>

                        <div class="form-group col-md-6">
                            <label>{{ __('type') }}</label>
                            <div>
                                <b-form-radio-group
                                    v-model="product.type"
                                    :options="[
                                        { text: __('single'), value: 'single' },
                                        { text: __('variable'), value: 'variable' }
                                    ]"
                                    buttons
                                    button-variant="outline-primary"
                                    @change="onTypeChange">
                                </b-form-radio-group>
                            </div>
                        </div>

                        <div class="form-group col-md-6">
                            <label>{{ __('image') }}</label>
                            <input type="file" class="form-control" accept="image/*" @change="onProductImage" />
                            <div v-if="productImagePreview" class="mt-2">
                                <img :src="productImagePreview" height="80" />
                            </div>
                        </div>

                        <div class="form-group col-md-12">
                            <label>{{ __('short_description') }}</label>
                            <textarea class="form-control" rows="2" v-model="product.short_description"></textarea>
                        </div>

                        <div class="form-group col-md-12">
                            <label>{{ __('description') }}</label>
                            <textarea class="form-control" rows="4" v-model="product.description"></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Variants -->
            <div class="card mt-3">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h4 class="mb-0">{{ __('variants') }}</h4>
                    <button
                        v-if="product.type === 'variable'"
                        type="button"
                        class="btn btn-sm btn-outline-primary"
                        @click="addVariantRow">
                        <i class="fa fa-plus"></i> {{ __('add_variant') }}
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th>{{ __('sku') }}</th>
                                    <th>{{ __('unit') }}</th>
                                    <th>{{ __('secondary_unit') }}</th>
                                    <th>{{ __('secondary_value') }}</th>
                                    <th>{{ __('weight') }}</th>
                                    <th>{{ __('image') }}</th>
                                    <th>{{ __('status') }}</th>
                                    <th v-if="product.type === 'variable'" style="width:60px;">{{ __('actions') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(v, idx) in visibleVariants" :key="v._key">
                                    <td>
                                        <input type="text" class="form-control form-control-sm" v-model="v.sku" />
                                    </td>
                                    <td>
                                        <select class="form-control form-control-sm" v-model="v.unit_id">
                                            <option :value="null">--</option>
                                            <option v-for="u in units" :key="u.id" :value="u.id">{{ u.name }}</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select class="form-control form-control-sm" v-model="v.secondary_unit_id">
                                            <option :value="null">--</option>
                                            <option v-for="u in units" :key="u.id" :value="u.id">{{ u.name }}</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input type="number" class="form-control form-control-sm" step="0.01" v-model.number="v.secondary_unit_value" />
                                    </td>
                                    <td>
                                        <input type="number" class="form-control form-control-sm" step="0.001" v-model.number="v.weight" />
                                    </td>
                                    <td>
                                        <input type="file" class="form-control form-control-sm" accept="image/*" @change="onVariantImage($event, v)" />
                                        <div v-if="v._preview || v.image" class="mt-1">
                                            <img :src="v._preview || ($storageUrl + v.image)" height="40" />
                                        </div>
                                    </td>
                                    <td>
                                        <select class="form-control form-control-sm" v-model.number="v.status">
                                            <option :value="1">{{ __('active') }}</option>
                                            <option :value="0">{{ __('deactive') }}</option>
                                        </select>
                                    </td>
                                    <td v-if="product.type === 'variable'">
                                        <button
                                            type="button"
                                            class="btn btn-sm btn-danger"
                                            :disabled="visibleVariants.length === 1"
                                            @click="removeVariantRow(v)">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <small class="text-muted">
                        {{ product.type === 'single'
                            ? __('single_type_one_variant_hint')
                            : __('variable_type_multiple_variants_hint') }}
                    </small>
                </div>
            </div>

            <div class="card-footer mt-3 text-end">
                <router-link to="/master_catalog/products" class="btn btn-secondary me-2">
                    {{ __('cancel') }}
                </router-link>
                <button type="submit" class="btn btn-primary" :disabled="isSaving">
                    {{ __('save') }}
                    <b-spinner small v-if="isSaving"></b-spinner>
                </button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    props: ['id'],
    data() {
        return {
            isSaving: false,
            isEdit: false,

            product: {
                id: null,
                name: '',
                parent_company_id: null,
                brand_id: null,
                category_id: null,
                tax_id: null,
                hsn: '',
                short_description: '',
                description: '',
                type: 'single',
                status: 1,
                image: null,
            },
            productImageFile: null,
            productImagePreview: null,

            variants: [this.blankVariant()],

            brands: [],
            categories: [],
            taxes: [],
            units: [],

            // Parent company picker
            pcQuery: '',
            pcResults: [],
            pcDropdownOpen: false,
            pcDebounce: null,
        };
    },
    computed: {
        visibleVariants() {
            return this.variants.filter(v => !v._delete);
        },
        pcExactMatch() {
            const q = (this.pcQuery || '').trim().toLowerCase();
            return this.pcResults.some(pc => (pc.name || '').toLowerCase() === q);
        },
    },
    created() {
        this.isEdit = !!this.id;
        this.fetchLookups();
        if (this.isEdit) {
            this.fetchProduct();
        }
    },
    methods: {
        blankVariant() {
            return {
                _key: Math.random().toString(36).slice(2),
                id: null,
                sku: '',
                unit_id: null,
                secondary_unit_id: null,
                secondary_unit_value: null,
                weight: null,
                image: null,
                status: 1,
                _file: null,
                _preview: null,
                _delete: false,
            };
        },
        fetchLookups() {
            axios.get(this.$apiUrl + '/products/brands/get').then(r => {
                this.brands = r.data.data || [];
            });
            axios.get(this.$apiUrl + '/categories', { params: { per_page: 1000 } }).then(r => {
                this.categories = r.data.data || [];
            }).catch(() => {});
            axios.get(this.$apiUrl + '/products/taxes').then(r => {
                this.taxes = r.data.data || [];
            }).catch(() => {});
            axios.get(this.$apiUrl + '/units/get').then(r => {
                this.units = r.data.data || [];
            }).catch(() => {});
        },
        fetchProduct() {
            axios.get(this.$apiUrl + '/master_catalog/products/edit/' + this.id).then(r => {
                const p = r.data.data;
                if (!p) return;
                this.product = {
                    id: p.id,
                    name: p.name,
                    parent_company_id: p.parent_company_id,
                    brand_id: p.brand_id,
                    category_id: p.category_id,
                    tax_id: p.tax_id,
                    hsn: p.hsn,
                    short_description: p.short_description,
                    description: p.description,
                    type: p.type || 'single',
                    status: p.status,
                    image: p.image,
                };
                this.pcQuery = p.parent_company ? p.parent_company.name : '';
                if (p.image) {
                    this.productImagePreview = this.$storageUrl + p.image;
                }
                if (Array.isArray(p.variants) && p.variants.length) {
                    this.variants = p.variants.map(v => ({
                        _key: Math.random().toString(36).slice(2),
                        id: v.id,
                        sku: v.sku,
                        unit_id: v.unit_id,
                        secondary_unit_id: v.secondary_unit_id,
                        secondary_unit_value: v.secondary_unit_value,
                        weight: v.weight,
                        image: v.image,
                        status: v.status,
                        _file: null,
                        _preview: null,
                        _delete: false,
                    }));
                }
            });
        },
        onProductImage(e) {
            const file = e.target.files[0];
            if (!file) return;
            this.productImageFile = file;
            this.productImagePreview = URL.createObjectURL(file);
        },
        onVariantImage(e, v) {
            const file = e.target.files[0];
            if (!file) return;
            v._file = file;
            v._preview = URL.createObjectURL(file);
        },
        onTypeChange(value) {
            if (value === 'single' && this.visibleVariants.length > 1) {
                this.variants = [this.visibleVariants[0]];
            }
        },
        addVariantRow() {
            this.variants.push(this.blankVariant());
        },
        removeVariantRow(v) {
            if (v.id) {
                v._delete = true;
            } else {
                this.variants = this.variants.filter(x => x._key !== v._key);
            }
        },

        // Parent company picker
        onPcInput() {
            clearTimeout(this.pcDebounce);
            this.product.parent_company_id = null;
            this.pcDropdownOpen = true;
            this.pcDebounce = setTimeout(() => this.searchPc(), 250);
        },
        searchPc() {
            axios.get(this.$apiUrl + '/master_catalog/parent_companies/search', {
                params: { q: this.pcQuery }
            }).then(r => {
                this.pcResults = r.data.data || [];
            });
        },
        selectParentCompany(pc) {
            this.pcQuery = pc.name;
            this.product.parent_company_id = pc.id;
            this.pcDropdownOpen = false;
        },
        createParentCompany() {
            axios.post(this.$apiUrl + '/master_catalog/parent_companies/find_or_create', {
                name: this.pcQuery
            }).then(r => {
                const pc = r.data.data;
                if (pc) {
                    this.selectParentCompany(pc);
                }
            });
        },
        onPcBlur() {
            setTimeout(() => { this.pcDropdownOpen = false; }, 150);
        },

        save() {
            if (!this.product.name) {
                this.showError(__('name_is_required'));
                return;
            }
            if (!this.visibleVariants.length) {
                this.showError(__('at_least_one_variant_required'));
                return;
            }

            this.isSaving = true;
            const fd = new FormData();
            fd.append('name', this.product.name);
            if (this.product.parent_company_id) fd.append('parent_company_id', this.product.parent_company_id);
            if (this.product.brand_id) fd.append('brand_id', this.product.brand_id);
            if (this.product.category_id) fd.append('category_id', this.product.category_id);
            if (this.product.tax_id) fd.append('tax_id', this.product.tax_id);
            if (this.product.hsn) fd.append('hsn', this.product.hsn);
            if (this.product.short_description) fd.append('short_description', this.product.short_description);
            if (this.product.description) fd.append('description', this.product.description);
            fd.append('type', this.product.type);
            fd.append('status', this.product.status);
            if (this.productImageFile) fd.append('image', this.productImageFile);

            this.variants.forEach((v, idx) => {
                if (v.id) fd.append(`variants[${idx}][id]`, v.id);
                if (v._delete) fd.append(`variants[${idx}][_delete]`, 1);
                fd.append(`variants[${idx}][sku]`, v.sku || '');
                if (v.unit_id) fd.append(`variants[${idx}][unit_id]`, v.unit_id);
                if (v.secondary_unit_id) fd.append(`variants[${idx}][secondary_unit_id]`, v.secondary_unit_id);
                if (v.secondary_unit_value != null) fd.append(`variants[${idx}][secondary_unit_value]`, v.secondary_unit_value);
                if (v.weight != null) fd.append(`variants[${idx}][weight]`, v.weight);
                fd.append(`variants[${idx}][status]`, v.status);
                if (v._file) fd.append(`variants[${idx}][image]`, v._file);
            });

            const url = this.isEdit
                ? this.$apiUrl + '/master_catalog/products/update'
                : this.$apiUrl + '/master_catalog/products/save';
            if (this.isEdit) fd.append('id', this.product.id);

            axios.post(url, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(res => {
                    this.isSaving = false;
                    if (res.data.status) {
                        this.showMessage('success', res.data.message || __(this.isEdit ? 'master_product_updated_successfully' : 'master_product_saved_successfully'));
                        this.$router.push('/master_catalog/products');
                    } else {
                        this.showError(res.data.message);
                    }
                }).catch((err) => {
                    this.isSaving = false;
                    const msg = (err.response && err.response.data && err.response.data.message) || __('something_went_wrong');
                    this.showError(msg);
                });
        },
    },
};
</script>
