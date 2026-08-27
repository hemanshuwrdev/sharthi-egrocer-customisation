<template>
    <div>
        <div class="page-heading">
            <div class="row">
                <div class="col-12 col-md-6 order-md-1 order-last">
                    <h3>{{ __('manage_area') }}</h3>
                </div>
                <div class="col-12 col-md-6 order-md-2 order-first">
                    <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item">
                                <router-link to="/dashboard">{{ __('dashboard') }}</router-link>
                            </li>
                            <li class="breadcrumb-item active" aria-current="page">
                                <template v-if="area.id">{{ __('edit') }}</template>
                                <template v-else>{{ __('create') }}</template>
                                {{ __('area') }}
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-sm-12 order-md-1 order-last">
                    <div class="card h-100">
                        <div class="card-header">
                            <h4>
                                <template v-if="area.id">{{ __('edit') }}</template>
                                <template v-else>{{ __('create') }}</template>
                                {{ __('area') }}
                            </h4>
                        </div>
                        <div class="card-body">
                            <form ref="my-form" @submit.prevent="saveRecord" novalidate>
                                <div class="form-group">
                                    <label for="city_id">{{ __('zone') }}<span class="text-danger text-sm">*</span></label>
                                    <select class="form-control form-select" name="city_id" id="city_id"
                                        v-model="area.city_id" required>
                                        <option value="">{{ __('select_zone') }}</option>
                                        <option v-for="city in cities" :key="city.id" :value="city.id">{{ city.zone }}</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="name">{{ __('area_name') }}<span class="text-danger text-sm">*</span></label>
                                    <input type="text" class="form-control" name="name" id="name"
                                        v-model="area.name" :placeholder="__('area_name')" required>
                                </div>

                                <div class="form-group">
                                    <label for="pincode">{{ __('pincode') }}<span class="text-danger text-sm">*</span></label>
                                    <input type="text" class="form-control" name="pincode" id="pincode"
                                        v-model="area.pincode" :placeholder="__('pincode')" required>
                                </div>

                                <div class="form-group">
                                    <label for="state">{{ __('state_name') }}</label>
                                    <input type="text" class="form-control" name="state" id="state"
                                        v-model="area.state" :placeholder="__('state_name')">
                                </div>

                                <div class="form-group">
                                    <label for="district">{{ __('district') }}</label>
                                    <input type="text" class="form-control" name="district" id="district"
                                        v-model="area.district" :placeholder="__('district')">
                                </div>

                                <div class="form-group">
                                    <label for="status">{{ __('status') }}</label>
                                    <select class="form-control form-select" name="status" id="status" v-model="area.status">
                                        <option :value="1">{{ __('active') }}</option>
                                        <option :value="0">{{ __('inactive') }}</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <button type="submit" class="btn btn-primary">{{ __('save') }}</button>
                                    <button type="reset" class="btn btn-secondary">{{ __('clear') }}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";

export default {
    data: function () {
        return {
            area: {
                id: "",
                city_id: "",
                name: "",
                pincode: "",
                state: "",
                district: "",
                status: 1,
            },
            cities: [],
            isLoading: false,
        }
    },
    created: function () {
        this.area.id = this.$route.params.id;
        this.$apiUrl = '/api';

        this.fetchCities();

        if (this.area.id) {
            this.loadArea();
        }
    },
    methods: {
        fetchCities() {
            return axios.get(this.$apiUrl + '/cities')
                .then(response => {
                    this.cities = response.data.data?.cities || [];
                }).catch(() => {
                    this.cities = [];
                });
        },

        loadArea() {
            return axios.get(this.$apiUrl + '/areas/edit/' + this.area.id)
                .then(response => {
                    const area = response.data.data;

                    if (!area) {
                        this.showError("Area not found");
                        return;
                    }

                    Object.keys(this.area).forEach(key => {
                        if (area[key] !== undefined && area[key] !== null) {
                            this.area[key] = area[key];
                        }
                    });
                })
                .catch(() => {
                    this.showError("Failed to load area");
                });
        },

        async saveRecord() {
            if (!this.area.city_id || !this.area.name || !this.area.pincode) {
                this.showError(__('please_fill_all_required_fields'));
                return;
            }

            this.isLoading = true;

            let formData = new FormData();
            if (this.area.id) {
                formData.append("id", this.area.id);
            }
            formData.append("city_id", this.area.city_id);
            formData.append("name", this.area.name);
            formData.append("pincode", this.area.pincode);
            formData.append("state", this.area.state ?? '');
            formData.append("district", this.area.district ?? '');
            formData.append("status", this.area.status);

            try {
                await axios.post(this.$apiUrl + '/areas/save', formData);

                this.showMessage("success", __('area_saved_successfully'));

                setTimeout(() => {
                    this.$router.push({ path: '/areas' });
                }, 1500);
            } catch (error) {
                if (error.response?.data?.message) {
                    this.showError(error.response.data.message);
                } else {
                    this.showError("Something went wrong!");
                }
            } finally {
                this.isLoading = false;
            }
        }
    }
};
</script>
