<template>
    <div>
        <div class="page-heading">
            <div class="row">
                <div class="col-12 col-md-6 order-md-1 order-last">
                    <h3>{{ __('manage_city') }}</h3>
                </div>
                <div class="col-12 col-md-6 order-md-2 order-first">
                    <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item">
                                <router-link to="/dashboard">{{ __('dashboard') }}</router-link>
                            </li>
                            <li class="breadcrumb-item active" aria-current="page">
                                <template v-if="city.id">
                                    {{ __('edit') }}
                                </template>
                                <template v-else>
                                    {{ __('create') }}
                                </template>
                                {{ __('city') }}
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
                                <template v-if="city.id">{{ __('edit') }}</template>
                                <template v-else>{{ __('create') }}</template>
                                {{ __('city') }}
                            </h4>
                        </div>
                        <div class="card-body">
                            <form ref="my-form" @submit.prevent="saveRecord" novalidate>
                                <b-tabs :key="renderKey" v-model="activeLanguageTab" content-class="mt-3"
                                    v-if="languages.length > 0">

                                    <b-tab v-for="language in languages" :key="language.id" :title="language.name">
                                        <template #title>
                                            <span :class="{ 'text-primary font-weight-bold': language.is_default }">
                                                {{ language.name }}
                                            </span>
                                        </template>

                                        <!-- Translate buttons (skip if no language.name) -->
                                        <div class="mb-3"
                                            v-if="language.is_default && languages.length > 1 && language.name">
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

                                        <div class="form-group" v-if="language.is_default">
                                            <label for="city_name"> {{ __('search_city') }}</label>
                                            <GmapAutocomplete type="search" class="form-control"
                                                :placeholder="__('search_city_on_map')" @place_changed="setPlace"
                                                :options="{ fields: ['address_components', 'formatted_address', 'geometry', 'name', 'place_id', 'plus_code', 'types'], strictBounds: false }"
                                                id="city_name">
                                            </GmapAutocomplete>
                                            <input type="hidden" v-model="city.formatted_address">
                                            <span class="text text-primary">{{
                                                __('search_your_city_where_you_will_deliver_the_food_and_to_find_co_ordinates')
                                                }}</span>
                                        </div>

                                        <div class="form-group" v-if="language.is_default">
                                            <label for="latitude">{{ __('latitude') }} <span
                                                    class="text-danger text-sm">*</span></label>
                                            <input type="text" class="form-control" name="latitude" id="latitude"
                                                v-model="city.latitude" :placeholder="__('latitude')" required readonly>
                                        </div>
                                        <div class="form-group" v-if="language.is_default">
                                            <label for="longitude"> {{ __('longitude') }}<span
                                                    class="text-danger text-sm">*</span></label>
                                            <input type="text" class="form-control" name="longitude" id="longitude"
                                                v-model="city.longitude" :placeholder="__('longitude')" required
                                                readonly>
                                        </div>

                                        <div class="form-group" v-if="language.is_default">
                                            <label for="name"> {{ __('city_name') }}<span
                                                    class="text-danger text-sm">*</span></label>
                                            <input type="text" class="form-control" name="name" id="name"
                                                v-model="city.name" :placeholder="__('city_name')" required readonly>
                                        </div>

                                        <div class="form-group" v-if="language.is_default">
                                            <label for="state"> {{ __('state_name') }}<span
                                                    class="text-danger text-sm">*</span></label>
                                            <input type="text" class="form-control" name="state" id="state"
                                                v-model="city.state" :placeholder="__('state_name')" required readonly>
                                        </div>

                                        <div class="form-group">
                                            <label :for="'zone_' + language.id"> {{ __('zone_name') }}<span
                                                    v-if="language.is_default"
                                                    class="text-danger text-sm">*</span></label>
                                            <input type="text" class="form-control" name="zone"
                                                :id="'zone_' + language.id" v-model="translations[language.id].zone"
                                                :required="language.is_default == 1 ? true : undefined"
                                                :placeholder="__('zone_name')">
                                        </div>

                                        <div class="form-group" v-if="language.is_default">

                                            <label for="time_to_travel">{{ __('time_to_travel_1km') }} <span
                                                    class="text-danger text-sm">*</span> <small>(
                                                    {{ __('enter_in_minutes') }})</small>
                                            </label>
                                            <input type="number" class="form-control" name="time_to_travel"
                                                id="time_to_travel" min="0" max="999999999"
                                                v-model="city.time_to_travel" :placeholder="__('enter_time_to_travel_1km_in_minutes')"
                                                required>
                                        </div>

                                        <div class="form-group" v-if="language.is_default">
                                            <label for="min_amount_for_free_delivery">{{
                                                __('minimum_amount_for_free_delivery')
                                                }}<span class="text-danger text-xs">*</span> <small>[ {{ $currency }}
                                                    ]</small></label>
                                            <input type="number" class="form-control"
                                                name="min_amount_for_free_delivery" id="min_amount_for_free_delivery"
                                                v-model="city.min_amount_for_free_delivery"
                                                :placeholder="__('minimum_amount_for_free_delivery')" min="0"
                                                max="999999999" required>
                                        </div>

                                        <div class="form-group d-none" v-if="language.is_default">
                                            <label for="max_deliverable_distance"> {{ __('maximum_delivarable_distance')
                                                }}<span class="text-danger text-xs">*</span>
                                                <small>[Kilometre]</small></label>
                                            <input type="number" class="form-control" name="max_deliverable_distance"
                                                v-model="city.max_deliverable_distance"
                                                placeholder="Enter Delivarable Maximum Distance in km" min="0"
                                                max="999999999">
                                        </div>

                                        <div class="form-group" v-if="language.is_default">
                                            <label for="delivery_charge_method" class=" col-12 col-form-label">{{
                                                __('delivery_charge_methods') }} <span
                                                    class="text-danger text-sm">*</span></label>
                                            <select class="form-control form-select" name="delivery_charge_method"
                                                id="delivery_charge_method" v-model="city.delivery_charge_method"
                                                required>
                                                <option value="">{{ __('select_method') }}</option>
                                                <option value="fixed_charge">{{ __('fixed_delivery_charges') }}</option>
                                                <option value="per_km_charge">{{ __('per_km_delivery_charges') }}
                                                </option>
                                                <option value="range_wise_charges">{{ __('range_wise_delivery_charges')
                                                    }}</option>
                                            </select>
                                        </div>

                                        <div v-if="language.is_default">
                                            <div class="form-group"
                                                v-if="city.delivery_charge_method === 'fixed_charge'">
                                                <label for="fixed_charge"> {{ __('fix_delivery_charges') }}<span
                                                        class="text-danger text-sm">*</span></label>
                                                <input type="number" class="form-control" name="fixed_charge"
                                                    id="fixed_charge" v-model="city.fixed_charge"
                                                    :placeholder="__('fix_delivery_charges')" min="0" max="999999999"
                                                    step="any">
                                            </div>
                                            <div class="form-group"
                                                v-if="city.delivery_charge_method === 'per_km_charge'">
                                                <label for="per_km_charge">{{ __('per_km_delivery_charges') }}<span
                                                        class="text-danger text-sm">*</span> </label>
                                                <input type="number" class="form-control" name="per_km_charge"
                                                    id="per_km_charge" v-model="city.per_km_charge"
                                                    :placeholder="__('per_km_delivery_charges')" min="0" max="999999999"
                                                    step="any">
                                                <input type="text" class="form-control d-none" name="boundary_points"
                                                    id="boundary_points" v-model="city.boundary_points"
                                                    :placeholder="__('boundary_points')">
                                            </div>

                                            <div class="form-group col-sm-12"
                                                v-if="city.delivery_charge_method === 'range_wise_charges'">
                                                <label>{{ __('range_wise_delivery_charges') }}<span
                                                        class="text-danger text-sm">*
                                                    </span> <span class="text-secondary text-sm">{{ __('set_proper_ranges_for_delivery_charge_do_not_repeat_the_range_value_to_next_range_for_e_g_1_3_4_6') }}</span>
                                                </label>
                                                <div class="form-group row"
                                                    v-for="(range, index) in city.range_wise_charges"
                                                    :key="key = index + 1">
                                                    <div class="col-sm-1">{{ key }}.</div>
                                                    <div class="col-sm-3">
                                                        <input type="number" class="form-control" name="from_range[]"
                                                            id="from_range" v-model="range.from_range"
                                                            :placeholder="__('from_range')" min="0" max="999999999">
                                                    </div>
                                                    <div class="col-sm-1 btn btn-secondary">{{ __('to') }}</div>
                                                    <div class="col-sm-3">
                                                        <input type="number" class="form-control" name="to_range[]"
                                                            id="to_range" v-model="range.to_range"
                                                            :placeholder="__('to_range')" min="0" max="999999999">
                                                    </div>
                                                    <div class="col-sm-3">
                                                        <input type="number" class="form-control" name="price[]"
                                                            id="price" v-model="range.price" :placeholder="__('price')" min="0"
                                                            max="999999999" step="any">
                                                    </div>

                                                    <div class="col-sm-1" v-if="index === 0">
                                                        <a v-b-tooltip.hover :title="__('add_row')" style="cursor: pointer;"
                                                            @click="addRow">
                                                            <i class="fa fa-plus-square fa-2x"></i>
                                                        </a>
                                                    </div>

                                                    <div class="col-sm-1" v-if="index !== 0">
                                                        <a v-b-tooltip.hover :title="__('remove_row')" style="cursor: pointer;"
                                                            @click="remove(index)">
                                                            <i class="fa fa-times fa-2x"></i>
                                                        </a>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </b-tab></b-tabs>
                                <div class="form-group">
                                    <button type="submit" class="btn btn-primary"> {{ __('save') }}</button>
                                    <button type="reset" class="btn btn-secondary">{{ __('clear') }}</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 order-md-1 order-last">
                    <div class="card h-100">
                        <div class="card-header">
                            <h4>{{ __('map_view') }}</h4>
                        </div>
                        <div class="card-body">
                            <div class="offset-3 mt-1">
                                <button type="button" id="remove-line" class="badge bg-primary">{{ __('remove_newly_added_line') }}</button>
                                <button type="button" id="clear-line" class="badge bg-danger">{{ __('clear_map') }}</button>
                                <button type="button" id="add-line" class="badge bg-success">{{ __('restore_old_map') }}</button>
                            </div>
                            <div id="map" style="position: relative; overflow: hidden;">
                                <GmapMap :zoom="13" :center="center" :mapTypeControl=true :drawingControl=true
                                    style="width: 100%; height: 700px; margin-top: 5px" ref="mapRef">
                                    <GmapMarker :key="index" v-for="(m, index) in markers"
                                        :position="google && m.position" @click="center = m.position" :clickable="true"
                                        :draggable="true" />
                                    <gmap-info-window :options="{
                                        maxWidth: 300,
                                        pixelOffset: { width: 0, height: -35 }
                                    }" :position="infoWindow.position" :opened="infoWindow.open"
                                        @closeclick="infoWindow.open = false">
                                        <div v-html="infoWindow.template"></div>
                                    </gmap-info-window>
                                </GmapMap>
                            </div>
                            <div v-if="city.formatted_address">
                                <span class="title font-weight-bolder">{{ city.formatted_address }}</span>
                            </div>
                            <div class="form-group d-none">
                                <label for="vertices" class="control-label">{{ __('boundry_points') }}<span
                                        class='text-danger text-xs'>*</span>
                                </label>
                                <textarea name="vertices" id="vertices" v-model="vertices" class="form-control"
                                    placeholder="here will be your selected outlines latitude and longitude" cols="10"
                                    rows="2"></textarea>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import { gmapApi } from 'vue2-google-maps';
