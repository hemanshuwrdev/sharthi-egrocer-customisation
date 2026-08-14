<template>
    <div>
        <div class="page-heading">
            <div class="row">
                <div class="col-12 col-md-6 order-md-1 order-last">
                    <h3>{{ id ? __('edit_scheme') : __('add_scheme') }}</h3>
                </div>
                <div class="col-12 col-md-6 order-md-2 order-first">
                    <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><router-link to="/seller/dashboard">{{ __('dashboard') }}</router-link></li>
                            <li class="breadcrumb-item"><router-link to="/seller/schemes">{{ __('schemes') }}</router-link></li>
                            <li class="breadcrumb-item active" aria-current="page">{{ id ? __('edit') : __('add') }}</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-md-12 col-lg-12">
                <div class="card">
                    <div class="card-header">
                        <h4>{{ __('scheme_details') }}</h4>
                    </div>
                    <div class="card-body">
                        <form ref="my-form" @submit.prevent="saveRecord">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="name">{{ __('scheme_name') }}</label>
                                        <input type="text" v-model="record.name" class="form-control" id="name" :placeholder="__('enter_scheme_name')" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="type">{{ __('scheme_type') }}</label>
                                        <select class="form-control" v-model="record.type" required>
                                            <option value="buy_x_get_y">{{ __('buy_x_get_y') }}</option>
                                            <option value="group_discount_price">{{ __('group_discount_price') }}</option>
                                            <option value="group_discount_qty">{{ __('group_discount_qty') }}</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Buy X Get Y fields -->
                                <template v-if="record.type === 'buy_x_get_y'">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>{{ __('buy_product') }}</label>
                                            <multiselect v-model="record.buy_product" :options="availableProducts" placeholder="Select Product" label="name" track-by="id"></multiselect>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="buy_qty">{{ __('buy_quantity') }}</label>
                                            <input type="number" min="1" v-model="record.buy_qty" class="form-control" id="buy_qty" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>{{ __('free_product') }}</label>
                                            <multiselect v-model="record.free_product" :options="availableProducts" placeholder="Select Product" label="name" track-by="id"></multiselect>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="free_qty">{{ __('free_quantity') }}</label>
                                            <input type="number" min="1" v-model="record.free_qty" class="form-control" id="free_qty" required>
                                        </div>
                                    </div>
                                </template>

                                <!-- Group discount fields (shared for both group types) -->
                                <template v-else>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label>{{ __('group_products') }}</label>
                                            <multiselect v-model="record.products" :options="availableProducts" :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Select Products" label="name" track-by="id"></multiselect>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label>{{ __('discount_slabs') }}</label>
                                            <div class="row mb-2 align-items-end" v-for="(slab, index) in record.slabs" :key="index">
                                                <div class="col-md-4">
                                                    <label class="small">
                                                        <span v-if="record.type === 'group_discount_qty'">{{ __('minimum_units') }}</span>
                                                        <span v-else>{{ __('minimum_basket_value') }} (₹)</span>
                                                    </label>
                                                    <input type="number" step="1" min="1" v-model="slab.min_value" class="form-control" required>
                                                </div>
                                                <div class="col-md-3">
                                                    <label class="small">{{ __('discount_type') }}</label>
                                                    <select class="form-control" v-model="slab.discount_type" required>
                                                        <option value="percentage">{{ __('percentage') }}</option>
                                                        <option value="flat">{{ __('flat') }}</option>
                                                    </select>
                                                </div>
                                                <div class="col-md-3">
                                                    <label class="small">{{ __('discount_value') }}</label>
                                                    <input type="number" step="0.01" min="0.01"
                                                        :max="slab.discount_type === 'percentage' ? 100 : null"
                                                        v-model="slab.discount_value" class="form-control" required>
                                                    <small v-if="slab.discount_type === 'percentage' && slab.discount_value > 100" class="text-danger">
                                                        {{ __('percentage_discount_cannot_exceed_100') }}
                                                    </small>
                                                </div>
                                                <div class="col-md-2">
                                                    <button type="button" class="btn btn-danger btn-sm" @click="removeSlab(index)" :disabled="record.slabs.length === 1">
                                                        <i class="fa fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <button type="button" class="btn btn-secondary btn-sm" @click="addSlab">
                                                <i class="fa fa-plus"></i> {{ __('add_slab') }}
                                            </button>
                                        </div>
                                    </div>
                                </template>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="start_date">{{ __('start_date') }}</label>
                                        <input type="date" v-model="record.start_date" class="form-control" id="start_date" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="end_date">{{ __('end_date') }}</label>
                                        <input type="date" v-model="record.end_date" class="form-control" id="end_date" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="status">{{ __('status') }}</label>
                                        <div class="form-check form-switch mt-2">
                                            <input class="form-check-input" type="checkbox" role="switch" id="status" v-model="record.status" :true-value="1" :false-value="0">
                                            <label class="form-check-label ms-2" for="status">{{ record.status == 1 ? __('active') : __('deactive') }}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary" :disabled="isLoading">{{ __('save') }}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Multiselect from 'vue-multiselect';

