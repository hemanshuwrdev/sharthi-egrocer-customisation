<template>
  <div>
    <div class="page-heading"> 
      <div class="row">
        <div class="col-12 col-md-6 order-md-1 order-last">
          <h3>{{ __('manage_promo_code') }}</h3>
        </div>
        <div class="col-12 col-md-6 order-md-2 order-first">
          <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                  <router-link to="/dashboard">{{ __('dashboard') }}</router-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">{{ __('manage_promo_code') }}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-12 order-md-1 order-last">
          <div class="card">
            <div class="card-header">
              <h4>{{ __('promo_code') }}</h4>
              <span class="pull-right">
                <button class="btn btn-primary" @click="create_new=true" v-if="$can('promo_code_create')">{{ __('add_promo_code') }}</button>
              </span>
            </div>

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
                      <button class="btn btn-primary btn_refresh" v-b-tooltip.hover :title="__('refresh')" @click="getPromoCode()" >
                          <i class="fa fa-refresh" aria-hidden="true"></i>
                      </button>
                  </b-col>
              </b-row>
              <template>
                <div class="table-responsive">
                  <b-table
                    :items="promocode"
                    :fields="fields"
                    :current-page="currentPage"
                    :per-page="perPage"
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
                  <template #cell(image)="row">
                      <img :src="row.item.image_url" height="50" />
                  </template>
                  <template #cell(message)="row">
                      {{ getTranslatedMessage(row.item) }}
                  </template>

                  <template #cell(validity)="row">
                      <label v-if="row.item.is_applicable === 1" class='badge bg-success'>{{ row.item.validity }}</label>
                      <label v-else="row.item.is_applicable === 0" class='badge bg-danger'>{{ row.item.validity }}</label>
                  </template>

                  <template #cell(status)="row">
                      <label v-if="row.item.status === 1" class='badge bg-success'>{{ __('active') }}</label>
                      <label v-else="row.item.status === 0" class='badge bg-danger'>{{ __('deactive') }}</label>
                  </template>

                <template #cell(actions)="row">
                  <button class="btn btn-sm btn-primary" @click="edit_record = row.item" v-if="$can('promo_code_update')" v-b-tooltip.hover :title="__('edit')"><i class="fa fa-pencil-alt"></i></button>
                  <button class="btn btn-sm btn-danger" @click="deleteSlider(row.index,row.item.id)" v-if="$can('promo_code_delete')" v-b-tooltip.hover :title="__('delete')"><i class="fa fa-trash"></i></button>
                </template>
              </b-table>
            </div>
          </template>
              <b-row>
                <b-col md="2" class="my-1">
                  <b-form-group
                    :label="__('per_page')"
                    label-for="per-page-select"
                    label-align-sm="right"
                    label-size="sm"
                    class="mb-0"
                  >
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

    <!-- Add / Edit -->

      <app-edit-record
          v-if="create_new || edit_record"
          :record="edit_record"
          @modalClose="hideModal()"
      ></app-edit-record>

  </div>
</template>
<script>
import { VuejsDatatableFactory } from "vuejs-datatable";
import EditRecord from "./Edit.vue";
import axios from "axios";

