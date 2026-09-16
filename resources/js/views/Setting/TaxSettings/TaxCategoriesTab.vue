<template>
    <div class="list-surface">
        <div class="list-toolbar">
            <div class="list-search">
                <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                <b-form-input
                    id="tax-category-filter"
                    v-model="filter"
                    type="search"
                    :placeholder="__('search')"
                ></b-form-input>
            </div>
            <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getRecords()">
                <i class="fa fa-refresh" aria-hidden="true"></i>
            </button>
        </div>

        <div class="table-responsive">
            <b-table
                :items="categories"
                :fields="fields"
                :filter="filter"
                :filter-included-fields="filterOn"
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

                <template #cell(code)="row">
                    <span class="badge bg-light text-dark border">{{ row.item.code }}</span>
                </template>

                <template #cell(tax_rules_count)="row">
                    <span v-if="row.item.tax_rules_count" class="badge bg-secondary">{{ row.item.tax_rules_count }}</span>
                    <span v-else class="badge bg-danger">{{ __('no_rules') }}</span>
                </template>

                <template #cell(products_count)="row">
                    {{ row.item.products_count || '—' }}
                </template>

                <template #cell(status)="row">
                    <span v-if="row.item.status == 1" class="badge bg-success">{{ __('active') }}</span>
                    <span v-else class="badge bg-danger">{{ __('deactive') }}</span>
                </template>

                <template #cell(actions)="row">
                    <div class="list-actions">
                        <button class="list-action-btn is-edit" @click="edit_record = row.item" v-b-tooltip.hover :title="__('edit')"><i class="fa fa-pencil-alt"></i></button>
                        <button class="list-action-btn is-delete" @click="deleteRecord(row.index, row.item.id)" v-b-tooltip.hover :title="__('delete')"><i class="fa fa-trash"></i></button>
                    </div>
                </template>
            </b-table>
        </div>

        <div class="list-footer">
            <div></div>
            <div class="text-muted">{{ __('total_records') }}: {{ categories.length }}</div>
        </div>

        <app-tax-category-edit
            v-if="edit_record"
            :record="edit_record"
            @modalClose="edit_record = null"
        ></app-tax-category-edit>
    </div>
</template>

<script>
import TaxCategoryEdit from './TaxCategoryEdit.vue';

export default {
    components: {
        'app-tax-category-edit': TaxCategoryEdit,
    },
    data() {
        return {
            fields: [
                { key: 'id', label: __('id'), class: 'text-center' },
                { key: 'name', label: __('name'), class: 'text-center' },
                { key: 'code', label: __('code'), class: 'text-center' },
                { key: 'tax_rules_count', label: __('tax_rules'), class: 'text-center' },
                { key: 'products_count', label: __('products'), class: 'text-center' },
                { key: 'status', label: __('status'), class: 'text-center' },
                { key: 'actions', label: __('actions'), class: 'text-center' },
            ],
            filter: null,
            filterOn: [],
            categories: [],
            isLoading: false,
            edit_record: null,
        };
    },
    created() {
        this._recordSavedHandler = (message) => {
            this.showMessage('success', message);
            this.getRecords();
        };
        this.$eventBus.$on('taxCategorySaved', this._recordSavedHandler);
        this.getRecords();
    },
    beforeDestroy() {
        this.$eventBus.$off('taxCategorySaved', this._recordSavedHandler);
    },
    methods: {
        openAdd() {
            this.edit_record = {};
        },
        getRecords() {
            this.isLoading = true;
            axios.get(this.$apiUrl + '/tax-categories', { params: { limit: 0 } })
                .then((response) => {
                    this.isLoading = false;
                    this.categories = response.data.data;
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
            }).then((result) => {
                if (result.value) {
                    axios.post(this.$apiUrl + '/tax-categories/delete', { id })
                        .then((response) => {
                            let data = response.data;
                            if (!data.status) {
                                this.showError(data.message);
                                return;
                            }
                            this.categories.splice(index, 1);
                            this.showMessage('success', data.message);
                        });
                }
            });
        },
    },
};
</script>
