                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <template>
    <div>
        <div class="page-heading">
            <div class="row">
                <div class="col-12 col-md-6 order-md-1 order-last">
                    <h3>
                        <template v-if="clone">
                            {{ __('clone') }}
                        </template>
                        <template v-else-if="id">
                            {{ __('edit') }}
                        </template>
                        <template v-else>
                            {{ __('add') }}
                        </template>
                        {{ __('product') }}
                    </h3>
                </div>
                <div class="col-12 col-md-6 order-md-2 order-first">
                    <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                        <ol class="breadcrumb">
                            <!-- Conditionally render breadcrumb item based on the current route -->
                            <li class="breadcrumb-item" v-if="isSellerRoute">
                                <router-link to="/seller/dashboard">{{ __('dashboard') }}</router-link>
                            </li>
                            <li class="breadcrumb-item" v-else>
                                <router-link to="/dashboard">{{ __('dashboard') }}</router-link>
                            </li>
                            <!-- Conditionally render breadcrumb item based on the current route -->
                            <li class="breadcrumb-item" v-if="isSellerRoute">
                                <router-link to="/seller/manage_products">{{ __('manage_products') }}</router-link>
                            </li>
                            <li class="breadcrumb-item" v-else>
                                <router-link to="/manage_products">{{ __('manage_products') }}</router-link>
                            </li>

                            <li class="breadcrumb-item active" aria-current="page">
                                <template v-if="clone">
                                    {{ __('clone') }}
                                </template>
                                <template v-else-if="id">
                                    {{ __('edit') }}
                                </template>
                                <template v-else>
                                    {{ __('add') }}
                                </template>
                                {{ __('product') }}
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div class="row">
                <div class="col-12 col-md-12 order-md-1 order-last" id="mymodal">
                    <form ref="my-form" @submit.prevent="saveRecord" @keydown.enter="$event.preventDefault()">
                        <div class="card">
                            <div class="card-header">
                                <h4><template v-if="clone">{{ __('clone') }}</template><template v-else-if="id">{{
                                    __('edit') }}</template><template v-else>{{ __('add') }}</template> {{
                                            __('product') }}</h4>
                                <span class="pull-right">
                                    <template v-if="isSellerRole">
                                        <router-link to="/seller/manage_products" class="btn btn-primary"
                                            v-b-tooltip.hover title="Manage Product">{{ __('manage_products')
                                            }}</router-link>
                                    </template>
                                    <template v-else>
                                        <router-link to="/manage_products" class="btn btn-primary" v-b-tooltip.hover
                                            title="Manage Product">{{ __('manage_products') }}</router-link>
                                    </template>
                                </span>
                            </div>
                            <div class="card-body">
                                <!-- Language Tabs -->
                                <div class="col-md-12 mb-3" v-if="languages.length > 0">
                                    <b-tabs v-model="activeLanguageTab" content-class="mt-3">
                                        <b-tab v-for="language in languages" :key="language.id" :title="language.name"
                                            lazy>
                                            <template #title>
                                                <span :class="{ 'text-primary font-weight-bold': language.is_default }">
                                                    {{ language.name }}
                                                </span>
                                            </template>

                                            <!-- Translate buttons -->
                                            <div class="mb-3" v-if="language.is_default && languages.length > 1">
                                                <b-button size="sm" variant="outline-primary" class="mr-2"
                                                    @click="translateEmpty(language)" v-b-tooltip.hover
                                                    :title="__('only_empty_fields_will_be_translated_existing_content_will_not_be_changed')"
                                                    :disabled="loadingEmpty">
                                                    <span v-if="!loadingEmpty">{{ __('translate_empty_fields') }}</span>
                                                    <b-spinner v-else small></b-spinner>
                                                </b-button>

                                                <b-button size="sm" variant="outline-danger"
                                                    @click="translateOverwrite(language)" v-b-tooltip.hover
                                                    :title="__('all_fields_will_be_translated_and_existing_content_will_be_overwritten')"
                                                    :disabled="loadingOverwrite">
                                                    <span v-if="!loadingOverwrite">{{ __('translate_and_overwrite')
                                                        }}</span>
                                                    <b-spinner v-else small></b-spinner>
                                                </b-button>

                                                <div v-if="translateSuccessMessage"
                                                    class="text-success mt-2 font-weight-bold">
                                                    {{ translateSuccessMessage }}
                                                </div>
                                            </div>
                                            <!-- Translate buttons END -->

                                            <div v-if="translations[language.id]">
                                                <div class="row">
                                                    <div class="col-md-6 mb-3 mt-0">
                                                        <label>{{ __('product_name') }} <i class="text-danger"
                                                                v-if="language.is_default">*</i></label>
                                                        <input type="text" class="form-control"
                                                            :placeholder="__('enter_product_name')"
                                                            v-model="translations[language.id].name"
                                                            :required="language.is_default ? true : undefined"
                                                            @input="handleDefaultLanguageInput('name', language)"
                                                            :disabled="isSellerRole">
                                                    </div>

                                                    <template v-if="language.is_default">
                                                        <div class="col-md-6 mb-3">
                                                            <label>{{ __('slug') }} <i class="text-danger">*</i></label>
                                                            <input type="text" class="form-control"
                                                                :placeholder="__('enter_product_slug')" v-model="slug"
                                                                readonly>
                                                        </div>
                                                        <template v-if="isSellerRole">
                                                            <input type="hidden" v-model="seller_id" required>   
                                                        </template>
                                                        <template v-else>
                                                            <div class="col-md-6 mb-3">
                                                                <label class="control-label" for="seller_id">{{
                                                                    __('seller') }} <i class="text-danger">*</i></label>
                                                                <select id="seller_id" name="seller_id"
                                                                    class="form-control form-select" v-model="seller_id"
                                                                    required
                                                                    @change="getSellerCategories(); getSeller()">
                                                                    <option value="">{{ __('select_seller') }}</option>
                                                                    <option v-for="seller in translatedSellers"
                                                                        :value="seller.id">{{ seller.name }}
                                                                    </option>
                                                                </select>
                                                            </div>
                                                        </template>
                                                        <div class="col-md-6 mb-3">
                                                            <label for="tax_id" class="control-label">{{ __('tax')
                                                                }}</label>
                                                            <select id="tax_id" name="tax_id"
                                                                class="form-control form-select" v-model="tax_id"
                                                                :disabled="isSellerRole">
                                                                <option value="0">{{ __('select_tax') }}</option>
                                                                <option v-for="tax in translatedTaxes" :value="tax.id">
                                                                    {{ tax.title }}
                                                                    ({{ tax.percentage }} %)</option>
                                                            </select>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="form-group mb-3">
                                                                <label>{{ __('brands') }}</label>
                                                                <multiselect v-model="brand" :options="translatedBrands"
                                                                    :placeholder="__('select_and_search_brands')"
                                                                    label="name" track-by="id" required
                                                                    :disabled="isSellerRole">
                                                                    <template slot="singleLabel" slot-scope="props">
                                                                        <span class="option__desc">
                                                                            <span class="option__title">{{
                                                                                props.option.name }}</span>
                                                                        </span>
                                                                    </template>
                                                                    <template slot="option" slot-scope="props">
                                                                        <div class="option__desc">
                                                                            <span class="option__small">
                                                                                <img style="height: 25px; "
                                                                                    class="option__image"
                                                                                    :src="props.option.image_url"
                                                                                    alt="Brand Logo">
                                                                            </span>
                                                                            <span class="option__title">{{
                                                                                props.option.name }}</span>
                                                                        </div>
                                                                    </template>
                                                                </multiselect>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-12">
                                                            <div
                                                                class="form-group mt-3 mb-3 d-flex flex-wrap align-items-center">
                                                                <button type="button"
                                                                    class="btn btn-outline-primary me-3 my-2 ai-generate-btn"
                                                                    @click="generateDescription"
                                                                    :disabled="isGeneratingAI || isSellerRole">
                                                                    <!-- AI Processing State -->
                                                                    <template v-if="isGeneratingAI">
                                                                        <span class="ai-spinner me-2"></span>
                                                                        <span class="ai-text-animate">AI is
                                                                            generating...</span>
                                                                    </template>
                                                                    <!-- Normal State -->
                                                                    <template v-else>
                                                                        <i class="fa fa-magic me-1"></i>
                                                                        {{ __('generate_description_with_ai') }}
                                                                    </template>
                                                                </button>
                                                                <label class="my-2 d-flex align-items-center">
                                                                    <input type="checkbox" v-model="useCustomPrompt"
                                                                        class="me-2" :disabled="isSellerRole" />
                                                                    <span class="mt-1">{{ __('use_custom_prompt')
                                                                    }}</span>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        <div class="col-md-12">
                                                            <div class="form-group mb-3" v-if="useCustomPrompt">
                                                                <label>{{ __('custom_prompt') }}</label>
                                                                <textarea class="form-control" v-model="customPrompt"
                                                                    rows="3"
                                                                    placeholder="e.g. Write a fun and engaging description focusing on features and benefits"
                                                                    :disabled="isSellerRole"></textarea>
                                                            </div>
                                                        </div>
                                                    </template>

                                                    <!-- Translatable Fields: Tags (shown in all language tabs) -->
                                                    <div class="col-md-12">
                                                        <div class="form-group mt-2 mb-3">
                                                            <label for="tags" class="control-label">{{ __('tags') }} (
                                                                {{
                                                                    __('these_tags_help_you_in_search_result') }} ) <i
                                                                    class="text-danger"
                                                                    v-if="language.is_default">*</i></label>
                                                            <!-- Use Select2 for all language tabs -->
                                                            <Select2
                                                                :key="'tags_' + language.id + '_' + activeLanguageTab"
                                                                :value="language.is_default ? tag_ids : (tagIdsByLanguage[language.id] || [])"
                                                                @input="handleTagInput(language.id, $event)"
                                                                @change="handleTagInput(language.id, $event)"
                                                                placeholder="Select Tags" no-add-on-enter
                                                                :disabled="isSellerRole"
                                                                :options="tagsOptions" separator=" ,;" :settings="{
                                                                    tags: true,
                                                                    multiple: true,
                                                                    width: '100%',
                                                                    dropdownParent: '#mymodal',
                                                                    tokenSeparators: [',', ';'],
                                                                    placeholder: __('enter_product_tag'),
                                                                }" />
                                                        </div>
                                                    </div>

                                                    <!-- Translatable Fields: Description (shown in all language tabs) -->
                                                    <div class="col-md-12">
                                                        <div class="form-group mb-3">
                                                            <label>{{ __('description') }} <i class="text-danger"
                                                                    v-if="language.is_default">*</i></label>
                                                            <editor :placeholder="__('enter_product_description')"
                                                                v-model="translations[language.id].description"
                                                                :init="getEditorConfig()"
                                                                @input="handleDefaultLanguageInput('description', language)"
                                                                :disabled="isSellerRole" />
                                                        </div>
                                                    </div>

                                                    <!-- Translatable Fields: Manufacturer (shown in other language tabs only, not in default) -->
                                                    <div class="col-md-6" v-if="!language.is_default">
                                                        <div class="form-group mb-3">
                                                            <label>{{ __('manufacturer') }}</label>
                                                            <input type="text" class="form-control"
                                                                :placeholder="__('enter_manufacturer')"
                                                                v-model="translations[language.id].manufacturer"
                                                                :disabled="isSellerRole">
                                                        </div>
                                                    </div>

                                                    <!-- Non-translatable Fields: Images (only shown in default language tab) -->
                                                    <template v-if="language.is_default">
                                                        <div class="col-md-6">
                                                            <div class="form-group mb-3">
                                                                <label>{{ __('main_image') }} <i
                                                                        class="text-danger">*</i></label>
                                                                <input type="file" name="image" accept="image/*"
                                                                    ref="file_image" v-on:change="fileImage"
                                                                    class="file-input" :disabled="isSellerRole">

                                                                <div class="file-input-div bg-gray-100"
                                                                    @click="!isSellerRole && triggerRefClick('file_image')"
                                                                    @drop="!isSellerRole && dropFile" @dragover="$dragoverFile"
                                                                    @dragleave="$dragleaveFile">
                                                                    <template v-if="main_image_name == ''">
                                                                        <label><i
                                                                                class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                                                        <label>{{
                                                                            __('drop_files_here_or_click_to_upload')
                                                                            }}</label>
                                                                    </template>
                                                                    <template v-else>
                                                                        <label>{{ __('selected_file_name') }} {{
                                                                            main_image_name
                                                                            }}</label>
                                                                    </template>
                                                                </div>
                                                                <span class="text text-primary">{{ __('please_choose_square_image_of_larger_than_350px_350px_and_smaller_than_550px_550px') }}</span>
                                                                <p v-if="mainImageerror" class="error">{{ mainImageerror
                                                                    }}</p>

                                                                <div class="row" v-if="main_image_path">
                                                                    <div class="col-md-4">
                                                                        <img class="custom-image" :src="main_image_path"
                                                                            title='Main Image' alt='Main Image' />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="form-group mb-3">
                                                                <label for="other_images">{{
                                                                    __('other_images_of_the_product') }}</label>

                                                                <input type="file" name="other_images[]"
                                                                    accept="image/*" id="other_images"
                                                                    v-on:change="otherImage" multiple=""
                                                                    ref="file_other_images" class="file-input" :disabled="isSellerRole">

                                                                <div class="file-input-div bg-gray-100"
                                                                    @click="!isSellerRole && triggerRefClick('file_other_images')"
                                                                    @drop="!isSellerRole && dropFileOtherImage" @dragover="$dragoverFile"
                                                                    @dragleave="$dragleaveFile">
                                                                    <template v-if="images.length === 0">
                                                                        <label><i
                                                                                class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                                                        <label>{{
                                                                            __('drop_files_here_or_click_to_upload')
                                                                            }}</label>
                                                                    </template>
                                                                    <template v-else>
                                                                        <template v-if="images.length === 1">
                                                                            <label>{{ __('selected_file_name') }}
                                                                                {{ images[0].name }}</label>
                                                                        </template>
                                                                        <template v-else>
                                                                            <label>{{ images.length }} files
                                                                                Selected</label>
                                                                            <span><small v-for="image in images">{{
                                                                                image.name }}, </small></span>
                                                                        </template>
                                                                    </template>
                                                                </div>
                                                                <span class="text text-primary">{{ __('please_choose_square_image_of_larger_than_350px_350px_and_smaller_than_550px_550px') }} *</span>
                                                                <p v-if="otherImageerror" class="error">{{
                                                                    otherImageerror }}</p>

                                                                <div class="row" v-if="images && images.length !== 0">
                                                                    <h6 class="mt-3">Seleted Other Image List.</h6>
                                                                    <div class="col-md-4 image-container"
                                                                        v-if="images.length !== 0"
                                                                        v-for="(image, index) in images">
                                                                        <img class="img-thumbnail custom-image"
                                                                            :src="image.url"
                                                                            title='Selected Other Image'
                                                                            alt='Selected Other Image' />
                                                                        <button type="button"
                                                                            @click="removeOtherImage(images.indexOf(image))"
                                                                            class="btn btn-sm btn-danger btn-remove" v-if="!isSellerRole"> <i
                                                                                class="fa fa-times-circle"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <div class="row"
                                                                    v-if="other_images && other_images.length !== 0">
                                                                    <h6 class="mt-3">Uploaded Other Image List.</h6>
                                                                    <div class="col-md-4 image-container"
                                                                        v-if="other_images.length !== 0"
                                                                        v-for="(image, index) in other_images">
                                                                        <img class="img-thumbnail custom-image"
                                                                            :src="$storageUrl + image.image"
                                                                            title='Other Image' alt='Other Image' />
                                                                        <button type="button"
                                                                            @click="deleteImage(index, image.id, true)"
                                                                            class="btn btn-sm btn-danger btn-remove" v-if="!isSellerRole"> <i
                                                                                class="fa fa-times-circle"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </template>
                                                </div>
                                            </div>
                                        </b-tab>
                                    </b-tabs>
                                </div>

                                <!-- Loading state for languages -->
                                <div v-else-if="isLoadingLanguages" class="text-center p-3 mb-3">
                                    <b-spinner label="Loading languages..."></b-spinner>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <h4>{{ __('seo_settings') }}</h4>
                            </div>
                            <div class="card-body">
                                <!-- Language Tabs for SEO -->
                                <div class="col-md-12 mb-3" v-if="languages.length > 0">
                                    <b-tabs v-model="activeLanguageTab" content-class="mt-3">
                                        <b-tab v-for="language in languages" :key="language.id" :title="language.name"
                                            lazy>
                                            <template #title>
                                                <span :class="{ 'text-primary font-weight-bold': language.is_default }">
                                                    {{ language.name }}
                                                </span>
                                            </template>

                                            <div v-if="translations[language.id]">
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <div class="form-group mb-3">
                                                            <label>{{ __('meta_title') }} </label>
                                                            <input type="text" class="form-control"
                                                                v-model="translations[language.id].meta_title"
                                                                :placeholder="__('enter_meta_title')"
                                                                @input="handleDefaultLanguageInput('meta_title', language)">
                                                        </div>
                                                        <div class="form-group mb-3">
                                                            <label>{{ __('meta_keywords') }} </label>
                                                            <input type="text" class="form-control"
                                                                v-model="translations[language.id].meta_keywords"
                                                                :placeholder="__('enter_meta_keywords')"
                                                                @input="handleDefaultLanguageInput('meta_keywords', language)">
                                                        </div>
                                                        <div class="form-group mb-3">
                                                            <label>{{ __('schema_markup') }} </label>
                                                            <input type="text" class="form-control"
                                                                v-model="translations[language.id].schema_markup"
                                                                :placeholder="__('enter_schema_markup')"
                                                                @input="handleDefaultLanguageInput('schema_markup', language)">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group mb-3">
                                                            <label>{{ __('meta_description') }} </label>
                                                            <textarea type="text" class="form-control"
                                                                v-model="translations[language.id].meta_description"
                                                                :placeholder="__('enter_meta_description')" rows="4"
                                                                @input="handleDefaultLanguageInput('meta_description', language)"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </b-tab>
                                    </b-tabs>
                                </div>
                            </div>
                            <!-- Save and Clear buttons for non-default language tabs -->
                            <div class="card-footer"
                                v-if="languages.length > 0 && languages[activeLanguageTab] && !languages[activeLanguageTab].is_default">
                                <b-button type="submit" @keydown.enter="saveRecord" variant="primary"
                                    :disabled="isLoading"> {{ __('save') }}
                                    <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
                                </b-button>
                                <button type="button" class="btn btn-danger" @click="clearForm" v-if="!isSellerRole">{{ __('clear')
                                    }}</button>
                            </div>
                        </div>

                        <!-- Product Variants: Only show in default language tab -->
                        <div class="card"
                            v-if="languages.length > 0 && languages[activeLanguageTab] && languages[activeLanguageTab].is_default">
                            <div class="card-header">
                                <h4>{{ __('product_variants') }}</h4>
                            </div>
                            <div class="card-body">
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="form-group col-md-6">
                                            <label>{{ __('type') }} <i class="text-danger">*</i></label><br>
                                            <b-form-radio-group v-model="type" :options="[
                                                { text: __('packet'), 'value': 'packet' },
                                                { text: __('loose'), 'value': 'loose' },
                                            ]" buttons button-variant="outline-primary" :disabled="isSellerRole"></b-form-radio-group>
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label class="control-label">{{ __('stock_limit') }} <i
                                                    class="text-danger">*</i></label><br>
                                            <b-form-radio-group v-model="is_unlimited_stock" :options="[
                                                { text: __('limited'), 'value': 0 },
                                                { text: __('unlimited'), 'value': 1 },
                                            ]" buttons button-variant="outline-primary" :disabled="isSellerRole"></b-form-radio-group>
                                        </div>
                                    </div>
                                </div>

                                <div id="packate_div" class="list-group-item" v-if="type === 'packet'"
                                    v-for="(input, k) in inputs" :key="k">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>{{ __('sku') }}</label>
                                                <input type="text" class="form-control"
                                                    placeholder="e.g. SUG-1KG" v-model="input.packet_sku" :disabled="isSellerRole">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>{{ __('measurement') }} <i class="text-danger">*</i></label>
                                                <input type="number" step="any" min="0" class="form-control"
                                                    placeholder="0" v-model="input.packet_measurement" :disabled="isSellerRole">
                                            </div>
                                        </div>

                                        <div class="col-md-4" v-if="isSellerRole">
                                            <div class="form-group">
                                                <label>{{ __('price') }} ( {{ $currency }} ) <i
                                                        class="text-danger">*</i></label>
                                                <input type="number" min="0" step="any" class="form-control"
                                                    placeholder="0.00" v-model="input.packet_price" required>
                                            </div>
                                        </div>
                                        <div class="col-md-4" v-if="isSellerRole">
                                            <div class="form-group">
                                                <label>{{ __('purchase_price') }} ( {{ $currency }} )
                                                    <i class="fa fa-info-circle text-muted" v-b-tooltip.hover
                                                        title="This field is used to calculate in your report"></i>
                                                </label>
                                                <input type="number" min="0" step="any" class="form-control"
                                                    placeholder="0.00" v-model="input.packet_purchase_price">
                                            </div>
                                        </div>
                                        <div class="col-md-4" v-if="isSellerRole">
                                            <div class="form-group">
                                                <label>{{ __('discounted_price') }} ( {{ $currency }} )</label>
                                                <input type="number" min="0" step="any" class="form-control"
                                                    placeholder="0.00" v-model="input.discounted_price"
                                                    @input="validateDiscountedPrice(input)">
                                                <span v-if="input.validationErrorDiscountedPrice" class="error">{{
                                                    input.validationErrorDiscountedPrice }}</span>
                                            </div>
                                        </div>
                                        <div class="col-md-4" v-if="isSellerRole && is_unlimited_stock != 1">
                                            <div class="form-group">
                                                <label>{{ __('stock') }} <i class="text-danger">*</i></label>
                                                <input type="number" step="any" min="0" class="form-control"
                                                    placeholder="0" name="packate_stock[]" v-model="input.packet_stock">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>{{ __('unit') }} <i class="text-danger">*</i></label>
                                                <select class="form-control form-select" @change="changeUnits()"
                                                    v-model="input.packet_stock_unit_id" :disabled="isSellerRole">
                                                    <option value="">{{ __('select_unit') }}</option>

                                                    <option v-for="(unit, key) in units" :value="unit.id">{{
                                                        unit.short_code }}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>{{ __('secondary_unit_outer_case_bag') }}</label>
                                                <select class="form-control form-select"
                                                    v-model="input.packet_secondary_unit_id" :disabled="isSellerRole">
                                                    <option value="">{{ __('select_secondary_unit') }}</option>
                                                    <option v-for="(unit, key) in units" :value="unit.id">{{
                                                        unit.short_code }}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>{{ __('secondary_unit_value_items_per_case') }}</label>
                                                <input type="number" step="any" min="0" class="form-control"
                                                    placeholder="0" v-model="input.packet_secondary_unit_value" :disabled="isSellerRole">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>{{ __('status') }} <i class="text-danger">*</i></label>
                                                <select class="form-control form-select" v-model="input.packet_status"
                                                    required :disabled="isSellerRole">
                                                    <option value="">{{ __('select_status') }}</option>
                                                    <option value="1">{{ __('available') }}</option>
                                                    <option value="0">{{ __('sold_out') }}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-12 hidden">
                                            <div class="form-group">
                                                <label>{{ __('variant_images') }}</label>
                                                <input type="file" accept="image/*" :ref="'packet_variant_images_' + k"
                                                    multiple class="file-input" v-on:change="variantImagesChanges(k)" :disabled="isSellerRole">

                                                <div class="file-input-div bg-gray-100"
                                                    @click="!isSellerRole && $refs['packet_variant_images_' + k][0].click()"
                                                    @dragover="$dragoverFile" @dragleave="$dragleaveFile">
                                                    <label><i class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                                    <label>{{ __('drop_files_here_or_click_to_upload') }}</label>
                                                </div>

                                                <span class="text text-primary">{{ __('please_choose_square_image_of_larger_than_350px_350px_and_smaller_than_550px_550px') }}</span>
                                                <p v-if="variantImageerror" class="error">{{ variantImageerror }}</p>
                                                <div class="row">
                                                    <div class="col-md-2 image-container"
                                                        v-for="(image, index) in variantImages[k]">
                                                        <img class="img-thumbnail custom-image" :src="image.url"
                                                            title='Selected Variant Image'
                                                            alt='Selected Variant Image' />
                                                    </div>
                                                </div>

                                                <div class="row">
                                                    <div class="col-md-2 image-container"
                                                        v-if="input.images.length !== 0"
                                                        v-for="(image, index) in input.images">
                                                        <img class="img-thumbnail custom-image"
                                                            :src="$storageUrl + image.image" title='Variant Image'
                                                            alt='Variant Image' />
                                                        <button type="button"
                                                            @click="deleteImage(index, image.id, false, k)"
                                                            class="btn btn-sm btn-danger btn-remove" v-if="!isSellerRole"> <i
                                                                class="fa fa-times-circle"></i>
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div class="col-md-2 offset-md-10 text-end" v-if="k === 0 && !isSellerRole">
                                            <a style="cursor: pointer;" class="btn btn-primary" v-b-tooltip.hover
                                                title="Add variant of product" @click="addRow">
                                                <i class="fa fa-plus-square"></i> {{ __('add_variant') }}
                                            </a>
                                        </div>
                                        <div class="col-md-2 offset-md-10 text-end" v-if="k !== 0 && !isSellerRole">
                                            <a style="cursor: pointer;" class="btn btn-danger" v-b-tooltip.hover
                                                title="Remove variant of product" @click="remove(k)">
                                                <i class="fa fa-times"></i> {{ __('remove_variant') }}
                                            </a>
                                        </div>

                                    </div>
                                </div>

                                <div id="loose_div" v-if="type === 'loose'">
                                    <div class="list-group-item" v-for="(input, k) in inputs" :key="k">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="form-group loose_div">
                                                    <label>{{ __('measurement') }} <i class="text-danger">*</i></label>

                                                    <b-input-group class="mb-2">
                                                        <input type="number" step="any" min="0" class="form-control"
                                                            placeholder="0" v-model="input.loose_measurement" :disabled="isSellerRole">
                                                    </b-input-group>
                                                </div>
                                            </div>

                                            <div class="col-md-4" v-if="isSellerRole">
                                                <div class="form-group loose_div">
                                                    <label>{{ __('price') }} ( {{ $currency }} ): <i
                                                            class="text-danger">*</i></label>
                                                    <input type="number" step="any" min="0" class="form-control"
                                                        placeholder="0.00" v-model="input.loose_price" required>
                                                </div>
                                            </div>
                                     
                                            <div class="col-md-4" v-if="isSellerRole">
                                                <div class="form-group loose_div">
                                                    <label for="discounted_price">{{ __('discounted_price') }} ( {{
                                                        $currency }} ):</label>
                                                    <input type="number" step="any" min="0" class="form-control"
                                                        placeholder="0.00" id="discounted_price"
                                                        v-model="input.loose_discounted_price"
                                                        @input="validateDiscountedPriceLoose(input)">
                                                    <span v-if="input.validationErrorDiscountedPriceLoose"
                                                        class="error">{{
                                                            input.validationErrorDiscountedPriceLoose }}</span>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-group loose_div">
                                                    <label>{{ __('sku') }}</label>
                                                    <input type="text" class="form-control"
                                                        placeholder="e.g. SUG-1KG-L" v-model="input.loose_sku" :disabled="isSellerRole">
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-group loose_div">
                                                    <label>{{ __('secondary_unit_outer_case_bag') }}</label>
                                                    <select class="form-control form-select"
                                                        v-model="input.loose_secondary_unit_id" :disabled="isSellerRole">
                                                        <option value="">{{ __('select_secondary_unit') }}</option>
                                                        <option v-for="(unit, key) in units" :value="unit.id">{{
                                                            unit.short_code }}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-group loose_div">
                                                    <label>{{ __('secondary_unit_value_items_per_case') }}</label>
                                                    <input type="number" step="any" min="0" class="form-control"
                                                        placeholder="0" v-model="input.loose_secondary_unit_value" :disabled="isSellerRole">
                                                </div>
                                            </div>
                                            <div class="col-md-12 hidden">
                                                <div class="form-group loose_div">
                                                    <label>{{ __('variant_images') }}</label>
                                                    <!--                                                @drop="dropFileStoreLogo"               -->
                                                    <input type="file" accept="image/*"
                                                        :ref="'loose_variant_images_' + k" multiple class="file-input"
                                                        v-on:change="variantImagesChanges(k)" @dragover="$dragoverFile"
                                                        @dragleave="$dragleaveFile" :disabled="isSellerRole">
                                                    <div class="file-input-div bg-gray-100"
                                                        @click="!isSellerRole && $refs['loose_variant_images_' + k][0].click()">
                                                        <label><i class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                                        <label>{{ __('drop_files_here_or_click_to_upload') }}</label>
                                                    </div>
                                                    <span class="text text-primary">{{ __('please_choose_square_image_of_larger_than_350px_350px_and_smaller_than_550px_550px') }}</span>

                                                    <div class="row">
                                                        <div class="col-md-2 image-container"
                                                            v-if="input.loose_images.length !== 0"
                                                            v-for="(image, index) in input.loose_images">
                                                            <img class="img-thumbnail custom-image"
                                                                :src="$storageUrl + image.image" title='Variant Image'
                                                                alt='Variant Image' />
                                                            <button type="button"
                                                                @click="deleteImage(index, image.id, false, k)"
                                                                class="btn btn-sm btn-danger btn-remove" v-if="!isSellerRole"> <i
                                                                    class="fa fa-times-circle"></i>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div class="row">
                                                        <div class="col-md-4 image-container"
                                                            v-if="variantImages[k].length !== 0"
                                                            v-for="(image, index) in variantImages[k]">
                                                            <img class="img-thumbnail custom-image" :src="image.url"
                                                                title='Selected Variant Image'
                                                                alt='Selected Variant Image' />
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            <div class="col-md-2 offset-md-10 text-end" v-if="k === 0 && !isSellerRole">
                                                <a style="cursor: pointer;" class="btn btn-primary" v-b-tooltip.hover
                                                    title="Add variant of product" @click="addRow">
                                                    <i class="fa fa-plus-square"></i> {{ __('add_variant') }}
                                                </a>
                                            </div>
                                            <div class="col-md-2 offset-md-10 text-end" v-if="k !== 0 && !isSellerRole">
                                                <a style="cursor: pointer;" class="btn btn-danger" v-b-tooltip.hover
                                                    title="Remove variant of product" @click="remove(k)">
                                                    <i class="fa fa-times"></i> {{ __('remove_variant') }}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row mt-3" id="loose_stock_div" v-if="type === 'loose'">
                                    <div class="col-md-4" v-if="isSellerRole">
                                        <div class="form-group">
                                            <label>{{ __('purchase_price') }} ( {{ $currency }} )
                                                <i class="fa fa-info-circle text-muted" v-b-tooltip.hover
                                                    title="This field is used to calculate in your report"></i>
                                            </label>
                                            <input type="number" step="any" min="0" class="form-control"
                                                placeholder="0.00" v-model="loose_purchase_price">
                                        </div>
                                    </div>

                                    <div class="col-md-4" v-if="isSellerRole">
                                        <div class="form-group" v-if="is_unlimited_stock != 1">
                                            <label>{{ __('stock') }} <i class="text-danger">*</i></label>
                                            <input type="number" step="any" min="0" class="form-control"
                                                v-model="loose_stock"><br>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>{{ __('unit') }} <i class="text-danger">*</i></label>
                                            <select class="form-control form-select" name="loose_stock_unit_id"
                                                v-model="loose_stock_unit_id" :disabled="isSellerRole">
                                                <option value="">{{ __('select_unit') }}</option>
                                                <option v-for="(unit, key) in units" :value="unit.id">{{ unit.short_code
                                                    }}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>{{ __('status') }} <i class="text-danger">*</i></label>
                                            <select name="status" class="form-control form-select" v-model="status" :disabled="isSellerRole">
                                                <option value="">{{ __('select_status') }}</option>
                                                <option value="1">{{ __('available') }}</option>
                                                <option value="0">{{ __('sold_out') }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <!-- Non-translatable Fields: Only show in default language tab -->
                        <div class="card"
                            v-if="languages.length > 0 && languages[activeLanguageTab] && languages[activeLanguageTab].is_default">
                            <div class="card-header">
                                <h4>{{ __('product_settings') }}</h4>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <!-- Row: Category, Product type, Product status -->
                                    <div :class="isSellerRole ? 'col-md-4' : 'col-md-3'">
                                        <div class="form-group mb-3">
                                            <label>{{ __('category') }} <i class="text-danger">*</i></label>
                                            <select class="form-control form-select" v-model="category_id"
                                                 :disabled="isSellerRole || !seller_id" v-html="categoryOptionsHtml">
                                             </select>
                                        </div>
                                    </div>
                                    <div :class="isSellerRole ? 'col-md-4' : 'col-md-3'">
                                        <div class="form-group mb-3">
                                            <label>{{ __('product_type') }} </label>
                                            <select class="form-control form-select" v-model="product_type" :disabled="isSellerRole">
                                                 <option value="">{{ __('select_type') }}</option>
                                                 <option value="1">{{ __('veg') }}</option>
                                                 <option value="2">{{ __('non_veg') }}</option>
                                             </select>
                                        </div>
                                    </div>
                                    <div :class="isSellerRole ? 'col-md-4' : 'col-md-3'" v-if="!isSellerRole">
                                        <div class="form-group mb-3">
                                            <label class="control-label">{{ __('product_status') }}</label><br>
                                            <div id="status" class="btn-group">
                                                <label class="btn" :class="is_approved == 1 ? 'btn-success text-white' : 'btn-outline-success'" style="font-weight: 600;">
                                                    <input type="radio" v-model="is_approved" value="1" style="display: none;"> {{ __('approved') }}
                                                </label>
                                                <label class="btn" :class="is_approved == 0 ? 'btn-danger text-white' : 'btn-outline-danger'" style="font-weight: 600;">
                                                    <input type="radio" v-model="is_approved" value="0" style="display: none;"> {{ __('not_approved') }}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <template v-else>
                                        <input type="hidden" v-model="is_approved">
                                    </template>
                                    <div :class="isSellerRole ? 'col-md-4' : 'col-md-3'">
                                        <div class="form-group mb-3">
                                            <label class="control-label">{{ __('status') }}</label><br>
                                            <div id="status" class="btn-group">
                                                <label class="btn" :class="status == 1 ? 'btn-success text-white' : 'btn-outline-success'" style="font-weight: 600;">
                                                    <input type="radio" v-model="status" value="1" style="display: none;"> {{ __('active') }}
                                                </label>
                                                <label class="btn" :class="status == 0 ? 'btn-danger text-white' : 'btn-outline-danger'" style="font-weight: 600;">
                                                    <input type="radio" v-model="status" value="0" style="display: none;"> {{ __('deactive') }}
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Row: Manufacturer, Made in -->
                                    <div class="col-md-6">
                                        <div class="form-group mb-3">
                                            <label>{{ __('manufacturer') }} / Parent Company</label>
                                            <input type="text" class="form-control" v-model="manufacturer"
                                                 :placeholder="__('enter_manufacturer')" :disabled="isSellerRole">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group mb-3">
                                            <label>{{ __('made_in') }}</label>
                                            <multiselect v-model="made_in" :options="countries"
                                                 :placeholder="__('select_and_search_country_name')" label="name"
                                                 track-by="name" required :disabled="isSellerRole">
                                                <template slot="singleLabel" slot-scope="props">
                                                    <span class="option__desc">
                                                        <span class="option__title">{{ props.option.name }}</span>
                                                    </span>
                                                </template>
                                                <template slot="option" slot-scope="props">
                                                    <div class="option__desc">

                                                        <span class="option__title">{{ props.option.name }}</span>
                                                        <span class="option__small">[{{ props.option.code }}]</span>
                                                    </div>
                                                </template>
                                            </multiselect>

                                        </div>
                                    </div>


                                    <!-- Row: FSSAI, Barcode, Total allowed quantity -->
                                    <div class="col-md-4">
                                        <div class="form-group mb-3">
                                            <label for="fssai_lic">{{ __('fssai_lic_no') }}</label>
                                            <input type="text" id="fssai_lic" class="form-control" :placeholder="__('fssai_lic_no')"
                                                v-model="fssai_lic_no" @input="validateFSSAINumber" :disabled="isSellerRole">
                                            <p style="color:red" v-if="validationMessage">{{ validationMessage
                                                }}</p>
                                            <p style="color:green" v-else-if="isValid">FSSAI License Number is
                                                valid!</p>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group mb-3">
                                            <label for="barcode">{{ __('barcode') }}</label>
                                            <input type="text" class="form-control" :placeholder="__('barcode')"
                                                v-model="barcode" @input="validateBarcode" :disabled="isSellerRole">
                                            <p style="color:red" v-if="validationBarcodeMessage">{{
                                                validationBarcodeMessage }}</p>
                                            <p style="color:green" v-else-if="isBarcodeValid">Barcode is valid!
                                            </p>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group mb-3">
                                            <label>{{ __('total_allowed_quantity') }} ({{ __('keep_blank_if_no_such_limit')
                                                }}) </label>
                                            <input type="number" min="0" class="form-control"
                                                v-model="max_allowed_quantity" :disabled="isSellerRole">
                                        </div>
                                    </div>

                                    <!-- Row: Is returnable, Is cancelable, Is COD allowed -->
                                    <div class="col-md-4">
                                        <div class="form-group mb-3 d-flex flex-wrap align-items-start gap-2">
                                            <div>
                                                <label>{{ __('is_returnable') }}</label><br>
                                                <b-form-radio-group v-model="return_status" :options="[
                                                    { text: __('no'), 'value': 0 },
                                                    { text: __('yes'), 'value': 1 },
                                                ]" buttons button-variant="outline-primary" required :disabled="isSellerRole"></b-form-radio-group>
                                            </div>
                                            <div v-if="return_status == 1" class="ms-2">
                                                <label for="return_day">{{ __('max_return_days') }}</label>
                                                <input type="number" step="any" :min="return_status == 1 ? 1 : 0"
                                                    :required="return_status == 1 ? true : undefined" id="return_day"
                                                    class="form-control" :placeholder="__('number_of_days_to_return')"
                                                    v-model="return_days" :disabled="isSellerRole">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group mb-3 d-flex flex-wrap align-items-start gap-2">
                                            <div>
                                                <label>{{ __('is_cancelable') }}</label><br>
                                                <b-form-radio-group v-model="cancelable_status" :options="[
                                                    { text: __('no'), 'value': 0 },
                                                    { text: __('yes'), 'value': 1 },
                                                ]" buttons button-variant="outline-primary" :disabled="isSellerRole"></b-form-radio-group>
                                            </div>
                                            <div v-if="cancelable_status === 1" class="ms-2">
                                                <label for="till_status">{{ __('till_which_status') }} <i
                                                    class="text-danger">*</i></label>
                                                <select id="till_status" class="form-control form-select"
                                                    v-model="till_status"
                                                    :required="cancelable_status === 1 ? true : undefined" :disabled="isSellerRole">
                                                    <option value="">{{ __('select_order_status') }}</option>
                                                    <option v-for="status in order_status" :value="status.id">{{
                                                        getStatusDisplayName(status) }}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group mb-3">
                                            <label>{{ __('is_cod_allowed') }}</label><br>
                                            <b-form-radio-group v-model="cod_allowed_status" :options="[
                                                { text: __('no'), 'value': 0 },
                                                { text: __('yes'), 'value': 1 },
                                            ]" buttons button-variant="outline-primary" :disabled="isSellerRole"></b-form-radio-group>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Save and Clear buttons for default language tab only -->
                            <div class="card-footer"
                                v-if="languages.length === 0 || (languages[activeLanguageTab] && languages[activeLanguageTab].is_default)">
                                <b-button type="submit" @keydown.enter="saveRecord" variant="primary"
                                    :disabled="isLoading"> {{ __('save') }}
                                    <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
                                </b-button>
                                <button type="button" class="btn btn-danger" @click="clearForm" v-if="!isSellerRole">{{ __('clear')
                                    }}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
