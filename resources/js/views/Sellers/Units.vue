<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{__('units')}}</h3>
        </div>

        <div class="ui-filters">
            <div class="ui-search">
                <i class="fa fa-search" aria-hidden="true"></i>
                <input id="filter-input" v-model="filter" type="text" :placeholder="__('search')" :aria-label="__('search')">
                <button v-if="filter" type="button" class="ui-search__clear" :title="__('Clear')" @click="filter = null">
                    <i class="fa fa-times"></i>
                </button>
            </div>
            <button type="button" class="ui-iconbtn" v-b-tooltip.hover :title="__('refresh')" @click="getUnits()">
                <i class="fa fa-sync-alt" :class="{ 'fa-spin': isLoading }" aria-hidden="true"></i>
            </button>
        </div>

        <div class="list-surface">
            <div class="table-responsive">
                <b-table
                    :items="units"
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
                            <div class="ui-empty__icon"><i class="fa fa-ruler"></i></div>
                            <h3>{{ __('No units found') }}</h3>
                            <p>{{ __('Units will show up here.') }}</p>
                        </div>
                    </template>

                    <template #emptyfiltered>
                        <div class="ui-empty">
                            <div class="ui-empty__icon"><i class="fa fa-ruler"></i></div>
                            <h3>{{ __('No units found') }}</h3>
                            <p>{{ __('Nothing matches this search. Try changing or clearing it.') }}</p>
                            <button type="button" class="ui-btn" @click="filter = null">
                                <i class="fa fa-times"></i> {{ __('Clear search') }}
                            </button>
                        </div>
                    </template>

                    <template #cell(id)="row">
                        <span class="ui-id">#{{ row.item.id }}</span>
                    </template>

                    <template #cell(name)="row">
                        <strong class="ui-strong">{{ row.item.name }}</strong>
                    </template>

                    <template #cell(short_code)="row">
                        <span v-if="row.item.short_code" class="ui-tag">{{ row.item.short_code }}</span>
                        <span v-else class="ui-dash">-</span>
                    </template>

                    <template #cell(parent_id)="row">
                        <span v-if="row.item.parent_id!==null">{{ row.item.parent_id }}</span>
                        <span v-else class="ui-dash">-</span>
                    </template>

                    <template #cell(conversion)="row">
                        <span v-if="row.item.conversion!==null">{{ row.item.conversion }}</span>
                        <span v-else class="ui-dash">-</span>
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
                    { key: 'id', label: __('id'), sortable: true, sortDirection: 'desc' },
                    { key: 'name', label: __('name'), sortable: true, class: 'text-center' },
                    { key: 'short_code', label: __('short_code'), sortable: true, class: 'text-center' },
                    { key: 'parent_id', label: __('parent_id'),  class: 'text-center' },
                    { key: 'conversion', label: __('conversion'),  class: 'text-center' }
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

                units: [],
                isLoading: false,
                sectionStyle : 'style_1',
                max_visible_units : 12,
                max_col_in_single_row : 3,
                create_new : null,
                edit_record : null
            }
        },
        computed: {
            sortOptions() {
                // Create an options list from our fields
                return this.fields
                    .filter(f => f.sortable)
                    .map(f => {
                        return { text: f.label, value: f.key }
                    })
            }
        },
        mounted() {
            // Set the initial number of items
            this.totalRows = this.units.length
        },
        created: function() {
            this.$eventBus.$on('unitSaved', (message) => {
                this.showMessage("success", message);
                this.getUnits();
                this.create_new = null;
            });
            this.getUnits();
        },
        methods: {
            getUnits(){
                this.isLoading = true
                axios.get(this.$apiUrl + '/units')
                    .then((response) => {
                        this.isLoading = false
                        let data = response.data;
                        this.units = data.data
                        this.totalRows = this.units.length
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
