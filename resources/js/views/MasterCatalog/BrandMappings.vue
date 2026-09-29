<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('brand_distributor_mappings') }}</h3>
            <button class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap" @click="openCreate">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add_mapping') }}</span>
            </button>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input v-model="filter" type="search" :placeholder="__('search_by_brand_distributor_or_line')" @input="getRecords()"></b-form-input>
                </div>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getRecords()">
                    <i class="fa fa-refresh"></i>
                </button>
            </div>

            <div class="table-responsive">
                <b-table
                    :items="mappings"
                    :fields="fields"
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

                    <template #cell(brand)="row">
                        {{ row.item.brand ? row.item.brand.name : '-' }}
                        <span v-if="row.item.brand && row.item.brand.is_overlap_allowed == 1"
                            class="badge bg-info ms-2">{{ __('overlap_allowed') }}</span>
                    </template>

                    <template #cell(seller)="row">
                        {{ row.item.seller ? row.item.seller.store_name : '-' }}
                    </template>

                    <template #cell(line)="row">
                        <span class="badge" :class="row.item.brand_line_id ? 'bg-secondary' : 'bg-light text-dark border'">
                            {{ row.item.brand_line_name }}
                        </span>
                    </template>

                    <template #cell(cities)="row">
                        <div class="d-flex flex-wrap justify-content-center align-items-center gap-1 py-1">
                            <span v-for="c in row.item.cities" :key="c.id" class="badge bg-secondary">{{ c.name }}</span>
                            <span class="badge bg-light text-dark border fw-bold">{{ row.item.city_count }} {{ __('zones') }}</span>
                        </div>
                    </template>

                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <button class="list-action-btn is-edit" @click="openEdit(row.item)" v-b-tooltip.hover :title="__('edit')">
                                <i class="fa fa-pencil-alt"></i>
                            </button>
                            <button class="list-action-btn is-delete" @click="deleteRecord(row.index, row.item)" v-b-tooltip.hover :title="__('delete')">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </template>
                </b-table>
            </div>

            <div class="list-footer">
                <div class="list-perpage">
                    <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right" label-size="sm" class="mb-0">
                        <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions" size="sm" class="form-control form-select"></b-form-select>
                    </b-form-group>
                </div>
                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="fill" size="sm" class="list-pagination"></b-pagination>
            </div>
        </div>

        <!-- Edit/Create Modal -->
        <b-modal v-model="modalOpen" :title="isEdit ? __('edit_mapping') : __('add_mapping')" hide-footer no-close-on-backdrop>
            <form @submit.prevent="save">
                <div class="form-group mb-3">
                    <label class="required">{{ __('brand') }}</label>
                    <select class="form-control" v-model="form.brand_id" :disabled="isEdit" @change="onBrandChange" required>
                        <option :value="null">-- {{ __('select') }} --</option>
                        <option v-for="b in brands" :key="b.id" :value="b.id">{{ b.name }}</option>
                    </select>
                </div>
                <div class="form-group mb-3">
                    <label>{{ __('line') }}</label>
                    <select class="form-control" v-model="form.brand_line_id" :disabled="isEdit || !form.brand_id">
                        <option :value="null">{{ __('all_lines') }}</option>
                        <option v-for="l in modalBrandLines" :key="l.id" :value="l.id">{{ l.name }}</option>
                    </select>
                    <small class="text-muted">{{ __('all_lines_distributor_supplies_every_product_of_this_brand') }}</small>
                </div>
                <div class="form-group mb-3">
                    <label class="required">{{ __('distributor') }}</label>
                    <select class="form-control" v-model="form.seller_id" :disabled="isEdit" @change="onDistributorChange" required>
                        <option :value="null">-- {{ __('select') }} --</option>
                        <option v-for="s in sellers" :key="s.id" :value="s.id">{{ s.store_name }}</option>
                    </select>
                </div>
                <!-- Zones are taken directly from the distributor's own assigned territory
                     (sellers.city_id) — no manual picking for now, see distributorCityOptions. -->
                <div class="form-group mb-3" v-if="form.seller_id && !distributorCityOptions.length">
                    <div class="text-danger">{{ __('this_distributor_has_no_zones_assigned_set_up_geo_fences_first') }}</div>
                </div>
                <div class="text-end">
                    <button type="button" class="btn btn-secondary me-2" @click="modalOpen = false">{{ __('cancel') }}</button>
                    <button type="submit" class="btn btn-primary" :disabled="isSaving">
                        {{ __('save') }}
                        <b-spinner small v-if="isSaving"></b-spinner>
                    </button>
                </div>
            </form>
        </b-modal>
    </div>
</template>

