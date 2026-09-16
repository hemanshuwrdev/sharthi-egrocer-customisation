<template>
    <div class="list-page">
        <div class="page-head">
            <div>
                <h3 class="page-head-title">{{ __('tax_settings') }}</h3>
                <p class="text-muted mb-0">{{ __('tax_categories_and_the_rules_each_jurisdiction_charges') }}</p>
            </div>
            <div class="d-flex align-items-center gap-2">
                <button class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap" @click="addNew">
                    <i class="fa fa-plus" aria-hidden="true"></i>
                    <span>{{ activeTab === 0 ? __('add_tax_category') : __('add_tax_rule') }}</span>
                </button>
            </div>
        </div>

        <b-tabs v-model="activeTab" content-class="mt-3">
            <b-tab :title="__('tax_categories')">
                <app-tax-categories-tab ref="categoriesTab"></app-tax-categories-tab>
            </b-tab>
            <b-tab :title="__('tax_rules')">
                <app-tax-rules-tab ref="rulesTab"></app-tax-rules-tab>
            </b-tab>
        </b-tabs>
    </div>
</template>

<script>
import TaxCategoriesTab from './TaxCategoriesTab.vue';
import TaxRulesTab from './TaxRulesTab.vue';

export default {
    components: {
        'app-tax-categories-tab': TaxCategoriesTab,
        'app-tax-rules-tab': TaxRulesTab,
    },
    data() {
        return {
            activeTab: 0,
        };
    },
    methods: {
        addNew() {
            if (this.activeTab === 0) {
                this.$refs.categoriesTab.openAdd();
            } else {
                this.$refs.rulesTab.openAdd();
            }
        },
    },
};
</script>
