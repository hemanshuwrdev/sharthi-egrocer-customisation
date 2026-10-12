<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ id ? __('edit_salesman') : __('add_salesman') }}</h3>
            <div class="page-head-actions">
                <router-link to="/seller/salesman" class="ui-backbtn">
                    <i class="fa fa-arrow-left" aria-hidden="true"></i> {{ __('salesman') }}
                </router-link>
            </div>
        </div>

        <form ref="my-form" class="ui-card" @submit.prevent="saveRecord">
            <div class="ui-card__body">

                <section class="ui-section">
                    <h3 class="ui-section__title"><i class="fa fa-user"></i> {{ __('salesman_details') }}</h3>
                    <div class="ui-grid">
                        <div class="ui-field">
                            <label class="ui-label" for="name">{{ __('salesman_name') }}<span class="ui-req">*</span></label>
                            <input type="text" v-model="record.name" class="ui-control" id="name" :placeholder="__('enter_salesman_name')" required>
                        </div>

                        <div class="ui-field">
                            <label class="ui-label" for="mobile">{{ __('mobile') }}<span class="ui-req">*</span></label>
                            <div class="ui-phone">
                                <div class="ui-phone__code" ref="countryDropdown">
                                    <button type="button" class="ui-phone__toggle" @click="countryDropdownOpen = !countryDropdownOpen">
                                        <span>{{ record.country_code }}</span>
                                        <span class="ui-phone__caret"></span>
                                    </button>
                                    <ul v-if="countryDropdownOpen" class="ui-phone__menu">
                                        <li v-for="c in countries" :key="c.id" @click="record.country_code = c.dial_code; countryDropdownOpen = false">
                                            {{ c.dial_code }}
                                        </li>
                                    </ul>
                                </div>
                                <input type="number" v-model="record.mobile" class="ui-phone__input" id="mobile" :placeholder="__('enter_mobile')" required>
                            </div>
                        </div>

                        <div class="ui-field">
                            <label class="ui-label" for="email">{{ __('email') }}<span class="ui-req">*</span></label>
                            <input type="email" v-model="record.email" class="ui-control" id="email" :placeholder="__('enter_email')" required>
                        </div>

                        <div class="ui-field">
                            <label class="ui-label" for="password">
                                {{ __('password') }}<span class="ui-req" v-if="!id">*</span>
                                <span v-if="id" class="ui-hint">({{ __('leave_blank_to_keep_unchanged') }})</span>
                            </label>
                            <input type="password" v-model="record.password" class="ui-control" id="password" :placeholder="__('enter_password')" :required="!id" autocomplete="new-password">
                        </div>
                    </div>
                </section>

                <section class="ui-section">
                    <h3 class="ui-section__title"><i class="fa fa-tags"></i> {{ __('Brands & pricing') }}</h3>
                    <div class="ui-grid">
                        <div class="ui-field ui-span-all">
                            <label class="ui-label" for="brands">{{ __('assigned_brands') }}<span class="ui-req">*</span></label>
                            <multiselect
                                class="ui-multi"
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

                        <div class="ui-field">
                            <label class="ui-label" for="discount">{{ __('discount') }} (%)</label>
                            <input type="number" step="0.01" v-model="record.discount" class="ui-control" id="discount" :placeholder="__('enter_discount')">
                        </div>

                        <div class="ui-field">
                            <label class="ui-label">{{ __('status') }}<span class="ui-req">*</span></label>
                            <b-form-radio-group v-model="record.status" :options="[
                                { text: __('active'), value: 1 },
                                { text: __('deactive'), value: 0 },
                            ]" buttons button-variant="outline-primary" class="ui-seg" required></b-form-radio-group>
                        </div>
                    </div>
                </section>

                <section class="ui-section">
                    <h3 class="ui-section__title"><i class="fa fa-user-shield"></i> {{ __('Permissions') }}</h3>
                    <div class="ui-grid">
                        <label class="ui-switch" :class="{ 'is-on': record.allow_price_edit }" for="allow_price_edit">
                            <input type="checkbox" v-model="record.allow_price_edit" id="allow_price_edit">
                            <span class="ui-switch__track"></span>
                            <span class="ui-switch__text">{{ __('allow_price_edit') }}</span>
                        </label>
                        <label class="ui-switch" :class="{ 'is-on': record.allow_payment_collection }" for="allow_payment_collection">
                            <input type="checkbox" v-model="record.allow_payment_collection" id="allow_payment_collection">
                            <span class="ui-switch__track"></span>
                            <span class="ui-switch__text">{{ __('allow_payment_collection') }}</span>
                        </label>
                    </div>
                </section>
            </div>

            <div class="ui-card__foot">
                <b-button type="submit" variant="primary" :disabled="isLoading">
                    {{ __('save') }}
                    <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
                </b-button>
            </div>
        </form>
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
                allow_price_edit: false,
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
            axios.get(this.$apiUrl + '/countries')
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
                        this.record.allow_price_edit = data.data.allow_price_edit == 1 ? true : false;
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
            formData.append('allow_price_edit', this.record.allow_price_edit ? 1 : 0);
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
/* All colours come from the --ui-* tokens that modern.css defines on .ui-modern (the seller layout). */
.ui-span-all { grid-column: 1 / -1; }
.ui-hint { margin-left: 4px; font-size: 12px; font-weight: 500; color: var(--ui-muted); text-decoration: none; border-bottom: 0; }

