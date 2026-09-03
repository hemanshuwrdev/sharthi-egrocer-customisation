<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('master_products') }}</h3>
            <router-link to="/master_catalog/products/create"
                class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add_master_product') }}</span>
            </router-link>
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
                        @input="getRecords()"
                    ></b-form-input>
                </div>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')"
                    @click="getRecords()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                <b-table
                    :items="products"
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

                    <template #cell(image)="row">
                        <p v-if="!row.item.image">{{ __('no_image') }}</p>
                        <img :src="$storageUrl + row.item.image" height="50" v-else />
                    </template>

                    <template #cell(parent_company)="row">
                        {{ row.item.parent_company ? row.item.parent_company.name : '-' }}
                    </template>

                    <template #cell(brand)="row">
                        {{ row.item.brand ? row.item.brand.name : '-' }}
                    </template>

                    <template #cell(variants_count)="row">
                        <span class="badge bg-info">{{ row.item.variants_count }}</span>
                    </template>

                    <template #cell(status)="row">
                        <span v-if="row.item.status == 1" class="badge bg-success">{{ __('active') }}</span>
                        <span v-else class="badge bg-danger">{{ __('deactive') }}</span>
                    </template>

                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <router-link
                                :to="'/master_catalog/products/edit/' + row.item.id"
                                class="list-action-btn is-edit"
                                v-b-tooltip.hover
                                :title="__('edit')">
                                <i class="fa fa-pencil-alt"></i>
                            </router-link>
                            <button class="list-action-btn is-delete" @click="deleteRecord(row.index, row.item.id)"
                                v-b-tooltip.hover :title="__('delete')">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </template>
                </b-table>
            </div>

            <div class="list-footer">
                <div class="list-perpage">
                    <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right"
                        label-size="sm" class="mb-0">
                        <b-form-select
                            id="per-page-select"
                            v-model="perPage"
                            :options="pageOptions"
                            size="sm"
                            class="form-control form-select">
                        </b-form-select>
                    </b-form-group>
                </div>
                <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    align="fill"
                    size="sm"
                    class="list-pagination">
                </b-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            fields: [
                { key: 'id', label: __('id'), class: 'text-center', sortable: true },
                { key: 'image', label: __('image'), class: 'text-center' },
                { key: 'name', label: __('name'), class: 'text-center' },
                { key: 'parent_company', label: __('parent_company'), class: 'text-center' },
                { key: 'brand', label: __('brand') ? __('brand').charAt(0).toUpperCase() + __('brand').slice(1) : 'Brand', class: 'text-center' },
                { key: 'variants_count', label: __('variants') ? __('variants').charAt(0).toUpperCase() + __('variants').slice(1) : 'Variants', class: 'text-center' },
                { key: 'status', label: __('status'), class: 'text-center' },
                { key: 'actions', label: __('actions'), class: 'text-center' },
            ],
            totalRows: 0,
            currentPage: 1,
            perPage: this.$perPage || 10,
            pageOptions: this.$pageOptions || [5, 10, 15, 20],
            filter: null,
            isLoading: false,
            products: [],
        };
    },
    created() {
        this.getRecords();
    },
    watch: {
        currentPage() { this.getRecords(); },
        perPage() { this.getRecords(); },
    },
    methods: {
        getRecords() {
            this.isLoading = true;
            axios.get(this.$apiUrl + '/master_catalog/products', {
                params: {
                    page: this.currentPage,
                    per_page: this.perPage,
                    filter: this.filter,
                },
            }).then((response) => {
                this.isLoading = false;
                this.products = response.data.data || [];
                this.totalRows = response.data.total || 0;
            }).catch(() => {
                this.isLoading = false;
            });
        },
        deleteRecord(index, id) {
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
                    this.isLoading = true;
                    axios.post(this.$apiUrl + '/master_catalog/products/delete', { id })
                        .then((response) => {
                            this.isLoading = false;
                            this.products.splice(index, 1);
                            this.showMessage('success', response.data.message);
                        }).catch(() => {
                            this.isLoading = false;
                        });
                }
            });
        },
    },
};
</script>
