<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ id ? __('edit_retailer') : __('add_retailer') }}</h3>
            <router-link to="/users" class="btn btn-outline-secondary d-inline-flex align-items-center gap-2 text-nowrap">
                <i class="fa fa-arrow-left" aria-hidden="true"></i>
                <span>{{ __('retailers') }}</span>
            </router-link>
        </div>

        <div class="card">
            <form ref="my-form" @submit.prevent="saveRecord">
                <div class="card-body">

                    <h5 class="mb-3">{{ __('retailer_details') }}</h5>
                    <div class="row">
                        <div class="form-group col-md-6">
                            <label for="shop_name">{{ __('shop_name') }} <span class="text-danger text-sm">*</span></label>
                            <input type="text" class="form-control" id="shop_name" v-model="record.shop_name"
                                :placeholder="__('shop_name')" maxlength="160" required>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="party_name">{{ __('party_name') }} <span class="text-danger text-sm">*</span></label>
                            <input type="text" class="form-control" id="party_name" v-model="record.party_name"
                                :placeholder="__('party_name')" maxlength="160" required>
                            <small class="text-muted">{{ __('party_name_hint') }}</small>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="mobile">{{ __('mobile') }} <span class="text-danger text-sm">*</span></label>
                            <div class="input-group">
                                <select class="form-control form-select" style="max-width: 170px;"
                                    v-model="record.country_code">
                                    <option v-for="c in countries" :key="c.id" :value="c.dial_code">{{ c.dial_code }} {{ c.name }}</option>
                                </select>
                                <input type="number" class="form-control" id="mobile" v-model="record.mobile"
                                    :placeholder="__('enter_mobile')" required>
                            </div>
                            <small class="text-muted" v-if="id">{{ __('retailer_mobile_change_hint') }}</small>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="gst_no">{{ __('gst_no') }}</label>
                            <input type="text" class="form-control" id="gst_no" v-model="record.gst_no"
                                :placeholder="__('gst_no')" maxlength="32">
                        </div>
                    </div>

                    <hr>
                    <h5 class="mb-3">{{ __('address_and_location') }}</h5>
                    <div class="row">
                        <div class="form-group col-md-12">
                            <label for="shop_location_search">{{ __('search_location') }}</label>
                            <GmapAutocomplete type="search" class="form-control" id="shop_location_search"
                                :placeholder="__('search_your_location_on_map')" @place_changed="setPlace"
                                :options="{ fields: ['address_components', 'formatted_address', 'geometry', 'name'], strictBounds: false }">
                            </GmapAutocomplete>
                            <small class="text-muted">{{ __('retailer_location_hint') }}</small>
                        </div>

                        <div class="form-group col-md-12">
                            <GmapMap :center="mapCenter" :zoom="mapZoom" map-type-id="roadmap"
                                style="width: 100%; height: 300px;" @click="onMapClick">
                                <GmapMarker v-if="hasLocation" :position="markerPosition" :draggable="true"
                                    @dragend="onMarkerDragEnd" />
                            </GmapMap>
                        </div>

                        <div class="form-group col-md-6">
                            <label for="gps_lat">{{ __('latitude') }} <span class="text-danger text-sm">*</span></label>
                            <input type="number" step="any" class="form-control" id="gps_lat" v-model="record.gps_lat"
                                :placeholder="__('latitude')" required>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="gps_lng">{{ __('longitude') }} <span class="text-danger text-sm">*</span></label>
                            <input type="number" step="any" class="form-control" id="gps_lng" v-model="record.gps_lng"
                                :placeholder="__('longitude')" required>
                        </div>

                        <div class="form-group col-md-6">
                            <label for="address_line1">{{ __('address_line_1') }} <span class="text-danger text-sm">*</span></label>
                            <input type="text" class="form-control" id="address_line1" v-model="record.address_line1"
                                :placeholder="__('address_line_1')" maxlength="255" required>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="address_line2">{{ __('address_line_2') }}</label>
                            <input type="text" class="form-control" id="address_line2" v-model="record.address_line2"
                                :placeholder="__('address_line_2')" maxlength="255">
                        </div>
                        <div class="form-group col-md-4">
                            <label for="retailer_city">{{ __('retailer_city') }}</label>
                            <input type="text" class="form-control" id="retailer_city" v-model="record.city"
                                :placeholder="__('retailer_city')" maxlength="191">
                        </div>
                        <div class="form-group col-md-4">
                            <label for="retailer_state">{{ __('state') }}</label>
                            <input type="text" class="form-control" id="retailer_state" v-model="record.state"
                                :placeholder="__('state')" maxlength="191">
                        </div>
                        <div class="form-group col-md-4">
                            <label>{{ __('area') }} <span class="text-danger text-sm" v-if="hasAreas">*</span></label>
                            <multiselect v-model="record.area" :options="areaOptions" label="label" track-by="id"
                                :searchable="true" :internal-search="false" :loading="areaLoading"
                                :allow-empty="true" :placeholder="__('search_area_or_pincode')"
                                @search-change="searchAreas">
                                <template slot="noResult">{{ __('area_picker_no_matches') }}</template>
                                <template slot="noOptions">{{ __('area_picker_no_areas') }}</template>
                            </multiselect>
                            <small class="text-muted">{{ __('retailer_area_hint') }}</small>
                        </div>
                    </div>

                    <hr>
                    <h5 class="mb-3">{{ __('verification') }}</h5>
                    <template v-if="!id">
                        <div class="form-check form-switch verify-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="is_verified"
                                v-model="record.is_verified" :disabled="!$can('customer_verify')">
                            <label class="form-check-label" for="is_verified">
                                {{ __('mark_as_verified_ready_to_order') }}
                            </label>
                        </div>
                        <small class="text-muted d-block mt-2">
                            {{ record.is_verified ? __('retailer_verified_on_create_hint') : __('retailer_pending_on_create_hint') }}
                        </small>
                    </template>
                    <template v-else>
                        <span v-if="isVerified" class="badge bg-success">{{ __('verified') }}</span>
                        <span v-else class="badge bg-warning text-dark">{{ __('pending') }}</span>
                        <small class="text-muted d-block mt-2">{{ __('retailer_verify_from_list_hint') }}</small>
                    </template>
                </div>

                <div class="card-footer text-end">
                    <b-button type="submit" variant="primary" :disabled="isLoading">
                        {{ __('save') }}
                        <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
                    </b-button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import Multiselect from 'vue-multiselect';