<script>
export default {
    data() {
        return {
            fields: [
                { key: 'brand', label: __('brand') ? __('brand').charAt(0).toUpperCase() + __('brand').slice(1) : 'Brand', class: 'text-center' },
                { key: 'seller', label: __('distributor'), class: 'text-center' },
                { key: 'line', label: __('line'), class: 'text-center' },
                { key: 'cities', label: __('zones'), class: 'text-center' },
                { key: 'actions', label: __('actions'), class: 'text-center' },
            ],
            mappings: [],
            totalRows: 0,
            currentPage: 1,
            perPage: 10,
            pageOptions: this.$pageOptions || [5, 10, 15, 20],
            filter: null,
            isLoading: false,
            isSaving: false,

            modalOpen: false,
            isEdit: false,
            form: { brand_id: null, brand_line_id: null, seller_id: null, city_ids: [] },

            brands: [],
            sellers: [],
            cities: [],
            modalBrandLines: [],
        };
    },
    computed: {
        // A mapping always takes the selected distributor's whole geo-fenced territory
        // (sellers.city_id) — manual zone picking is hidden for now, see save().
        distributorCityOptions() {
            if (!this.form.seller_id) return [];
            const seller = this.sellers.find(s => s.id === this.form.seller_id);
            const territoryIds = (seller && seller.city_id)
                ? String(seller.city_id).split(',').map(id => parseInt(id, 10)).filter(id => id > 0)
                : [];
            return this.cities.filter(c => territoryIds.includes(c.id));
        },
    },
    created() {
        this.getRecords();
        this.fetchLookups();
    },
    watch: {
        currentPage() { this.getRecords(); },
        perPage() { this.getRecords(); },
    },
    methods: {
        getRecords() {
            this.isLoading = true;
            axios.get(this.$apiUrl + '/admin/brand-mappings', {
                params: { page: this.currentPage, per_page: this.perPage, filter: this.filter },
            }).then(res => {
                this.isLoading = false;
                this.mappings = res.data.data || [];
                this.totalRows = res.data.total || 0;
            }).catch(() => { this.isLoading = false; });
        },
        fetchLookups() {
            axios.get(this.$apiUrl + '/products/brands/get').then(r => { this.brands = r.data.data || []; });
            axios.get(this.$apiUrl + '/sellers', { params: { per_page: 1000 } }).then(r => {
                this.sellers = r.data.data || [];
            }).catch(() => {});
            axios.get(this.$apiUrl + '/cities').then(r => {
                const payload = r.data && r.data.data ? r.data.data : null;
                this.cities = Array.isArray(payload) ? payload : (payload && payload.cities ? payload.cities : []);
            });
        },

        onBrandChange() {
            this.form.brand_line_id = null;
            this.modalBrandLines = [];
            if (!this.form.brand_id) return;
            axios.get(this.$apiUrl + '/admin/brands/' + this.form.brand_id + '/lines').then(r => {
                this.modalBrandLines = (r.data.data || []).filter(l => l.status == 1);
            }).catch(() => {});
        },
        onDistributorChange() {
            // Zone picking is hidden for now — this just keeps distributorCityOptions'
            // "no zones assigned" check reactive as soon as a distributor is picked.
            this.form.city_ids = this.distributorCityOptions.map(c => c.id);
        },
        openCreate() {
            this.isEdit = false;
            this.form = { brand_id: null, brand_line_id: null, seller_id: null, city_ids: [] };
            this.modalBrandLines = [];
            this.modalOpen = true;
        },
        openEdit(row) {
            this.isEdit = true;
            this.form = { brand_id: row.brand_id, brand_line_id: row.brand_line_id, seller_id: row.seller_id, city_ids: [] };
            this.modalOpen = true;
            if (row.brand_id) {
                axios.get(this.$apiUrl + '/admin/brands/' + row.brand_id + '/lines').then(r => {
                    this.modalBrandLines = r.data.data || [];
                }).catch(() => {});
            }
        },
        save() {
            if (!this.form.brand_id || !this.form.seller_id) {
                this.showError(__('select_brand_and_distributor'));
                return;
            }
            // Zone picking is hidden for now — always take the distributor's whole
            // current territory rather than whatever was last loaded into the form.
            this.form.city_ids = this.distributorCityOptions.map(c => c.id);
            if (!this.form.city_ids.length) {
                this.showError(__('this_distributor_has_no_zones_assigned_set_up_geo_fences_first'));
                return;
            }
            this.isSaving = true;
            axios.post(this.$apiUrl + '/admin/brand-mappings', this.form).then(res => {
                this.isSaving = false;
                if (res.data.status) {
                    this.showMessage('success', res.data.message);
                    this.modalOpen = false;
                    this.getRecords();
                } else {
                    this.showError(res.data.message);
                }
            }).catch(err => {
                this.isSaving = false;
                const msg = (err.response && err.response.data && err.response.data.message) || __('something_went_wrong');
                this.showError(msg);
            });
        },
        deleteRecord(index, item) {
            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('this_will_remove_distributor_access_to_this_brand'),
                confirmButtonText: __('yes_sure'),
                cancelButtonText: __('cancel'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#37a279',
                cancelButtonColor: '#d33',
            }).then(result => {
                if (result.value) {
                    axios.post(this.$apiUrl + '/admin/brand-mappings/delete', {
                        brand_id: item.brand_id,
                        brand_line_id: item.brand_line_id,
                        seller_id: item.seller_id,
                    }).then(res => {
                        this.showMessage('success', res.data.message);
                        this.mappings.splice(index, 1);
                    });
                }
            });
        },
    },
};
</script>
