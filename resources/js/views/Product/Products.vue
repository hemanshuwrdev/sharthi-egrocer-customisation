<template>
    <div>
        <div class="page-heading">
            <div class="row">
                <div class="col-12 col-md-6 order-md-1 order-last">
                    <h3>{{ __('manage_products') }}</h3>
                </div>
                <div class="col-12 col-md-6 order-md-2 order-first">
                    <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item" v-if="isSellerRoute">
                                <router-link to="/seller/dashboard">{{ __('dashboard') }}</router-link>
                            </li>
                            <li class="breadcrumb-item" v-else>
                                <router-link to="/dashboard">{{ __('dashboard') }}</router-link>
                            </li>
                            <li class="breadcrumb-item active" aria-current="page">{{ __('manage_products') }}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div class="row">
                <div class="col-12 col-md-12 order-md-1 order-last">
                    <div class="card">

                        <div class="card-header">
                            <h4>{{ __('products') }}</h4>
                            <span class="pull-right">
                                <template v-if="$roleSeller == login_user.role.name">
                                    <router-link to="/seller/manage_products/create" class="btn btn-primary"
                                        v-b-tooltip.hover title="Add Product">{{ __('add_product') }}</router-link>
                                </template>
                                <template v-else>
                                    <router-link to="/manage_products/create" class="btn btn-primary" v-b-tooltip.hover
                                        title="Add Product">{{ __('add_product') }}</router-link>
                                </template>
                            </span>
                        </div>

                        <div class="card-body">
                            <div class="row">
                                <div class="form-group col-md-3">
                                    <b-dropdown size="sm" dropright :text="__('actions')"
                                        split-variant="outline-primary" variant="primary" class="m-2"
                                        :disabled="selectedItems.length === 0">
                                        <b-dropdown-item href="javascript:void(0);" @click="multipleDelete"><span
                                                class="text-danger" style="font-weight: bold;"><i
                                                    class="fa fa-trash"></i> {{ __('delete_selected_products')
                                                }}</span>
                                        </b-dropdown-item>
                                    </b-dropdown>
                                </div>
                            </div>
                            <b-row class="mb-3">
                                <b-col md="2" class="mb-3">
                                    <h6 class="box-title">{{ __('categories') }}</h6>
                                    <form method="post">
                                        <select @change="getRecords()" v-model="category"
                                            class="form-control form-select">
                                            <option value="">{{ __('all_categories') }}</option>
                                            <option v-for="category in translatedCategories" :value="category.id">
                                                {{ category.name }}
                                            </option>
                                        </select>
                                    </form>
                                </b-col>
                                <b-col md="2" class="mb-3">
                                    <h6 class="box-title">{{ __('status') }} </h6>
                                    <select id="is_approved" name="is_approved" @change="getRecords()"
                                        v-model="is_approved" class="form-control form-select">
                                        <option value="">{{ __('select_status') }}</option>
                                        <option value="1">{{ __('approved') }}</option>
                                        <option value="0">{{ __('not_approved') }}</option>
                                    </select>
                                </b-col>

                                <template v-if="$roleSeller == login_user.role.name">

                                    <input type="hidden" :value="seller = login_user.seller.id">
                                </template>
                                <template v-else>
                                    <b-col md="3" class="mb-3">
                                        <h6 class="box-title">{{ __('sellers') }} </h6>
                                        <select @change="getRecords()" v-model="seller"
                                              required class="form-control form-select">
                                            <option value="">{{ __('all_sellers') }}</option>
                                            <option v-for="seller in translatedSellers" :value="seller.id">{{ seller.name }}
                                            </option>
                                        </select>
                                    </b-col>
                                </template>
                                <b-col md="3" class="mb-3" v-bind:class="($roleSeller == login_user.role.name) ? 'offset-3' : ''">
                                    <h6 class="box-title">{{ __('search') }}</h6>
                                    <b-form-input id="filter-input" v-model="filter" type="search"
                                        :placeholder="__('search')" @input="getRecords()"></b-form-input>
                                </b-col>
                                <b-col md="2" class="text-center mb-3">

                                    <div class="btn-group btn_tool" role="group" aria-label="Basic example">
                                        <button type="button" class="btn btn-primary" v-b-tooltip.hover
                                            :title="__('refresh')" @click="getRecords()">
                                            <i class="fa fa-refresh" aria-hidden="true"></i>
                                        </button>

                                        <b-dropdown dropleft menu-class="w-100 border dropdownOverflow"
                                            v-b-tooltip.hover :title="__('columns')">
                                            <template #button-content>
                                                <i class="fa fa-th-list"></i>
                                            </template>
                                            <li class="m-1" v-for="field in fields" :key="field.key"
                                                v-if="field.key !== 'select'">
                                                <input type="checkbox" :id="field.key"
                                                    :disabled="visibleFields.length == 1 && field.visible"
                                                    v-model="field.visible" class="form-check-input">
                                                <label :for="field.key">{{ field.label }}</label>
                                                <b-dropdown-divider></b-dropdown-divider>
                                            </li>
                                        </b-dropdown>
                                    </div>
                                </b-col>
                            </b-row>
                            <div class="table-responsive">
                                <b-table :items="translatedProducts" :fields="visibleFields" :filter="filter"
                                    :filter-included-fields="filterOn" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
                                    :sort-direction="sortDirection" :bordered="true" :busy="isLoading" stacked="md"
                                    show-empty small>

                                    <template #table-busy>
                                        <div class="text-center text-black my-2">
                                            <b-spinner class="align-middle"></b-spinner>
                                            <strong>{{ __('loading') }}...</strong>
                                        </div>
                                    </template>

                                    <template #head(select)="row">
                                        <input type="checkbox" v-model="all_select" @click="allSelectCheckBox"
                                            class="form-check-input">
                                    </template>
                                    <template #cell(select)="row">
                                        <input type="checkbox" v-model="selectedItems" @change="selectCheckBox"
                                            :value="`${row.item.product_variant_id}`" class="form-check-input">
                                    </template>

                                    <template #cell(seller_name)="row">
                                        {{ row.item.seller_name }}
                                    </template>

                                    <template #cell(image)="row">
                                        <img :src="$storageUrl + row.item.image"
                                            @click="openLightbox($storageUrl + row.item.image)" alt="Image"
                                            height="50" />

                                        <FsLightbox :toggler="toggler" :sources="lightboxSources"
                                            :onClose="handleClose"> </FsLightbox>

                                    </template>

                                    <template #cell(is_approved)="row">
                                        <span class='badge bg-success' v-if="row.item.is_approved == 1">{{ __('approved') }}</span>
                                        <span class='badge bg-danger'
                                            v-if="row.item.is_approved == 0">{{ __('not_approved') }}</span>
                                    </template>
                                    <template #cell(return_status)="row">
                                        <span class='badge bg-danger'
                                            v-if="row.item.return_status == 0">{{ __('not_allowed') }}</span>
                                        <span class='badge bg-success' v-if="row.item.return_status == 1">{{ __('allowed') }}</span>
                                    </template>
                                    <template #cell(cancelable_status)="row">
                                        <span class='badge bg-danger'
                                            v-if="row.item.cancelable_status === 0">{{ __('not_allowed') }}</span>
                                        <span class='badge bg-success'
                                            v-if="row.item.cancelable_status == 1">{{ __('allowed') }}</span>
                                    </template>

                                    <template #cell(actions)="row">
                                        <div>

                                            <template v-if="$roleSeller == login_user.role.name">
                                                <router-link
                                                    :to="{ name: 'SellerViewProduct', params: { id: row.item.id, record: row.item } }"
                                                    class="btn btn-primary btn-sm" v-b-tooltip.hover
                                                    :title="__('view')">
                                                    <i class="fa fa-eye"></i>
                                                </router-link>
                                                <router-link
                                                    :to="{ name: 'SellerEditProduct', params: { id: row.item.id, record: row.item } }"
                                                    class="btn btn-success btn-sm" v-if="$can('product_update')"
                                                    v-b-tooltip.hover :title="__('edit')">
                                                    <i class="fa fa-pencil-alt"></i>
                                                </router-link>
                                                <router-link
                                                    :to="{ name: 'SellerProductRatings', params: { id: row.item.id, record: row.item } }"
                                                    class="btn btn-success btn-sm" v-if="$can('product_update')"
                                                    v-b-tooltip.hover :title="__('view')">
                                                    <i class="fa fa-star"></i>
                                                </router-link>
                                                <router-link
                                                    :to="{ name: 'SellerCloneProduct', params: { id: row.item.id, record: row.item, clone: true } }"
                                                    class="btn btn-success btn-sm" v-if="$can('product_update')"
                                                    v-b-tooltip.hover :title="__('clone_product')">
                                                    <i class="fa fa-clone"></i>
                                                </router-link>
                                            </template>
                                            <template v-else>
                                                <router-link
                                                    :to="{ name: 'ViewProduct', params: { id: row.item.id, record: row.item } }"
                                                    class="btn btn-primary btn-sm" v-b-tooltip.hover
                                                    :title="__('view')">
                                                    <i class="fa fa-eye"></i>
                                                </router-link>
                                                <router-link
                                                    :to="{ name: 'EditProduct', params: { id: row.item.id, record: row.item } }"
                                                    class="btn btn-success btn-sm" v-if="$can('product_update')"
                                                    v-b-tooltip.hover :title="__('edit')">
                                                    <i class="fa fa-pencil-alt"></i>
                                                </router-link>
                                                <router-link
                                                    :to="{ name: 'ProductRatings', params: { id: row.item.id, record: row.item } }"
                                                    class="btn btn-success btn-sm" v-if="$can('product_update')"
                                                    v-b-tooltip.hover :title="__('view_ratings')">
                                                    <i class="fa fa-star"></i>
                                                </router-link>
                                                <router-link
                                                    :to="{ name: 'CloneProduct', params: { id: row.item.id, record: row.item, clone: true } }"
                                                    class="btn btn-success btn-sm" v-if="$can('product_update')"
                                                    v-b-tooltip.hover :title="__('clone_product')">
                                                    <i class="fa fa-clone"></i>
                                                </router-link>
                                            </template>

                                            <button class="btn btn-danger btn-sm"
                                                @click="deleteRecord(row.index, row.item.product_variant_id)"
                                                v-if="$can('product_delete')" v-b-tooltip.hover :title="__('delete')">
                                                <i class="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </template>

                                </b-table>
                            </div>
                            <b-row>
                                <b-col md="2">
                                    <label>
                                        <b-form-group :label="__('per_page')" label-for="per-page-select"
                                            label-align-sm="right" label-size="sm" class="mb-0">

                                            <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"
                                                size="sm" class="form-control form-select"></b-form-select>
                                        </b-form-group>
                                    </label>
                                </b-col>
                                <b-col md="4" offset-md="6">
                                    <label>{{ __('total_records') }} :- {{ totalRows }} </label>
                                    <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
                                        align="fill" size="sm" class="my-0">
                                    </b-pagination>
                                </b-col>
                            </b-row>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>