export default {
    components: { Multiselect },
    data: function () {
        return {
            id: this.$route.params.id,
            isLoading: false,
            countries: [],
            areaOptions: [],
            areaLoading: false,
            areaTimer: null,
            hasAreas: false,
            verificationStatus: null,
            mapCenter: { lat: 22.5, lng: 79 },
            mapZoom: 5,
            record: {
                shop_name: '',
                party_name: '',
                country_code: '+91',
                mobile: '',
                gst_no: '',
                gps_lat: null,
                gps_lng: null,
                address_line1: '',
                address_line2: '',
                city: '',
                state: '',
                area: null,
                // The usual reason to add a retailer here is a shop that already trades offline.
                is_verified: true,
            },
        }
    },
    computed: {
        hasLocation() {
            return this.isCoordinate(this.record.gps_lat) && this.isCoordinate(this.record.gps_lng);
        },
        markerPosition() {
            return { lat: parseFloat(this.record.gps_lat), lng: parseFloat(this.record.gps_lng) };
        },
        isVerified() {
            return ['approved', 'active'].includes(this.verificationStatus);
        },
    },
    watch: {
        // Typing coordinates by hand also moves the pin.
        markerPosition(position) {
            if (this.hasLocation) {
                this.mapCenter = position;
            }
        },
    },
    created: function () {
        if (!this.$can('customer_verify')) {
            this.record.is_verified = false;
        }
        this.getCountries();
        this.fetchAreas('');
        if (this.id) {
            this.getRecord();
        }
    },
    methods: {
        isCoordinate(value) {
            return value !== null && value !== '' && !isNaN(parseFloat(value));
        },
        getCountries() {
            // /countries returns only 5 rows unless a limit is given.
            axios.get(this.$apiUrl + '/countries', { params: { limit: 250 } })
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
        toAreaOption(area) {
            return { id: area.id, label: area.pincode ? `${area.name} (${area.pincode})` : area.name };
        },
        searchAreas(query) {
            clearTimeout(this.areaTimer);
            this.areaTimer = setTimeout(() => this.fetchAreas(query), 300);
        },
        fetchAreas(query) {
            this.areaLoading = true;
            axios.get(this.$apiUrl + '/areas', { params: { search: query || '', limit: 30 } })
                .then((response) => {
                    const list = ((response.data.data || {}).areas || [])
                        .filter(a => a.status == 1)
                        .map(this.toAreaOption);
                    if (!query && list.length) {
                        this.hasAreas = true;
                    }
                    // Keep the chosen area in the list even when the search no longer matches it.
                    if (this.record.area && !list.some(a => a.id === this.record.area.id)) {
                        list.unshift(this.record.area);
                    }
                    this.areaOptions = list;
                })
                .catch(() => {
                    this.areaOptions = this.record.area ? [this.record.area] : [];
                })
                .finally(() => {
                    this.areaLoading = false;
                });
        },
        getRecord() {
            this.isLoading = true;
            axios.get(this.$apiUrl + '/customers/edit/' + this.id)
                .then((response) => {
                    this.isLoading = false;
                    if (response.data.status !== 1) {
                        this.showError(response.data.message);
                        this.$router.push({ path: '/users' });
                        return;
                    }
                    const user = response.data.data;
                    const profile = user.retailer_profile || {};
                    this.verificationStatus = user.verification_status;
                    this.record = {
                        shop_name: profile.shop_name || '',
                        party_name: profile.party_name || user.name || '',
                        country_code: user.country_code || '+91',
                        mobile: user.mobile || '',
                        gst_no: profile.gst_no || '',
                        gps_lat: profile.gps_lat,
                        gps_lng: profile.gps_lng,
                        address_line1: profile.address_line1 || profile.address || '',
                        address_line2: profile.address_line2 || '',
                        city: profile.city || '',
                        state: profile.state || '',
                        area: profile.area_id
                            ? this.toAreaOption({ id: profile.area_id, name: profile.area_name || '#' + profile.area_id, pincode: profile.area_pincode })
                            : null,
                        is_verified: this.isVerified,
                    };
                    if (this.record.area) {
                        this.areaOptions = [this.record.area, ...this.areaOptions.filter(a => a.id !== this.record.area.id)];
                    }
                    if (this.hasLocation) {
                        this.mapCenter = this.markerPosition;
                        this.mapZoom = 16;
                    }
                })
                .catch((error) => {
                    this.isLoading = false;
                    this.showError(error.request?.statusText || error.message || __('something_went_wrong'));
                });
        },
        setLocation(lat, lng) {
            this.record.gps_lat = Number(lat.toFixed(7));
            this.record.gps_lng = Number(lng.toFixed(7));
            this.mapCenter = { lat: this.record.gps_lat, lng: this.record.gps_lng };
            this.mapZoom = 16;
        },
        setPlace(place) {
            if (!place || !place.geometry) return;
            this.setLocation(place.geometry.location.lat(), place.geometry.location.lng());

            const components = place.address_components || [];
            const pick = (type) => (components.find(c => c.types.includes(type)) || {}).long_name || '';
            const city = pick('locality') || pick('administrative_area_level_2');
            const state = pick('administrative_area_level_1');
            if (city) this.record.city = city;
            if (state) this.record.state = state;
            if (!this.record.address_line1) {
                this.record.address_line1 = place.formatted_address || place.name || '';
            }
        },
        onMapClick(event) {
            this.setLocation(event.latLng.lat(), event.latLng.lng());
        },
        onMarkerDragEnd(event) {
            this.setLocation(event.latLng.lat(), event.latLng.lng());
        },
        saveRecord() {
            if (!this.hasLocation) {
                this.showError(__('retailer_location_required'));
                return;
            }
            if (this.hasAreas && !this.record.area) {
                this.showError(__('retailer_area_required'));
                return;
            }

            this.isLoading = true;
            const payload = {
                shop_name: this.record.shop_name,
                party_name: this.record.party_name,
                country_code: this.record.country_code,
                mobile: this.record.mobile,
                gst_no: this.record.gst_no,
                gps_lat: this.record.gps_lat,
                gps_lng: this.record.gps_lng,
                address_line1: this.record.address_line1,
                address_line2: this.record.address_line2,
                city: this.record.city,
                state: this.record.state,
                area_id: this.record.area ? this.record.area.id : null,
            };
            if (this.id) {
                payload.id = this.id;
            } else {
                payload.is_verified = this.record.is_verified ? 1 : 0;
            }

            axios.post(this.$apiUrl + '/customers/' + (this.id ? 'update' : 'save'), payload)
                .then((response) => {
                    if (response.data.status === 1) {
                        this.showMessage("success", response.data.message);
                        setTimeout(() => {
                            this.$router.push({ path: '/users' });
                        }, 1000);
                    } else {
                        this.showError(response.data.message);
                        this.isLoading = false;
                    }
                })
                .catch((error) => {
                    this.isLoading = false;
                    this.showError(error.request?.statusText || error.message || __('something_went_wrong'));
                });
        },
    },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.verify-switch {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-left: 0;
}
.verify-switch .form-check-input {
    float: none;
    flex: 0 0 auto;
    margin: 0;
    width: 2.75em;
    height: 1.4em;
    cursor: pointer;
}
.verify-switch .form-check-label {
    margin: 0;
    font-weight: 600;
    cursor: pointer;
}
</style>
