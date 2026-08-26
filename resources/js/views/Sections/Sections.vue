<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('featured_sections_of_app') }}</h3>
            <button class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap"
                @click="create_new = true" v-if="$can('featured_section_create')">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add') }}</span>
            </button>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input id="filter-input" v-model="filter" type="search"
                        :placeholder="__('search')"></b-form-input>
                </div>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')"
                    @click="getSections()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                <b-table :items="translatedSections" :fields="fields" :current-page="currentPage"
                    :per-page="perPage" :filter="filter" :filter-included-fields="filterOn"
                    :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection"
                    :bordered="true" :busy="isLoading" stacked="md" show-empty small>
                    <template #table-busy>
                        <div class="text-center text-black my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>{{ __('loading') }}...</strong>
                        </div>
                    </template>
                    <template #cell(style)="row">
                        <div>
                            <!-- App Style -->
                            <div v-if="row.item.style_app">
                                <strong>{{ __('App Style:') }}</strong>
                                <img v-if="row.item.style_app === 'style_1'"
                                    :src="$baseUrl + '/images/app_style/App_Style_1.jpg'" alt="App Style 1"
                                    height="70"
                                    @click="openLightbox($baseUrl + '/images/app_style/App_Style_1.jpg')" />
                                <img v-if="row.item.style_app === 'style_2'"
                                    :src="$baseUrl + '/images/app_style/App_Style_2.jpg'" alt="App Style 2"
                                    height="70"
                                    @click="openLightbox($baseUrl + '/images/app_style/App_Style_2.jpg')" />
                                <img v-if="row.item.style_app === 'style_3'"
                                    :src="$baseUrl + '/images/app_style/App_Style_3.jpg'" alt="App Style 3"
                                    height="70"
                                    @click="openLightbox($baseUrl + '/images/app_style/App_Style_3.jpg')" />
                                <img v-if="row.item.style_app === 'style_4'"
                                    :src="$baseUrl + '/images/app_style/App_Style_4.jpg'" alt="App Style 4"
                                    width="70"
                                    @click="openLightbox($baseUrl + '/images/app_style/App_Style_4.jpg')" />


                                <FsLightbox :toggler="toggler" :sources="lightboxSources"
                                    :onClose="handleClose"> </FsLightbox>
                                <br /><br />
                            </div>

                            <!-- Web Style -->
                            <div v-if="row.item.style_web">
                                <strong>{{ __('Web Style:') }}</strong>
                                <img v-if="row.item.style_web === 'style_1'"
                                    :src="$baseUrl + '/images/web_style/Web_Style_1.jpg'" alt="Web Style 1"
                                    height="70"
                                    @click="openLightbox($baseUrl + '/images/web_style/Web_Style_1.jpg')" />
                                <img v-if="row.item.style_web === 'style_2'"
                                    :src="$baseUrl + '/images/web_style/Web_Style_1.jpg'" alt="Web Style 2"
                                    height="70"
                                    @click="openLightbox($baseUrl + '/images/web_style/Web_Style_2.jpg')" />
                                <img v-if="row.item.style_web === 'style_3'"
                                    :src="$baseUrl + '/images/web_style/Web_Style_1.jpg'" alt="Web Style 3"
                                    height="70"
                                    @click="openLightbox($baseUrl + '/images/web_style/Web_Style_3.jpg')" />
                                <img v-if="row.item.style_web === 'style_4'"
                                    :src="$baseUrl + '/images/web_style/Web_Style_1.jpg'" alt="Web Style 4"
                                    width="70"
                                    @click="openLightbox($baseUrl + '/images/web_style/Web_Style_4.jpg')" />
                            </div>
                        </div>
                    </template>

                    <template #cell(product_type)="row">
                        {{ row.item.product_type }}
                        <div v-if="row.item.product_type === 'custom_products'">
                            <strong>{{ __('product_ids') }} : </strong> {{ row.item.product_ids }}
                        </div>
                    </template>

                    <template #cell(image)="row">
                        <p v-if="row.item.image === ''">{{ __('no_image') }}</p>
                        <img :src="$storageUrl + row.item.image" height="50" v-else />
                    </template>
                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <button class="list-action-btn is-edit" @click="edit_record = row.item"
                                v-if="$can('featured_section_update')" v-b-tooltip.hover :title="__('edit')"><i
                                    class="fa fa-pencil-alt"></i></button>
                            <button class="list-action-btn is-delete" @click="deleteSection(row.index, row.item.id)"
                                v-if="$can('featured_section_delete')" v-b-tooltip.hover
                                :title="__('delete')"><i class="fa fa-trash"></i></button>
                        </div>
                    </template>

                </b-table>
            </div>

            <div class="list-footer">
                <div class="list-perpage">
                    <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right"
                        label-size="sm" class="mb-0">
                        <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"
                            size="sm" class="form-control form-select"></b-form-select>
                    </b-form-group>
                </div>
                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
                    align="fill" size="sm" class="list-pagination"></b-pagination>
            </div>
        </div>
        <!-- Add / Edit -->
        <app-edit-record v-if="create_new || edit_record" @saved="handleSectionSaved" :record="edit_record"
            @modalClose="hideModal()"></app-edit-record>
    </div>