export default {
    components: { Multiselect },
    data: function () {
        return {
            id: this.$route.params.id,
            record: {
                name: '',
                type: 'buy_x_get_y',
                buy_product: null,
                buy_qty: null,
                free_product: null,
                free_qty: null,
                products: [],
                slabs: [{ min_value: null, discount_type: 'percentage', discount_value: null }],
                start_date: '',
                end_date: '',
                status: 1
            },
            availableProducts: [],
            isLoading: false,
        }
    },
    created: async function () {
        await this.getProducts();
        if (this.id) {
            this.getRecord();
        }
    },
    methods: {
        getProducts() {
            return axios.get(this.$sellerApiUrl + '/schemes/products')
                .then(response => {
                    if (response.data.status === 1) {
                        this.availableProducts = response.data.data;
                    }
                }).catch(() => {
                    console.error("Error fetching products");
                });
        },
        getRecord() {
            this.isLoading = true;
            axios.get(this.$sellerApiUrl + '/schemes/edit/' + this.id)
                .then(response => {
                    this.isLoading = false;
                    let data = response.data;
                    if (data.status === 1) {
                        let r = data.data;
                        this.record.name = r.name;
                        this.record.type = r.type;
                        this.record.buy_qty = r.buy_qty;
                        this.record.free_qty = r.free_qty;
                        this.record.start_date = r.start_date ? r.start_date.substring(0, 10) : '';
                        this.record.end_date = r.end_date ? r.end_date.substring(0, 10) : '';
                        this.record.status = r.status;
                        this.record.buy_product = this.availableProducts.find(p => p.id == r.buy_seller_product_id) || null;
                        this.record.free_product = this.availableProducts.find(p => p.id == r.free_seller_product_id) || null;
                        this.record.products = this.availableProducts.filter(p => (r.product_ids || []).includes(p.id));
                        this.record.slabs = (r.slabs && r.slabs.length)
                            ? r.slabs
                            : [{ min_value: null, discount_type: 'percentage', discount_value: null }];
                    }
                }).catch(() => {
                    this.isLoading = false;
                    this.showError("Something went wrong");
                });
        },
        addSlab() {
            this.record.slabs.push({ min_value: null, discount_type: 'percentage', discount_value: null });
        },
        removeSlab(index) {
            this.record.slabs.splice(index, 1);
        },
        isGroupType() {
            return this.record.type === 'group_discount_price' || this.record.type === 'group_discount_qty';
        },
        saveRecord() {
            if (this.record.type === 'buy_x_get_y' && (!this.record.buy_product || !this.record.free_product)) {
                this.showError("Please select buy and free products.");
                return;
            }
            if (this.isGroupType() && this.record.products.length === 0) {
                this.showError("Please select at least one product.");
                return;
            }
            if (this.isGroupType()) {
                const invalidSlab = this.record.slabs.find(s => s.discount_type === 'percentage' && Number(s.discount_value) > 100);
                if (invalidSlab) {
                    this.showError(__('percentage_discount_cannot_exceed_100'));
                    return;
                }
            }
            this.isLoading = true;
            let url = this.$sellerApiUrl + '/schemes/' + (this.id ? 'update' : 'save');
            let formData = new FormData();
            if (this.id) {
                formData.append('id', this.id);
            }
            formData.append('name', this.record.name);
            formData.append('type', this.record.type);
            formData.append('start_date', this.record.start_date);
            formData.append('end_date', this.record.end_date);
            formData.append('status', this.record.status);
            if (this.record.type === 'buy_x_get_y') {
                formData.append('buy_seller_product_id', this.record.buy_product.id);
                formData.append('buy_qty', this.record.buy_qty);
                formData.append('free_seller_product_id', this.record.free_product.id);
                formData.append('free_qty', this.record.free_qty);
            } else if (this.isGroupType()) {
                this.record.products.forEach((p, index) => {
                    formData.append('product_ids[' + index + ']', p.id);
                });
                this.record.slabs.forEach((s, index) => {
                    formData.append('slabs[' + index + '][min_value]', s.min_value);
                    formData.append('slabs[' + index + '][discount_type]', s.discount_type);
                    formData.append('slabs[' + index + '][discount_value]', s.discount_value);
                });
            }

            axios.post(url, formData)
                .then(response => {
                    let data = response.data;
                    if (data.status === 1) {
                        this.showMessage("success", data.message);
                        setTimeout(() => {
                            this.$router.push({ path: '/seller/schemes' });
                        }, 1000);
                    } else {
                        this.showError(data.message);
                        this.isLoading = false;
                    }
                }).catch(error => {
                    this.isLoading = false;
                    if (error.request && error.request.statusText) {
                        this.showError(error.request.statusText);
                    } else if (error.message) {
                        this.showError(error.message);
                    } else {
                        this.showError("Something went wrong!");
                    }
                });
        }
    }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
