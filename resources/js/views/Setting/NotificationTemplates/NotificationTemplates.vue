<template>
    <div>
      <div class="page-heading">
        <div class="row">
          <div class="col-12 col-md-6 order-md-1 order-last">
            <h3>{{ __('notification_templates') }}</h3>
          </div>
          <div class="col-12 col-md-6 order-md-2 order-first">
            <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <router-link to="/dashboard">{{ __('dashboard') }}</router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">{{ __('notification_templates') }}</li>
              </ol>
            </nav>
          </div>
        </div>
  
        <div class="row">
          <div class="col-12 col-md-12 order-md-1 order-last">
            <div class="card">
              <div class="card-body">
                <b-row class="mb-2">
                  <b-col md="3" offset-md="8">
                    <h6 class="box-title">{{ __('search') }}</h6>
                    <b-form-input
                      id="filter-input"
                      v-model="filter"
                      type="search"
                      :placeholder="__('search')"
                    ></b-form-input>
                  </b-col>
                  <b-col md="1" class="text-center">
                    <button class="btn btn-primary btn_refresh" v-b-tooltip.hover :title="__('refresh')" @click="getTemplates()">
                      <i class="fa fa-refresh" aria-hidden="true"></i>
                    </button>
                  </b-col>
                </b-row>
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
                    <button
                      class="btn btn-sm btn-primary"
                      v-b-tooltip.hover
                      :title="__('edit')"
                      @click="openEdit(row.item)"
                    >
                      <i class="fa fa-pencil-alt"></i>
                    </button>
                  </template>
                </b-table>
                <b-row>
                  <b-col md="2" class="my-1">
                    <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right" label-size="sm" class="mb-0">
                      <b-form-select
                        id="per-page-select"
                        v-model="perPage"
                        :options="pageOptions"
                        size="sm"
                        class="form-control form-select"
                      ></b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col md="4" class="my-1" offset-md="6">
                    <label>{{ __('total_records') }}: {{ totalRows }}</label>
                    <b-pagination
                      v-model="currentPage"
                      :total-rows="totalRows"
                      :per-page="perPage"
                      align="fill"
                      size="sm"
                      class="my-0"
                    ></b-pagination>
                  </b-col>
                </b-row>
              </div>
            </div>
          </div>
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
  