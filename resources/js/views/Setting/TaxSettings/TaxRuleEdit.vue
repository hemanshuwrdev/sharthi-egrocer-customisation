<template>
    <b-modal ref="my-modal" :title="modal_title" @hidden="$emit('modalClose')" scrollable no-close-on-backdrop no-fade static size="lg">
        <div slot="modal-footer">
            <b-button variant="primary" @click="$refs['dummy_submit'].click()" :disabled="isLoading">
                {{ __('save') }}
                <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
            </b-button>
            <b-button variant="secondary" @click="hideModal">{{ __('cancel') }}</b-button>
        </div>

        <form ref="my-form" @submit.prevent="saveRecord" novalidate>
            <div class="row">
                <div class="form-group col-md-6 mb-3">
                    <label>{{ __('country') }} <i class="text-danger">*</i></label>
                    <select class="form-control form-select" v-model="countryId" required>
                        <option :value="null">{{ __('select_country') }}</option>
                        <option v-for="c in countries" :key="c.id" :value="c.id">{{ c.name }}</option>
                    </select>
                </div>
                <div class="form-group col-md-6 mb-3">
                    <label>{{ __('tax_category') }} <i class="text-danger">*</i></label>
                    <select class="form-control form-select" v-model="taxCategoryId">
                        <option value="">{{ __('all_categories') }}</option>
                        <option v-for="c in taxCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
                    </select>
                    <small class="form-text text-muted">{{ __('the_category_this_rate_applies_to_products_with_no_tax_category_are_not_taxed') }}</small>
                </div>
            </div>

            <div class="form-group mb-3">
                <label>{{ __('place_of_supply') }} <i class="text-danger">*</i></label>
                <select class="form-control form-select" v-model="placeOfSupply" required>
                    <option v-for="opt in placeOfSupplyOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
                </select>
                <small class="form-text text-muted">{{ __('leave_as_any_unless_this_country_has_states_regions_imported') }}</small>
            </div>

            <hr>

            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <label class="mb-0 fw-bold">{{ __('tax_components') }} <i class="text-danger">*</i></label>
                    <div class="text-muted small">{{ __('components_are_added_together_and_all_apply_to_the_same_amount') }}</div>
                </div>
                <b-button size="sm" variant="outline-primary" @click="addComponent">
                    <i class="fa fa-plus"></i> {{ __('add_component') }}
                </b-button>
            </div>

            <div class="row mb-2 align-items-end" v-for="(component, index) in components" :key="index">
                <div class="col-md-6">
                    <label v-if="index === 0">{{ __('component_name') }}</label>
                    <input type="text" class="form-control" v-model="component.name" :placeholder="__('eg_cgst')" required>
                </div>
                <div class="col-md-4">
                    <label v-if="index === 0">{{ __('percentage') }}</label>
                    <input type="number" class="form-control" v-model.number="component.percentage" min="0" max="100" step="0.01" required>
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-outline-danger" @click="removeComponent(index)" :disabled="components.length === 1">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>

            <div class="form-group mb-3" v-if="id">
                <label>{{ __('status') }}</label>
                <div class="col-md-9 text-left mt-1">
                    <b-form-radio-group v-model="status" :options="[
                        { text: __('deactivate'), value: 0 },
                        { text: __('activate'), value: 1 },
                    ]" buttons button-variant="outline-primary"></b-form-radio-group>
                </div>
            </div>

            <hr>
            <div class="text-end fw-bold">{{ __('total_rate') }}: {{ totalRate }}%</div>

            <button ref="dummy_submit" style="display:none;"></button>
        </form>
    </b-modal>
</template>

<script>
export default {
    props: ['record'],
    data() {
        return {
            id: null,
            countryId: null,
            taxCategoryId: '',
            placeOfSupply: 'any',
            components: [{ name: '', percentage: 0 }],
            status: 1,
            isLoading: false,
            countries: [],
            taxCategories: [],
        };
    },
    watch: {
        record: {
            immediate: true,
            handler(newVal) {
                if (newVal && newVal.id) {
                    this.id = newVal.id;
                    this.countryId = newVal.country_id;
                    this.taxCategoryId = newVal.tax_category_id || '';
                    this.placeOfSupply = newVal.place_of_supply;
                    this.components = newVal.components && newVal.components.length
                        ? newVal.components.map((c) => ({ name: c.name, percentage: c.percentage }))
                        : [{ name: '', percentage: 0 }];
                    this.status = newVal.status;
                } else {
                    this.id = null;
                    this.countryId = null;
                    this.taxCategoryId = '';
                    this.placeOfSupply = 'any';
                    this.components = [{ name: '', percentage: 0 }];
                    this.status = 1;
                }
            },
        },
    },
    computed: {
        modal_title() {
            return this.id ? __('edit_tax_rule') : __('add_tax_rule');
        },
        placeOfSupplyOptions() {
            return [
                { value: 'any', text: __('any') },
                { value: 'same_region', text: __('same_region_store_and_customer') },
                { value: 'different_region', text: __('different_region_store_vs_customer') },
            ];
        },
        totalRate() {
            return this.components.reduce((sum, c) => sum + (parseFloat(c.percentage) || 0), 0);
        },
    },
    methods: {
        showModal() {
            this.$refs['my-modal'].show();
        },
        hideModal() {
            this.$refs['my-modal'].hide();
        },
        addComponent() {
            this.components.push({ name: '', percentage: 0 });
        },
        removeComponent(index) {
            this.components.splice(index, 1);
        },
        loadOptions() {
            axios.get(this.$apiUrl + '/countries', { params: { limit: 1000 } }).then((response) => {
                this.countries = response.data.data || [];
            });
            axios.get(this.$apiUrl + '/tax-categories', { params: { limit: 0 } }).then((response) => {
                this.taxCategories = response.data.data || [];
            });
        },
        saveRecord() {
            if (!this.countryId) {
                this.showError(__('please_select_country'));
                return;
            }

            this.isLoading = true;

            const postData = {
                country_id: this.countryId,
                tax_category_id: this.taxCategoryId || null,
                place_of_supply: this.placeOfSupply,
                components: this.components,
            };

            if (this.id) {
                postData.id = this.id;
                postData.status = this.status;
            }

            const url = this.id
                ? this.$apiUrl + '/tax-rules/update'
                : this.$apiUrl + '/tax-rules/save';

            axios.post(url, postData)
                .then((response) => {
                    const data = response.data;
                    if (!data.status) {
                        this.showError(data.message);
                        return;
                    }
                    this.$eventBus.$emit('taxRuleSaved', data.message);
                    this.hideModal();
                })
                .catch((err) => {
                    this.showError(err.response?.data?.message || err.message || __('something_went_wrong'));
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
    },
    mounted() {
        this.loadOptions();
        this.showModal();
    },
};
</script>