export default {
  components: {
    VuejsDatatableFactory,
    "app-edit-record": EditRecord,
  },
  data: function () {
    return {
      fields: [
        { key: "id", label: __("id"), sortable: true, headAttr: { width: '80px', textAlign: 'center' }, sortDirection: "desc" },
        { key: "promo_code", label: __('promo_code'), sortable: true, class: "text-center" },
        { key: "message", label: __('message'), sortable: true, sortDirection: "desc", class: "text-center" },
        { key: "start_date", label: __('start_date'), sortable: true, sortDirection: "desc", class: "text-center" },
        { key: "end_date", label: __('end_date'), sortable: true, sortDirection: "desc", class: "text-center" },
        { key: "no_of_users", label: __('no_of_users'), sortable: true, sortDirection: "desc", class: "text-center" },
        { key: "minimum_order_amount", label: __('minimum_order_amount'), sortable: true, sortDirection: "desc", class: "text-center" },
        { key: "discount", label: __('discount'), sortable: true, sortDirection: "desc", class: "text-center" },
        { key: "discount_type", label: __('discount_type'), sortable: true, sortDirection: "desc", class: "text-center" },
        { key: 'image', label: __('image'),  class: 'text-center' },
        { key: "status", label: __('status'), sortable: true, sortDirection: "desc", class: "text-center" },
        { key: "validity", label: __('validity'), sortable: true, sortDirection: "desc", class: "text-center" },
        { key: "actions", label: __('actions')},
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: this.$perPage,
      pageOptions: this.$pageOptions,
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      page: 1,

      promocode: [],
      isLoading: false,
      sectionStyle: "style_1",
      max_visible_promocode: 12,
      max_col_in_single_row: 12,
      create_new: false,
      edit_record: null,
      // Language handling for translations
      currentLanguageId: null,
      activeLanguages: []
    };
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.promocode.length;
  },
    watch: {
        $route(to, from) {
            this.showCreateModal();
        },
        filter() {
            this.getPromoCode();
        }
    },
  created: function () {
    this.showCreateModal();
    this.$eventBus.$on("PromoCodeSaved", (message) => {
      this.showMessage("success", message);
      this.getPromoCode();
    });
    // Load languages first so we know currentLanguageId before mapping translations
    this.fetchActiveLanguages().then(() => {
      this.getPromoCode();
    }).catch(() => {
      this.getPromoCode();
    });
  },
  methods: {
    // Fetch active languages and set current language ID
    fetchActiveLanguages() {
      return axios.get(this.$apiUrl + '/active_languages')
        .then(response => {
          if (response.data.data && Array.isArray(response.data.data)) {
            this.activeLanguages = response.data.data;
            
            const appLocale = window.appLocale || 'en';
            
            const currentLanguage = this.activeLanguages.find(
              lang => lang.code === appLocale
            );
            
            if (currentLanguage) {
              this.currentLanguageId = currentLanguage.id;
            } else {
              const defaultLanguage = this.activeLanguages.find(
                lang => lang.is_default === 1
              );
              if (defaultLanguage) {
                this.currentLanguageId = defaultLanguage.id;
              }
            }
          }
        })
        .catch(error => {
          console.error('Error loading languages:', error);
        });
    },
    // Get translated message with fallback logic
    getTranslatedMessage(promoCode) {
      // If no language is set yet, return the base message
      if (!this.currentLanguageId || !this.activeLanguages.length) {
        return promoCode.message || '';
      }

      // Get default language ID for fallback
      const defaultLanguage = this.activeLanguages.find(lang => lang.is_default === 1);
      const defaultLanguageId = defaultLanguage ? defaultLanguage.id : null;

      // Check if translations array exists
      if (promoCode.translations && Array.isArray(promoCode.translations) && promoCode.translations.length > 0) {
        // First try to find translation for current language
        let translation = promoCode.translations.find(
          t => t.language_id === this.currentLanguageId
        );

        // If not found, try default language
        if (!translation && defaultLanguageId) {
          translation = promoCode.translations.find(
            t => t.language_id === defaultLanguageId
          );
        }

        // Use translation message if available and not empty
        if (translation && translation.message && translation.message.trim() !== '') {
          return translation.message;
        }
      }

      // Fallback to base message
      return promoCode.message || '';
    },
    getPromoCode() {
      this.isLoading = true;
      axios.get(this.$apiUrl + "/promo_code?search=" + (this.filter || "")).then((response) => {
        this.isLoading = false;
        let data = response.data;
        // Ensure promo codes have proper structure with translations
        this.promocode = (data.data || []).map(code => {
          // Ensure translations array exists
          if (!code.translations) {
            code.translations = [];
          }
          return code;
        });
        this.totalRows = this.promocode.length;
      });
    },

    deleteSlider(index, id) {
      this.$swal
        .fire({
          title: __('are_you_sure'),
          text: __('you_want_be_able_to_revert_this'),
          confirmButtonText: __('yes_sure'),
          cancelButtonText: __('cancel'),
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#37a279",
          cancelButtonColor: "#d33",
        })
        .then((result) => {
          if (result.value) {
            this.isLoading = true;
            let postData = {
              id: id,
            };
            axios
              .post(this.$apiUrl + "/promo_code/delete", postData)
              .then((response) => {
                this.isLoading = false;
                let data = response.data;
                this.promocode.splice(index, 1);
                //this.showSuccess(data.message);
                  this.showMessage("success", data.message);
              });
          }
        });
    },
      showCreateModal(){
          let create = this.$route.params.create;
          if(create){
              this.create_new = true;
          }
      },
      hideModal() {
          this.create_new = false
          this.edit_record = false
          this.$router.push({path: '/promo_code'});
      },
  },
  beforeDestroy() {
      this.$eventBus.$off('PromoCodeSaved');
  }
};
</script>