<script>
import axios from "axios";
import Auth from '../../Auth.js';
import FsLightbox from "fslightbox-vue";
export default {
    components: {
        FsLightbox,
    },
    data: function () {
        return {
            login_user: Auth.user,

            fields: [
                { key: 'select', label: '', visible: true, class: 'text-center' },
                { key: 'product_variant_id', label: __('id'), visible: true, sortable: true, sortDirection: 'desc', class: 'text-center' },
                { key: 'product_id', label: __('product_id'), visible: true, sortable: true, sortDirection: 'desc', class: 'text-center' },
                { key: 'tax_id', label: __('tax_id'), visible: false, sortable: true, class: 'text-center' },
                { key: 'seller_name', label: __('seller_name'), visible: true, class: 'text-center', sortable: true },
                { key: 'name', label: __('name'), visible: true, sortable: true, class: 'text-center' },
                { key: 'image', label: __('image'), visible: true, class: 'text-center' },
                { key: 'price', label: __('price') + '(' + this.$currency + ')', visible: true, class: 'text-center', sortable: true },
                { key: 'discounted_price', label: __('discounted_price') + '(' + this.$currency + ')', visible: true, class: 'text-center', sortable: true },
                { key: 'is_approved', label: __('is_approved'), visible: true, class: 'text-center', sortable: true },
                { key: 'return_status', label: __('return'), visible: false, class: 'text-center', sortable: true },
                { key: 'cancelable_status', label: __('cancellation'), visible: false, class: 'text-center', sortable: true },
                { key: 'actions', label: __('actions'), visible: true }
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
            categories: [],
            sellers: [],
            products: [],

            category: "",
            seller: (Auth.user.seller !== null) ? Auth.user.seller.id : "",
            is_approved: "",

            selectedItems: [],
            select: '',
            all_select: false,
            isLoading: false,
            toggler: false,
            lightboxSources: [],

            currentLanguageId: null,
            activeLanguages: []
        }
    },
    computed: {
        visibleFields() {
            return this.fields.filter(field => field.visible)
        },
        isSellerRoute() {
            // Use this.$route to access the current route
            return this.$route.path.startsWith('/seller/');
        },
        translatedProducts: function() {
            if (!this.currentLanguageId || this.products.length === 0) {
                return this.products;
            }

            // Get translated sellers for lookup
            const sellersMap = {};
            if (this.translatedSellers && this.translatedSellers.length > 0) {
                this.translatedSellers.forEach(seller => {
                    sellersMap[seller.id] = seller.name;
                });
            }

            return this.products.map(product => {
                const translatedProduct = { ...product };

                // Translate product name
                if (product.translations && Array.isArray(product.translations)) {
                    const translation = product.translations.find(
                        t => t.language_id === this.currentLanguageId
                    );

                    if (translation && translation.name && translation.name.trim() !== '') {
                        translatedProduct.name = translation.name;
                    }
                }

                // Translate seller name
                if (product.seller_id && sellersMap[product.seller_id]) {
                    translatedProduct.seller_name = sellersMap[product.seller_id];
                }

                return translatedProduct;
            });
        },
        translatedCategories: function() {
            if (!this.currentLanguageId || this.categories.length === 0) {
                return this.categories;
            }

            // Get default language ID for fallback
            const defaultLanguage = this.activeLanguages.find(lang => lang.is_default === 1);
            const defaultLanguageId = defaultLanguage ? defaultLanguage.id : null;

            return this.categories.map(category => {
                const translatedCategory = { ...category };
                let translatedName = category.name; // Fallback to main table name

                if (category.translations && Array.isArray(category.translations)) {
                    // First try to find translation for current language
                    let translation = category.translations.find(
                        t => t.language_id === this.currentLanguageId
                    );

                    // If not found, try default language
                    if (!translation && defaultLanguageId) {
                        translation = category.translations.find(
                            t => t.language_id === defaultLanguageId
                        );
                    }

                    // Use translation name if available and not empty
                    if (translation && translation.name && translation.name.trim() !== '') {
                        translatedName = translation.name;
                    }
                }

                translatedCategory.name = translatedName;
                return translatedCategory;
            });
        },
        translatedSellers: function() {
            if (!this.currentLanguageId || this.sellers.length === 0) {
                return this.sellers;
            }

            // Get default language ID for fallback
            const defaultLanguage = this.activeLanguages.find(lang => lang.is_default === 1);
            const defaultLanguageId = defaultLanguage ? defaultLanguage.id : null;

            return this.sellers.map(seller => {
                const translatedSeller = { ...seller };
                let translatedName = seller.name; // Fallback to main table name

                if (seller.translations && Array.isArray(seller.translations)) {
                    // First try to find translation for current language
                    let translation = seller.translations.find(
                        t => t.language_id === this.currentLanguageId
                    );

                    // If not found, try default language
                    if (!translation && defaultLanguageId) {
                        translation = seller.translations.find(
                            t => t.language_id === defaultLanguageId
                        );
                    }

                    // Use translation name if available and not empty
                    if (translation && translation.name && translation.name.trim() !== '') {
                        translatedName = translation.name;
                    }
                }

                translatedSeller.name = translatedName;
                return translatedSeller;
            });
        },
    },

    mounted() {

    },
    created: function () {
        if (!this.$can('product_list')) {
            this.showError("You do not have permission to view this page.");
            this.$router.back();
        }
        if (this.$roleSeller === this.login_user.role.name) {
            this.fields.forEach((field, index) => {
                if (field.key === 'seller_name') {
                    this.fields.splice(index, 1);
                }
            });
        }
        this.fetchActiveLanguages().then(() => {
            this.getRecords();
        });
    },
    watch: {
        currentPage() {
            this.getRecords();
        },
        perPage() {
            this.getRecords();
        },
        category() {
            this.resetSelection();
        },
        seller() {
            this.resetSelection();
        },
        is_approved() {
            this.resetSelection();
        },
        filter() {
            this.resetSelection();
        },
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
        getRecords() {
            this.isLoading = true
            let param = {
                "category": this.category,
                "seller": this.seller,
                "is_approved": this.is_approved,
                page: this.currentPage,
                per_page: this.perPage,
                filter: this.filter
            }
            axios.get(this.$apiUrl + '/products', {
                params: param
            }).then((response) => {
                this.isLoading = false;
                this.categories = response.data.data.categories;
                this.sellers = response.data.data.sellers;
                this.products = response.data.data.products;
                this.totalRows = response.data.total

            });
        },
        deleteRecord(index, id) {

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
                    axios.post(this.$apiUrl + '/products/delete', postData)
                        .then((response) => {
                            this.isLoading = false
                            let data = response.data;
                            this.products.splice(index, 1)
                            //this.showSuccess(data.message);
                            this.showMessage("success", data.message);
                        });
                }
            });

        },
        allSelectCheckBox() {
            if (this.all_select === false) {
                this.all_select = true;
                // Get all products from current page (considering filters)
                this.products.forEach(product => {
                    // Only add if not already selected to avoid duplicates
                    if (!this.selectedItems.includes(product.product_variant_id)) {
                        this.selectedItems.push(product.product_variant_id);
                    }
                });
            } else {
                this.all_select = false;
                // Remove only the products from current page from selected items
                const currentPageProductIds = this.products.map(product => product.product_variant_id);
                this.selectedItems = this.selectedItems.filter(id => !currentPageProductIds.includes(id));
            }
        },
        selectCheckBox() {
            let uniqueSelectedItems = [...new Set(this.selectedItems)];
            // Get current page product IDs
            const currentPageProductIds = this.products.map(product => product.product_variant_id);
            // Check if all current page products are selected
            const allCurrentPageSelected = currentPageProductIds.every(id => uniqueSelectedItems.includes(id));
            this.all_select = allCurrentPageSelected && currentPageProductIds.length > 0;
        },
        resetSelection() {
            // Reset selection when filters change
            this.selectedItems = [];
            this.all_select = false;
        },
        multipleDelete() {
            let uniqueSelectedItems = [...new Set(this.selectedItems)];
            if (uniqueSelectedItems.length !== 0) {
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
                        let ids = uniqueSelectedItems.toString();
                        this.isLoading = true
                        let postData = {
                            ids: ids
                        }
                        axios.post(this.$apiUrl + '/products/multiple_delete', postData)
                            .then((response) => {
                                this.isLoading = false
                                let data = response.data;
                                this.getRecords();
                                this.selectedItems = [];
                                this.all_select = false;
                                this.showMessage("success", data.message);

                            });
                    }
                });
            } else {
                this.showWarning("Select at least one record!");
            }
        }
    }
};
</script>
