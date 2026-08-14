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
                                        <div class="input-group mobile-input-group">
                                            <div class="country-code-dropdown" ref="countryDropdown">
                                                <button type="button" class="country-code-toggle" @click="countryDropdownOpen = !countryDropdownOpen">
                                                    <span>{{ record.country_code }}</span>
                                                    <span class="country-code-caret"></span>
                                                </button>
                                                <ul v-if="countryDropdownOpen" class="country-code-menu">
                                                    <li v-for="c in countries" :key="c.id" @click="record.country_code = c.dial_code; countryDropdownOpen = false">
                                                        {{ c.dial_code }}
                                                    </li>
                                                </ul>
                                            </div>
                                            <input type="number" v-model="record.mobile" class="form-control" id="mobile" :placeholder="__('enter_mobile')" required>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="email">{{ __('email') }}</label>
                                        <input type="email" v-model="record.email" class="form-control" id="email" :placeholder="__('enter_email')" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="password">{{ __('password') }} <span v-if="id" class="text-muted small">({{ __('leave_blank_to_keep_unchanged') }})</span></label>
                                        <input type="password" v-model="record.password" class="form-control" id="password" :placeholder="__('enter_password')" :required="!id" autocomplete="new-password">
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
                country_code: '+91',
                email: '',
                password: '',
                brands: [],
                allow_payment_collection: false,
                discount: null,
                status: 1
            },
            availableBrands: [],
            isLoading: false,
            countries: [],
            countryDropdownOpen: false,
        }
    },
    created: async function () {
        await this.getBrands();
        this.getCountries();
        if (this.id) {
            this.getRecord();
        }
    },
    mounted() {
        document.addEventListener('click', this.handleCountryDropdownOutsideClick);
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleCountryDropdownOutsideClick);
    },
    methods: {
        handleCountryDropdownOutsideClick(event) {
            if (this.countryDropdownOpen && this.$refs.countryDropdown && !this.$refs.countryDropdown.contains(event.target)) {
                this.countryDropdownOpen = false;
            }
        },
        getCountries() {
            axios.get(this.$sellerApiUrl + '/countries')
                .then((response) => {
                    this.countries = response.data.data || [];
                    if (!this.countries.some(c => c.dial_code === this.record.country_code)) {
                        const india = this.countries.find(c => c.dial_code === '+91');
                        if (india) this.record.country_code = india.dial_code;
                    }
                })
                .catch(() => {
                    this.countries = [];
                });
        },
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
                        this.record.password = '';
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
            formData.append('country_code', this.record.country_code);
            formData.append('email', this.record.email);
            if (this.record.password) {
                formData.append('password', this.record.password);
            }
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
<style scoped>
.input-group.mobile-input-group {
    flex-wrap: nowrap;
    border: 1px solid #ced4da;
    border-radius: 0.375rem;
    background: #fff;
}
.mobile-input-group .country-code-dropdown {
    position: relative;
    flex: 0 0 auto;
    width: 72px;
    border-right: 1px solid #ced4da;
}
.mobile-input-group .country-code-toggle {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2px;
    padding: 0.375rem 0.5rem;
    border: none;
    background: transparent;
    cursor: pointer;
    border-top-left-radius: 0.375rem;
    border-bottom-left-radius: 0.375rem;
}
.mobile-input-group input.form-control {
    flex: 1 1 auto;
    min-width: 0;
    border: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
    box-shadow: none;
}
.mobile-input-group input.form-control:focus {
    box-shadow: none;
}
.country-code-caret {
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid #6c757d;
}
.country-code-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1050;
    width: 130px;
    max-height: 220px;
    overflow-y: auto;
    margin: 2px 0 0;
    padding: 4px 0;
    list-style: none;
    background: #fff;
    border: 1px solid #ced4da;
    border-radius: 4px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.country-code-menu li {
    padding: 6px 12px;
    cursor: pointer;
}
.country-code-menu li:hover {
    background: #f1f3f5;
}
</style>