// import InputTag from 'vue-input-tag';
import axios from "axios";
import Multiselect from 'vue-multiselect'
import Select2 from "v-select2-component";
import Editor from '@tinymce/tinymce-vue';
import Auth from '../../Auth.js';
import TranslationHelper from '../../mixins/TranslationHelper.js';

export default {
    mixins: [TranslationHelper],
    // register the component
    components: { Multiselect, Select2, 'editor': Editor },
    data: function () {
        return {
            login_user: Auth.user,
            isLoading: false,
            isGeneratingAI: false, // Track AI content generation state
            cacheTimer: null,
            cachedData: null,
            skipCache: false,

            name: '',
            slug: '',
            seller_id: 0,
            tags: [],
            tag_ids: '',
            tagIdsByLanguage: {}, // Store tag IDs for each language
            tagSuggestions: [],
            brand: null,
            tax_id: 0,
            type: 'packet',
            category_id: '',
            product_type: '',
            manufacturer: '',
            made_in: '',
            tag: '',
            fssai_lic_no: '',

            return_status: 0,
            return_days: 1,
            cancelable_status: 0,
            till_status: "",
            cod_allowed_status: 0,
            max_allowed_quantity: 0,
            description: '',
            require_products_approval: 0,
            is_approved: 1,
            loose_stock: 0,
            loose_stock_unit_id: "",
            status: 1,
            is_unlimited_stock: 0,
            tax_included_in_price: 0,
            pincode_ids_exc: null,

            sellers: null,
            taxes: null,
            units: [],
            brands: [],
            countries: [],

            categories: null,
            order_status: null,

            inputs: [{ 'name': '', 'packet_status': '', 'packet_stock_unit_id': '', 'packet_sku': '', 'packet_secondary_unit_id': '', 'packet_secondary_unit_value': '', 'loose_sku': '', 'loose_secondary_unit_id': '', 'loose_secondary_unit_value': '' }],

            image: null,
            main_image_path: "",
            main_image_name: "",


            other_images: null,
            images: [],
            variantImages: {},
            id: null,
            record: null,
            clone: false,
            categoryOptions: '<option value="">' + __('select_category') + '</option>',
            deleteImageIds: [],
            loggedUser: Auth.user,
            validationMessage: '',
            isValid: '',
            isBarcodeValid: '',
            input: [],
            mainImageerror: null,
            otherImageerror: null,
            variantImageerror: null,
            barcode: "",
            meta_title: "",
            meta_keywords: "",
            schema_markup: "",
            meta_description: "",
            validationBarcodeMessage: "",
            useCustomPrompt: false,
            customPrompt: '',
            loading: false,
            textGenKey: '',
            // Multi-language support
            isLoadingLanguages: false,
            activeLanguageTab: 0,
            translations: {},
            defaultLanguageId: null,
            languages: [],
            currentLanguageId: null,
            activeLanguages: [],
            categories: [], // Store categories data for translation

            // Translate buttons
            translatableFields: ['name', 'description', 'manufacturer', 'meta_title', 'meta_keywords', 'schema_markup', 'meta_description', 'tags'],
            translateSuccessMessage: '',
            loadingEmpty: false,
            loadingOverwrite: false,

            // Cache helpers
            cacheTimer: null,
            cachedData: null,
            skipCache: false,
        }
    },

    computed: {
        isSellerRoute() {
            // Use this.$route to access the current route
            return this.$route.path.startsWith('/seller/');
        },
        tagsOptions() {
            return this.tags.length ? this.tags.map(tag => ({ id: tag.id, text: tag.name })) : [];
        },
        selectedTags() {
            return this.tags.filter(tag => this.tag_ids.includes(tag.id));
        },
        // Computed property to safely access $roleSeller
        roleSeller() {
            return (this.$roleSeller !== undefined) ? this.$roleSeller : '';
        },
        // Computed property to check if current user is seller
        isSellerRole() {
            try {
                return this.login_user && this.login_user.role && this.login_user.role.name && this.roleSeller && this.roleSeller === this.login_user.role.name;
            } catch (e) {
                return false;
            }
        },
        canUseAIGenerate() {
            const user = Auth.user || this.login_user;
            return this.$isDemo != 1 && user && user.id == 1;
        },
        translatedSellers: function () {
            if (!this.currentLanguageId || !this.sellers || this.sellers.length === 0) {
                return this.sellers || [];
            }

            const defaultLanguage = this.activeLanguages.find(lang => lang.is_default === 1);
            const defaultLanguageId = defaultLanguage ? defaultLanguage.id : null;

            return this.sellers.map(seller => {
                const translatedSeller = { ...seller };
                let translatedName = seller.name;

                if (seller.translations && Array.isArray(seller.translations)) {
                    let translation = seller.translations.find(
                        t => t.language_id === this.currentLanguageId
                    );

                    if (!translation && defaultLanguageId) {
                        translation = seller.translations.find(
                            t => t.language_id === defaultLanguageId
                        );
                    }

                    if (translation && translation.name && translation.name.trim() !== '') {
                        translatedName = translation.name;
                    }
                }

                translatedSeller.name = translatedName;
                return translatedSeller;
            });
        },
        translatedBrands: function () {
            if (!this.currentLanguageId || !this.brands || this.brands.length === 0) {
                return this.brands || [];
            }

            const defaultLanguage = this.activeLanguages.find(lang => lang.is_default === 1);
            const defaultLanguageId = defaultLanguage ? defaultLanguage.id : null;

            return this.brands.map(brand => {
                const translatedBrand = { ...brand };
                let translatedTitle = brand.title || brand.name;

                if (brand.translations && Array.isArray(brand.translations)) {
                    let translation = brand.translations.find(
                        t => t.language_id === this.currentLanguageId
                    );

                    if (!translation && defaultLanguageId) {
                        translation = brand.translations.find(
                            t => t.language_id === defaultLanguageId
                        );
                    }

                    if (translation && translation.title && translation.title.trim() !== '') {
                        translatedTitle = translation.title;
                    }
                }

                translatedBrand.name = translatedTitle;
                translatedBrand.title = translatedTitle;
                return translatedBrand;
            });
        },
        translatedTaxes: function () {
            if (!this.currentLanguageId || !this.taxes || this.taxes.length === 0) {
                return this.taxes || [];
            }

            const defaultLanguage = this.activeLanguages.find(lang => lang.is_default === 1);
            const defaultLanguageId = defaultLanguage ? defaultLanguage.id : null;

            return this.taxes.map(tax => {
                const translatedTax = { ...tax };
                let translatedTitle = tax.title;

                if (tax.translations && Array.isArray(tax.translations)) {
                    let translation = tax.translations.find(
                        t => t.language_id === this.currentLanguageId
                    );

                    if (!translation && defaultLanguageId) {
                        translation = tax.translations.find(
                            t => t.language_id === defaultLanguageId
                        );
                    }

                    if (translation && translation.title && translation.title.trim() !== '') {
                        translatedTitle = translation.title;
                    }
                }

                translatedTax.title = translatedTitle;
                return translatedTax;
            });
        },
        translatedCategories: function () {
            if (!this.currentLanguageId || !this.categories || this.categories.length === 0) {
                return this.categories || [];
            }

            const defaultLanguage = this.activeLanguages.find(lang => lang.is_default === 1);
            const defaultLanguageId = defaultLanguage ? defaultLanguage.id : null;

            return this.categories.map(category => {
                const translatedCategory = { ...category };
                let translatedName = category.name;

                if (category.translations && Array.isArray(category.translations)) {
                    let translation = category.translations.find(
                        t => t.language_id === this.currentLanguageId
                    );

                    if (!translation && defaultLanguageId) {
                        translation = category.translations.find(
                            t => t.language_id === defaultLanguageId
                        );
                    }

                    if (translation && translation.name && translation.name.trim() !== '') {
                        translatedName = translation.name;
                    }
                }

                translatedCategory.name = translatedName;
                return translatedCategory;
            });
        },
        categoryOptionsHtml: function () {
            return this.categoryOptions;
        },
    },

    created: function () {
        this.id = this.$route.params.id || null;
        this.clone = this.$route.params.clone || false;

        this.fetchActiveLanguages().then(() => {
            this.getSellers();
            this.getTaxes();
            this.getUnits();
            this.getBrands();
            this.getCountries();
            this.getTags();
            this.getOrderStatus();
            this.getTextGenKey();
            if (this.isSellerRole) {
                this.seller_id = this.login_user.seller.id;
                this.getSeller();
                this.getSellerCategories();
            }
            if (this.id) {
                this.getProduct();
            } else {
                this.restoreCache();
            }
        });
    },
    beforeDestroy: function () {
        if (!this.id && !this.clone && !this.skipCache) this.saveCache();
        if (this.cacheTimer) clearTimeout(this.cacheTimer);
    },
    methods: {
        validateDefaultLanguageForTranslation() {
            const form = this.$refs['my-form'];

            // Trigger native browser validation UI
            if (form && !form.reportValidity()) {
                // Switch to default language tab so error field is visible
                this.$nextTick(() => {
                    this.switchToDefaultLanguageTab();
                });
                return false;
            }

            // Also validate required fields specifically
            return this.validateDefaultLanguage();
        },
        fetchActiveLanguages() {
            this.isLoadingLanguages = true;
            return axios.get(this.$apiUrl + '/active_languages')
                .then(response => {
                    if (response.data.data) {
                        this.languages = response.data.data;
                        this.activeLanguages = response.data.data;
                        const defaultLang = this.languages.find(lang => lang.is_default === 1);
                        if (defaultLang) {
                            this.defaultLanguageId = defaultLang.id;
                        }

                        // Get current language ID from app_locale
                        const appLocale = window.appLocale || 'en';
                        const currentLanguage = this.activeLanguages.find(
                            lang => lang.code === appLocale
                        );
                        if (currentLanguage) {
                            this.currentLanguageId = currentLanguage.id;
                        } else if (defaultLang) {
                            this.currentLanguageId = defaultLang.id;
                        }

                        this.initializeTranslations();
                        this.isLoadingLanguages = false;
                    } else {
                        this.isLoadingLanguages = false;
                    }
                })
                .catch(error => {
                    console.error('Error loading languages:', error);
                    this.isLoadingLanguages = false;
                });
        },

        initializeTranslations() {
            const allTranslations = {};
            this.languages.forEach(language => {
                allTranslations[language.id] = {
                    name: '',
                    tags: '',
                    manufacturer: '',
                    description: '',
                    meta_title: '',
                    meta_keywords: '',
                    schema_markup: '',
                    meta_description: ''
                };
            });
            this.translations = allTranslations;
        },

        // Handle input events for default language fields
        handleDefaultLanguageInput(fieldName, language) {
            if (language.is_default && this.translations[language.id]) {
                // Update the main data property with the translation value
                this[fieldName] = this.translations[language.id][fieldName];

                // Special handling for name field - also create slug
                if (fieldName === 'name') {
                    this.createSlug();
                }
            }
        },

        // Handle tag input for any language tab
        handleTagInput(languageId, value) {
            // Ensure value is properly formatted (could be array, string, or undefined)
            let tagIds = value;
            if (!tagIds) {
                tagIds = [];
            } else if (typeof tagIds === 'string') {
                tagIds = tagIds.split(',').map(t => t.trim()).filter(t => t);
            } else if (!Array.isArray(tagIds)) {
                tagIds = [tagIds];
            }

            if (languageId === this.defaultLanguageId) {
                // For default language, update tag_ids
                this.tag_ids = tagIds;
            } else {
                // For other languages, update tagIdsByLanguage
                this.$set(this.tagIdsByLanguage, languageId, tagIds);
            }
            // Convert IDs to names for translation
            this.handleTagChange(languageId);
        },

        // Handle tag changes - convert IDs to names for translation
        handleTagChange(languageId) {
            if (!this.translations[languageId]) return;

            // Get tag IDs for this language
            let tagIds = [];
            if (languageId === this.defaultLanguageId) {
                tagIds = Array.isArray(this.tag_ids) ? this.tag_ids : (this.tag_ids ? String(this.tag_ids).split(',').map(t => t.trim()).filter(t => t) : []);
            } else {
                const langTagIds = this.tagIdsByLanguage[languageId];
                if (langTagIds) {
                    tagIds = Array.isArray(langTagIds) ? langTagIds : (String(langTagIds).split(',').map(t => t.trim()).filter(t => t));
                }
            }

            // Convert tag IDs to tag names for translation
            if (tagIds.length > 0) {
                const tagNames = tagIds.map(tagId => {
                    // If it's a number, find the tag name from tags array
                    if (typeof tagId === 'number' || (typeof tagId === 'string' && !isNaN(tagId))) {
                        const tag = this.tags.find(t => t.id == tagId);
                        return tag ? tag.name : tagId;
                    }
                    // If it's already a string (new tag), use it as is
                    return tagId;
                });
                this.$set(this.translations[languageId], 'tags', tagNames.join(','));
            } else {
                // Only clear if we explicitly have an empty array (user cleared tags)
                // Don't overwrite if translation.tags already has a value
                if (tagIds.length === 0 && (!this.translations[languageId].tags || this.translations[languageId].tags === '')) {
                    this.$set(this.translations[languageId], 'tags', '');
                }
            }
        },

        getEditorConfig() {
            const plugins = (this.$editorPlugins && Array.isArray(this.$editorPlugins))
                ? this.$editorPlugins
                : ["autolink", "lists", "link", "image", "charmap", "anchor", "searchreplace", "visualblocks", "media", "table", "wordcount", "code", "codesample"];

            const toolbar = this.$editorToolbar || "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | charmap | code | removeformat";

            const fontSizes = this.$editorFont_size_formats || '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt';

            return {
                height: 400,
                plugins: plugins,
                toolbar: toolbar,
                font_size_formats: fontSizes,
                ...this.$tinymceImageUploadOptions()
            };
        },

        // Helper method to safely trigger file input click (handles refs in v-for)
        triggerRefClick(refName) {
            this.$nextTick(() => {
                try {
                    const ref = this.$refs[refName];
                    if (!ref) {
                        return;
                    }
                    // Handle array case (refs inside v-for)
                    if (Array.isArray(ref)) {
                        // Find first valid element in array
                        for (let i = 0; i < ref.length; i++) {
                            if (ref[i] && typeof ref[i].click === 'function') {
                                ref[i].click();
                                return;
                            }
                        }
                        return;
                    }
                    // Handle single ref case
                    if (typeof ref.click === 'function') {
                        ref.click();
                    }
                } catch (e) {
                    console.warn('Error triggering file input click:', e);
                }
            });
        },

        validateDefaultLanguage() {
            if (!this.defaultLanguageId) {
                this.showError(__('default_language_not_found'));
                return false;
            }

            const defaultTranslation = this.translations[this.defaultLanguageId];

            if (!defaultTranslation.name || defaultTranslation.name.trim() === '') {
                this.showError(__('please_fill_product_name_in_default_language'));
                this.switchToDefaultLanguageTab();
                return false;
            }

            if (!defaultTranslation.description || defaultTranslation.description.trim() === '') {
                this.showError(__('please_fill_description_in_default_language'));
                this.switchToDefaultLanguageTab();
                return false;
            }

            return true;
        },

        switchToDefaultLanguageTab() {
            const defaultLangIndex = this.languages.findIndex(lang => lang.id === this.defaultLanguageId);
            if (defaultLangIndex !== -1) {
                this.activeLanguageTab = defaultLangIndex;
            }
        },

        loadTranslations() {
            if (!this.id) return;

            // Wait for languages to be loaded first
            if (this.languages.length === 0) {
                this.fetchActiveLanguages().then(() => {
                    this.loadTranslationsData();
                });
                return;
            }

            this.loadTranslationsData();
        },

        // Load translations from API response (translations array with all language records)
        loadTranslationsData() {
            if (!this.record || !this.record.translations || !Array.isArray(this.record.translations)) {
                return;
            }

            const translationsArray = this.record.translations;

            this.languages.forEach(language => {
                const translation = translationsArray.find(t => t.language_id === language.id);
                if (translation) {
                    this.$set(this.translations[language.id], 'name', translation.name || '');
                    this.$set(this.translations[language.id], 'tags', translation.tags || '');
                    this.$set(this.translations[language.id], 'manufacturer', translation.manufacturer || '');
                    this.$set(this.translations[language.id], 'description', translation.description || '');
                    this.$set(this.translations[language.id], 'meta_title', translation.meta_title || '');
                    this.$set(this.translations[language.id], 'meta_keywords', translation.meta_keywords || '');
                    this.$set(this.translations[language.id], 'schema_markup', translation.schema_markup || '');
                    this.$set(this.translations[language.id], 'meta_description', translation.meta_description || '');
                }
            });

            if (this.tags && this.tags.length > 0) {
                this.convertTagNamesToIds();
            }
        },

        // Helper method to convert tag names to IDs for Select2 (for all languages)
        convertTagNamesToIds() {
            if (!this.tags || this.tags.length === 0) {
                return; // Tags not loaded yet
            }

            if (!this.languages || this.languages.length === 0) {
                return; // Languages not loaded yet
            }

            this.languages.forEach(language => {
                if (this.translations[language.id] && this.translations[language.id].tags) {
                    const tagsString = this.translations[language.id].tags;
                    if (tagsString && tagsString.trim()) {
                        // Tags in translation are names (comma-separated string)
                        // Convert names to IDs for Select2
                        const tagNames = tagsString.split(',').map(t => t.trim()).filter(t => t);
                        const tagIds = tagNames.map(tagName => {
                            // Try to find tag by name (case-insensitive matching)
                            const tag = this.tags.find(t => {
                                const tagNameTrimmed = String(t.name || '').trim();
                                const searchNameTrimmed = String(tagName || '').trim();
                                return tagNameTrimmed.toLowerCase() === searchNameTrimmed.toLowerCase();
                            });

                            if (tag) {
                                return tag.id;
                            }
                            // If not found, it might be a new tag (keep as string)
                            return tagName;
                        });

                        if (language.is_default) {
                            this.tag_ids = tagIds;
                        } else {
                            // Use $set to ensure reactivity
                            this.$set(this.tagIdsByLanguage, language.id, tagIds);
                        }
                    } else {
                        // Set empty array if no tags
                        if (language.is_default) {
                            this.tag_ids = [];
                        } else {
                            this.$set(this.tagIdsByLanguage, language.id, []);
                        }
                    }
                } else {
                    // Initialize with empty array if no translation
                    if (!language.is_default) {
                        this.$set(this.tagIdsByLanguage, language.id, []);
                    }
                }
            });
        },

        async generateDescription() {
            if (this.$isDemo == 1) {
                this.showError("This function is not available in demo mode.");
                return;
            }
            if (!this.name) {
                this.showMessage("error", "Please enter the product name.");
                return;
            }

            if (!this.textGenKey) {
                this.showMessage("error", "Text generation API key is not configured");
                return;
            }

            const prompt = this.useCustomPrompt && this.customPrompt.trim()
                ? `${this.customPrompt} for product: ${this.name}. Output raw HTML only, no explanatory text, no code blocks, no images.`
                : `Generate a detailed product description for ${this.name} formatted for TinyMCE editor.
            Structure: Start with <strong>Product Overview</strong>, then multiple <p> paragraphs describing features and benefits.
            Include <strong>Key Features</strong> with <ul><li> bullet points.
            Add <strong>Benefits</strong> section with more <p> content.
            Use <strong> for emphasis, <em> for highlights.
            Important: no code blocks, no markdown syntax, no explanatory text.`;

            try {
                this.isGeneratingAI = true; // Start AI processing state

                const response = await fetch(
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + this.textGenKey,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }]
                        })
                    }
                );

                const data = await response.json();

                if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                    const generatedText = data.candidates[0].content.parts[0].text;
                    this.description = generatedText;
                    if (this.defaultLanguageId && this.translations[this.defaultLanguageId]) {
                        this.$set(this.translations[this.defaultLanguageId], 'description', generatedText);
                    }
                } else {
                    this.showMessage("error", "Failed to generate description.");
                }
            } catch (error) {
                this.showMessage("error", "An error occurred while generating the description.");
            } finally {
                this.isGeneratingAI = false; // Stop AI processing state
            }
        },

        createSlug() {
            if (this.name !== "") {
                this.slug = this.name
                    .normalize("NFD") // Normalize Unicode
                    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
                    .replace(/[^\p{L}\p{N}\s-]/gu, '') // Keep letters, numbers, spaces, and hyphens (any language)
                    .trim()
                    .replace(/\s+/g, '-') // Replace spaces with '-'
                    .toLowerCase();
            }
        },

        fetchTags(query) {
            if (query.length > 1) {
                axios.get(this.$apiUrl + '/products/tags', {
                    params: { search: query }
                })
                    .then(response => {
                        this.tagSuggestions = response.data;
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        },
        addRow() {
            if (this.type === 'packet') {
                this.inputs.push({ 'name': '', 'packet_status': '', 'packet_stock_unit_id': '', 'packet_sku': '', 'packet_secondary_unit_id': '', 'packet_secondary_unit_value': '' })
            } else {
                this.inputs.push({ 'name': '', 'loose_sku': '', 'loose_secondary_unit_id': '', 'loose_secondary_unit_value': '' })
            }
        },
        remove(index) {
            let variant_id = (this.inputs[index].id) ? this.inputs[index].id : "";
            if (this.id && variant_id !== "") {
                this.$swal.fire({
                    title: "Are you Sure?",
                    text: "You want be able to revert this",
                    confirmButtonText: "Yes, Sure",
                    cancelButtonText: "Cancel",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#37a279',
                    cancelButtonColor: '#d33',
                }).then(result => {
                    if (result.value) {
                        let postData = {
                            id: variant_id
                        }
                        axios.post(this.$apiUrl + '/products/delete', postData)
                            .then((response) => {
                                let data = response.data;
                                this.inputs.splice(index, 1)
                                this.showSuccess(data.message)
                            });
                    }
                });
            } else {
                this.inputs.splice(index, 1)
            }
        },

        dropFile(event) {
            event.preventDefault();
            // Safely access file_image ref (can be array in v-for)
            const fileInput = Array.isArray(this.$refs.file_image)
                ? this.$refs.file_image[0]
                : this.$refs.file_image;

            if (fileInput) {
                fileInput.files = event.dataTransfer.files;
                this.fileImage(); // Trigger the onChange event manually
            }
            // Clean up
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },

        fileImage() {
            // Safely access file_image ref (can be array in v-for)
            const fileInput = Array.isArray(this.$refs.file_image)
                ? this.$refs.file_image[0]
                : this.$refs.file_image;

            if (!fileInput) return;

            const file = fileInput.files[0];

            // Reset previous error message
            this.mainImageerror = null;

            // Check if a file was selected
            if (!file) return;

            // Perform image validation
            const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
            if (!validTypes.includes(file.type)) {
                this.mainImageerror = "Invalid file type. Please upload a JPEG, PNG, JPG,  GIF or WEBP image.";
                this.main_image_path = "";
                this.main_image_name = "";
                return;
            }

            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                this.mainImageerror = "File size exceeds the maximum allowed limit (2MB).";
                this.main_image_path = "";
                this.main_image_name = "";
                return;
            }

            // Create a URL for the uploaded image and display it
            this.imageUrl = URL.createObjectURL(file);
            this.image = fileInput.files[0];
            this.main_image_path = URL.createObjectURL(this.image);
            this.main_image_name = this.image.name;
        },
        dropFileOtherImage(event) {
            event.preventDefault();
            // Safely access file_other_images ref (can be array in v-for)
            const fileInput = Array.isArray(this.$refs.file_other_images)
                ? this.$refs.file_other_images[0]
                : this.$refs.file_other_images;

            if (fileInput) {
                fileInput.files = event.dataTransfer.files;
                this.otherImage(); // Trigger the onChange event manually
            }
            // Clean up
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },
        removeOtherImage(index) {
            this.images.splice(index, 1);
        },

        otherImage() {
            this.images = [];
            // Safely access file_other_images ref (can be array in v-for)
            const fileInput = Array.isArray(this.$refs.file_other_images)
                ? this.$refs.file_other_images[0]
                : this.$refs.file_other_images;

            if (!fileInput) return;

            const files = fileInput.files;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Check if the file is an image (you can extend the list of allowed file types)
                if (!file.type.startsWith('image/')) {
                    this.otherImageerror = "Invalid file type. Please upload a JPEG, PNG, JPG,  GIF or WEBP image.";
                    file = "";
                } else {
                    let image = {};
                    image.url = URL.createObjectURL(file);
                    image.name = file.name;
                    image.file = file; // Store the actual file object
                    this.images.push(image);
                }
            }
        },

        variantImagesChanges(index) {
            let tempImages = [];
            Vue.set(this.variantImages, index, []);

            if (this.type === 'packet') {
                const validExtensions = ['jpg', 'jpeg', 'png', 'gif']; // Add more valid extensions as needed
                const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB (adjust the size limit as needed)

                for (var i = 0; i < this.$refs['packet_variant_images_' + index][0].files.length; i++) {
                    let image = {};
                    let file = this.$refs['packet_variant_images_' + index][0].files[i];
                    let extension = file.name.split('.').pop().toLowerCase();

                    // Check if the file extension is valid
                    if (!validExtensions.includes(extension)) {
                        this.variantImageerror = "Invalid file type. Please upload a JPEG, PNG, JPG,  GIF or WEBP image.";
                        return; // Skip this file and proceed to the next one
                    }

                    // Check if the file size is within the allowed limit
                    if (file.size > maxSizeInBytes) {
                        this.variantImageerror = "File size exceeds the limit of 5 MB.";
                        return; // Skip this file and proceed to the next one
                    }

                    image.url = URL.createObjectURL(file);
                    image.name = file.name;
                    tempImages.push(image);
                    Vue.set(this.variantImages, index, tempImages);
                }
            } else {
                for (var i = 0; i < this.$refs['loose_variant_images_' + index][0].files.length; i++) {
                    let image = {};
                    let file = this.$refs['loose_variant_images_' + index][0].files[i];
                    image.url = URL.createObjectURL(file);
                    image.name = file.name;
                    tempImages.push(image);
                    Vue.set(this.variantImages, index, tempImages);
                }
            }
        },

        getSellerCategories() {
            const selectPlaceholder = '<option value="">' + __('select_category') + '</option>';
            // When no seller selected, show only placeholder and clear selection
            if (!this.seller_id || this.seller_id === 0 || this.seller_id === '') {
                this.categoryOptions = selectPlaceholder;
                this.category_id = '';
                return;
            }
            this.isLoading = true;
            axios.get(this.$apiUrl + '/categories/seller_categories', {
                params: { seller_id: this.seller_id }
            })
                .then((response) => {
                    this.isLoading = false;
                    const data = response.data;
                    let optionsHtml = '';
                    if (typeof data === 'string') {
                        optionsHtml = data;
                    } else if (data && typeof data.data === 'string') {
                        optionsHtml = data.data;
                    }
                    this.categoryOptions = selectPlaceholder + optionsHtml;
                })
                .catch((error) => {
                    this.isLoading = false;
                    this.categoryOptions = selectPlaceholder;
                });
        },
        getSeller() {
            if (this.seller_id !== 0 && this.seller_id !== "" && !this.id) {
                this.isLoading = true;
                let param = {
                    "seller_id": this.seller_id
                }
                axios.get(this.$apiUrl + '/sellers/edit/' + this.seller_id, {
                    params: param
                }).then((response) => {
                    this.isLoading = false,
                        this.require_products_approval = response.data.data.require_products_approval;
                    this.is_approved = this.require_products_approval == 0 ? 1 : 0;
                });
            }
        },
        getCategories() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/categories/options')
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    const placeholder = '<option value="">' + __('select_category') + '</option>';
                    if (typeof data === 'string') {
                        this.categoryOptions = placeholder + data;
                    } else if (data.data && typeof data.data === 'string') {
                        this.categoryOptions = placeholder + data.data;
                    } else {
                        this.categoryOptions = placeholder;
                    }
                })
                .catch((error) => {
                    this.isLoading = false
                });
        },
        getSellers() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/sellers')
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    this.sellers = data.data
                });
        },
        getTaxes() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/products/taxes')
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    this.taxes = data.data
                });
        },
        getUnits() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/units/get')
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    this.units = data.data
                });
        },
        getBrands() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/products/brands/get')
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    this.brands = data.data;
                    if (this.cachedData && this.cachedData.brand) {
                        const foundBrand = this.brands.find(b => b.id === this.cachedData.brand.id) || null;
                        // Update brand with translated name
                        this.$nextTick(() => {
                            if (foundBrand && this.translatedBrands && this.translatedBrands.length > 0) {
                                const translatedBrand = this.translatedBrands.find(b => b.id === foundBrand.id);
                                if (translatedBrand) {
                                    this.brand = { ...foundBrand, name: translatedBrand.name, title: translatedBrand.title };
                                } else {
                                    this.brand = foundBrand;
                                }
                            } else {
                                this.brand = foundBrand;
                            }
                        });
                    }
                });
        },
        getCountries() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/countries/active')
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    this.countries = data.data;
                    if (this.cachedData && this.cachedData.made_in) {
                        this.made_in = this.countries.find(c => c.id === this.cachedData.made_in.id) || null;
                    }
                });
        },
        getTags() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/products/tags')
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    this.tags = data.data;

                    // After tags are loaded, convert tag names to IDs for Select2 (if translations are already loaded)
                    if (this.id && this.languages.length > 0) {
                        this.$nextTick(() => {
                            this.convertTagNamesToIds();
                        });
                    }
                });
        },

        /**
         * Status label for dropdown. API returns status_name as object by lang code { en: "...", hi: "..." }.
         * Picks current app locale; fallback to status.status.
         */
        getStatusDisplayName(status) {
            if (!status) return '';
            const sn = status.status_name;
            if (sn == null) return status.status || '';
            if (typeof sn === 'string') return sn.trim() || status.status || '';
            if (typeof sn === 'object' && !Array.isArray(sn)) {
                const appLocale = window.appLocale || window.localStorage.getItem('lang') || 'en';
                const forLocale = sn[appLocale];
                if (forLocale != null && String(forLocale).trim() !== '') return String(forLocale).trim();
                const first = Object.values(sn).find(val => val != null && String(val).trim() !== '');
                return first != null ? String(first).trim() : (status.status || '');
            }
            return status.status || '';
        },
        getOrderStatus() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/order_statuses').then((response) => {
                this.isLoading = false
                let data = response.data;
                const statusesToRemoveIds = [6, 7, 8];
                this.order_status = data.data.filter(status => !statusesToRemoveIds.includes(status.id));
            });
        },
        getTextGenKey() {
            // Get the text generation API key from store settings
            axios.get(this.$apiUrl + '/store_settings')
                .then((response) => {
                    let data = response.data.data;
                    if (data.store_settings) {
                        data.store_settings.forEach((item) => {
                            if (item.variable === 'text_gen_key') {
                                this.textGenKey = item.value;
                            }
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error fetching text generation key:', error);
                });
        },
        validateFSSAINumber() {
            const fssaiRegex = /^[0-9]{14}$/;

            if (fssaiRegex.test(this.fssai_lic_no)) {
                this.validationMessage = '';
                this.isValid = true;
            } else {
                this.validationMessage = 'Invalid FSSAI Number.';
                this.isValid = false;
            }
        },
        validateBarcode() {
            const barcodePattern = /^[A-Za-z0-9-]+$/;

            if (barcodePattern.test(this.barcode)) {
                this.validationBarcodeMessage = '';
                this.isBarcodeValid = true;
            } else {
                this.validationBarcodeMessage = 'Invalid Barcode Number.';
                this.isBarcodeValid = false;
            }
        },
        validateDiscountedPrice(input) {
            const discountedPrice = parseFloat(input.discounted_price);
            const actualPrice = parseFloat(input.packet_price);
            if (discountedPrice >= actualPrice) {
                input.validationErrorDiscountedPrice = "Discounted Price must be less than Actual Price";
                input.discounted_price = null;
            } else {
                input.validationErrorDiscountedPrice = null;
            }
        },
        validateDiscountedPriceLoose(input) {
            const discountedPrice = parseFloat(input.loose_discounted_price);
            const actualPrice = parseFloat(input.loose_price);
            if (discountedPrice >= actualPrice) {
                input.validationErrorDiscountedPriceLoose = "Discounted Price must be less than Actual Price";
                input.loose_discounted_price = null;
            } else {
                input.validationErrorDiscountedPriceLoose = null;
            }
        },
        validateStockWithMeasurement() {
            if (this.is_unlimited_stock == 1) {
                return true;
            }

            if (this.type === 'loose') {
                const totalStock = parseFloat(this.loose_stock);
                for (let i = 0; i < this.inputs.length; i++) {
                    const measurement = parseFloat(this.inputs[i].loose_measurement);
                    if (measurement > totalStock) {
                        this.showError(`Variant ${i + 1} measurement (${measurement}) cannot exceed total stock (${totalStock})`);
                        return false;
                    }
                }
            }
            return true;
        },
        getProduct() {
            this.isLoading = true;

            axios.get(this.$apiUrl + '/products/edit/' + this.id)
                .then((response) => {
                    let data = response.data;
                    if (data.status === 1) {
                        this.record = data.data

                        this.name = this.record.name;
                        this.slug = this.record.slug;
                        this.barcode = this.record.barcode;
                        if (this.clone) {
                            this.name = '';
                            this.slug = '';
                            this.barcode = '';
                        }

                        this.seller_id = this.record.seller_id;
                        this.getSellerCategories();
                        this.getSeller();

                        this.tag_ids = this.record.tags.map(item => item.id);

                        this.tax_id = this.record.tax_id;

                        const foundBrand = this.brands.find((item) => {
                            return item.id === this.record.brand_id;
                        });
                        // Update brand with translated name after brands are loaded
                        this.$nextTick(() => {
                            if (foundBrand && this.translatedBrands && this.translatedBrands.length > 0) {
                                const translatedBrand = this.translatedBrands.find(b => b.id === foundBrand.id);
                                if (translatedBrand) {
                                    this.brand = { ...foundBrand, name: translatedBrand.name, title: translatedBrand.title };
                                } else {
                                    this.brand = foundBrand;
                                }
                            } else {
                                this.brand = foundBrand;
                            }
                        });

                        this.type = this.record.type;

                        this.category_id = this.record.category_id;

                        this.product_type = this.record.indicator ?? "";
                        this.manufacturer = (this.record.manufacturer != null && this.record.manufacturer !== "null") ? this.record.manufacturer : "";

                        // Load translations
                        this.loadTranslations();


                        this.made_in = this.countries.find((item) => {
                            return item.id == this.record.made_in;
                        });

                        this.tax_included_in_price = this.record.tax_included_in_price;

                        this.return_status = this.record.return_status;
                        this.return_days = this.record.return_days;
                        this.cancelable_status = this.record.cancelable_status;

                        this.till_status = this.record.till_status;
                        this.cod_allowed_status = this.record.cod_allowed;
                        this.max_allowed_quantity = this.record.total_allowed_quantity;
                        this.description = this.record.description;
                        this.is_approved = this.record.is_approved;
                        this.status = this.record.status;
                        this.is_unlimited_stock = this.record.is_unlimited_stock;
                        this.main_image_path = this.$storageUrl + this.record.image;
                        this.other_images = this.record.images;
                        this.fssai_lic_no = this.record.fssai_lic_no;
                        this.image = this.record.image;
                        this.meta_title = this.record.meta_title;
                        this.meta_keywords = this.record.meta_keywords;
                        this.schema_markup = this.record.schema_markup;
                        this.meta_description = this.record.meta_description;

                        // Set default language translation from main record
                        if (this.defaultLanguageId && this.translations[this.defaultLanguageId]) {
                            this.translations[this.defaultLanguageId].name = this.name;
                            // Convert tag_ids to tag names for translation
                            if (Array.isArray(this.tag_ids) && this.tag_ids.length > 0) {
                                const tagNames = this.tag_ids.map(tagId => {
                                    const tag = this.tags.find(t => t.id == tagId);
                                    return tag ? tag.name : tagId;
                                });
                                this.translations[this.defaultLanguageId].tags = tagNames.join(',');
                            } else {
                                this.translations[this.defaultLanguageId].tags = '';
                            }
                            this.translations[this.defaultLanguageId].manufacturer = this.manufacturer;
                            this.translations[this.defaultLanguageId].description = this.description;
                            this.translations[this.defaultLanguageId].meta_title = this.meta_title;
                            this.translations[this.defaultLanguageId].meta_keywords = this.meta_keywords;
                            this.translations[this.defaultLanguageId].schema_markup = this.schema_markup;
                            this.translations[this.defaultLanguageId].meta_description = this.meta_description;
                        }

                        let vm = this;
                        if (this.type == 'packet') {
                            this.inputs = [];
                            this.record.variants.forEach(function (item) {
                                var variantData = {
                                    'id': (item.id) ? item.id : "",
                                    'packet_measurement': item.measurement,
                                    'packet_price': item.price,
                                    'packet_purchase_price': item.purchase_price,
                                    'discounted_price': item.discounted_price,
                                    'packet_stock': item.stock,
                                    'packet_stock_unit_id': item.stock_unit_id,
                                    'packet_status': item.status,
                                    'packet_sku': item.sku,
                                    'packet_secondary_unit_id': item.secondary_unit_id,
                                    'packet_secondary_unit_value': item.secondary_unit_value,
                                    'images': item.images,
                                };
                                vm.inputs.push(variantData);
                            });
                        }

                        if (this.type == 'loose') {

                            let loose_stock = 0;
                            let loose_stock_unit_id = 0;
                            let status = 0;

                            this.inputs = [];
                            this.record.variants.forEach(function (item) {
                                var variantData = {
                                    'id': (item.id) ? item.id : "",
                                    'loose_measurement': item.measurement,
                                    'loose_custom_title': item.custom_title ?? "",
                                    'loose_price': item.price,
                                    'loose_purchase_price': item.purchase_price,
                                    'loose_discounted_price': item.discounted_price,
                                    'packet_stock': item.stock,
                                    'loose_sku': item.sku,
                                    'loose_secondary_unit_id': item.secondary_unit_id,
                                    'loose_secondary_unit_value': item.secondary_unit_value,
                                    'loose_images': item.images,
                                };
                                vm.inputs.push(variantData);
                                loose_stock = item.stock;
                                loose_stock_unit_id = item.stock_unit_id;
                                status = item.status;
                            });
                            this.loose_stock = loose_stock;
                            this.loose_stock_unit_id = loose_stock_unit_id;
                            this.status = status;
                        }
                    } else {
                        this.showError(data.message);
                        setTimeout(() => {
                            this.$router.back();
                        }, 1000);
                    }
                }).catch(error => {
                    this.isLoading = false;
                    if (error.message) {
                        this.showError(error.message);
                    } else {
                        this.showError("Something went wrong!");
                    }
                });
        },

        saveRecord: function () {
            // Validate default language
            if (!this.validateDefaultLanguage()) {
                return;
            }

            // Validate stock vs measurement
            if (!this.validateStockWithMeasurement()) {
                return;
            }

            // Validate stock vs measurement
            if (!this.validateStockWithMeasurement()) {
                return;
            }

            this.isLoading = true;
            let vm = this;

            // Get default language translation for main table
            const defaultLang = this.languages.find(lang => lang.is_default === 1);
            if (!defaultLang) {
                vm.showError(__('default_language_not_found'));
                vm.isLoading = false;
                return;
            }

            const defaultTranslation = this.translations[defaultLang.id];

            let formData = new FormData();
            if (this.id) {
                formData.append('id', this.id);
                formData.append('deleteImageIds', JSON.stringify(this.deleteImageIds));
            }
            // Use default language values for main table
            formData.append('name', defaultTranslation.name || '');
            formData.append('slug', this.slug);
            formData.append('seller_id', this.seller_id);
            // Convert tag_ids array to comma-separated string for backend relationship
            const tagIdsString = Array.isArray(this.tag_ids) ? this.tag_ids.join(',') : (this.tag_ids || '');
            formData.append('tag_ids', tagIdsString);
            // Convert tag_ids to tag names for main products table tags column
            let tagsString = '';
            if (Array.isArray(this.tag_ids) && this.tag_ids.length > 0) {
                const tagNames = this.tag_ids.map(tagId => {
                    // If it's a number, find the tag name from tags array
                    if (typeof tagId === 'number' || (typeof tagId === 'string' && !isNaN(tagId))) {
                        const tag = this.tags.find(t => t.id == tagId);
                        return tag ? tag.name : tagId;
                    }
                    // If it's already a string (new tag), use it as is
                    return tagId;
                });
                tagsString = tagNames.join(',');
            } else if (this.tag_ids) {
                // Handle string case
                const tagIdsArray = String(this.tag_ids).split(',').map(t => t.trim());
                const tagNames = tagIdsArray.map(tagId => {
                    if (!isNaN(tagId)) {
                        const tag = this.tags.find(t => t.id == tagId);
                        return tag ? tag.name : tagId;
                    }
                    return tagId;
                });
                tagsString = tagNames.join(',');
            }
            formData.append('tags', tagsString);
            formData.append('tax_id', this.tax_id);
            formData.append('brand_id', this.brand ? this.brand.id : 0);
            formData.append('description', defaultTranslation.description || '');
            formData.append('type', this.type);
            formData.append('is_unlimited_stock', this.is_unlimited_stock);
            formData.append('fssai_lic_no', this.fssai_lic_no);
            formData.append('barcode', (this.barcode != null && this.barcode !== undefined) ? String(this.barcode).trim() : '');
            formData.append('meta_title', defaultTranslation.meta_title || '');
            formData.append('meta_keywords', defaultTranslation.meta_keywords || '');
            formData.append('schema_markup', defaultTranslation.schema_markup || '');
            formData.append('meta_description', defaultTranslation.meta_description || '');

            /*packet*/
            if (this.type === 'packet') {
                for (let i = 0; i < this.inputs.length; i++) {

                    formData.append('variant_id[]', (this.inputs[i].id) ? this.inputs[i].id : "");
                    formData.append('packet_measurement[]', this.inputs[i].packet_measurement);

                    formData.append('packet_price[]', (this.inputs[i].packet_price != undefined) ? this.inputs[i].packet_price : 0);
                    formData.append('packet_purchase_price[]', (this.inputs[i].packet_purchase_price != undefined) ? this.inputs[i].packet_purchase_price : 0);
                    formData.append('discounted_price[]', (this.inputs[i].discounted_price != undefined) ? this.inputs[i].discounted_price : 0);
                    formData.append('packet_stock[]', (this.inputs[i].packet_stock != undefined) ? this.inputs[i].packet_stock : 0);
                    formData.append('packet_stock_unit_id[]', (this.inputs[i].packet_stock_unit_id != undefined) ? this.inputs[i].packet_stock_unit_id : 0);
                    formData.append('packet_status[]', (this.inputs[i].packet_status != undefined) ? this.inputs[i].packet_status : 0);
                    formData.append('packet_sku[]', (this.inputs[i].packet_sku != undefined) ? this.inputs[i].packet_sku : "");
                    formData.append('packet_secondary_unit_id[]', (this.inputs[i].packet_secondary_unit_id != undefined) ? this.inputs[i].packet_secondary_unit_id : "");
                    formData.append('packet_secondary_unit_value[]', (this.inputs[i].packet_secondary_unit_value != undefined) ? this.inputs[i].packet_secondary_unit_value : "");

                    // Safely handle packet variant images refs (can be undefined when card is hidden in non-default language tab)
                    const packetRef = this.$refs['packet_variant_images_' + i];
                    const packetInput = Array.isArray(packetRef) ? packetRef && packetRef[0] : packetRef;
                    if (packetInput && packetInput.files) {
                        for (let j = 0; j < packetInput.files.length; j++) {
                            let file = packetInput.files[j];
                            formData.append('packet_variant_images_' + i + '[]', file);
                        }
                    }
                }
            }

            /*loose*/
            if (this.type === 'loose') {
                for (let i = 0; i < this.inputs.length; i++) {
                    formData.append('variant_id[]', (this.inputs[i].id) ? this.inputs[i].id : "");
                    formData.append('loose_measurement[]', this.inputs[i].loose_measurement);
                    formData.append('loose_custom_title[]', this.inputs[i].loose_custom_title);

                    formData.append('loose_price[]', (this.inputs[i].loose_price != undefined) ? this.inputs[i].loose_price : 0);
                    formData.append('loose_purchase_price[]', (this.inputs[i].loose_purchase_price != undefined) ? this.inputs[i].loose_purchase_price : 0);
                    formData.append('loose_discounted_price[]', (this.inputs[i].loose_discounted_price != undefined) ? this.inputs[i].loose_discounted_price : 0);
                    formData.append('packet_stock[]', (this.inputs[i].packet_stock != undefined) ? this.inputs[i].packet_stock : 0);
                    formData.append('loose_sku[]', (this.inputs[i].loose_sku != undefined) ? this.inputs[i].loose_sku : "");
                    formData.append('loose_secondary_unit_id[]', (this.inputs[i].loose_secondary_unit_id != undefined) ? this.inputs[i].loose_secondary_unit_id : "");
                    formData.append('loose_secondary_unit_value[]', (this.inputs[i].loose_secondary_unit_value != undefined) ? this.inputs[i].loose_secondary_unit_value : "");

                    // Safely handle loose variant images refs (can be undefined when card is hidden in non-default language tab)
                    const looseRef = this.$refs['loose_variant_images_' + i];
                    const looseInput = Array.isArray(looseRef) ? looseRef && looseRef[0] : looseRef;
                    if (looseInput && looseInput.files) {
                        for (let j = 0; j < looseInput.files.length; j++) {
                            let file = looseInput.files[j];
                            formData.append('loose_variant_images_' + i + '[]', file);
                        }
                    }
                }
                formData.append('loose_stock', this.loose_stock);
                formData.append('loose_stock_unit_id', this.loose_stock_unit_id);
                formData.append('status', this.status);
            }


            formData.append('loose_stock', (this.loose_stock != undefined) ? this.loose_stock : 0);
            formData.append('loose_stock_unit_id', (this.loose_stock_unit_id != undefined) ? this.loose_stock_unit_id : 0);
            formData.append('status', (this.status != undefined) ? this.status : 0);

            formData.append('category_id', this.category_id);
            formData.append('product_type', this.product_type);
            formData.append('manufacturer', this.manufacturer || '');

            formData.append('made_in', this.made_in ? this.made_in.id : 0);

            formData.append('shipping_type', this.shipping_type);

            formData.append('pincode_ids_exc', this.pincode_ids_exc);

            formData.append('return_status', this.return_status);
            const returnDaysToStore = (parseInt(this.return_days, 10) > 0) ? this.return_days : 1;
            formData.append('return_days', returnDaysToStore);
            formData.append('cancelable_status', this.cancelable_status);
            formData.append('till_status', this.till_status);
            formData.append('cod_allowed_status', this.cod_allowed_status);
            formData.append('max_allowed_quantity', this.max_allowed_quantity);

            formData.append('is_approved', this.is_approved);
            formData.append('tax_included_in_price', this.tax_included_in_price);
            formData.append('image', this.image);
            // Other Images - Use files from images array to maintain correct indexing
            for (var i = 0; i < this.images.length; i++) {
                let file = this.images[i].file;
                formData.append('other_images[]', file);
            }

            // Sync manufacturer to default language translation before saving
            if (this.defaultLanguageId && this.translations[this.defaultLanguageId]) {
                this.translations[this.defaultLanguageId].manufacturer = this.manufacturer;
            }

            // Sync tags for all languages before saving (ensure translation.tags is up to date)
            this.languages.forEach(language => {
                if (this.translations[language.id]) {
                    this.handleTagChange(language.id);
                }
            });

            // Prepare translations array
            const allTranslations = [];
            this.languages.forEach(language => {
                const translation = this.translations[language.id];
                // Convert tag IDs to tag names for translation (for all languages)
                let tagsValue = translation.tags || '';

                // Get tag IDs for this language
                let tagIds = [];
                if (language.is_default) {
                    tagIds = Array.isArray(this.tag_ids) ? this.tag_ids : (this.tag_ids ? String(this.tag_ids).split(',').map(t => t.trim()).filter(t => t) : []);
                } else {
                    const langTagIds = this.tagIdsByLanguage[language.id];
                    if (langTagIds) {
                        tagIds = Array.isArray(langTagIds) ? langTagIds : (String(langTagIds).split(',').map(t => t.trim()).filter(t => t));
                    }
                }

                // Convert tag IDs to tag names (only if we have tag IDs)
                // If tagIds is empty but translation.tags already has a value, use that (it was already converted by handleTagChange)
                if (tagIds.length > 0) {
                    const tagNames = tagIds.map(tagId => {
                        // If it's a number, find the tag name from tags array
                        if (typeof tagId === 'number' || (typeof tagId === 'string' && !isNaN(tagId))) {
                            const tag = this.tags.find(t => t.id == tagId);
                            return tag ? tag.name : tagId;
                        }
                        // If it's already a string (new tag), use it as is
                        return tagId;
                    });
                    tagsValue = tagNames.join(',');
                } else if (!tagsValue && translation.tags) {
                    // If no tagIds but translation.tags exists, use it (already converted)
                    tagsValue = translation.tags;
                }

                // For default language, use manufacturer from main field
                if (language.is_default) {
                    translation.manufacturer = this.manufacturer || '';
                }
                allTranslations.push({
                    language_id: language.id,
                    name: translation.name || '',
                    tags: tagsValue,
                    manufacturer: translation.manufacturer || '',
                    description: translation.description || '',
                    meta_title: translation.meta_title || '',
                    meta_keywords: translation.meta_keywords || '',
                    schema_markup: translation.schema_markup || '',
                    meta_description: translation.meta_description || '',
                });
            });
            formData.append('translations', JSON.stringify(allTranslations));

            let url = this.$apiUrl + '/products/save';
            if (this.clone) {

                url = this.$apiUrl + '/products/save';
            } else if (this.id) {
                url = this.$apiUrl + '/products/update';
            }

            axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                let data = res.data;

                if (data.status === 1) {
                    this.skipCache = true;
                    localStorage.removeItem('product_form_cache');
                    this.showMessage("success", data.message);
                    setTimeout(
                        function () {
                            vm.$swal.close();
                            vm.isLoading = false;
                            if (vm.loggedUser?.role?.name === "Seller") {
                                vm.$router.push({ path: '/seller/manage_products' });
                            } else {
                                vm.$router.push({ path: '/manage_products' });
                            }



                        }, 2000);
                } else {
                    vm.showError(data.message);
                    vm.isLoading = false;
                }
            }).catch(error => {
                vm.isLoading = false;
                this.showError("Something went wrong!");
            });
        },
        deleteImage(index, id, productImage, key = "") {
            this.$swal.fire({
                title: "Are you Sure?",
                text: "You want be able to revert this",
                confirmButtonText: "Yes, Sure",
                cancelButtonText: "Cancel",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#37a279',
                cancelButtonColor: '#d33',
            }).then(result => {
                if (result.value) {
                    this.deleteImageIds.push(id);
                    if (productImage) {
                        this.other_images.splice(index, 1);
                    } else {
                        if (this.type === 'packet') {
                            this.inputs[key].images.splice(index, 1);
                        } else {
                            this.inputs[key].loose_images.splice(index, 1);
                        }
                    }
                }
            });
        },
        changeUnits: function () {
        },

        saveCache: function () {
            if (this.id || this.clone || this.skipCache) return;
            try {
                const data = {
                    name: this.name, slug: this.slug, seller_id: this.seller_id, tag_ids: this.tag_ids,
                    tax_id: this.tax_id, brand: this.brand ? { id: this.brand.id } : null,
                    description: this.description, type: this.type, is_unlimited_stock: this.is_unlimited_stock,
                    fssai_lic_no: this.fssai_lic_no, barcode: this.barcode, meta_title: this.meta_title,
                    meta_keywords: this.meta_keywords, schema_markup: this.schema_markup,
                    meta_description: this.meta_description, category_id: this.category_id,
                    product_type: this.product_type, manufacturer: this.manufacturer,
                    made_in: this.made_in ? { id: this.made_in.id } : null, return_status: this.return_status,
                    return_days: (parseInt(this.return_days, 10) > 0) ? this.return_days : 1,
                    cancelable_status: this.cancelable_status,
                    till_status: this.till_status, cod_allowed_status: this.cod_allowed_status,
                    max_allowed_quantity: this.max_allowed_quantity, is_approved: this.is_approved,
                    tax_included_in_price: this.tax_included_in_price, status: this.status,
                    loose_stock: this.loose_stock, loose_stock_unit_id: this.loose_stock_unit_id,
                    inputs: JSON.parse(JSON.stringify(this.inputs)), useCustomPrompt: this.useCustomPrompt,
                    customPrompt: this.customPrompt,
                    tagIdsByLanguage: JSON.parse(JSON.stringify(this.tagIdsByLanguage)),
                    translations: JSON.parse(JSON.stringify(this.translations)),
                    timestamp: Date.now()
                };
                localStorage.setItem('product_form_cache', JSON.stringify(data));
            } catch (e) { }
        },

        restoreCache: function () {
            try {
                const cached = localStorage.getItem('product_form_cache');
                if (!cached) return;
                const data = JSON.parse(cached);
                if (data.timestamp && Date.now() - data.timestamp > 120000) {
                    localStorage.removeItem('product_form_cache');
                    return;
                }
                this.cachedData = data;
                Object.keys(data).forEach(key => {
                    if (key === 'timestamp' || key === 'brand' || key === 'made_in' || key === 'translations' || key === 'tagIdsByLanguage') return;
                    if (this.hasOwnProperty(key)) this[key] = data[key] !== undefined ? data[key] : this[key];
                });

                // Restore per-language translation data.
                // At this point initializeTranslations() has already run (it's called inside
                // fetchActiveLanguages before restoreCache), so this.translations already has
                // valid language-keyed slots we can safely overwrite.
                if (data.translations && this.languages && this.languages.length > 0) {
                    this.languages.forEach(language => {
                        if (data.translations[language.id]) {
                            this.$set(this.translations, language.id, {
                                ...this.translations[language.id],
                                ...data.translations[language.id]
                            });
                        }
                    });
                }
                // Restore per-language tag ID selections.
                if (data.tagIdsByLanguage && this.languages && this.languages.length > 0) {
                    Object.keys(data.tagIdsByLanguage).forEach(languageId => {
                        this.$set(this.tagIdsByLanguage, languageId, data.tagIdsByLanguage[languageId]);
                    });
                }

                if (data.brand && this.brands && this.brands.length) {
                    const foundBrand = this.brands.find(b => b.id === data.brand.id) || null;
                    // Update brand with translated name
                    this.$nextTick(() => {
                        if (foundBrand && this.translatedBrands && this.translatedBrands.length > 0) {
                            const translatedBrand = this.translatedBrands.find(b => b.id === foundBrand.id);
                            if (translatedBrand) {
                                this.brand = { ...foundBrand, name: translatedBrand.name, title: translatedBrand.title };
                            } else {
                                this.brand = foundBrand;
                            }
                        } else {
                            this.brand = foundBrand;
                        }
                    });
                }
                if (data.made_in && this.countries && this.countries.length) {
                    this.made_in = this.countries.find(c => c.id === data.made_in.id) || null;
                }
                if (this.seller_id) {
                    this.$nextTick(() => { this.getSellerCategories(); this.getSeller(); });
                }
            } catch (e) {
                localStorage.removeItem('product_form_cache');
            }
        },

        clearForm: function () {
            if (this.$refs['my-form']) this.$refs['my-form'].reset();
            Object.assign(this, {
                name: '', slug: '', seller_id: 0, tag_ids: '', tax_id: 0, brand: null,
                description: '', type: 'packet', is_unlimited_stock: 0, fssai_lic_no: '',
                barcode: '', meta_title: '', meta_keywords: '', schema_markup: '',
                meta_description: '', category_id: '', product_type: '', manufacturer: '',
                made_in: null, return_status: 0, return_days: 1, cancelable_status: 0,
                categoryOptions: '<option value="">' + __('select_category') + '</option>',
                till_status: '', cod_allowed_status: 0, max_allowed_quantity: 0,
                is_approved: 1, tax_included_in_price: 0, status: 1, loose_stock: 0,
                loose_stock_unit_id: '', inputs: [{ 'name': '', 'packet_status': '', 'packet_stock_unit_id': '', 'packet_sku': '', 'packet_secondary_unit_id': '', 'packet_secondary_unit_value': '', 'loose_sku': '', 'loose_secondary_unit_id': '', 'loose_secondary_unit_value': '' }],
                image: null, main_image_path: '', main_image_name: '', other_images: null,
                images: [], variantImages: {}, deleteImageIds: [], useCustomPrompt: false, customPrompt: '',
                tagIdsByLanguage: {}, activeLanguageTab: 0
            });
            this.tag_ids = [];
            this.initializeTranslations();
            localStorage.removeItem('product_form_cache');
        },

        debouncedSave: function () {
            if (this.cacheTimer) clearTimeout(this.cacheTimer);
            this.cacheTimer = setTimeout(() => this.saveCache(), 500);
        }
    },
    watch: {
        // Watch currentLanguageId to update selected brand name when language changes
        currentLanguageId: function (newVal, oldVal) {
            if (newVal && this.brand && this.translatedBrands && this.translatedBrands.length > 0) {
                // Find the translated brand from translatedBrands
                const translatedBrand = this.translatedBrands.find(b => b.id === this.brand.id);
                if (translatedBrand) {
                    // Update the brand object with translated name
                    this.brand = { ...this.brand, name: translatedBrand.name, title: translatedBrand.title };
                }
            }
        },
        // Watch translatedBrands to update selected brand when brands are loaded or language changes
        translatedBrands: {
            handler: function (newVal) {
                if (newVal && newVal.length > 0 && this.brand && this.brand.id) {
                    // Find the translated brand from translatedBrands
                    const translatedBrand = newVal.find(b => b.id === this.brand.id);
                    if (translatedBrand) {
                        // Update the brand object with translated name
                        this.brand = { ...this.brand, name: translatedBrand.name, title: translatedBrand.title };
                    }
                }
            },
            deep: true
        },
        // Watch activeLanguageTab to ensure Select2 updates when switching tabs
        activeLanguageTab: function (newTab, oldTab) {
            // Force Select2 to update when switching language tabs
            this.$nextTick(() => {
                // Trigger conversion again to ensure tagIdsByLanguage is set
                if (this.tags && this.tags.length > 0 && this.languages.length > 0) {
                    this.convertTagNamesToIds();
                }
            });
        },
        // Auto-save form data to cache (debounced)
        name: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        slug: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        seller_id: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        tag_ids: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        tax_id: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        brand: { handler: function () { if (!this.id && !this.clone) this.debouncedSave(); }, deep: true },
        description: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        type: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        is_unlimited_stock: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        fssai_lic_no: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        barcode: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        meta_title: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        meta_keywords: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        schema_markup: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        meta_description: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        category_id: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        product_type: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        manufacturer: function () {
            // Sync manufacturer to default language translation
            if (this.defaultLanguageId && this.translations[this.defaultLanguageId]) {
                this.translations[this.defaultLanguageId].manufacturer = this.manufacturer;
            }
            if (!this.id && !this.clone) this.debouncedSave();
        },
        made_in: { handler: function () { if (!this.id && !this.clone) this.debouncedSave(); }, deep: true },
        return_status: function () {
            // When user turns off returnable, default return_days to 1 if empty/0
            if (Number(this.return_status) === 0 && (parseInt(this.return_days, 10) || 0) <= 0) {
                this.return_days = 1;
            }
            if (!this.id && !this.clone) this.debouncedSave();
        },
        return_days: function () {
            // When days cleared or set to 0 (e.g. returnable off), keep default 1 in memory for next save
            if ((this.return_days === '' || this.return_days === null || parseInt(this.return_days, 10) <= 0) && Number(this.return_status) === 0) {
                this.return_days = 1;
            }
            if (!this.id && !this.clone) this.debouncedSave();
        },
        cancelable_status: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        till_status: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        cod_allowed_status: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        max_allowed_quantity: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        is_approved: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        tax_included_in_price: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        status: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        loose_stock: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        loose_stock_unit_id: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        inputs: { handler: function () { if (!this.id && !this.clone) this.debouncedSave(); }, deep: true },
        useCustomPrompt: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        customPrompt: function () { if (!this.id && !this.clone) this.debouncedSave(); },
        translations: { handler: function () { if (!this.id && !this.clone) this.debouncedSave(); }, deep: true }
        ,
        tagIdsByLanguage: { handler: function () { if (!this.id && !this.clone) this.debouncedSave(); }, deep: true }
    },

};
</script>
<style scoped>
@import "../../../../node_modules/vue-multiselect/dist/vue-multiselect.min.css";

/* AI Generate Button Styles */
.ai-generate-btn {
    position: relative;
    min-width: 200px;
    transition: all 0.3s ease;
}

.ai-generate-btn:disabled {
    opacity: 0.9;
    cursor: not-allowed;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
    color: white;
}

/* AI Spinner Animation */
.ai-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: ai-spin 0.8s ease-in-out infinite;
}

@keyframes ai-spin {
    to {
        transform: rotate(360deg);
    }
}

/* AI Text Animation - Pulsing effect */
.ai-text-animate {
    animation: ai-pulse 1.5s ease-in-out infinite;
}

@keyframes ai-pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.6;
    }
}
</style>
