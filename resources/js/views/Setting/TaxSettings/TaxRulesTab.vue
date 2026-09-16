<template>
    <div class="list-surface">
        <div v-if="warnings.length" class="alert alert-warning">
            <strong>{{ __('these_countries_have_an_active_store_but_no_tax_rule_for_some_categories') }}</strong>
            <ul class="mb-0">
                <li v-for="w in warnings" :key="w.country_id">
                    {{ w.country_name }} — {{ w.categories.join(', ') }}
                </li>
            </ul>
        </div>

        <div class="list-toolbar has-filters">
            <div class="list-toolbar-start">
                <div class="list-filter list-filter-select">
                    <multiselect
                        v-model="countryFilter"
                        :options="countryFilterOptions"
                        :allow-empty="false"
                        :show-labels="false"
                        :searchable="true"
                        label="name"
                        track-by="id"
                        @input="getRecords()"
                    ></multiselect>
                </div>
                <div class="list-filter list-filter-select">
                    <multiselect
                        v-model="taxCategoryFilter"
                        :options="taxCategoryFilterOptions"
                        :allow-empty="false"
                        :show-labels="false"
                        :searchable="true"
                        label="name"
                        track-by="id"
                        @input="getRecords()"
                    ></multiselect>
                </div>
            </div>
            <div class="list-toolbar-end">
                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input
                        id="tax-rule-filter"
                        v-model="filter"
                        type="search"
                        :placeholder="__('search')"
                    ></b-form-input>
                </div>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getRecords()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>
        </div>

        <div class="table-responsive">
            <b-table
                :items="rules"
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

                <template #cell(jurisdiction)="row">
                    {{ row.item.country ? row.item.country.name : '—' }}
                </template>

                <template #cell(tax_category)="row">
                    {{ row.item.tax_category ? row.item.tax_category.name : __('all_categories') }}
                </template>

                <template #cell(place_of_supply)="row">
                    <span class="pos-badge" :class="placeOfSupplyBadge(row.item.place_of_supply)">
                        {{ placeOfSupplyLabel(row.item.place_of_supply) }}
                    </span>
                </template>

                <template #cell(components)="row">
                    <span v-for="(c, i) in row.item.components" :key="i" class="badge bg-light text-dark border me-1">
                        {{ c.name }} {{ c.percentage }}%
                    </span>
                </template>

                <template #cell(total_rate)="row">
                    {{ row.item.total_rate }}%
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
            <div class="text-muted">{{ __('total_records') }}: {{ rules.length }}</div>
        </div>

        <app-tax-rule-edit
            v-if="edit_record"
            :record="edit_record"
            @modalClose="edit_record = null"
        ></app-tax-rule-edit>
    </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import TaxRuleEdit from './TaxRuleEdit.vue';

export default {
    components: {
        'app-tax-rule-edit': TaxRuleEdit,
        Multiselect,
    },
    data() {
        return {
            fields: [
                { key: 'jurisdiction', label: __('jurisdiction'), class: 'text-center' },
                { key: 'tax_category', label: __('tax_category'), class: 'text-center' },
                { key: 'place_of_supply', label: __('place_of_supply'), class: 'text-center' },
                { key: 'components', label: __('tax_components'), class: 'text-center' },
                { key: 'total_rate', label: __('total_rate'), class: 'text-center' },
                { key: 'status', label: __('status'), class: 'text-center' },
                { key: 'actions', label: __('actions'), class: 'text-center' },
            ],
            filter: null,
            filterOn: [],
            rules: [],
            warnings: [],
            isLoading: false,
            edit_record: null,
            countries: [],
            taxCategories: [],
            countryFilter: { id: '', name: __('all_countries') },
            taxCategoryFilter: { id: '', name: __('all_tax_categories') },
        };
    },
    computed: {
        countryFilterOptions() {
            return [{ id: '', name: __('all_countries') }].concat(this.countries);
        },
        taxCategoryFilterOptions() {
            return [{ id: '', name: __('all_tax_categories') }].concat(this.taxCategories);
        },
    },
    created() {
        this._recordSavedHandler = (message) => {
            this.showMessage('success', message);
            this.getRecords();
        };
        this.$eventBus.$on('taxRuleSaved', this._recordSavedHandler);
        this.loadFilters();
        this.getRecords();
    },
    beforeDestroy() {
        this.$eventBus.$off('taxRuleSaved', this._recordSavedHandler);
    },
    methods: {
        openAdd() {
            this.edit_record = {};
        },
        placeOfSupplyLabel(value) {
            const map = {
                any: __('any'),
                same_region: __('same_region_store_and_customer'),
                different_region: __('different_region_store_vs_customer'),
            };
            return map[value] || value;
        },
        placeOfSupplyBadge(value) {
            const map = {
                any: 'pos-badge-danger',
                same_region: 'pos-badge-success',
                different_region: 'pos-badge-warning',
            };
            return map[value] || 'pos-badge-secondary';
        },
        loadFilters() {
            axios.get(this.$apiUrl + '/countries', { params: { limit: 1000 } }).then((response) => {
                this.countries = response.data.data || [];
            });
            axios.get(this.$apiUrl + '/tax-categories', { params: { limit: 0 } }).then((response) => {
                this.taxCategories = response.data.data || [];
            });
        },
        getRecords() {
            this.isLoading = true;
            axios.get(this.$apiUrl + '/tax-rules', {
                params: {
                    limit: 0,
                    country_id: (this.countryFilter && this.countryFilter.id) || undefined,
                    tax_category_id: (this.taxCategoryFilter && this.taxCategoryFilter.id) || undefined,
                },
            }).then((response) => {
                this.isLoading = false;
                this.rules = response.data.data;
                this.warnings = response.data.warnings || [];
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
                    axios.post(this.$apiUrl + '/tax-rules/delete', { id })
                        .then((response) => {
                            let data = response.data;
                            if (!data.status) {
                                this.showError(data.message);
                                return;
                            }
                            this.rules.splice(index, 1);
                            this.showMessage('success', data.message);
                        });
                }
            });
        },
        
    },
};
</script>

<style scoped>
.list-filter-select {
    width: 220px;
}

.pos-badge {
    display: inline-block;
    padding: 0.3em 0.65em;
    border-radius: 0.375rem;
    border: 1px solid;
    font-size: 0.78rem;
    font-weight: 600;
    white-space: nowrap;
}

.pos-badge-danger {
    background: #fdeceb;
    border-color: #f3b8b3;
    color: #dc3545;
}

.pos-badge-success {
    background: #e9f7ef;
    border-color: #a9dfbf;
    color: #1e7e45;
}

.pos-badge-warning {
    background: #fff6e5;
    border-color: #f1d38a;
    color: #a5720a;
}

.pos-badge-secondary {
    background: #f1f2f3;
    border-color: #d6d8db;
    color: #495057;
}
@import "../../../../../node_modules/vue-multiselect/dist/vue-multiselect.min.css";
</style>
