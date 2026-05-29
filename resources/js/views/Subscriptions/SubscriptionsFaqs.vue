<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('subscription_faqs') }}</h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><router-link to="/dashboard">{{ __('dashboard')
                                }}</router-link></li>
                                <li class="breadcrumb-item active" aria-current="page">{{ __('subscription_faqs') }}
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <section class="section">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">{{ __('subscription_faqs_list') }}</h4>
                        <span class="pull-right">
                            <button class="btn btn-primary" @click="openAddModal" v-b-tooltip.hover :title="__('add')"
                                v-if="$can('subscription_faq_create')">{{ __('add') }} {{ __('subscription_faqs')
                                }}</button>
                        </span>
                    </div>
                    <div class="card-body">

                        <b-row class="mb-3">
                            <b-col md="3">
                                <div class="form-check form-switch">
                                    <label class="text-nowrap">
                                        <input type="checkbox" v-model="enableDragDrop" class="form-check-input mr-2">
                                        {{ __('enable_drag_and_drop') }}
                                    </label>
                                </div>
                            </b-col>
                            <b-col md="3" offset-md="5">
                                <h6 class="box-title">{{ __('search') }}</h6>
                                <b-form-input id="filter-input" v-model="filter" type="search"
                                    :placeholder="__('search')" @input="getFaqs()"></b-form-input>
                            </b-col>
                            <b-col md="1" class="text-center">
                                <button class="btn btn-primary btn_refresh" v-b-tooltip.hover :title="__('refresh')"
                                    @click="getFaqs()">
                                    <i class="fa fa-refresh" aria-hidden="true"></i>
                                </button>
                            </b-col>
                        </b-row>

                        <!-- Table with drag and drop -->
                        <div v-if="enableDragDrop" class="table-responsive">
                            <table class="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th class="text-center" style="width: 50px;">{{ __('drag') }}</th>
                                        <th class="text-center" style="width: 80px;">{{ __('id') }}</th>
                                        <th>{{ __('frequently_asked_questions') }}</th>
                                        <th class="text-center" style="width: 100px;">{{ __('sort_order') }}</th>
                                        <th class="text-center" style="width: 100px;">{{ __('status') }}</th>
                                        <th class="text-center" style="width: 120px;">{{ __('actions') }}</th>
                                    </tr>
                                </thead>
                                <draggable v-model="faqs" tag="tbody" :disabled="!enableDragDrop" v-bind="dragOptions"
                                    @start="isDragging = true" @end="isDragging = false" @change="updateFaqsOrder"
                                    handle=".drag-handle">
                                    <tr v-for="faq in translatedFaqs" :key="faq.id" :class="{ 'dragging': isDragging }">
                                        <td class="text-center drag-handle" style="cursor: move;">
                                            <i class="fas fa-arrows-alt"></i>
                                        </td>
                                        <td class="text-center">{{ faq.id }}</td>
                                        <td>
                                            <a href="javascript:void(0)" style="color:#435ebe;">{{ faq.question }}</a>
                                            <div class="faq-answer">
                                                <p class="mb-0"
                                                    v-if="!shouldTruncate(faq.answer) || expandedFaqs[faq.id]">
                                                    {{ faq.answer }}
                                                </p>
                                                <p class="mb-0" v-else>
                                                    {{ getTruncatedText(faq.answer) }}
                                                </p>
                                                <a v-if="shouldTruncate(faq.answer)" @click="toggleFaqExpansion(faq.id)"
                                                    href="javascript:void(0)"
                                                    style="color: #007bff; font-size: 12px; cursor: pointer;">
                                                    {{ expandedFaqs[faq.id] ? __('view_less') : __('view_more') }}
                                                </a>
                                            </div>
                                        </td>
                                        <td class="text-center">{{ faq.sort_order }}</td>
                                        <td class="text-center">
                                            <span class='badge bg-success' v-if="faq.status == 1">{{ __('active')
                                            }}</span>
                                            <span class='badge bg-danger' v-if="faq.status == 0">{{ __('deactive')
                                            }}</span>
                                        </td>
                                        <td class="text-center">
                                            <button class="btn btn-sm btn-primary" @click="editFaq(faq)"
                                                v-b-tooltip.hover :title="__('edit')"
                                                v-if="$can('subscription_faq_update')"><i
                                                    class="fa fa-pencil-alt"></i></button>
                                            <button class="btn btn-sm btn-danger"
                                                @click="deleteFaq(getFaqIndex(faq.id), faq.id)" v-b-tooltip.hover
                                                :title="__('delete')" v-if="$can('subscription_faq_delete')"><i
                                                    class="fa fa-trash"></i></button>
                                        </td>
                                    </tr>
                                </draggable>
                            </table>
                        </div>

                        <!-- Regular table when drag and drop is disabled -->
                        <div v-else class="table-responsive">
                            <b-table :items="translatedFaqs" :fields="fields" :current-page="currentPage"
                                :per-page="perPage" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
                                :sort-direction="sortDirection" :bordered="true" :busy="isLoading" stacked="md"
                                show-empty small @filtered="onFiltered">
                                <template #table-busy>
                                    <div class="text-center text-black my-2">
                                        <b-spinner class="align-middle"></b-spinner>
                                        <strong>{{ __('loading') }}...</strong>
                                    </div>
                                </template>
                                <template #cell(faqs)="row">
                                    <a href="javascript:void(0)" style="color:#435ebe;">{{ row.item.question }}</a>
                                    <div class="faq-answer">
                                        <p class="mb-0"
                                            v-if="!shouldTruncate(row.item.answer) || expandedFaqs[row.item.id]">
                                            {{ row.item.answer }}
                                        </p>
                                        <p class="mb-0" v-else>
                                            {{ getTruncatedText(row.item.answer) }}
                                        </p>
                                        <!-- View More/Less Link -->
                                        <a v-if="shouldTruncate(row.item.answer)"
                                            @click="toggleFaqExpansion(row.item.id)" href="javascript:void(0)"
                                            style="color: #007bff; font-size: 12px; cursor: pointer;">
                                            {{ expandedFaqs[row.item.id] ? __('view_less') : __('view_more') }}
                                        </a>
                                    </div>
                                </template>
                                <template #cell(sort_order)="row">
                                    <span>{{ row.item.sort_order }}</span>
                                </template>
                                <template #cell(status)="row">
                                    <span class='badge bg-success' v-if="row.item.status == 1">{{ __('active') }}</span>
                                    <span class='badge bg-danger' v-if="row.item.status == 0">{{ __('deactive')
                                    }}</span>
                                </template>
                                <template #cell(actions)="row">
                                    <button class="btn btn-sm btn-primary" @click="editFaq(row.item)" v-b-tooltip.hover
                                        :title="__('edit')" v-if="$can('subscription_faq_update')"><i
                                            class="fa fa-pencil-alt"></i></button>
                                    <button class="btn btn-sm btn-danger" @click="deleteFaq(row.index, row.item.id)"
                                        v-b-tooltip.hover :title="__('delete')"
                                        v-if="$can('subscription_faq_delete')"><i class="fa fa-trash"></i></button>
                                </template>
                            </b-table>
                        </div>
                        <!-- Pagination controls (only show when drag-and-drop is disabled) -->
                        <b-row v-if="!enableDragDrop">
                            <b-col md="2" class="my-1">
                                <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right"
                                    label-size="sm" class="mb-0">
                                    <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"
                                        size="sm" class="form-control form-select"></b-form-select>
                                </b-form-group>
                            </b-col>
                            <b-col md="4" class="my-1" offset-md="6">
                                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
                                    align="fill" size="sm" class="my-0"></b-pagination>
                            </b-col>
                        </b-row>
                        <!-- Show total count when drag-and-drop is enabled -->
                        <b-row v-else class="mt-2">
                            <b-col>
                                <p class="text-muted mb-0">{{ __('total') }}: {{ totalRows }} {{ __('items') }}</p>
                            </b-col>
                        </b-row>

                    </div>

                </div>
            </section>
        </div>

        <!-- Add / Edit Modal -->
        <b-modal ref="faq-modal" :title="modalTitle" @hidden="hideModal" scrollable no-close-on-backdrop no-fade static
            size="lg" v-model="create_new">

            <div slot="modal-footer">
                <b-button variant="primary" @click="$refs['dummy_submit'].click()" :disabled="isSubmitting">
                    {{ __('save') }}
                    <b-spinner v-if="isSubmitting" small label="Spinning"></b-spinner>
                </b-button>
                <b-button variant="secondary" @click="hideModal">{{ __('cancel') }}</b-button>
            </div>

            <!-- Loading languages -->
            <div v-if="isLoadingLanguages" class="text-center p-5">
                <b-spinner></b-spinner>
                <p>{{ __('loading_languages') }}</p>
            </div>

            <form v-else ref="faq-form" @submit.prevent="saveFaq" novalidate>
                <b-tabs v-if="languages.length && Object.keys(form.translations).length" v-model="activeLanguageTab"
                    content-class="mt-3">
                    <b-tab v-for="language in languages" :key="language.id" lazy>

                        <template #title>
                            <span :class="{ 'text-primary font-weight-bold': language.is_default }">
                                {{ language.name }}
                            </span>
                        </template>

                        <!-- Translate buttons -->
                        <div class="mb-3" v-if="language.is_default && languages.length > 1">
                            <b-button size="sm" variant="outline-primary" class="mr-2" @click="translateEmpty(language)"
                                v-b-tooltip.hover
                                :title="__('only_empty_fields_will_be_translated_existing_content_will_not_be_changed')"
                                :disabled="loadingEmpty">
                                <span v-if="!loadingEmpty">{{ __('translate_empty_fields') }}</span>
                                <b-spinner v-else small></b-spinner>
                            </b-button>
                            <b-button size="sm" variant="outline-danger" @click="translateOverwrite(language)"
                                v-b-tooltip.hover
                                :title="__('all_fields_will_be_translated_and_existing_content_will_be_overwritten')"
                                :disabled="loadingOverwrite">
                                <span v-if="!loadingOverwrite">{{ __('translate_and_overwrite') }}</span>
                                <b-spinner v-else small></b-spinner>
                            </b-button>
                            <div v-if="translateSuccessMessage" class="text-success mt-2 font-weight-bold">
                                {{ translateSuccessMessage }}
                            </div>
                        </div>
                        <!-- Translate buttons END -->

                        <div class="col-md-12">

                            <!-- Question -->
                            <div class="form-group">
                                <i class="text-danger" v-if="language.is_default">*</i>
                                <label for="question">{{ __('query') }}</label>

                                <input type="text" name="question" id="question" class="form-control"
                                    :required="language.is_default ? true : undefined"
                                    v-model="form.translations[language.id].question"
                                    :placeholder="__('enter_question')" maxlength="1000">
                            </div>
                        </div>

                        <!-- Answer -->
                        <div class="form-group">

                            <div class="form-group">
                                <i class="text-danger" v-if="language.is_default">*</i>
                                <label for="answer">{{ __('answer') }}</label>

                                <textarea class="form-control" name="answer" id="answer" rows="5"
                                    :required="language.is_default ? true : undefined"
                                    v-model="form.translations[language.id].answer" :placeholder="__('enter_answer')"
                                    maxlength="1000"></textarea>
                            </div>
                        </div>

                        <!-- Status & Sort only once (default language) -->
                        <div class="row" v-if="language.is_default">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="sort_order">{{ __('sort_order') }}</label>
                                    <input type="number" class="form-control" name="sort_order" id="sort_order"
                                        v-model="form.sort_order" :placeholder="__('enter_sort_order')" min="0">

                                </div>
                            </div>

                            <div class="col-md-6">
                                <label>{{ __('status') }}</label>
                                <b-form-radio-group v-model="form.status" :options="[
                                    { text: __('deactive'), value: 0 },
                                    { text: __('active'), value: 1 }
                                ]" buttons button-variant="outline-primary d-flex gap-2" required>
                                </b-form-radio-group>
                            </div>
                        </div>

                    </b-tab>
                </b-tabs>

                <button ref="dummy_submit" style="display:none;"></button>
            </form>
        </b-modal>

    </div>
