<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{__('taxes')}}</h3>
        </div>

        <div class="ui-filters">
            <div class="ui-search">
                <i class="fa fa-search" aria-hidden="true"></i>
                <input id="filter-input" v-model="filter" type="text" :placeholder="__('search')" :aria-label="__('search')">
                <button v-if="filter" type="button" class="ui-search__clear" :title="__('Clear')" @click="filter = null">
                    <i class="fa fa-times"></i>
                </button>
            </div>
            <button type="button" class="ui-iconbtn" v-b-tooltip.hover :title="__('refresh')" @click="getRecords()">
                <i class="fa fa-sync-alt" :class="{ 'fa-spin': isLoading }" aria-hidden="true"></i>
            </button>
        </div>

        <div class="list-surface">
            <div class="table-responsive">
                <b-table
                    :items="taxes"
                    :fields="fields"
                    :current-page="currentPage"
                    :per-page="perPage"
                    :filter="filter"
                    :filter-included-fields="filterOn"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :sort-direction="sortDirection"
                    :bordered="false"
                    borderless
                    hover
                    :busy="isLoading"
                    stacked="md"
                    show-empty
                    @filtered="onFiltered">
                    <template #table-busy>
                        <div class="ui-busy">
                            <b-spinner class="align-middle" small></b-spinner>
                            <strong>{{ __('loading') }}...</strong>
                        </div>
                    </template>

                    <template #empty>
                        <div class="ui-empty">
                            <div class="ui-empty__icon"><i class="fa fa-percent"></i></div>
                            <h3>{{ __('No taxes found') }}</h3>
                            <p>{{ __('Taxes will show up here.') }}</p>
                        </div>
                    </template>

                    <template #emptyfiltered>
                        <div class="ui-empty">
                            <div class="ui-empty__icon"><i class="fa fa-percent"></i></div>
                            <h3>{{ __('No taxes found') }}</h3>
                            <p>{{ __('Nothing matches this search. Try changing or clearing it.') }}</p>
                            <button type="button" class="ui-btn" @click="filter = null">
                                <i class="fa fa-times"></i> {{ __('Clear search') }}
                            </button>
                        </div>
                    </template>

                    <template #cell(id)="row">
                        <span class="ui-id">#{{ row.item.id }}</span>
                    </template>

                    <template #cell(title)="row">
                        <strong class="ui-strong">{{ row.item.title }}</strong>
                    </template>

                    <template #cell(percentage)="row">
                        <span class="ui-tag">{{ row.item.percentage }}</span>
                    </template>

                    <template #cell(status)="row">
                        <span v-if="row.item.status == 1" class="badge bg-success">{{__('activate')}}</span>
                        <span v-else class="badge bg-danger">{{__('deactivate')}}</span>
                    </template>
                </b-table>
            </div>

            <div class="list-footer">
                <div class="list-perpage">
                    <b-form-group
                        :label="__('per_page')"
                        label-for="per-page-select"
                        label-align-sm="right"
                        label-size="sm"
                        class="mb-0">
                        <b-form-select
                            id="per-page-select"
                            v-model="perPage"
                            :options="pageOptions"
                            size="sm"
                            class="form-control form-select"
                        ></b-form-select>
                    </b-form-group>
                </div>
                <span class="ui-count">{{ rangeText(currentPage, perPage, totalRows) }}</span>
                <b-pagination
                    v-if="totalRows > perPage"
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    size="sm"
                    class="list-pagination my-0"
                ></b-pagination>
            </div>
        </div>
    </div>
</template>
<script>
export default {

    data: function() {
        return {
            fields: [
                { key: 'id', label: __('id'), class: 'text-center', sortable: true, sortDirection: 'desc' },
                { key: 'title', label: __('title'),  class: 'text-center' },
                { key: 'percentage', label: __('percentage'),  class: 'text-center' },
                { key: 'status', label: __('status'),  class: 'text-center' },
            ],
            totalRows: 1,
            currentPage: 1,
            perPage: this.$perPage,
            pageOptions: this.$pageOptions,
            sortBy: '',
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,
            filterOn: [],
            page: 1,

            sectionStyle : 'style_1',
            max_visible_units : 12,
            max_col_in_single_row : 3,

            taxes: [],
            isLoading: false,
            create_new : null,
            edit_record : null,

        }
    },
    created: function() {
        this.getRecords();
    },
    methods: {
        getRecords(){
            this.isLoading = true
            axios.get(this.$apiUrl + '/products/taxes')
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    this.taxes = data.data;
                    this.totalRows = data.total;
                });
        },
        // The search filters in the browser, so the footer count and pager follow the matching rows
        onFiltered(filteredItems) {
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
        rangeText(page, perPage, total) {
            if (!total) return '';
            const from = (page - 1) * perPage + 1;
            const to = Math.min(page * perPage, total);
            return from + '-' + to + ' / ' + total;
        },
    }
};
</script>