/* mobile number: country-code dropdown + number as one control */
.ui-phone {
    display: flex; align-items: stretch; flex-wrap: nowrap; height: 44px; border-radius: 12px; border: 1px solid var(--ui-border); background: var(--ui-soft);
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}
.ui-phone:focus-within { background: var(--ui-card); border-color: var(--ui-primary); box-shadow: 0 0 0 3px var(--ui-primary-soft); }
.ui-phone__code { position: relative; flex: 0 0 auto; width: 84px; border-right: 1px solid var(--ui-border); }
.ui-phone__toggle {
    width: 100%; height: 100%; display: flex; align-items: center; justify-content: space-between; gap: 4px; padding: 0 12px; border: 0;
    border-radius: 11px 0 0 11px; background: transparent; color: var(--ui-text); font-size: 14px; font-weight: 600; cursor: pointer;
}
.ui-phone__caret { width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid var(--ui-muted); }
.ui-phone__menu {
    position: absolute; top: 100%; left: 0; z-index: 1050; width: 130px; max-height: 220px; overflow-y: auto; margin: 6px 0 0; padding: 6px;
    list-style: none; background: var(--ui-card); border: 1px solid var(--ui-border); border-radius: 12px; box-shadow: 0 12px 32px rgba(15, 23, 42, 0.14);
}
.ui-phone__menu li { padding: 7px 10px; border-radius: 8px; font-size: 14px; color: var(--ui-text); cursor: pointer; }
.ui-phone__menu li:hover { background: var(--ui-soft); }
.ui-phone__input {
    flex: 1 1 auto; min-width: 0; height: 100%; padding: 0 14px; border: 0; border-radius: 0 11px 11px 0; background: transparent;
    color: var(--ui-text); font-size: 14px; outline: none; box-shadow: none;
}
.ui-phone__input::placeholder { color: var(--ui-muted); }

/* on / off switch rows */
.ui-switch {
    position: relative; display: flex; align-items: center; gap: 12px; margin: 0; padding: 12px 14px; border: 1px solid var(--ui-border); border-radius: 12px;
    background: var(--ui-soft); color: var(--ui-text); font-size: 14px; font-weight: 600; cursor: pointer; user-select: none;
    transition: border-color 0.15s ease, background-color 0.15s ease;
}
.ui-switch:hover { border-color: var(--ui-primary); }
.ui-switch input { position: absolute; opacity: 0; pointer-events: none; }
.ui-switch__track { position: relative; flex: 0 0 auto; width: 40px; height: 22px; border-radius: 999px; background: var(--ui-border); transition: background-color 0.15s ease; }
.ui-switch__track::after {
    content: ""; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.3); transition: transform 0.15s ease;
}
.ui-switch input:checked + .ui-switch__track { background: var(--ui-primary); }
.ui-switch input:checked + .ui-switch__track::after { transform: translateX(18px); }
.ui-switch input:focus-visible + .ui-switch__track { box-shadow: 0 0 0 3px var(--ui-primary-soft); }
.ui-switch.is-on { border-color: var(--ui-primary); background: var(--ui-primary-soft); }

/* vue-multiselect, dressed like .ui-control */
.ui-multi ::v-deep .multiselect__tags {
    min-height: 44px; padding: 7px 40px 0 10px; border: 1px solid var(--ui-border); border-radius: 12px; background: var(--ui-soft);
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}
.ui-multi.multiselect--active ::v-deep .multiselect__tags { background: var(--ui-card); border-color: var(--ui-primary); box-shadow: 0 0 0 3px var(--ui-primary-soft); }
.ui-multi ::v-deep .multiselect__placeholder { margin: 0 0 8px 4px; padding-top: 2px; font-size: 14px; color: var(--ui-muted); }
.ui-multi ::v-deep .multiselect__input,
.ui-multi ::v-deep .multiselect__single { background: transparent; color: var(--ui-text); font-size: 14px; }
.ui-multi ::v-deep .multiselect__tag { margin: 0 6px 7px 0; padding: 5px 26px 5px 10px; border-radius: 8px; background: var(--ui-primary-soft); color: var(--ui-primary); font-size: 13px; font-weight: 600; }
.ui-multi ::v-deep .multiselect__tag-icon:after { color: var(--ui-primary); }
.ui-multi ::v-deep .multiselect__tag-icon:hover { background: var(--ui-primary); }
.ui-multi ::v-deep .multiselect__tag-icon:hover:after { color: #fff; }
.ui-multi ::v-deep .multiselect__select { height: 42px; }
.ui-multi ::v-deep .multiselect__content-wrapper {
    margin-top: 6px; border: 1px solid var(--ui-border); border-radius: 12px; background: var(--ui-card); box-shadow: 0 12px 32px rgba(15, 23, 42, 0.14);
}
.ui-multi ::v-deep .multiselect__option { padding: 10px 14px; font-size: 14px; color: var(--ui-text); }
.ui-multi ::v-deep .multiselect__option--highlight { background: var(--ui-primary-soft); color: var(--ui-primary); }
.ui-multi ::v-deep .multiselect__option--selected { background: var(--ui-soft); color: var(--ui-text); font-weight: 700; }
.ui-multi ::v-deep .multiselect__option--selected.multiselect__option--highlight { background: var(--ui-red-bg); color: var(--ui-red-fg); }
</style>