</template>
<script>
import draggable from 'vuedraggable';
import axios from "axios";
import TranslationHelper from '../../mixins/TranslationHelper.js';

export default {
    mixins: [TranslationHelper],
    name: 'SubscriptionsFaqs',
    components: {
        draggable,
    },
    data: function () {
        return {
            translatableFields: ['question', 'answer'],
            translateSuccessMessage: '',
            loadingEmpty: false,
            loadingOverwrite: false,
            fields: [
                { key: 'id', label: __('id'), sortable: true, class: 'text-center' },
                { key: 'faqs', label: __('frequently_asked_questions') },
                { key: 'sort_order', label: __('sort_order'), sortable: true, class: 'text-center' },
                { key: 'status', label: __('status'), class: 'text-center' },
                { key: 'actions', label: __('actions'), class: 'text-center' }
            ],
            totalRows: 1,
            currentPage: 1,
            perPage: this.$perPage,
            pageOptions: this.$pageOptions,
            sortBy: 'id',
            sortDesc: true,
            sortDirection: 'desc',
            filter: null,
            filterOn: ['id', 'question', 'answer', 'status'],
            //   filterOn: [],

            page: 1,

            isLoading: false,
            isSubmitting: false,
            isUpdatingOrder: false,
            create_new: false,
            edit_record: null,
            allFaqs: [], // Store all FAQs
            faqs: [], // Displayed FAQs for drag-and-drop mode
            expandedFaqs: {}, // Track which FAQs are expanded
            maxLength: 200, // Maximum characters to show before truncation
            enableDragDrop: false, // Enable/disable drag and drop
            isDragging: false, // Track if currently dragging
            currentLanguageId: null,
            activeLanguages: []
            ,
            languages: [],
            activeLanguageTab: 0,
            isLoadingLanguages: true,
            form: {
                id: null,
                translations: {},
                sort_order: 0,
                status: 1
            }
        }
    },
    computed: {
        defaultLanguageId() {
            const d = this.languages.find(l => l.is_default === 1);
            return d ? d.id : null;
        },
        translations() {
            return this.form.translations || {};
        },
        translatedFaqs() {
            if (!this.currentLanguageId) {
                return this.allFaqs;
            }

            return this.allFaqs.map(faq => {
                const translated = { ...faq };

                if (faq.translations && Array.isArray(faq.translations)) {
                    const t = faq.translations.find(
                        tr => tr.language_id === this.currentLanguageId
                    );

                    // fallback logic (same pattern as category)
                    if (t?.question?.trim()) {
                        translated.question = t.question;
                    }

                    if (t?.answer?.trim()) {
                        translated.answer = t.answer;
                    }
                }

                return translated;
            });
        }
        ,
        sortOptions() {
            // Create an options list from our fields
            return this.fields
                .filter(f => f.sortable)
                .map(f => {
                    return { text: f.label, value: f.key }
                })
        },
        // Modal title based on whether we're editing or creating
        modalTitle() {
            let title = this.form.id ? __('edit') : __('add');
            title += " ";
            title += __('subscription_faqs');
            return title;
        },
        // Drag options for vuedraggable
        dragOptions() {
            return {
                animation: 200,
                group: "faqs",
                disabled: !this.enableDragDrop,
                ghostClass: "ghost",
                chosenClass: "chosen"
            };
        }
    },
    watch: {
        // Watch for enableDragDrop changes
        enableDragDrop(newVal) {
            if (newVal) {
                // When enabling drag-drop, show all FAQs (no pagination)
                this.faqs = [...this.allFaqs];
                this.totalRows = this.allFaqs.length;
            } else {
                // When disabling drag-drop, b-table will handle pagination automatically
                // Just ensure totalRows is set correctly
                this.totalRows = this.allFaqs.length;
            }
        }
    },
    mounted() {
        // Set the initial number of items
        this.totalRows = this.faqs.length

    },
    created() {
        this.fetchActiveLanguages().then(() => {
            this.getFaqs();
        });
    }
    ,
    methods: {

        loadFaqWithTranslations() {
            this.isLoadingData = true;

            return axios.get(this.$apiUrl + '/subscription_faqs', {
                params: {
                    id: this.id
                }
            })
                .then(response => {
                    if (response.data.data) {

                        // API may return array or single object
                        const faqs = Array.isArray(response.data.data)
                            ? response.data.data
                            : [response.data.data];

                        const faq = faqs.length > 0 ? faqs[0] : null;

                        if (!faq) {
                            console.error('FAQ not found in response');
                            this.isLoadingData = false;
                            return;
                        }

                        /* ---------------- BASE DATA ---------------- */
                        this.form.id = faq.id;
                        this.form.sort_order = faq.sort_order;
                        this.form.status = faq.status;

                        /* ----------- TRANSLATIONS MERGE ------------ */
                        const updatedTranslations = { ...this.form.translations };

                        // Load translation table data
                        if (faq.translations && Array.isArray(faq.translations)) {
                            faq.translations.forEach(trans => {
                                const langId = trans.language_id;
                                updatedTranslations[langId] = {
                                    language_id: langId,
                                    question: trans.question || '',
                                    answer: trans.answer || ''
                                };
                            });
                        }

                        // Fallback to base table for default language
                        this.languages.forEach(language => {
                            if (
                                !updatedTranslations[language.id] ||
                                (!updatedTranslations[language.id].question &&
                                    !updatedTranslations[language.id].answer)
                            ) {
                                if (language.is_default) {
                                    updatedTranslations[language.id] = {
                                        language_id: language.id,
                                        question: faq.question || '',
                                        answer: faq.answer || ''
                                    };
                                }
                            }
                        });


                        this.form.translations = updatedTranslations;
                    }

                    this.isLoadingData = false;
                })
                .catch(error => {
                    console.error('Error loading FAQ translations:', error);
                    this.isLoadingData = false;
                    throw error;
                });
        },

        fetchActiveLanguages() {
            this.isLoadingLanguages = true;

            return axios.get(this.$apiUrl + '/active_languages')
                .then(res => {
                    this.languages = res.data.data || [];

                    const appLocale = window.appLocale || 'en';

                    const currentLang = this.languages.find(
                        l => l.code === appLocale
                    );

                    if (currentLang) {
                        this.currentLanguageId = currentLang.id;
                    } else {
                        const defaultLang = this.languages.find(
                            l => l.is_default === 1
                        );
                        this.currentLanguageId = defaultLang?.id || null;
                    }


                    this.initializeTranslations(); // do NOT remove
                })
                .catch(() => {
                    this.showError(__('something_went_wrong'));
                })
                .finally(() => {
                    this.isLoadingLanguages = false;
                });
        }
        ,



        initializeTranslations(existingTranslations = [], baseFaq = null) {
            const map = {};

            this.languages.forEach(lang => {
                const found = existingTranslations.find(
                    t => t.language_id === lang.id
                );

                map[lang.id] = {
                    language_id: lang.id,
                    question: found?.question
                        ?? (lang.is_default ? baseFaq?.question : '')
                        ?? '',
                    answer: found?.answer
                        ?? (lang.is_default ? baseFaq?.answer : '')
                        ?? ''
                };
            });


            this.form.translations = map;
        },

        switchToDefaultLanguageTab() {
            const defaultLangIndex = this.languages.findIndex(lang => lang.id === this.defaultLanguageId);
            if (defaultLangIndex !== -1) {
                this.showError(__('please_fill_default_language_required_fields'));
                this.activeLanguageTab = defaultLangIndex;
            }
        },

        validateDefaultLanguageForTranslation() {
            return this.validateDefaultLanguage();
        },

        validateDefaultLanguage() {
            const defaultLang = this.languages.find(l => l.is_default);
            if (!defaultLang) return true;

            const t = this.form.translations?.[defaultLang.id];

            if (!t || !t.question || !t.answer) {
                this.showError(__('please_fill_default_language_required_fields'));
                this.switchToDefaultLanguageTab();
                return false;
            }
            return true;
        },

        // Get all subscription FAQs
        getFaqs() {
            this.isLoading = true
            const params = {
                search: this.filter
            };

            axios.get(this.$apiUrl + '/subscription_faqs/', { params })
                .then((response) => {
                    this.isLoading = false;
                    if (response.data.status === 1) {
                        this.allFaqs = response.data.data || [];
                        this.totalRows = response.data.total || this.allFaqs.length;
                        // Update displayed FAQs based on current mode
                        if (this.enableDragDrop) {
                            // When drag-drop is enabled, show all FAQs
                            this.faqs = [...this.allFaqs];
                        }
                        // When drag-drop is disabled, b-table handles pagination automatically
                    } else {
                        this.showError(response.data.message);
                        this.allFaqs = [];
                        this.faqs = [];
                        this.totalRows = 0;
                    }
                })
                .catch((error) => {
                    this.isLoading = false;
                    this.showError(__('something_went_wrong'));
                    this.allFaqs = [];
                    this.faqs = [];
                    this.totalRows = 0;
                });
        },

        // Handle filtered event from b-table
        onFiltered(filteredItems) {
            // Update totalRows when filter is applied
            this.totalRows = filteredItems.length;
        },

        // Delete a subscription FAQ
        deleteFaq(index, id) {
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
                    axios.post(this.$apiUrl + `/subscription_faqs/delete/${id}`)
                        .then((response) => {
                            this.isLoading = false
                            if (response.data.status === 1) {
                                // Remove from both faqs and allFaqs arrays
                                const allFaqsIndex = this.allFaqs.findIndex(faq => faq.id === id);
                                if (allFaqsIndex !== -1) {
                                    this.allFaqs.splice(allFaqsIndex, 1);
                                }

                                // Remove from faqs array (for drag-drop mode)
                                if (this.enableDragDrop) {
                                    const faqsIndex = this.faqs.findIndex(faq => faq.id === id);
                                    if (faqsIndex !== -1) {
                                        this.faqs.splice(faqsIndex, 1);
                                    }
                                }

                                this.totalRows = this.allFaqs.length;
                                this.showMessage("success", response.data.message);
                            } else {
                                this.showError(response.data.message);
                            }
                        })
                        .catch((error) => {
                            this.isLoading = false;
                            this.showError(__('something_went_wrong'));
                        });
                }
            });
        },

        // Hide modal and reset form
        hideModal() {
            this.isSubmitting = false;
            this.create_new = false;
            this.resetForm();
        },

        // Open add modal
        openAddModal() {
            this.resetForm();

            this.fetchActiveLanguages().then(() => {
                this.create_new = true;
            });
        }
        ,

        // Edit FAQ - populate form with FAQ data
        editFaq(faq) {
            this.resetForm();

            this.fetchActiveLanguages().then(() => {
                this.form.id = faq.id;
                this.form.sort_order = faq.sort_order;
                this.form.status = faq.status;

                this.initializeTranslations(
                    faq.translations || [],
                    faq
                );

                this.create_new = true;
            });
        },

        resetForm() {
            this.isSubmitting = false;

            this.form = {
                id: null,
                translations: {},
                sort_order: 0,
                status: 1
            };

            this.activeLanguageTab = 0;
        },

        // Save FAQ (create or update)
        saveFaq() {
            if (!this.validateDefaultLanguage()) return;

            const payload = {
                status: this.form.status,
                sort_order: this.form.sort_order,
                translations: Object.values(this.form.translations)
            };

            let url = this.$apiUrl + '/subscription_faqs/save';
            if (this.form.id) {
                url = this.$apiUrl + '/subscription_faqs/update/' + this.form.id;
            }

            this.isSubmitting = true;

            axios.post(url, payload)
                .then((response) => {
                    this.isSubmitting = false;
                    if (response.data.status === 1) {
                        this.showMessage("success", response.data.message);
                        this.hideModal();
                        this.getFaqs();
                    } else {
                        this.showError(response.data.message);
                    }
                })
                .catch(() => {
                    this.showError(__('something_went_wrong'));
                })
                .finally(() => {
                    this.isSubmitting = false;
                });
        }
        ,

        // Toggle FAQ expansion state
        toggleFaqExpansion(faqId) {
            this.$set(this.expandedFaqs, faqId, !this.expandedFaqs[faqId]);
        },

        // Check if FAQ answer should be truncated
        shouldTruncate(answer) {
            return answer && answer.length > this.maxLength;
        },

        // Get truncated text for display
        getTruncatedText(answer) {
            if (!answer) return '';
            return answer.length > this.maxLength ? answer.substring(0, this.maxLength) + '...' : answer;
        },

        // Get FAQ index by ID (for delete function)
        getFaqIndex(id) {
            return this.faqs.findIndex(faq => faq.id === id);
        },

        // Update FAQs order after drag and drop
        updateFaqsOrder() {
            // Update sort_order based on new position in the displayed list
            // Since we're showing all FAQs when drag-drop is enabled, update all
            this.faqs.forEach((faq, index) => {
                faq.sort_order = index + 1;
            });

            // Also update allFaqs to keep them in sync
            this.allFaqs = [...this.faqs];

            // Send update to server
            this.isUpdatingOrder = true;
            const formData = this.faqs.map(faq => ({
                id: faq.id,
                sort_order: faq.sort_order
            }));

            axios.post(this.$apiUrl + '/subscription_faqs/update_order', { faqs: formData })
                .then((response) => {
                    this.isUpdatingOrder = false;
                    if (response.data.status === 1) {
                        this.showMessage("success", response.data.message || __('order_updated_successfully'));
                        // Update allFaqs to reflect new order
                        this.allFaqs = [...this.faqs];
                    } else {
                        this.showError(response.data.message);
                        // Reload FAQs to restore original order
                        this.getFaqs();
                    }
                })
                .catch((error) => {
                    this.isUpdatingOrder = false;
                    this.showError(__('something_went_wrong'));
                    // Reload FAQs to restore original order
                    this.getFaqs();
                });
        },
    },
};
</script>

<style scoped>
.faq-answer {
    margin-top: 8px;
    color: #666;
    font-size: 14px;
}

/* Drag and drop styles */
.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}

.chosen {
    background: #e3f2fd;
}

.dragging {
    opacity: 0.8;
}

.drag-handle {
    cursor: move;
    user-select: none;
}

.drag-handle:hover {
    color: #007bff;
}

.table tbody tr {
    cursor: default;
}

.table tbody tr:hover {
    background-color: #f8f9fa;
}
</style>

<style>
.swal2-container {
    z-index: 9999 !important;
}

.swal2-popup {
    z-index: 10000 !important;
}

.swal2-backdrop-show {
    z-index: 9998 !important;
}

.swal2-container.swal2-backdrop-show {
    z-index: 9999 !important;
}
</style>
