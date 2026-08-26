<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('notification_templates') }}</h3>
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
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getTemplates()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                <b-table
                  :items="templates"
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
                  small
                >
                  <template #table-busy>
                    <div class="text-center text-black my-2">
                      <b-spinner class="align-middle"></b-spinner>
                      <strong>{{ __('loading') }}...</strong>
                    </div>
                  </template>
                  <template #cell(type)="row">
                    <code>{{ row.item.type }}</code>
                  </template>
                  <template #cell(placeholders)="row">
                    <small>{{ (row.item.placeholders || []).join(', ') || '-' }}</small>
                  </template>
                  <template #cell(actions)="row">
                    <div class="list-actions">
                        <button
                          class="list-action-btn is-edit"
                          v-b-tooltip.hover
                          :title="__('edit')"
                          @click="openEdit(row.item)"
                        >
                          <i class="fa fa-pencil-alt"></i>
                        </button>
                    </div>
                  </template>
                </b-table>
            </div>

            <div class="list-footer">
                <div class="list-perpage">
                    <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right" label-size="sm" class="mb-0">
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

        <app-edit-record v-if="editRecord" :record="editRecord" @modalClose="editRecord = null" @saved="onTemplateSaved"></app-edit-record>
    </div>
</template>
  
  <script>
  import EditRecord from './Edit.vue';
  
  export default {
    components: {
      'app-edit-record': EditRecord,
    },
    data() {
      return {
        fields: [
          { key: 'id', label: __('id'), class: 'text-left', sortable: true, thStyle: { width: '5%' } },
          { key: 'type', label: __('type'), class: 'text-left', sortable: true, thStyle: { width: '22%' } },
          { key: 'placeholders', label: __('placeholders'), class: 'text-left', thStyle: { width: '38%' } },
          { key: 'actions', label: __('actions'), class: 'text-center', thStyle: { width: '10%' } },
        ],
        totalRows: 1,
        currentPage: 1,
        perPage: this.$perPage || 10,
        pageOptions: this.$pageOptions || [10, 25, 50, 100],
        sortBy: 'id',
        sortDesc: false,
        sortDirection: 'asc',
        filter: null,
        filterOn: ['type'],
        templates: [],
        isLoading: false,
        editRecord: null,
      };
    },
    watch: {
      currentPage() {
        this.getTemplates();
      },
      perPage() {
        this.getTemplates();
      },
    },
    created() {
      this.getTemplates();
    },
    methods: {
      getTemplates() {
        this.isLoading = true;
        const params = {
          offset: this.currentPage,
          limit: this.perPage,
          filter: this.filter || '',
        };
        axios.get(this.$apiUrl + '/notification_templates', { params }).then((response) => {
          this.isLoading = false;
          const data = response.data;
          this.templates = data.data || [];
          this.totalRows = data.total || 0;
        }).catch(() => {
          this.isLoading = false;
        });
      },
      openEdit(record) {
        this.editRecord = record;
      },
      onTemplateSaved() {
        this.editRecord = null;
        this.showMessage('success', this.__('notification_template_updated_successfully'));
        this.getTemplates();
      },
    },
  };
  </script>
  