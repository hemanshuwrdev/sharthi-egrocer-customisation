<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('manage_sms_templates') }}</h3>
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
                    ></b-form-input>
                </div>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getSmsTemplates()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                            <b-table
                                :items="sms_templates"
                                :fields="fields"
                               
                                :filter="filter"
                                :filter-included-fields="filterOn"
                                :sort-by.sync="sortBy"
                                :sort-desc.sync="sortDesc"
                                :sort-direction="sortDirection"
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
                                <template #cell(updated_at)="row">
                                    {{ row.item.updated_at  }}
                                </template>
                               
                                <template #cell(actions)="row">
                                    <div class="list-actions">
                                        <button class="list-action-btn is-edit" @click="edit_record = row.item" v-if="$can('category_update')" v-b-tooltip.hover :title="__('edit')"><i class="fa fa-pencil-alt"></i></button>
                                    </div>
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
                <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    align="fill"
                    size="sm"
                    class="list-pagination"
                ></b-pagination>
            </div>
        </div>

        <!-- Add / Edit -->
        <app-edit-record
            v-if="edit_record"
            :record="edit_record"
            @modalClose="edit_record = null"
        ></app-edit-record>
    </div>

</template>
<script>

import EditRecord from './Edit.vue';
export default {
    components: {
        'app-edit-record' : EditRecord,
    },
    data: function() {
        return {
            fields: [
                { key: 'id', label: __('id'), class: 'text-left', sortable: true, sortDirection: 'desc',thStyle: { width: '5%' }  },
                { key: 'type', label: __('type'), class: 'text-left', sortable: true,thStyle: { width: '20%' }  },
                { key: 'message', label: __('message'), class: 'text-left', sortable: true,thStyle: { width: '50%' }  },
                { key: 'updated_at', label: __('last_updated'),  class: 'text-left',thStyle: { width: '15%' }  },
                { key: 'actions', label: __('actions'), class: 'text-center', thStyle: { width: '10%' } }
            ],
            totalRows: 1,
            currentPage: 1,
            perPage: this.$perPage,
            pageOptions: this.$pageOptions,
            sortBy: 'id',
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,
            filterOn: [],
            page: 1,
            sms_templates: [],
            isLoading: false,
            edit_record : null,
            settingModalShow:false
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
        },
    },
    mounted() {

    },
    watch: {
        currentPage() {
            this.getSmsTemplates();
        },
        perPage() {
            this.getSmsTemplates();
        }
    },
    created: function() {
        this.$eventBus.$on('SmsTemplatesSaved', (message) => {
            this.showMessage("success", message);
            this.getSmsTemplates();
            this.create_new = null;
        });
        this.getSmsTemplates(); 
    },
    methods: {

        getSmsTemplates(){

            this.isLoading = true
            const params = {
                offset: this.currentPage,
                limit: this.perPage,
                filter: this.filter
            };
            axios.get(this.$apiUrl + '/sms_templates', { params })
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    this.sms_templates = data.data
                    this.totalRows = data.total
                });
        }

    }
};
</script>
