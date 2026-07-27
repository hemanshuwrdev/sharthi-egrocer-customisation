<template>
    <div>
        <div class="page-heading">
            <div class="row">
                <div class="col-12 col-md-6 order-md-1 order-last">
                    <h3>{{ __('brand_distributor_mappings') }}</h3>
                </div>
                <div class="col-12 col-md-6 order-md-2 order-first">
                    <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item">
                                <router-link to="/dashboard">{{ __('dashboard') }}</router-link>
                            </li>
                            <li class="breadcrumb-item active" aria-current="page">{{ __('brand_distributor_mappings') }}</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h4>{{ __('brand_distributor_mappings') }}</h4>
                        <span class="pull-right">
                            <button class="btn btn-primary" @click="openCreate">
                                {{ __('add_mapping') }}
                            </button>
                        </span>
                    </div>
                    <div class="card-body">
                        <b-row class="mb-2">
                            <b-col md="3" offset-md="8">
                                <h6 class="box-title">{{ __('search') }}</h6>
                                <b-form-input v-model="filter" type="search" :placeholder="__('search')" @input="getRecords()"></b-form-input>
                            </b-col>
                            <b-col md="1" class="text-center">
                                <button class="btn btn-primary btn_refresh" v-b-tooltip.hover :title="__('refresh')" @click="getRecords()">
                                    <i class="fa fa-refresh"></i>
                                </button>
                            </b-col>
                        </b-row>

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

                            <template #cell(cities)="row">
                                <div class="d-flex flex-wrap justify-content-center align-items-center gap-1 py-1">
                                    <span v-for="c in row.item.cities" :key="c.id" class="badge bg-secondary">{{ c.name }}</span>
                                    <span class="badge bg-light text-dark border fw-bold">{{ row.item.city_count }} {{ __('zones') }}</span>
                                </div>
                            </template>

                            <template #cell(actions)="row">
                                <button class="btn btn-sm btn-primary" @click="openEdit(row.item)" v-b-tooltip.hover :title="__('edit')">
                                    <i class="fa fa-pencil-alt"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" @click="deleteRecord(row.index, row.item)" v-b-tooltip.hover :title="__('delete')">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </template>
                        </b-table>

                        <b-row>
                            <b-col md="2" class="my-1">
                                <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right" label-size="sm" class="mb-0">
                                    <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions" size="sm" class="form-control form-select"></b-form-select>
                                </b-form-group>
                            </b-col>
                            <b-col md="4" class="my-1" offset-md="6">
                                <label>{{ __('total_records') }} :- {{ totalRows }}</label>
                                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="fill" size="sm" class="my-0"></b-pagination>
                            </b-col>
                        </b-row>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit/Create Modal -->
        <b-modal v-model="modalOpen" :title="isEdit ? __('edit_mapping') : __('add_mapping')" hide-footer no-close-on-backdrop>
            <form @submit.prevent="save">
                <div class="form-group mb-3">
                    <label class="required">{{ __('brand') }}</label>
                    <select class="form-control" v-model="form.brand_id" :disabled="isEdit" required>
                        <option :value="null">-- {{ __('select') }} --</option>
                        <option v-for="b in brands" :key="b.id" :value="b.id">{{ b.name }}</option>
                    </select>
                </div>
                <div class="form-group mb-3">
                    <label class="required">{{ __('distributor') }}</label>
                    <select class="form-control" v-model="form.seller_id" :disabled="isEdit" required>
                        <option :value="null">-- {{ __('select') }} --</option>
                        <option v-for="s in sellers" :key="s.id" :value="s.id">{{ s.store_name }}</option>
                    </select>
                </div>
                <div class="form-group mb-3">
                    <label class="required">{{ __('cities') }}</label>
                    <div style="max-height: 240px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; padding: 8px;">
                        <div v-if="!cities.length" class="text-muted">{{ __('loading') }}...</div>
                        <div v-for="c in cities" :key="c.id" class="form-check">
                            <input class="form-check-input" type="checkbox" :id="'city_' + c.id" :value="c.id" v-model="form.city_ids" />
                            <label class="form-check-label" :for="'city_' + c.id">{{ c.name }}</label>
                        </div>
                    </div>
                    <small class="text-muted">{{ __('select_one_or_more_cities') }}</small>
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
                { key: 'cities', label: __('zones'), class: 'text-center' },
                { key: 'actions', label: __('actions'), class: 'text-center' },
            ],
            mappings: [],
            totalRows: 0,
            currentPage: 1,
            perPage: this.$perPage || 10,
            pageOptions: this.$pageOptions || [5, 10, 15, 20],
            filter: null,
            isLoading: false,
            isSaving: false,

            modalOpen: false,
            isEdit: false,
            form: { brand_id: null, seller_id: null, city_ids: [] },

            brands: [],
            sellers: [],
            cities: [],
        };
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

        openCreate() {
            this.isEdit = false;
            this.form = { brand_id: null, seller_id: null, city_ids: [] };
            this.modalOpen = true;
        },
        openEdit(row) {
            this.isEdit = true;
            this.form = { brand_id: row.brand_id, seller_id: row.seller_id, city_ids: [] };
            this.modalOpen = true;
            axios.get(this.$apiUrl + '/admin/brand-mappings/get', {
                params: { brand_id: row.brand_id, seller_id: row.seller_id }
            }).then(r => {
                this.form.city_ids = (r.data.data && r.data.data.city_ids) || [];
            });
        },
        save() {
            if (!this.form.brand_id || !this.form.seller_id || !this.form.city_ids.length) {
                this.showError(__('select_brand_distributor_and_cities'));
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