</template>
<script>
import EditRecord from './Edit';
import FsLightbox from "fslightbox-vue";
export default {
    components: {
        'app-edit-record': EditRecord,
        FsLightbox,
    },
    data: function () {
        return {
            fields: [
                { key: 'id', label: __('id'), sortable: true, sortDirection: 'desc' },
                { key: 'title', label: __('title'), sortable: true, class: 'text-center' },
                { key: 'short_description', label: __('short_description'), sortable: true, class: 'text-center' },
                { key: 'style', label: 'Style', class: 'text-center' },
                { key: 'product_type', label: __('product_type'), class: 'text-center' },
                { key: 'category_ids', label: __('category_ids'), class: 'text-center' },
                { key: 'position', label: __('position'), class: 'text-center' },
                { key: 'actions', label: __('actions') }
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

            isLoading: false,
            sectionStyle: 'style_1',
            max_visible_units: 12,
            max_col_in_single_row: 3,
            create_new: null,
            edit_record: null,
            sections: [],
            toggler: false,
            lightboxSources: [],
            slide: 1,
            currentLanguageId: null,
            activeLanguages: []

        }
    },
    computed: {
        translatedSections() {
            if (!this.currentLanguageId || this.sections.length === 0) {
                return this.sections;
            }

            return this.sections.map(section => {
                const translatedSection = { ...section };

                // Get main table data for fallback
                const mainTitle = section.title || '';
                const mainShortDescription = section.short_description || '';

                // Try to get translation for current language
                if (section.translations && Array.isArray(section.translations) && section.translations.length > 0) {
                    const translation = section.translations.find(
                        t => t.language_id === this.currentLanguageId
                    );

                    if (translation) {
                        // Use translation if it exists and has value
                        if (translation.title && translation.title.trim() !== '') {
                            translatedSection.title = translation.title;
                        }

                        if (
                            translation.short_description &&
                            translation.short_description.trim() !== ''
                        ) {
                            translatedSection.short_description =
                                translation.short_description;
                        }
                    }
                }

                // Fallback: If no translation found or translation is empty, use main table data
                if (!translatedSection.title || translatedSection.title.trim() === '') {
                    translatedSection.title = mainTitle;
                }
                if (!translatedSection.short_description || translatedSection.short_description.trim() === '') {
                    translatedSection.short_description = mainShortDescription;
                }

                return translatedSection;
            });
        },
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
        this.totalRows = this.sections.length
    },
    watch: {
        $route(to, from) {
            this.showCreateModal();
        }
    },
    created() {
        this.showCreateModal();

        this.$eventBus.$on('sectionSaved', (message) => {
            this.showMessage("success", message);
            this.getSections();
            this.create_new = null;
        });

        this.fetchActiveLanguages().then(() => {
            this.getSections();
        });
    },
    methods: {

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

        openLightbox(image) {

            this.lightboxSources = [image];
            this.toggler = !this.toggler;
        },
        handleClose() {
            this.lightboxSources = null;
            this.toggler = false;

        },
        handleSectionSaved(message) {
            this.showMessage('success', message);
            this.getSections();
            this.create_new = false;
            this.edit_record = null;
        },
        getSections() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/sections')
                .then((response) => {
                    this.isLoading = false
                    this.sections = response.data.data;
                    this.totalRows = this.sections.length
                }).catch(error => {
                    this.isLoading = false;

                    let msg = __('something_went_wrong');

                    if (error.response && error.response.data && error.response.data.message) {
                        msg = error.response.data.message;
                    } else if (error.message) {
                        msg = error.message;
                    }

                    this.showError(msg);
                });

        },
        deleteSection(index, id) {
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
                        id: id
                    }
                    axios.post(this.$apiUrl + '/sections/delete', postData)
                        .then((response) => {
                            this.isLoading = false
                            this.sections.splice(index, 1)
                            this.showMessage('success', response.data.message);
                        }).catch(error => {
                            this.isLoading = false;


                            let msg = __('something_went_wrong');

                            if (error.response && error.response.data && error.response.data.message) {
                                msg = error.response.data.message;
                            } else if (error.message) {
                                msg = error.message;
                            }

                            this.showError(msg);
                        });

                }
            });
        },
        showCreateModal() {
            let create = this.$route.params.create;
            if (create) {
                this.create_new = true;
            }
        },
        hideModal() {
            this.create_new = false
            this.edit_record = false

            if (this.$route.path !== '/sections') {
                this.$router.push({ path: '/sections' });
            }
        }
    },
    beforeDestroy() {
        this.$eventBus.$off('sectionSaved');
    }
};
</script>
