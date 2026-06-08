<template>
    <div>
        <div class="page-heading">
            <div class="row">
                <div class="col-12 col-md-6 order-md-1 order-last">
                    <h3>{{ id ? __('edit_salesman') : __('add_salesman') }}</h3>
                </div>
                <div class="col-12 col-md-6 order-md-2 order-first">
                    <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><router-link to="/seller/dashboard">{{ __('dashboard') }}</router-link></li>
                            <li class="breadcrumb-item"><router-link to="/seller/salesman">{{ __('salesman') }}</router-link></li>
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
                        <h4>{{ __('salesman_details') }}</h4>
                    </div>
                    <div class="card-body">
                        <form ref="my-form" @submit.prevent="saveRecord">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="name">{{ __('salesman_name') }}</label>
                                        <input type="text" v-model="record.name" class="form-control" id="name" :placeholder="__('enter_salesman_name')" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="mobile">{{ __('mobile') }}</label>
                                        <input type="number" v-model="record.mobile" class="form-control" id="mobile" :placeholder="__('enter_mobile')" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="brands">{{ __('assigned_brands') }}</label>
                                        <multiselect
                                            v-model="record.brands"
                                            :options="availableBrands"
                                            :multiple="true"
                                            :close-on-select="false"
                                            :clear-on-select="false"
                                            :preserve-search="true"
                                            placeholder="Select Brands"
                                            label="name"
                                            track-by="id"
                                            required>
                                        </multiselect>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="allow_payment_collection">{{ __('allow_payment_collection') }}</label><br>
                                        <input type="checkbox" v-model="record.allow_payment_collection" id="allow_payment_collection" class="form-check-input mt-2">
                                        <label for="allow_payment_collection" class="form-check-label mt-2 ml-2">{{ __('yes') }}</label>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="discount">{{ __('discount') }} (%)</label>
                                        <input type="number" step="0.01" v-model="record.discount" class="form-control" id="discount" :placeholder="__('enter_discount')">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="status">{{ __('status') }}</label>
                                        <select class="form-control" v-model="record.status" required>
                                            <option value="1">{{ __('active') }}</option>
                                            <option value="0">{{ __('deactive') }}</option>
                                        </select>
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
                mobile: '',
                brands: [],
                allow_payment_collection: false,
                discount: null,
                status: 1
            },
            availableBrands: [],
            isLoading: false,
        }
    },
    created: async function () {
        await this.getBrands();
        if (this.id) {
            this.getRecord();
        }
    },
    methods: {
        getBrands() {
            return axios.get(this.$sellerApiUrl + '/brands')
                .then(response => {
                    let data = response.data;
                    if (data.status === 1) {
                        this.availableBrands = data.data;
                    }
                }).catch(error => {
                    console.error("Error fetching brands");
                });
        },
        getRecord() {
            this.isLoading = true;
            axios.get(this.$sellerApiUrl + '/salesman/edit/' + this.id)
                .then(response => {
                    this.isLoading = false;
                    let data = response.data;
                    if (data.status === 1) {
                        this.record = data.data;
                        this.record.allow_payment_collection = data.data.allow_payment_collection == 1 ? true : false;
                        if (this.record.brands) {
                            let parsedBrands = typeof this.record.brands === 'string' ? JSON.parse(this.record.brands) : this.record.brands;
                            let brandIds = parsedBrands.map(b => b.toString());
                            this.record.brands = this.availableBrands.filter(b => brandIds.includes(b.id.toString()));
                        } else {
                            this.record.brands = [];
                        }
                    }
                }).catch(error => {
                    this.isLoading = false;
                    this.showError("Something went wrong");
                });
        },
        saveRecord() {
            if (this.record.brands.length === 0) {
                this.showError("Please assign at least one brand.");
                return;
            }
            this.isLoading = true;
            let url = this.$sellerApiUrl + '/salesman/' + (this.id ? 'update' : 'save');
            let formData = new FormData();
            if (this.id) {
                formData.append('id', this.id);
            }
            formData.append('name', this.record.name);
            formData.append('mobile', this.record.mobile);
            this.record.brands.forEach((brand, index) => {
                // If brand is an object from Multiselect, just pass its ID.
                formData.append('brands[' + index + ']', brand.id || brand);
            });
            formData.append('allow_payment_collection', this.record.allow_payment_collection ? 1 : 0);
            if (this.record.discount !== null && this.record.discount !== '') {
                formData.append('discount', this.record.discount);
            }
            formData.append('status', this.record.status);

            axios.post(url, formData)
                .then(response => {
                    let data = response.data;
                    if (data.status === 1) {
                        this.showMessage("success", data.message);
                        setTimeout(() => {
                            this.$router.push({path: '/seller/salesman'});
                        }, 1000);
                    } else {
                        this.showError(data.message);
                        this.isLoading = false;
                    }
                }).catch(error => {
                    this.isLoading = false;
                    if (error.request.statusText) {
                        this.showError(error.request.statusText);
                    }else if (error.message) {
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
