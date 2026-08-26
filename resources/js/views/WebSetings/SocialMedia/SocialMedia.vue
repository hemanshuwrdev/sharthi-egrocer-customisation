<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('social_media') }}</h3>
            <button class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap"
                @click="create_new=true" v-if="$can('manage_social_media_create')">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add') }}</span>
            </button>
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
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getSocialMedia()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                <b-table
                    :items="socialMedia"
                    :fields="fields"
                    :current-page="currentPage"
                    :per-page="perPage"
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
                    <template #cell(icon)="row">
                        <i v-bind:class="row.item.icon"></i> {{ row.item.icon }}
                    </template>

                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <button class="list-action-btn is-edit" @click="edit_record = row.item" v-if="$can('manage_social_media_update')" v-b-tooltip.hover :title="__('edit')"><i class="fa fa-pencil-alt"></i></button>
                            <button class="list-action-btn is-delete" @click="deleteSocialMedia(row.index,row.item.id)" v-if="$can('manage_social_media_delete')" v-b-tooltip.hover :title="__('delete')"><i class="fa fa-trash"></i></button>
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
            v-if="create_new || edit_record"
            :record="edit_record"
            @modalClose="hideModal()"
        ></app-edit-record>
    </div>
</template>
<script>
import EditRecord from './Edit';
export default {
    components: {
        'app-edit-record' : EditRecord,
    },
    data: function() {
        return {
            fields: [
                { key: 'id', label:  __('id') , sortable: true, sortDirection: 'desc' },
                { key: 'icon', label:  __('icon') , sortable: true, class: 'text-center' },
                { key: 'link', label: __('link') , sortable: true, class: 'text-center' },
                { key: 'actions', label:  __('actions')  }
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
            per_page: 10,
            isLoading: false,

            sectionStyle : 'style_1',
            max_visible_units : 12,
            max_col_in_single_row : 3,
            create_new : null,
            edit_record : null,

            socialMedia: [],
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
        this.totalRows = this.socialMedia.length
    },
    created: function() {
        this.$eventBus.$on('socialMediaSaved', (message) => {
            this.showMessage("success", message);
            this.getSocialMedia();
            this.create_new = null;
        });
        this.getSocialMedia();
    },
    methods: {
        getSocialMedia(){
            this.isLoading = true
           
            axios.get(this.$apiUrl + '/social_media')
                .then((response) => {
                    this.socialMedia = response.data.data;
                    this.totalRows = this.socialMedia.length
                    this.isLoading = false
                });
        },
        deleteSocialMedia(index, id){
            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('you_want_be_able_to_revert_this'),
                confirmButtonText: __('yes_sure'),
                cancelButtonText: __('cancel'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#37a279',
                cancelButtonColor: '#d33',
            }).then(result => {

                if (result.value) {
                    this.isLoading = true
                    let postData = {
                        id : id
                    }
                    axios.post(this.$apiUrl + '/social_media/delete',postData)
                        .then((response) => {
                            this.isLoading = false
                            this.socialMedia.splice(index, 1)
                            this.showSuccess(response.data.message)
                        });
                }
            });
        },
        hideModal() {
            this.create_new = false
            this.edit_record = false
        },
    }
};
</script>
