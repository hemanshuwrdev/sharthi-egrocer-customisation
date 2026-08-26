<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('product_ratings') }}</h3>
        </div>

        <div class="list-surface">
            <b-row class="mb-2">
                <b-col md="3">
                    <h6 class="box-title">{{ __('products') }}</h6>
                    <form method="post">
                        <select  @change="getRecords()" v-model="product_id" class="form-control form-select">
                            <option value="">{{ __('select_product') }}</option>
                            <option v-for="product in translatedProducts" :value="product.id">
                                {{ product.name }}
                            </option>
                        </select>
                    </form>
                    <span class="text-danger d-block font-size-13">{{ __('select_a_product_for_update_product_rating_list') }}</span>
                </b-col>
            </b-row>

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
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getProductRatings()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                <b-table
                    :items="ratings"
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

                     <template #cell(rate)="row">
                        <!-- Use the renderStarRating method to display the star rating -->
                        {{ renderStarRating(row.item.rate) }}
                    </template>

                    <template #table-busy>
                        <div class="text-center text-black my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>{{ __('loading') }}...</strong>
                        </div>
                    </template>
                    <template #cell(updated_at)="row">
                        {{ new Date(row.item.updated_at).toLocaleString()  }}
                    </template>
                   <template #cell(images)="row">
                        <a v-for="(image, index) in row.item.images" :key="index" >
                        <img class="images_border" :src="image.image_url" alt="Image" height="50">
                        </a>

                        <FsLightbox :toggler="toggler" :sources="lightboxSource" :onClose="handleClose" ></FsLightbox>
                    </template>
                    <template #cell(status)="row">
                        <span class='badge bg-success' v-if="row.item.status == 1">{{ __('activate') }}</span>
                        <span class='badge bg-danger' v-if="row.item.status == 0">{{ __('deactivate') }}</span>
                    </template>
                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <button class="list-action-btn is-edit" @click="edit_record = row.item"  v-b-tooltip.hover :title="__('edit')"><i class="fa fa-pencil"></i></button>
                            <button class="list-action-btn is-delete" @click="deleteDietary(row.index,row.item.id)"  v-b-tooltip.hover :title="__('delete')"><i class="fa fa-trash"></i></button>
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
                <label class="mb-0">{{ __('total_ratings') }} {{totalRows}}   , </label>
                <label class="mb-0">{{ __('average_rating') }} {{ calculateAverageRating().toFixed(2) }}</label>
                <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    align="fill"
                    size="sm"
                    class="list-pagination"
                ></b-pagination>
            </div>

            <template v-if="list.length==0 && product_id>0">
                <span>{{ __('no_ratings_foundddd') }}</span>
            </template>
        </div>
    </div>