import TranslationHelper from '../../mixins/TranslationHelper.js';

export default {
    mixins: [TranslationHelper],
    data: function () {
        return {

            center: { lat: 0, lng: 0 },
            currentPlace: null,
            markers: [],
            city: {
                id: "",
                latitude: "",
                longitude: "",
                name: "",
                state: "",
                zone: "",
                formatted_address: "",
                time_to_travel: "",
                min_amount_for_free_delivery: "",
                max_deliverable_distance: "",
                delivery_charge_method: "",
                fixed_charge: "",
                per_km_charge: "",
                range_wise_charges: [
                    { from_range: "", to_range: "", price: "" }
                ],
                boundary_points: "",
                geolocation_type: "",
                radius: "",

            },
            boundary_points: "",
            formatted_address: "",
            infoWindow: {
                position: { lat: 0, lng: 0 },
                open: false,
                template: ''
            },
            map: "",
            drawingManager: "",
            vertices: "",
            geolocation_type: "",
            googleMapsLoaded: false,
            languages: [],
            translations: {},
            defaultLanguageId: null,
            activeLanguageTab: 0,
            renderKey: 0,

            // Translate buttons
            translatableFields: ['zone'],
            translateSuccessMessage: '',
            loadingEmpty: false,
            loadingOverwrite: false,
        }
    },
    mounted() {
        let vm = this;
        this.$refs.mapRef.$mapPromise.then((map) => {
            vm.map = map;
            vm.drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.POLYGON,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [google.maps.drawing.OverlayType.POLYGON,
                    google.maps.drawing.OverlayType.CIRCLE,]
                },
                polygonOptions: {
                    editable: true,
                },
                circleOptions: {
                    fillColor: '#666666',
                    fillOpacity: 0.5,
                    strokeWeight: 1,
                    clickable: true,
                    editable: true,
                    draggable: true,
                    zIndex: 1
                }
            });
            vm.drawingManager.setMap(vm.map);
            google.maps.event.addListener(vm.drawingManager, "overlaycomplete", function (event) {
                var newShape = event.overlay;
                newShape.type = event.type;
            });
            google.maps.event.addListener(vm.drawingManager, "overlaycomplete", function (event) {
                if (event.type == "circle") {
                    var circle_points = [];
                    vm.radius = event.overlay.getRadius();
                    var lat = event.overlay.getCenter().lat();
                    var lng = event.overlay.getCenter().lng();
                    circle_points.push({
                        "lat": lat,
                        "lng": lng,
                    });
                    vm.geolocation_type = event.type;
                    vm.vertices = JSON.stringify(circle_points);
                } else {
                    vm.geolocation_type = event.type;
                    vm.vertices = event.overlay.getPath().getArray();
                    vm.overlayClickListener(event.overlay);
                }
            });
            google.maps.event.addListener(this.drawingManager, "overlaycomplete", function (event) {
                vm.overlayRemoveListener(event.overlay, false);
            });
        });
        this.waitForGoogleMaps();
    },
    computed: {
        google() {
            return gmapApi(); // This will return the google object once the API is loaded
        }
    },
    created: function () {
        this.city.id = this.$route.params.id;
        this.cityRecord = this.$route.params.record;
        this.$apiUrl = '/api';

        this.fetchActiveLanguages()
            .then(() => {
                this.initializeTranslations();

                if (this.city.id) {
                    this.loadCityWithTranslations();
                }


                this.isLoadingData = false;
            });

    },
    methods: {
        fetchActiveLanguages() {
            return axios.get(this.$apiUrl + '/active_languages')
                .then(response => {
                    this.languages = response.data.data;

                    const defaultLang = this.languages.find(l => l.is_default === 1);
                    if (defaultLang) {
                        this.defaultLanguageId = defaultLang.id;
                    }
                });
        },

        initializeTranslations() {
            const allTranslations = {};
            this.languages.forEach(language => {
                allTranslations[language.id] = {
                    name: '',
                    zone: '',
                };
            });
            this.translations = allTranslations;
        },
        validateDefaultLanguage() {

            // Validate normal city name
            if (!this.city.name || this.city.name.trim() === '') {
                this.showError("Please enter city name");
                this.switchToDefaultLanguageTab();
                return false;
            }

            // Validate default language zone
            const defaultTranslation = this.translations[this.defaultLanguageId];

            if (!defaultTranslation.zone || defaultTranslation.zone.trim() === '') {
                this.showError("Please enter zone name in default language");
                this.switchToDefaultLanguageTab();
                return false;
            }

            // Validate Time to travel 1 (km) - required
            if (this.city.time_to_travel === '' || this.city.time_to_travel === null || this.city.time_to_travel === undefined) {
                this.showError(__('time_to_travel_1km') + ' ' + __('is_required'));
                this.switchToDefaultLanguageTab(true);
                return false;
            }

            // Validate Minimum Amount for Free Delivery - required
            if (this.city.min_amount_for_free_delivery === '' || this.city.min_amount_for_free_delivery === null || this.city.min_amount_for_free_delivery === undefined) {
                this.showError(__('minimum_amount_for_free_delivery') + ' ' + __('is_required'));
                this.switchToDefaultLanguageTab(true);
                return false;
            }

            // Validate Delivery Charge Methods - required
            if (!this.city.delivery_charge_method || this.city.delivery_charge_method.trim() === '') {
                this.showError(__('delivery_charge_methods') + ' ' + __('is_required'));
                this.switchToDefaultLanguageTab(true);
                return false;
            }

            // Validate delivery charge method specific fields
            if (this.city.delivery_charge_method === 'fixed_charge') {
                if (this.city.fixed_charge === '' || this.city.fixed_charge === null || this.city.fixed_charge === undefined) {
                    this.showError(__('fix_delivery_charges') + ' ' + __('is_required'));
                    this.switchToDefaultLanguageTab(true);
                    return false;
                }
            } else if (this.city.delivery_charge_method === 'per_km_charge') {
                if (this.city.per_km_charge === '' || this.city.per_km_charge === null || this.city.per_km_charge === undefined) {
                    this.showError(__('per_km_delivery_charges') + ' ' + __('is_required'));
                    this.switchToDefaultLanguageTab(true);
                    return false;
                }
            } else if (this.city.delivery_charge_method === 'range_wise_charges') {
                const ranges = this.city.range_wise_charges || [];
                const hasValidRange = ranges.some(r => (r.from_range !== '' && r.from_range != null) && (r.to_range !== '' && r.to_range != null) && (r.price !== '' && r.price != null));
                if (!hasValidRange) {
                    this.showError(__('range_wise_delivery_charges') + ' ' + __('is_required'));
                    this.switchToDefaultLanguageTab(true);
                    return false;
                }
            }

            return true;
        },


        addRow() {
            this.city.range_wise_charges.push({ from_range: "", to_range: "", price: "" })
        },
        remove(index) {
            this.city.range_wise_charges.splice(index, 1)
        },
        setPlace(place) {
            this.currentPlace = place;
            this.addMarker()
        },
        addMarker() {
            if (this.currentPlace) {
                const marker = {
                    lat: this.currentPlace.geometry.location.lat(),
                    lng: this.currentPlace.geometry.location.lng(),
                };
                this.markers.push({ position: marker });
                this.center = marker;
                this.city.latitude = this.currentPlace.geometry.location.lat();
                this.city.longitude = this.currentPlace.geometry.location.lng();
                this.city.name = this.currentPlace.name;

                let addressArr = this.currentPlace.formatted_address.split(",");
                this.city.state = addressArr[addressArr.length - 2];

                this.city.formatted_address = this.currentPlace.formatted_address;
                this.infoWindow.position = { lat: this.city.latitude, lng: this.city.longitude }
                this.infoWindow.template = `<b>${this.city.name}</b><br>${this.city.formatted_address}`
                this.infoWindow.open = true;
                this.currentPlace = null;
            }
        },

        loadCityWithTranslations() {

            return axios.get(this.$apiUrl + '/cities/edit/' + this.city.id)
                .then(response => {

                    const city = response.data.data;

                    if (!city) {
                        this.showError("City not found");
                        return;
                    }

                    // Load base fields
                    Object.keys(this.city).forEach(key => {

                        if (key === 'range_wise_charges') {
                            this.city[key] = city[key] ? JSON.parse(city[key]) : [];
                        }
                        else if (key !== 'zone') {
                            this.city[key] = city[key] || '';
                        }

                    });
                    let updatedTranslations = { ...this.translations };

                    if (city.translations && Array.isArray(city.translations)) {

                        city.translations.forEach(trans => {

                            updatedTranslations[trans.language_id] = {
                                zone: trans.zone || ''
                            };

                        });
                    }

                    // Fallback for default language
                    this.languages.forEach(language => {

                        if (language.is_default) {

                            if (!updatedTranslations[language.id]?.zone) {

                                updatedTranslations[language.id] = {
                                    zone: city.zone || ''
                                };

                            }

                        }

                    });

                    this.translations = updatedTranslations;

                    // Force re-render 
                    this.renderKey++;

                    this.setMap();

                })
                .catch(error => {
                    console.error("Error loading city:", error);
                    this.showError("Failed to load city");
                });
        }
        ,

        validateDefaultLanguageForTranslation() {
            return this.validateDefaultLanguage();
        },
        overlayClickListener(overlay) {
            google.maps.event.addListener(overlay, "mouseup", function (event) {
                this.vertices = overlay.getPath().getArray();
            });
        },
        overlayRemoveListener(overlay, is_restore = false, drawed_map = "", not_remove = false, boundary_points = "") {
            let vm = this;
            if (is_restore == true) {
                document.getElementById("add-line").addEventListener("click", addLine);
            }
            document.getElementById("clear-line").addEventListener("click", clearLine);
            if (not_remove == false) {
                document.getElementById("remove-line").addEventListener("click", removeLine);
            }
            function clearLine() {
                overlay.setMap(null);
                vm.vertices = "";
            }
            function removeLine() {
                overlay.setMap(null);
                vm.vertices = "";
            }
            function addLine() {
                if (drawed_map != "") {
                    overlay.setMap(drawed_map);
                } else {
                    overlay.setMap(map);
                }
                vm.vertices = boundary_points;
            }
        },
        waitForGoogleMaps() {
            const checkGoogleMaps = setInterval(() => {
                if (gmapApi() && gmapApi().maps) {
                    this.googleMapsLoaded = true;
                    clearInterval(checkGoogleMaps);
                    this.setMap();
                }
            }, 100); // Check every 100ms
        },
        setMap() {

            if (!this.city.latitude || !this.city.longitude) {
                return; 
            }

            const lat = parseFloat(this.city.latitude);
            const lng = parseFloat(this.city.longitude);

            if (isNaN(lat) || isNaN(lng)) {
                console.error("Invalid coordinates", this.city.latitude, this.city.longitude);
                return;
            }

            const marker = { lat, lng };

            this.markers = []; // clear old markers
            this.markers.push({ position: marker });

            this.center = marker;

            this.infoWindow.position = marker;
            this.infoWindow.template = `<b>${this.city.name}</b><br>${this.city.formatted_address}`;
            this.infoWindow.open = true;

            if (!this.map || !this.city.boundary_points || !this.city.id) {
                return;
            }
            let boundaryPoints = this.city.boundary_points;
            if (typeof boundaryPoints === 'string') {
                try {
                    boundaryPoints = JSON.parse(boundaryPoints);
                } catch (e) {
                    return;
                }
            }
            if (!boundaryPoints || typeof boundaryPoints !== 'object') {
                return;
            }
            const points = Array.isArray(boundaryPoints) ? boundaryPoints : [boundaryPoints];
            if (points.length === 0) return;

            this.geolocation_type = this.city.geolocation_type || 'polygon';
            this.radius = this.city.radius;

            if (this.city.geolocation_type === 'circle') {
                this.vertices = this.city.boundary_points;
                const cityCircle = new google.maps.Circle({
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                    map: this.map,
                    center: points[0],
                    radius: this.city.radius ? Math.sqrt(parseFloat(this.city.radius)) * 100 : 1000,
                });
                this.overlayRemoveListener(cityCircle, true, this.map, true, this.city.boundary_points);
            } else {
                this.vertices = points;
                const polygon = new google.maps.Polygon({
                    paths: points,
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                    editable: true,
                    geodesic: true,
                });
                polygon.setMap(this.map);
                this.overlayRemoveListener(polygon, true, this.map, true, points);
            }
        },

        switchToDefaultLanguageTab(skipError = false) {
            const defaultLangIndex = this.languages.findIndex(language => language.id === this.defaultLanguageId);
            if (defaultLangIndex !== -1) {
                if (!skipError) {
                    this.showError(__('please_fill_default_language_required_fields'));
                }
                this.activeLanguageTab = defaultLangIndex;
            }
        },

        async saveRecord() {

            if (!this.validateDefaultLanguage()) return;

            if (!this.vertices) {
                this.showError("Draw Deliverable area on Map");
                return;
            }

            this.isLoading = true;

            let cityId = this.city.id;

            const languagesToSave = [];

            const defaultLang = this.languages.find(l => l.is_default);
            if (defaultLang) {
                languagesToSave.push(defaultLang);
            }

            this.languages.forEach(language => {
                if (language.is_default) return;

                const trans = this.translations[language.id];
                if (trans.zone && trans.zone.trim() !== '') {
                    languagesToSave.push(language);
                }
            });

            try {

                for (let language of languagesToSave) {

                    let formData = new FormData();

                    // Always send ID only if valid
                    if (cityId && cityId !== "") {
                        formData.append("id", cityId);
                    }

                    // ALWAYS send base fields for default language
                    if (language.is_default) {

                        for (let key in this.city) {

                            if (key === 'range_wise_charges') {
                                formData.append(key, JSON.stringify(this.city[key]));
                            } else {
                                formData.append(key, this.city[key] ?? '');
                            }

                        }

                        formData.append("geolocation_type", this.geolocation_type);
                        formData.append("radius", this.radius);

                        if (this.geolocation_type === 'circle') {
                            formData.append("boundary_points", this.vertices);
                        } else {
                            formData.append("boundary_points", JSON.stringify(this.vertices));
                        }
                    }

                    // Always send translation fields
                    formData.append("language_id", language.id);
                    formData.append("zone", this.translations[language.id].zone || '');

                    const response = await axios.post(this.$apiUrl + '/cities/save', formData);

                    if (!cityId && response.data.data?.id) {
                        cityId = response.data.data.id;
                    }
                }

                this.showMessage("success", __('city_saved_successfully'));

                setTimeout(() => {
                    this.$router.push({ path: '/cities' });
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
