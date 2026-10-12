<template>
    <div class="clp">
        <!-- Header -->
        <header class="clp-head">
            <div class="clp-head__title">
                <span class="clp-eyebrow">{{ __('Logistics') }}</span>
                <h1>{{ __('create_loading_slip') }}</h1>
            </div>
            <router-link :to="urlPrefix + '/loading_slips'" class="clp-back">
                <i class="fa fa-arrow-left"></i> {{ __('back_to_slips') }}
            </router-link>
        </header>

        <div class="clp-grid">
            <!-- Left: orders to load -->
            <section class="clp-card clp-orders">
                <div class="clp-card__head">
                    <div class="clp-card__title">
                        <h2>{{ __('unassigned_doorstep_orders') }}</h2>
                        <span class="ui-pill ui-tone--blue">{{ orders.length }}</span>
                    </div>

                    <div class="clp-filters">
                        <div class="clp-field">
                            <span class="clp-field__label">{{ __('filter_by_area') }}</span>
                            <select v-model="selectedArea" @change="getOrders" class="clp-select">
                                <option value="">{{ __('all_areas') }}</option>
                                <option v-for="area in areas" :key="area.id" :value="area.id">{{ area.name }}</option>
                            </select>
                        </div>

                        <div class="clp-field">
                            <span class="clp-field__label">Rescheduled</span>
                            <div class="clp-seg" role="group">
                                <button type="button" class="clp-seg__btn" :class="{ 'clp-seg__btn--on': selectedRescheduled === '' }" @click="setRescheduled('')">All</button>
                                <button type="button" class="clp-seg__btn" :class="{ 'clp-seg__btn--on': selectedRescheduled === '1' }" @click="setRescheduled('1')">Rescheduled</button>
                                <button type="button" class="clp-seg__btn" :class="{ 'clp-seg__btn--on': selectedRescheduled === '0' }" @click="setRescheduled('0')">Regular</button>
                            </div>
                        </div>

                        <!-- Product filter: shows only orders containing at least one of the
                             selected products (matches ANY, not ALL). -->
                        <div class="clp-field clp-field--grow product-filter-select2">
                            <span class="clp-field__label">{{ __('Filter by Product') }}</span>
                            <Select2
                                v-model="selectedProductIds"
                                :options="productOptions"
                                placeholder="Search and select products..."
                                :settings="{ multiple: 'multiple', width: '100%' }"
                                style="flex: 1;"
                            />
                        </div>
                    </div>
                </div>

                <div class="clp-scroll">
                    <table class="clp-table">
                        <thead>
                            <tr>
                                <th class="clp-th-check">
                                    <input @change="toggleSelectAll" v-model="selectAll" class="clp-check" type="checkbox" :title="__('Select all')">
                                </th>
                                <th class="clp-col-id">{{ __('order_id') }}</th>
                                <th>{{ __('customer_name') }}</th>
                                <th class="clp-col-zone">{{ __('zone') }} / {{ __('area') }}</th>
                                <th class="clp-num clp-col-value">{{ __('value') }}</th>
                                <th class="clp-num clp-col-weight">{{ __('weight_kg') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in orders" :key="order.id" class="clp-row"
                                :class="{ 'clp-row--on': selectedOrderIds.includes(order.id) }" @click="toggleOrderSelection(order)">
                                <td class="clp-th-check" @click.stop>
                                    <input v-model="selectedOrderIds" :value="order.id" class="clp-check" type="checkbox" @change="calculateWeightSum">
                                </td>
                                <td class="clp-id clp-col-id">#{{ order.id }}</td>
                                <td>
                                    <div class="clp-shop">
                                        <span class="ui-avatar" :class="'ui-tone--' + avatarTone(order.user_name)">{{ initials(order.user_name) }}</span>
                                        <div class="clp-shop__text">
                                            <div class="clp-shop__name">
                                                <span class="clp-shop__id">#{{ order.id }}</span>
                                                <strong :title="order.user_name">{{ order.user_name }}</strong>
                                                <span v-if="order.is_rescheduled" class="ui-pill ui-tone--amber">Rescheduled</span>
                                            </div>
                                            <span class="clp-shop__addr" :title="order.address">{{ order.address }}</span>
                                            <div class="clp-shop__zone">
                                                <span class="ui-pill ui-tone--blue" v-b-tooltip.hover.top :title="formatZone(order.city_zone || 'Default')"><span class="clp-clip">{{ formatZone(order.city_zone || 'Default') }}</span></span>
                                                <span v-if="order.area_name" class="ui-pill ui-tone--amber" v-b-tooltip.hover.top :title="order.area_name"><span class="clp-clip">{{ order.area_name }}</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="clp-col-zone">
                                    <div class="clp-pills">
                                        <span class="ui-pill ui-tone--blue" v-b-tooltip.hover.top :title="formatZone(order.city_zone || 'Default')"><span class="clp-clip">{{ formatZone(order.city_zone || 'Default') }}</span></span>
                                        <span v-if="order.area_name" class="ui-pill ui-tone--amber" v-b-tooltip.hover.top :title="order.area_name"><span class="clp-clip">{{ order.area_name }}</span></span>
                                    </div>
                                </td>
                                <td class="clp-num clp-col-value"><strong>₹{{ formatMoney(order.final_total) }}</strong></td>
                                <td class="clp-num clp-col-weight"><strong>{{ order.weight || 0 }} kg</strong></td>
                            </tr>
                            <tr v-if="orders.length === 0">
                                <td colspan="6">
                                    <div class="ui-empty">
                                        <div class="ui-empty__icon"><i class="fa fa-check-circle"></i></div>
                                        <h3>{{ __('hurray_all_doorstep_orders_are_already_assigned_to_slips') }}</h3>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Totals of everything currently listed (after filters) -->
                <div class="clp-list-foot">
                    <span>{{ __('total_weight') }} <strong>{{ totalFilteredWeight }} {{ __('kg') }}</strong></span>
                    <span>{{ __('orders') }} <strong>{{ orders.length }}</strong></span>
                    <span>{{ __('total_value') }} <strong>₹{{ totalFilteredValue }}</strong></span>
                </div>
            </section>

            <!-- Right: logistics planner -->
            <aside class="clp-planner">
                <div class="clp-card">
                    <div class="clp-card__head clp-card__head--plain">
                        <div class="clp-card__title">
                            <span class="ui-tile ui-tone--blue clp-tile"><i class="fa fa-truck"></i></span>
                            <h2>{{ __('logistics_planner') }}</h2>
                        </div>
                    </div>

                    <form @submit.prevent="openReviewModal" class="clp-form">
                        <!-- Vehicle Select -->
                        <div class="clp-field clp-field--stack">
                            <label class="clp-field__label" for="clp-vehicle">{{ __('select_delivery_vehicle') }} <em>*</em></label>
                            <select id="clp-vehicle" v-model="selectedVehicleId" class="clp-select clp-select--lg" required @change="updateVehicleCapacity">
                                <option value="">-- {{ __('choose_vehicle') }} --</option>
                                <option v-for="v in vehicles" :key="v.id" :value="v.id">
                                    {{ v.name }} [{{ v.vehicle_number }}] - {{ __('cap') }}: {{ v.capacity }} {{ __('kg') }}
                                </option>
                            </select>
                            <div v-if="selectedVehicle" class="clp-chips">
                                <span class="ui-tag clp-plate">{{ selectedVehicle.vehicle_number }}</span>
                                <span class="ui-tag">{{ __('cap') }}: {{ selectedVehicle.capacity }} {{ __('kg') }}</span>
                            </div>
                        </div>

                        <!-- Driver Select -->
                        <div class="clp-field clp-field--stack">
                            <label class="clp-field__label" for="clp-driver">{{ __('select_active_driver_rider') }} <em>*</em></label>
                            <select id="clp-driver" v-model="selectedDriverId" class="clp-select clp-select--lg" required>
                                <option value="">-- {{ __('choose_driver') }} --</option>
                                <option v-for="d in drivers" :key="d.id" :value="d.id">
                                    {{ d.name }} [{{ d.mobile }}]
                                </option>
                            </select>
                        </div>

                        <!-- Dynamic Weight Capacity Bar -->
                        <div class="clp-gauge" :class="'clp-gauge--' + (selectedVehicle ? loadTone : 'idle')">
                            <div class="clp-gauge__title">{{ __('live_weight_load_bar') }}</div>

                            <div v-if="!selectedVehicle" class="clp-gauge__idle">
                                <i class="fa fa-truck"></i> {{ __('choose_a_vehicle_to_visualize_weight_limits') }}
                            </div>
                            <div v-else>
                                <div class="clp-gauge__nums">
                                    <span>{{ __('current_load_weight') }}</span>
                                    <strong>{{ totalSelectedWeight }} / {{ selectedVehicle.capacity }} {{ __('kg') }}</strong>
                                </div>
                                <div class="clp-gauge__track">
                                    <div class="clp-gauge__fill" :style="{ width: gaugeWidth + '%' }"></div>
                                </div>
                                <div class="clp-gauge__meta">
                                    <span class="clp-gauge__pct">{{ loadPercent.toFixed(1) }}% {{ __('capacity_loaded') }}</span>
                                    <span class="clp-gauge__left">{{ loadRemaining >= 0 ? loadRemaining + ' ' + __('kg') + ' left' : 'Over by ' + Math.abs(loadRemaining) + ' ' + __('kg') }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Selection totals -->
                        <div class="clp-sel">
                            <div><span>{{ __('orders_selected') }}</span><strong>{{ selectedOrderIds.length }}</strong></div>
                            <div><span>{{ __('weight_kg') }}</span><strong>{{ totalSelectedWeight }}</strong></div>
                            <div><span>{{ __('value') }}</span><strong>₹{{ selectedValue }}</strong></div>
                        </div>

                        <!-- Alert warnings -->
                        <div v-if="loadPercent > 100" class="clp-alert">
                            <i class="fa fa-exclamation-triangle"></i>
                            <div><strong>{{ __('vehicle_overloaded') }}!</strong> {{ __('selected_load_exceeds_the_vehicle_maximum_capability') }}</div>
                        </div>

                        <!-- Action button -->
                        <button type="submit" class="clp-cta" :disabled="reviewLoading">
                            <b-spinner v-if="reviewLoading" small></b-spinner>
                            <i v-else class="fa fa-magic"></i>{{ __('generate_slip_and_sequence_route') }}
                        </button>
                        <p v-if="plannerHint" class="clp-hint">{{ plannerHint }}</p>
                    </form>
                </div>
            </aside>
        </div>

        <!-- Review-before-generate modal: pure display/confirmation, no validation of its
             own — just lets the distributor eyeball the pick list (boxes + loose pieces)
             against physical stock before committing. Confirm runs the unmodified,
             existing createLoadingSlip() flow exactly as before. -->
        <b-modal v-model="showReviewModal" :title="__('Review Before Generating Slip')" size="lg" hide-footer no-close-on-backdrop>
            <!-- .ui-modern re-establishes the colour tokens: modals render outside the page root -->
            <div class="ui-modern clp-review">
                <p class="clp-review__lead">{{ __('Verify you have enough physical stock for each product below. Click a product to see and adjust the orders behind it.') }}</p>
                <div class="clp-review__strip">
                    <span><strong>{{ reviewSummary.length }}</strong> {{ __('orders') }}</span>
                    <span><strong>{{ productGroupedSummary.length }}</strong> {{ __('Products') }}</span>
                </div>

                <div class="review-orders-scroll">
                    <div v-for="product in productGroupedSummary" :key="product.key" class="clp-pcard">
                        <div class="clp-pcard__head" @click="toggleProductExpand(product.key)">
                            <span class="clp-pcard__name">
                                <i class="fa" :class="expandedProducts[product.key] ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
                                <strong>{{ product.name }}</strong>
                            </span>
                            <span class="clp-pcard__meta">
                                <span class="clp-pcard__count">{{ product.orders.length }} {{ __('orders') }}</span>
                                <span class="ui-pill ui-tone--blue">
                                    <template v-if="product.boxes !== null">
                                        {{ product.boxes }} {{ product.boxUnit }}<template v-if="product.loose"> + {{ product.loose }} {{ product.pieceUnit }}</template>
                                    </template>
                                    <template v-else>{{ product.totalQty }}</template>
                                </span>
                            </span>
                        </div>
                        <b-collapse :visible="!!expandedProducts[product.key]">
                            <div class="table-responsive">
                                <table class="clp-rtable">
                                    <thead>
                                        <tr>
                                            <th>{{ __('order') }} #</th>
                                            <th>{{ __('retailer') }}</th>
                                            <th class="clp-num">{{ __('Qty') }}</th>
                                            <th class="clp-num">{{ product.boxUnit || __('Boxes') }}</th>
                                            <th class="clp-num">{{ product.pieceUnit || __('Loose Pieces') }}</th>
                                            <th style="width:50px;"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="o in product.orders" :key="o.orderId">
                                            <td><strong>#{{ o.orderId }}</strong> <span class="clp-muted">({{ o.ordersId }})</span></td>
                                            <td>{{ o.retailerName }}</td>
                                            <td class="clp-num">{{ o.qty }}</td>
                                            <td class="clp-num">
                                                <span v-if="o.boxes">{{ o.boxes }} {{ product.boxUnit }}</span>
                                                <span v-else class="clp-muted">—</span>
                                            </td>
                                            <td class="clp-num">
                                                <span v-if="o.loose">{{ o.loose }} {{ product.pieceUnit }}</span>
                                                <span v-else class="clp-muted">—</span>
                                            </td>
                                            <td class="clp-num">
                                                <button type="button" class="review-order-remove-btn" v-b-tooltip.hover.right.noninteractive :title="__('Remove this order from the slip')" @click="removeOrderFromReview(o.orderId)">
                                                    <i class="fa fa-times"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </b-collapse>
                    </div>
                    <div v-if="productGroupedSummary.length === 0" class="clp-review__empty">{{ __('no_data_found') }}</div>
                </div>

                <div class="clp-review__foot">
                    <b-button variant="outline-secondary" class="clp-btn" @click="showReviewModal = false">{{ __('cancel') }}</b-button>
                    <b-button variant="primary" class="clp-btn clp-btn--primary" :disabled="loading || reviewSummary.length === 0" @click="confirmGenerate">
                        <b-spinner v-if="loading" small class="mr-2"></b-spinner>
                        <i v-else class="fa fa-check-circle mr-2"></i>{{ __('Confirm & Generate Slip') }}
                    </b-button>
                </div>
            </div>
        </b-modal>
    </div>
</template>
<script>
import axios from 'axios';
import Select2 from 'v-select2-component';

export default {
    name: 'SellerCreateLoadingSlip',
    components: { Select2 },
    data() {
        return {
            orders: [],
            areas: [],
            vehicles: [],
            drivers: [],
            productOptions: [],
            selectedProductIds: [],
            selectedArea: '',
            selectedRescheduled: '',
            selectedVehicleId: '',
            selectedVehicle: null,
            selectedDriverId: '',
            selectedOrderIds: [],
            selectAll: false,
            totalSelectedWeight: 0,
            loadPercent: 0,
            loading: false,
            reviewLoading: false,
            showReviewModal: false,
            reviewSummary: [],
            expandedProducts: {}
        };
    },
    computed: {
        // Regroups the order-first reviewSummary into product-first rows for display —
        // reviewSummary itself stays the source of truth for what's actually included
        // (removeOrderFromReview mutates that), this just re-derives from it, so removing
        // an order updates every product's total automatically via Vue reactivity.
        productGroupedSummary() {
            const groups = {};
            this.reviewSummary.forEach(order => {
                order.items.forEach(item => {
                    if (!groups[item.key]) {
                        groups[item.key] = {
                            key: item.key,
                            name: item.name,
                            packSize: item.pack_size,
                            boxUnit: item.box_unit,
                            pieceUnit: item.piece_unit,
                            totalQty: 0,
                            orders: [],
                        };
                    }
                    const group = groups[item.key];
                    group.totalQty += item.qty;
                    group.orders.push({
                        orderId: order.order_id,
                        ordersId: order.orders_id,
                        retailerName: order.retailer_name,
                        qty: item.qty,
                        boxes: item.boxes,
                        loose: item.loose,
                    });
                });
            });
            return Object.values(groups).map(g => {
                let boxes = null, loose = null;
                if (g.packSize > 0) {
                    boxes = Math.floor(g.totalQty / g.packSize);
                    loose = g.totalQty % g.packSize;
                }
                return { ...g, boxes, loose };
            });
        },
        totalFilteredWeight() {
            let sum = this.orders.reduce((acc, order) => acc + parseFloat(order.weight || 0), 0);
            return sum.toFixed(2);
        },
        totalFilteredValue() {
            let sum = this.orders.reduce((acc, order) => acc + parseFloat(order.final_total || 0), 0);
            return sum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },
        barClass() {
            if (this.loadPercent > 100) return 'bg-danger';
            if (this.loadPercent > 85) return 'bg-warning';
            return 'bg-success';
        },
        // ---- display-only helpers for the redesigned planner ----
        loadTone() {
            if (this.loadPercent > 100) return 'red';
            if (this.loadPercent > 85) return 'amber';
            return 'green';
        },
        // the bar itself never grows past its track (loadPercent can reach 120)
        gaugeWidth() {
            return Math.min(this.loadPercent, 100);
        },
        // kg still free on the chosen vehicle; negative = overloaded
        loadRemaining() {
            if (!this.selectedVehicle) return 0;
            return parseFloat((parseFloat(this.selectedVehicle.capacity || 0) - this.totalSelectedWeight).toFixed(2));
        },
        selectedValue() {
            const sum = this.orders
                .filter(order => this.selectedOrderIds.includes(order.id))
                .reduce((acc, order) => acc + parseFloat(order.final_total || 0), 0);
            return sum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },
        // purely informational: what is still missing before a slip can be generated
        plannerHint() {
            if (!this.selectedVehicleId) return this.__('Choose a vehicle to continue');
            if (!this.selectedDriverId) return this.__('Choose a driver to continue');
            if (!this.selectedOrderIds.length) return this.__('Select at least one order to load');
            return '';
        },
        urlPrefix() {
            return this.$route.path.startsWith('/seller') ? '/seller' : '';
        },
        isSeller() {
            return this.$route.path.startsWith('/seller');
        },
        apiBase() {
            return this.isSeller ? this.$sellerApiUrl : this.$apiUrl;
        }
    },
    mounted() {
        this.getAreas();
        this.getVehicles();
        this.getDrivers();
        this.getProductOptions();
        this.getOrders();
    },
    watch: {
        selectedProductIds() {
            this.getOrders();
        },
    },
    methods: {
        getProductOptions() {
            axios.get(this.apiBase + '/loading_slips/products')
                .then(res => {
                    if (res.data.status === 1) {
                        this.productOptions = res.data.data || [];
                    }
                });
        },
        getAreas() {
            axios.get(this.apiBase + '/loading_slips/areas')
                .then(res => {
                    if (res.data.status === 1) {
                        this.areas = res.data.data || [];
                    }
                });
        },
        getVehicles() {
            axios.get(this.apiBase + '/vehicles/active')
                .then(res => {
                    if (res.data.status === 1) {
                        this.vehicles = res.data.data;
                        // a single vehicle leaves nothing to choose, so it is picked for you
                        // (never overrides something already selected)
                        if (this.vehicles.length === 1 && !this.selectedVehicleId) {
                            this.selectedVehicleId = this.vehicles[0].id;
                            this.updateVehicleCapacity();
                        }
                    }
                });
        },
        getDrivers() {
            // Eager load delivery boys that are active
            axios.get(this.apiBase + '/delivery_boys', { params: { status: 1 } })
                .then(res => {
                    if (res.data.status === 1) {
                        this.drivers = res.data.data.data || res.data.data;
                        // same for a single driver
                        if (this.drivers.length === 1 && !this.selectedDriverId) {
                            this.selectedDriverId = this.drivers[0].id;
                        }
                    }
                });
        },
        getOrders() {
            const params = {};
            if (this.selectedArea) params.area_id = this.selectedArea;
            if (this.selectedRescheduled !== '') params.is_rescheduled = this.selectedRescheduled;
            if (this.selectedProductIds.length) params.product_ids = this.selectedProductIds;
            axios.get(this.apiBase + '/loading_slips/orders', { params }).then(res => {
                if (res.data.status === 1) {
                    this.orders = res.data.data;
                    this.selectedOrderIds = [];
                    this.selectAll = false;
                    this.calculateWeightSum();
                }
            });
        },
        updateVehicleCapacity() {
            this.selectedVehicle = this.vehicles.find(v => v.id == this.selectedVehicleId) || null;
            this.calculateWeightSum();
        },
        toggleOrderSelection(order) {
            const index = this.selectedOrderIds.indexOf(order.id);
            if (index > -1) {
                this.selectedOrderIds.splice(index, 1);
            } else {
                this.selectedOrderIds.push(order.id);
            }
            this.calculateWeightSum();
        },
        toggleSelectAll() {
            if (this.selectAll) {
                this.selectedOrderIds = this.orders.map(o => o.id);
            } else {
                this.selectedOrderIds = [];
            }
            this.calculateWeightSum();
        },
        calculateWeightSum() {
            let sum = 0;
            this.orders.forEach(order => {
                if (this.selectedOrderIds.includes(order.id)) {
                    sum += parseFloat(order.weight || 0);
                }
            });
            this.totalSelectedWeight = parseFloat(sum.toFixed(2));
            
            const capacity = parseFloat(this.selectedVehicle?.capacity || 0);
            if (this.selectedVehicle && capacity > 0) {
                this.loadPercent = Math.min((this.totalSelectedWeight / capacity) * 100, 120);
            } else {
                this.loadPercent = 0;
            }
        },
        // Rescheduled filter as buttons: sets the same selectedRescheduled value ('' | '1' | '0') the old select did
        setRescheduled(value) {
            this.selectedRescheduled = value;
            this.getOrders();
        },
        // whole amounts stay compact (4,000); fractional ones always show paise (8,336.30)
        formatMoney(value) {
            const n = parseFloat(value);
            if (isNaN(n)) return '0';
            return n.toLocaleString('en-IN', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 });
        },
        initials(name) {
            const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
            if (!parts.length) return '?';
            return ((parts[0][0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
        },
        // Stable colour per shop so the same shop always gets the same avatar
        avatarTone(name) {
            const tones = ['blue', 'green', 'purple', 'amber', 'red'];
            let hash = 0;
            String(name || '').split('').forEach(ch => { hash = (hash * 31 + ch.charCodeAt(0)) % 997; });
            return tones[hash % tones.length];
        },
        formatZone(zone) {
            if (!zone) return 'All';
            return zone.charAt(0).toUpperCase() + zone.slice(1);
        },
        openReviewModal() {
            this.reviewLoading = true;
            axios.post(this.apiBase + '/loading_slips/order_items_summary', {
                order_ids: this.selectedOrderIds
            }).then(res => {
                this.reviewLoading = false;
                if (res.data.status === 1) {
                    this.reviewSummary = res.data.data || [];
                    this.expandedProducts = {};
                    this.showReviewModal = true;
                } else {
                    this.showError(res.data.message);
                }
            }).catch(() => {
                this.reviewLoading = false;
                this.showError(__('an_error_occurred_during_slip_creation'));
            });
        },
        confirmGenerate() {
            this.showReviewModal = false;
            this.createLoadingSlip(false);
        },
        // Drop an order right from the review modal instead of forcing cancel ->
        // untick checkbox -> reopen. selectedOrderIds is the same array the order
        // checkboxes v-model against, so this also unticks it there for free, and
        // calculateWeightSum() keeps the weight bar / "orders selected" badge in sync.
        removeOrderFromReview(orderId) {
            this.reviewSummary = this.reviewSummary.filter(o => o.order_id !== orderId);
            this.selectedOrderIds = this.selectedOrderIds.filter(id => id !== orderId);
            this.calculateWeightSum();
        },
        toggleProductExpand(key) {
            this.$set(this.expandedProducts, key, !this.expandedProducts[key]);
        },
        createLoadingSlip(confirmStock = false) {
            this.loading = true;
            axios.post(this.apiBase + '/loading_slips/save', {
                vehicle_id: this.selectedVehicleId,
                driver_id: this.selectedDriverId,
                order_ids: this.selectedOrderIds,
                confirm_stock_shortage: confirmStock === true
            }).then(res => {
                this.loading = false;
                if (res.data.status === 1) {
                    this.showSuccess(__('loading_slip_generated_and_route_optimized_successfully'));
                    this.$router.push(this.urlPrefix + '/loading_slips');
                } else if (res.data.status === 2) {
                    let shortageListHtml = '<div class="text-left mt-2" style="max-height: 200px; overflow-y: auto; font-size: 14px;"><ul class="list-group list-group-flush">';
                    res.data.shortages.forEach(item => {
                        shortageListHtml += `<li class="list-group-item px-0 py-1 text-danger">
                            <strong>${item.name}</strong><br>
                            <span class="text-muted small">Required: <b>${item.required}</b> | Available: <b>${item.available}</b></span>
                        </li>`;
                    });
                    shortageListHtml += '</ul></div>';

                    this.$swal.fire({
                        title: 'Stock Shortage Warning!',
                        html: `<p class="mb-2">The following items have insufficient database stock:</p>${shortageListHtml}<p class="mt-3">Are you sure you want to proceed and generate the loading slip?</p>`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Yes, Proceed',
                        cancelButtonText: 'Cancel',
                        confirmButtonColor: '#37a279',
                        cancelButtonColor: '#d33'
                    }).then(result => {
                        if (result.value) {
                            this.createLoadingSlip(true);
                        }
                    });
                } else {
                    this.showError(res.data.message);
                }
            }).catch(err => {
                this.loading = false;
                this.showError(__('an_error_occurred_during_slip_creation'));
            });
        }
    }
};
</script>
<style scoped>
/* All colours come from the --ui-* tokens that modern.css defines on .ui-modern (the seller layout),
   so this page follows light/dark mode and the app palette automatically. */
.clp { padding: 24px; color: var(--ui-text); font-variant-numeric: tabular-nums; }
.clp-muted { color: var(--ui-muted); }
.clp-num { text-align: right; white-space: nowrap; }

/* ---------- header ---------- */
.clp-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 16px; margin-bottom: 18px; }
.clp-head__title { display: flex; align-items: baseline; gap: 14px; }
.clp-eyebrow { padding-right: 14px; border-right: 1px solid var(--ui-border); font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ui-muted); }
.clp .clp-head h1 { margin: 0; font-size: 28px; line-height: 1.15; font-weight: 800; letter-spacing: -0.02em; color: var(--ui-text); }
.clp-back {
    display: inline-flex; align-items: center; gap: 8px; height: 42px; padding: 0 18px; border-radius: 12px;
    border: 1px solid var(--ui-border); background: var(--ui-card); color: var(--ui-text); font-size: 14px; font-weight: 600; text-decoration: none !important;
    box-shadow: var(--ui-shadow); transition: background-color 0.15s ease;
}
.clp-back:hover { background: var(--ui-soft); color: var(--ui-text); }

/* ---------- layout ---------- */
.clp-grid { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 20px; align-items: start; }
.clp-card { background: var(--ui-card); border: 1px solid var(--ui-border); border-radius: 18px; box-shadow: var(--ui-shadow); }
.clp-orders { overflow: hidden; container-type: inline-size; container-name: clporders; }
.clp-planner { position: sticky; top: 24px; }

.clp-card__head { padding: 18px 20px; border-bottom: 1px solid var(--ui-border); }
.clp-card__head--plain { border-bottom: 0; padding-bottom: 4px; }
.clp-card__title { display: flex; align-items: center; gap: 12px; }
.clp .clp-card__title h2 { margin: 0; font-size: 17px; font-weight: 700; color: var(--ui-text); }
.clp-tile { width: 40px; height: 40px; border-radius: 12px; font-size: 17px; }

/* ---------- filters ---------- */
.clp-filters { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px 16px; margin-top: 14px; }
.clp-field { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
.clp-field--grow { flex: 1 1 260px; }
.clp-field--stack { margin-bottom: 16px; }
.clp-field__label { margin: 0; font-size: 11.5px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--ui-muted); }
.clp-field__label em { font-style: normal; color: var(--ui-red); }
.clp-filters .clp-select { width: 200px; }
.clp-select {
    height: 42px; min-width: 160px; padding: 0 34px 0 14px; border-radius: 12px; border: 1px solid var(--ui-border);
    background-color: var(--ui-soft); color: var(--ui-text); font-size: 14px; outline: none; cursor: pointer; max-width: 100%;
}
.clp-select--lg { width: 100%; height: 46px; }
.clp-select:focus { border-color: var(--ui-primary); box-shadow: 0 0 0 3px var(--ui-primary-soft); }

.clp-seg { display: inline-flex; gap: 4px; padding: 4px; height: 42px; border-radius: 12px; background: var(--ui-slate-bg); }
.clp .clp-seg__btn { padding: 0 12px; border: 0; border-radius: 9px; background: transparent; color: var(--ui-muted); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; white-space: nowrap; }
.clp-seg__btn:hover { color: var(--ui-text); }
.clp-seg__btn--on { background: var(--ui-card); color: var(--ui-text); box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12); }

/* ---------- order table ---------- */
.clp-scroll { max-height: 540px; overflow: auto; }
.clp-table td.clp-col-zone { max-width: 220px; }
.clp-table { width: 100%; border-collapse: separate; border-spacing: 0; }
.clp-table thead th {
    position: sticky; top: 0; z-index: 1; padding: 12px 16px; background: var(--ui-soft); color: var(--ui-muted); white-space: nowrap;
    font-size: 11.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; border-bottom: 1px solid var(--ui-border);
}
.clp-table tbody td { padding: 12px 16px; vertical-align: middle; border-top: 1px solid var(--ui-border); font-size: 14px; }
.clp-table tbody tr:first-child td { border-top: 0; }
.clp-th-check { width: 48px; padding-right: 0 !important; }
.clp-check { width: 18px; height: 18px; cursor: pointer; accent-color: var(--ui-primary); }
.clp-row { cursor: pointer; transition: background-color 0.12s ease; }
.clp-row:hover td { background: var(--ui-soft); }
.clp-row--on td { background: var(--ui-primary-soft) !important; }
.clp-id { font-weight: 700; white-space: nowrap; }
.clp-shop { display: flex; align-items: center; gap: 12px; min-width: 220px; }
.clp-shop__text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.clp-shop__name { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; }
.clp-shop__name strong { font-size: 14px; font-weight: 700; }
.clp-shop__addr { max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; color: var(--ui-muted); }
.clp-pills { display: flex; flex-wrap: wrap; gap: 6px; max-width: 180px; }
/* long names (an area can list a dozen places) are cut to one line; the full text shows on hover */
.clp-clip { display: block; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.clp-shop__zone { display: none; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.clp-shop__id { display: none; font-size: 12px; font-weight: 700; color: var(--ui-muted); }

.clp-list-foot { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 20px; padding: 14px 20px; border-top: 1px solid var(--ui-border); font-size: 13px; color: var(--ui-muted); }
.clp-list-foot strong { margin-left: 6px; color: var(--ui-text); font-size: 14px; }

/* ---------- planner ---------- */
.clp-form { padding: 8px 20px 20px; }
.clp-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
.clp-plate { font-family: SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: 0.04em; }

.clp-gauge { --g: var(--ui-slate); --g-bg: var(--ui-slate-bg); --g-fg: var(--ui-slate-fg); margin-bottom: 16px; padding: 14px 16px; border-radius: 14px; background: var(--ui-soft); border: 1px solid var(--ui-border); }
.clp-gauge--green { --g: var(--ui-green); --g-fg: var(--ui-green-fg); }
.clp-gauge--amber { --g: var(--ui-amber); --g-fg: var(--ui-amber-fg); }
.clp-gauge--red   { --g: var(--ui-red);   --g-fg: var(--ui-red-fg); }
.clp-gauge__title { margin-bottom: 8px; font-size: 11.5px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--ui-muted); }
.clp-gauge__idle { padding: 6px 0; text-align: center; font-size: 13px; color: var(--ui-muted); }
.clp-gauge__idle .fa { margin-right: 6px; }
.clp-gauge__nums { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; font-size: 13px; color: var(--ui-muted); }
.clp-gauge__nums strong { font-size: 15px; color: var(--ui-text); }
.clp-gauge__track { height: 10px; margin: 10px 0 8px; border-radius: 999px; background: var(--g-bg); overflow: hidden; }
.clp-gauge__fill { height: 100%; border-radius: 999px; background: var(--g); transition: width 0.35s ease, background-color 0.2s ease; }
.clp-gauge__meta { display: flex; justify-content: space-between; gap: 8px; font-size: 12.5px; font-weight: 600; }
.clp-gauge__pct { color: var(--g-fg); }
.clp-gauge__left { color: var(--ui-muted); }

.clp-sel { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.35fr); margin-bottom: 16px; border: 1px solid var(--ui-border); border-radius: 14px; overflow: hidden; }
.clp-sel > div { display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; }
.clp-sel > div + div { border-left: 1px solid var(--ui-border); }
.clp-sel span { font-size: 11.5px; color: var(--ui-muted); }
.clp-sel strong { font-size: 16px; font-weight: 800; color: var(--ui-text); }

.clp-alert { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 16px; padding: 12px 14px; border-radius: 12px; background: var(--ui-red-bg); color: var(--ui-red-fg); font-size: 13px; line-height: 1.4; }
.clp-alert .fa { margin-top: 2px; }

.clp .clp-cta {
    display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; height: 48px; border: 0; border-radius: 12px;
    background: var(--ui-primary); color: #fff; font-size: 14.5px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 14px rgba(var(--brand-rgb, 4, 42, 95), 0.3);
    transition: filter 0.15s ease, transform 0.1s ease;
}
.clp-cta:hover:not(:disabled) { filter: brightness(0.95); }
.clp-cta:active:not(:disabled) { transform: translateY(1px); }
.clp-cta:disabled { opacity: 0.65; cursor: wait; }
.clp-hint { margin: 10px 0 0; text-align: center; font-size: 12.5px; color: var(--ui-muted); }

/* ---------- review modal ---------- */
.clp-review { background: transparent; color: var(--ui-text); }
.clp-review__lead { margin: 0 0 12px; font-size: 13px; color: var(--ui-muted); }
.clp-review__strip { display: flex; gap: 10px; margin-bottom: 14px; }
.clp-review__strip span { padding: 6px 12px; border-radius: 10px; background: var(--ui-soft); border: 1px solid var(--ui-border); font-size: 13px; color: var(--ui-muted); }
.clp-review__strip strong { margin-right: 4px; color: var(--ui-text); }
.review-orders-scroll { max-height: 56vh; overflow-y: auto; padding-right: 4px; margin-bottom: 16px; }
.clp-review__empty { padding: 20px 0; text-align: center; color: var(--ui-muted); }
.clp-pcard { margin-bottom: 12px; border: 1px solid var(--ui-border); border-radius: 14px; overflow: hidden; background: var(--ui-card); }
.clp-pcard:last-child { margin-bottom: 0; }
.clp-pcard__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px; background: var(--ui-soft); cursor: pointer; user-select: none; }
.clp-pcard__head:hover { filter: brightness(0.98); }
.clp-pcard__name { display: flex; align-items: center; gap: 10px; min-width: 0; }
.clp-pcard__name .fa { font-size: 11px; color: var(--ui-muted); }
.clp-pcard__name strong { font-size: 14px; }
.clp-pcard__meta { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.clp-pcard__count { font-size: 12.5px; color: var(--ui-muted); }
.clp-rtable { width: 100%; border-collapse: collapse; }
.clp-rtable th { padding: 10px 16px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--ui-muted); border-top: 1px solid var(--ui-border); border-bottom: 1px solid var(--ui-border); background: var(--ui-card); }
.clp-rtable td { padding: 10px 16px; font-size: 13.5px; border-top: 1px dashed var(--ui-border); }
.clp-rtable tbody tr:first-child td { border-top: 0; }
.review-order-remove-btn { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; padding: 0; border: 0; border-radius: 50%; background: transparent; color: var(--ui-muted); font-size: 12px; transition: background-color 0.15s ease, color 0.15s ease; }
.review-order-remove-btn:hover { background: var(--ui-red-bg); color: var(--ui-red-fg); }
.clp-review__foot { display: flex; justify-content: flex-end; gap: 10px; }
.clp-btn { height: 42px; padding: 0 18px; border-radius: 12px; font-weight: 600; }
.clp-btn--primary { background: var(--ui-primary); border-color: var(--ui-primary); }

/* ---------- responsive ---------- */
/* when the orders card is narrow, the zone/area pills tuck under the address instead of taking a column */
@container clporders (max-width: 880px) {
    .clp-col-zone { display: none; }
    .clp-shop__zone { display: flex; }
}
@media (max-width: 1199px) {
    .clp-grid { grid-template-columns: 1fr; }
    .clp-planner { position: static; }
}
@media (max-width: 767px) {
    .clp { padding: 16px; }
    .clp .clp-head h1 { font-size: 24px; }
    .clp-col-zone { display: none; }
    .clp-table { table-layout: fixed; }
    .clp-table thead th, .clp-table tbody td { padding: 10px 8px; }
    .clp-th-check { width: 34px; }
    .clp-col-id { display: none; }
    .clp-col-value { width: 92px; }
    .clp-col-weight { width: 66px; }
    .clp-shop { min-width: 0; }
    .clp-shop .ui-avatar { display: none; }
    .clp-shop__id { display: inline; }
    .clp-shop__addr { max-width: 100%; }
    .clp-sel strong { font-size: 14px; }
    .clp-field, .clp-select, .clp-filters .clp-select { width: 100%; }
    .clp-seg { width: 100%; }
    .clp-seg__btn { flex: 1; padding: 0 6px; }
}
</style>

<!-- Unscoped: Select2 renders its own DOM via jQuery outside Vue's template, so
     scoped styles (which rely on a compile-time data-v-* attribute) never reach it.
     Selectors are prefixed by .product-filter-select2 so this stays local to this
     page's filter instead of restyling every Select2 usage app-wide. -->
<style>
.product-filter-select2 .select2-container {
    flex: 1;
}
.product-filter-select2 .select2-container--default .select2-selection--multiple {
    background-color: var(--ui-soft, #f7f9fc);
    border: 1px solid var(--ui-border, #e9edf5);
    border-radius: 12px;
    min-height: 42px;
    padding: 0.1rem 0.35rem;
}
.product-filter-select2 .select2-container--default.select2-container--focus .select2-selection--multiple,
.product-filter-select2 .select2-container--default.select2-container--open .select2-selection--multiple {
    border-color: var(--ui-primary, #042A5F);
    box-shadow: 0 0 0 3px var(--ui-primary-soft, rgba(4, 42, 95, 0.14));
}
.product-filter-select2 .select2-selection__choice {
    background-color: var(--ui-blue-bg, rgba(78, 115, 223, 0.1)) !important;
    border: none !important;
    border-radius: 8px !important;
    color: var(--ui-blue-fg, #4e73df) !important;
    font-weight: 600;
    padding: 2px 8px !important;
}
.product-filter-select2 .select2-selection__choice__remove {
    color: var(--ui-blue-fg, #4e73df) !important;
    margin-right: 4px !important;
}
.product-filter-select2 .select2-search--inline .select2-search__field {
    margin-top: 6px;
}
</style>