</template>
<script>
import draggable from 'vuedraggable';
import axios from "axios";
import FsLightbox from "fslightbox-vue";
export default {
    components: {
        draggable,
         FsLightbox,
    },
    data: function () {
        return {
            fields: [
                { key: 'id', label: __('id'), class: 'text-center', sortable: true, sortDirection: 'desc' },
                { key: 'user.name', label: __('user'),  class: 'text-center' },
                { key: 'rate', label: __('product_ratings'), class: 'text-center', sortable: true },
                { key: 'review', label: __('reviews'),  class: 'text-center' },
                { key: 'images', label: __('image'),  class: 'text-center' }, 
                { key: 'updated_at', label: __('date'),  class: 'text-center' },
                
            ],
            totalRows: 0,
            currentPage: 1,
            perPage: this.$perPage,
            pageOptions: this.$pageOptions,
            sortBy: 'id',
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,
            filterOn: [],
            page: 1,
            ratings: [],
            list: [],
            editable: true,
            isDragging: false,
            delayedDragging: false,
            isLoading: false,
            products: [], 
            product_id:this.id !== undefined ? this.id : "",
            
             lightboxSource: [],  // array to store sources for each row
     toggler: false,
      activeImageIndex: 0,
            // Language handling for translations
            currentLanguageId: null,
            activeLanguages: []
        }
    },
    computed: {
        dragOptions() {
            return {
                animation: 0,
                group: "description",
                disabled: !this.editable,
                ghostClass: "ghost"
            };
        },
        listString() {
            return JSON.stringify(this.list, null, 2);
        },
        list2String() {
            return JSON.stringify(this.list2, null, 2);
        },
        // Computed property to translate products for dropdown
        translatedProducts: function() {
            if (!this.currentLanguageId || this.products.length === 0) {
                return this.products;
            }

            // Get default language ID for fallback
            const defaultLanguage = this.activeLanguages.find(lang => lang.is_default === 1);
            const defaultLanguageId = defaultLanguage ? defaultLanguage.id : null;

            return this.products.map(product => {
                const translatedProduct = { ...product };
                let translatedName = product.name; // Fallback to main table name

                if (product.translations && Array.isArray(product.translations)) {
                    // First try to find translation for current language
                    let translation = product.translations.find(
                        t => t.language_id === this.currentLanguageId
                    );

                    // If not found, try default language
                    if (!translation && defaultLanguageId) {
                        translation = product.translations.find(
                            t => t.language_id === defaultLanguageId
                        );
                    }

                    // Use translation name if available and not empty
                    if (translation && translation.name && translation.name.trim() !== '') {
                        translatedName = translation.name;
                    }
                }

                translatedProduct.name = translatedName;
                return translatedProduct;
            });
        },
    },
    watch: {
        isDragging(newValue) {
            if (newValue) {
                this.delayedDragging = true;
                return;
            }
            this.$nextTick(() => {
                this.delayedDragging = false;
            });
        }
    },
    mounted() { 
     
        $(document).on('click', '[data-toggle="lightbox"]', function(event) {
      event.preventDefault();
      $(this).ekkoLightbox();
    });

    },
    created: function () {
        this.id = this.$route.params.id;
        // Load languages first so we know currentLanguageId before mapping translations
        this.fetchActiveLanguages().then(() => {
            this.getProducts();
            this.getRecords();
        }).catch(() => {
            this.getProducts();
            this.getRecords();
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
       openLightbox(image) {
      // Populate lightboxSources with the image URLs
      this.lightboxSource = [image];
      // Open the lightbox at the selected index
     this.toggler = !this.toggler;
    },
    handleClose(rowIndex) {
      this.lightboxSource[rowIndex] = null;  // Close lightbox for the specific row
    },
        calculateAverageRating() {
    if (this.ratings.length === 0) {
      return 0; // Return 0 if there are no ratings to avoid division by zero
    }

    const totalRatings = this.ratings.reduce((total, rating) => total + rating.rate, 0);
    const averageRating = totalRatings / this.ratings.length;

    return averageRating;
  },
         renderStarRating(rate) {
       const totalStars = 5;
    const filledStars = rate;
    const blankStars = totalStars - filledStars;

    const starIconFilled = '⭐️';
    const starIconBlank = '☆';

    const ratingString = starIconFilled.repeat(filledStars) + starIconBlank.repeat(blankStars);

    return ratingString;
    },
  

      getRecords() {
            this.isLoading = true;
            this.product_id  = this.product_id !== "" ? this.product_id : this.id;
            let param = {
               "product_id": this.product_id
            }
           
            axios.get(this.$baseUrl + '/customer/products/ratings_list', {
                params: param
            }).then((response) => {
                this.isLoading = false;
                this.ratings = response.data.data.rating_list;
                this.totalRows = this.ratings.length
            });
        },
    
       
        getProducts() {
            axios.get(this.$apiUrl + '/products/active')
                .then((response) => {
                    this.products = response.data.data;
                });
        },
    }
};
</script>
<style scoped>
.flip-list-move {
    transition: transform 0.5s;
}

.no-move {
    transition: transform 0s;
}

.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}

.list-group {
    min-height: 20px;
}

.list-group-item {
    cursor: move;
}

.list-group-item i {
    cursor: pointer;
}
</style>
<style>
/* Add some basic styling to the lightbox */
#lightbox {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
  overflow: hidden;
  z-index: 999;
}

#lightbox-content {
  position: relative;
  max-width: 80%;
  max-height: 80%;
}

.close {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 30px;
  color: #fff;
  cursor: pointer;
}
</style>
