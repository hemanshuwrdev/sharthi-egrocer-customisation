<template>
    <div class="cls-page">
        <!-- Header: edge-to-edge bar, separate from the padded canvas below -->
        <div class="cls-header-bar">
            <div class="cls-header-left">
                <span class="page-head-icon"><i class="fa fa-clipboard"></i></span>
                <div>
                    <h1 class="cls-header-title">{{ __('create_loading_slip') }}</h1>
                    <p class="cls-header-subtitle">{{ __('select_delivery_zone_assign_driver_and_vehicle_and_optimize_the_delivery_routing') }}</p>
                </div>
            </div>
            <div class="cls-header-actions">
                <router-link :to="urlPrefix + '/loading_slips'" class="cls-back-btn">
                    <i class="fa fa-arrow-left"></i> {{ __('back_to_slips') }}
                </router-link>
            </div>
        </div>

        <div class="cls-canvas">
        <div class="row">
            <!-- Left Side: Orders List & Filter -->
            <div class="col-lg-8 mb-4">
                <div class="card border-0 shadow-sm rounded-lg h-100">
                    <div class="card-header border-0 py-3">
                        <h6 class="m-0 mb-3 font-weight-bold">{{ __('unassigned_doorstep_orders') }}</h6>
                        <div class="d-flex align-items-center flex-wrap gap-3">
                            <div class="d-flex align-items-center">
                                <label class="mb-0 text-muted font-weight-bold mr-2 text-nowrap">{{ __('filter_by_area') }}:</label>
                                <select v-model="selectedArea" @change="getOrders" class="form-control form-select border shadow-none max-w-200">
                                    <option value="">{{ __('all_areas') }}</option>
                                    <option v-for="area in areas" :key="area.id" :value="area.id">{{ area.name }}</option>
                                </select>
                            </div>
                            <div class="d-flex align-items-center">
                                <label class="mb-0 text-muted font-weight-bold mr-2 text-nowrap">Rescheduled:</label>
                                <select v-model="selectedRescheduled" @change="getOrders" class="form-control form-select border shadow-none max-w-200">
                                    <option value="">All Orders</option>
                                    <option value="1">Rescheduled Only</option>
                                    <option value="0">Regular Only</option>
                                </select>
                            </div>
                            <!-- Product filter: shows only orders containing at least one of the
                                 selected products (matches ANY, not ALL). -->
                            <div class="d-flex align-items-center flex-grow-1 product-filter-select2" style="min-width: 260px;">
                                <label class="mb-0 text-muted font-weight-bold mr-2 text-nowrap">{{ __('Filter by Product') }}:</label>
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
                    <div class="card-body p-0">
                        <div class="overflow-auto" style="max-height: 520px;">
                            <div class="table-responsive">
                            <table class="table align-items-center table-flush table-hover mb-0">
                                <thead class="thead-light">
                                    <tr>
                                        <th style="width: 50px;" class="py-3 pl-4">
                                            <div class="form-check mb-0">
                                                <input @change="toggleSelectAll" v-model="selectAll" class="form-check-input" type="checkbox">
                                            </div>
                                        </th>
                                        <th class="py-3 font-weight-bold text-muted">{{ __('order_id') }}</th>
                                        <th class="py-3 font-weight-bold text-muted">{{ __('customer_name') }}</th>
                                        <th class="py-3 font-weight-bold text-muted text-center">{{ __('zone') }}</th>
                                        <th class="py-3 font-weight-bold text-muted text-center">{{ __('area') }}</th>
                                        <th class="py-3 font-weight-bold text-muted text-right">{{ __('value') }}</th>
                                        <th class="py-3 font-weight-bold text-muted text-right">{{ __('weight_kg') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="order in orders" :key="order.id" class="transition-all cursor-pointer align-middle" @click="toggleOrderSelection(order)">
                                        <td class="py-3 pl-4" @click.stop>
                                            <div class="form-check mb-0">
                                                <input v-model="selectedOrderIds" :value="order.id" class="form-check-input" type="checkbox" @change="calculateWeightSum">
                                            </div>
                                        </td>
                                        <td class="font-weight-bold">#{{ order.id }}</td>
                                        <td>
                                            <div class="d-flex flex-column">
                                                <div class="d-flex align-items-center mb-0">
                                                    <span class="font-weight-bold mr-2">{{ order.user_name }}</span>
                                                    <span v-if="order.is_rescheduled" class="badge bg-soft-warning text-warning font-weight-bold">Rescheduled</span>
                                                </div>
                                                <small class="text-muted text-truncate d-block max-w-250">{{ order.address }}</small>
                                            </div>
                                        </td>
                                        <td class="text-center">
                                            <span class="badge bg-soft-primary font-weight-bold">{{ formatZone(order.city_zone || 'Default') }}</span>
                                        </td>
                                        <td class="text-center">
                                            <span v-if="order.area_name" class="badge bg-soft-warning font-weight-bold">{{ order.area_name }}</span>
                                            <span v-else class="text-muted small">-</span>
                                        </td>
                                        <td class="text-right font-weight-bold">₹{{ order.final_total }}</td>
                                        <td class="text-right font-weight-bold">
                                            {{ order.weight || 0 }} kg
                                        </td>
                                    </tr>
                                    <tr v-if="orders.length === 0">
                                        <td colspan="7" class="text-center py-5 text-muted">
                                            <i class="fa fa-check-circle fa-2x mb-3 text-success"></i>
                                            <p class="mb-0 font-weight-bold">{{ __('hurray_all_doorstep_orders_are_already_assigned_to_slips') }}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        </div>

                        <!-- Footer Summary -->
                        <div class="px-4 py-3 bg-white border-top d-flex justify-content-between font-weight-bold text-success">
                            <div>
                                <span>{{ __('total_weight') }} :- {{ totalFilteredWeight }} {{ __('kg') }}</span>
                            </div>
                            <div>
                                <span>{{ __('orders') }} :- {{ orders.length }}</span>
                            </div>
                            <div>
                                <span>{{ __('total_value') }} :- ₹{{ totalFilteredValue }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Side: Planning & Load Slider -->
            <div class="col-lg-4 mb-4">
                <div class="card border-0 shadow-sm rounded-lg position-sticky" style="top: 24px;">
                    <div class="card-header border-0 py-3">
                        <h6 class="m-0 font-weight-bold">{{ __('logistics_planner') }}</h6>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="openReviewModal">
                            <!-- Vehicle Select -->
                            <div class="form-group mb-3">
                                <label class="form-control-label text-muted font-weight-bold mb-1">{{ __('select_delivery_vehicle') }} <span class="text-danger">*</span></label>
                                <select v-model="selectedVehicleId" class="form-control form-select border shadow-none" required @change="updateVehicleCapacity">
                                    <option value="">-- {{ __('choose_vehicle') }} --</option>
                                    <option v-for="v in vehicles" :key="v.id" :value="v.id">
                                        {{ v.name }} [{{ v.vehicle_number }}] - {{ __('cap') }}: {{ v.capacity }} {{ __('kg') }}
                                    </option>
                                </select>
                            </div>

                            <!-- Driver Select -->
                            <div class="form-group mb-4">
                                <label class="form-control-label text-muted font-weight-bold mb-1">{{ __('select_active_driver_rider') }} <span class="text-danger">*</span></label>
                                <select v-model="selectedDriverId" class="form-control form-select border shadow-none" required>
                                    <option value="">-- {{ __('choose_driver') }} --</option>
                                    <option v-for="d in drivers" :key="d.id" :value="d.id">
                                        {{ d.name }} [{{ d.mobile }}]
                                    </option>
                                </select>
                            </div>

                            <!-- Dynamic Weight Capacity Bar -->
                            <div class="card border-0 p-3 mb-4 rounded-lg">
                                <h6 class="font-weight-bold mb-2">{{ __('live_weight_load_bar') }}</h6>
                                
                                <div v-if="!selectedVehicle" class="text-center py-2 text-muted small">
                                    <i class="fa fa-truck mr-1"></i> {{ __('choose_a_vehicle_to_visualize_weight_limits') }}
                                </div>
                                <div v-else>
                                    <div class="d-flex justify-content-between font-weight-bold mb-1 small">
                                        <span>{{ __('current_load_weight') }}</span>
                                        <span>{{ totalSelectedWeight }} / {{ selectedVehicle.capacity }} {{ __('kg') }}</span>
                                    </div>
                                    <!-- Progress Bar -->
                                    <div class="progress rounded-pill mb-2" style="height: 12px;">
                                        <div class="progress-bar rounded-pill transition-all" role="progressbar" :style="{ width: loadPercent + '%' }" :class="barClass"></div>
                                    </div>
                                    <div class="d-flex justify-content-between text-xs font-weight-bold">
                                        <span :class="loadPercent > 100 ? 'text-danger' : 'text-muted'">
                                            {{ loadPercent.toFixed(1) }}% {{ __('capacity_loaded') }}
                                        </span>
                                        <span class="badge" :class="loadPercent > 100 ? 'bg-danger text-white' : 'bg-secondary'">
                                            {{ selectedOrderIds.length }} {{ __('orders_selected') }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Alert warnings -->
                            <div v-if="loadPercent > 100" class="alert alert-danger border-0 rounded-lg p-3 small mb-4">
                                <i class="fa fa-exclamation-triangle mr-2"></i><strong>{{ __('vehicle_overloaded') }}!</strong> {{ __('selected_load_exceeds_the_vehicle_maximum_capability') }}
                            </div>

                            <!-- Action button -->
                            <button type="submit" class="btn btn-primary btn-block btn-lg shadow-sm font-weight-bold rounded-pill" :disabled="reviewLoading">
                                <b-spinner v-if="reviewLoading" small class="mr-2"></b-spinner>
                                <i v-else class="fa fa-magic mr-2"></i>{{ __('generate_slip_and_sequence_route') }}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Review-before-generate modal: pure display/confirmation, no validation of its
             own — just lets the distributor eyeball the pick list (boxes + loose pieces)
             against physical stock before committing. Confirm runs the unmodified,
             existing createLoadingSlip() flow exactly as before. -->
        <b-modal v-model="showReviewModal" :title="__('Review Before Generating Slip')" size="lg" hide-footer no-close-on-backdrop>
            <p class="text-muted small mb-3">{{ __('Verify you have enough physical stock for each product below. Click a product to see and adjust the orders behind it.') }}</p>
            <div class="review-orders-scroll">
                <div v-for="product in productGroupedSummary" :key="product.key" class="review-order-card">
                    <div class="review-order-header review-product-header" @click="toggleProductExpand(product.key)">
                        <span class="d-flex align-items-center" style="gap: 8px;">
                            <i class="fa" :class="expandedProducts[product.key] ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
                            <span class="review-order-number">{{ product.name }}</span>
                        </span>
                        <span class="d-flex align-items-center" style="gap: 12px;">
                            <span class="text-muted small">{{ product.orders.length }} {{ __('orders') }}</span>
                            <span class="badge bg-soft-primary review-order-retailer">
                                <template v-if="product.boxes !== null">
                                    {{ product.boxes }} {{ product.boxUnit }}<template v-if="product.loose"> + {{ product.loose }} {{ product.pieceUnit }}</template>
                                </template>
                                <template v-else>{{ product.totalQty }}</template>
                            </span>
                        </span>
                    </div>
                    <b-collapse :visible="!!expandedProducts[product.key]">
                        <div class="table-responsive">
                            <table class="table table-sm review-order-table mb-0">
                                <thead>
                                    <tr>
                                        <th>{{ __('order') }} #</th>
                                        <th>{{ __('retailer') }}</th>
                                        <th class="text-end">{{ __('Qty') }}</th>
                                        <th class="text-end">{{ product.boxUnit || __('Boxes') }}</th>
                                        <th class="text-end">{{ product.pieceUnit || __('Loose Pieces') }}</th>
                                        <th class="text-center" style="width:50px;"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="o in product.orders" :key="o.orderId">
                                        <td>#{{ o.orderId }} <span class="text-muted small">({{ o.ordersId }})</span></td>
                                        <td>{{ o.retailerName }}</td>
                                        <td class="text-end">{{ o.qty }}</td>
                                        <td class="text-end">
                                            <span v-if="o.boxes">{{ o.boxes }} {{ product.boxUnit }}</span>
                                            <span v-else class="text-muted">—</span>
                                        </td>
                                        <td class="text-end">
                                            <span v-if="o.loose">{{ o.loose }} {{ product.pieceUnit }}</span>
                                            <span v-else class="text-muted">—</span>
                                        </td>
                                        <td class="text-center">
                                            <button type="button" class="review-order-remove-btn" v-b-tooltip.hover :title="__('Remove this order from the slip')" @click="removeOrderFromReview(o.orderId)">
                                                <i class="fa fa-times"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </b-collapse>
                </div>
                <div v-if="productGroupedSummary.length === 0" class="text-center text-muted py-3">{{ __('no_data_found') }}</div>
            </div>
            <div class="d-flex justify-content-end gap-2">
                <b-button variant="outline-secondary" class="rounded-pill" @click="showReviewModal = false">{{ __('cancel') }}</b-button>
                <b-button variant="primary" class="rounded-pill font-weight-bold" :disabled="loading || reviewSummary.length === 0" @click="confirmGenerate">
                    <b-spinner v-if="loading" small class="mr-2"></b-spinner>
                    <i v-else class="fa fa-check-circle mr-2"></i>{{ __('Confirm & Generate Slip') }}
                </b-button>
            </div>
        </b-modal>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Select2 from 'v-select2-component';

export default {
    name: 'CreateLoadingSlip',
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
                    }
                });
        },
        getDrivers() {
            // Eager load delivery boys that are active
            axios.get(this.apiBase + '/delivery_boys', { params: { status: 1 } })
                .then(res => {
                    if (res.data.status === 1) {
                        this.drivers = res.data.data.data || res.data.data;
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
.bg-soft-primary {
    background-color: rgba(78, 115, 223, 0.1) !important;
    color: #4e73df !important;
}
.bg-soft-warning {
    background-color: rgba(246, 194, 62, 0.1) !important;
    color: #f6c23e !important;
}
.max-w-200 {
    max-width: 200px;
}
.max-w-250 {
    max-width: 250px;
}
.transition-all {
    transition: all 0.25s ease-in-out;
}
.cursor-pointer {
    cursor: pointer;
}
.gap-2 {
    gap: 0.5rem;
}
.text-xs {
    font-size: 0.75rem;
}
.position-sticky {
    position: sticky;
}
.review-orders-scroll {
    max-height: 60vh;
    overflow-y: auto;
    padding-right: 4px;
    margin-bottom: 1rem;
}
.review-order-card {
    border: 1px solid var(--app-card-border, #e6eaf2);
    border-radius: 0.6rem;
    overflow: hidden;
    background-color: var(--app-card-bg, #fff);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    margin-bottom: 1.25rem;
}
.review-order-card:last-child {
    margin-bottom: 0;
}
.review-order-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 0.6rem 1rem;
    background-color: var(--app-thead-bg, #f7f9fc);
    border-bottom: 1px solid var(--app-border, #e9edf5);
}
.review-product-header {
    cursor: pointer;
    user-select: none;
}
.review-product-header:hover {
    background-color: var(--app-hover, #f0f2f7);
}
.review-order-number {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--app-ink, #0f172a);
}
.review-order-code {
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--app-muted, #64748b);
    margin-left: 4px;
}
.review-order-retailer {
    font-size: 0.75rem;
    font-weight: 500;
}
.review-order-remove-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background-color: transparent;
    color: var(--app-muted, #94a3b8);
    font-size: 0.75rem;
    line-height: 1;
    transition: background-color 0.15s ease, color 0.15s ease;
}
.review-order-remove-btn:hover {
    background-color: rgba(231, 74, 59, 0.12);
    color: #e74a3b;
}
.review-order-table thead th {
    background-color: rgba(0, 0, 0, 0.015);
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--app-muted, #64748b);
    border-top: none;
    padding: 0.6rem 1rem;
}
.review-order-table td {
    padding: 0.6rem 1rem;
    font-size: 0.875rem;
    color: var(--app-ink, #0f172a);
    border-color: var(--app-border, #e9edf5);
}
.review-order-table tbody tr:last-child td {
    border-bottom: none;
}
.page-head-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin-right: 12px;
    border-radius: 0.6rem;
    background-color: rgba(78, 115, 223, 0.1);
    color: #4e73df;
    font-size: 1.05rem;
    flex-shrink: 0;
}

/* Header: edge-to-edge bar sitting above a distinct, softly-tinted canvas —
   this page's root has no padding of its own so the bar can span full width;
   the canvas below carries the padding + background instead. */
.cls-page {
    min-height: 100%;
}
.cls-header-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    background-color: var(--app-card-bg, #fff);
    border-bottom: 1px solid var(--app-border, #e9edf5);
    padding: 1.25rem 2rem;
}
.cls-header-left {
    display: flex;
    align-items: center;
}
.cls-header-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--app-ink, #0f172a);
    line-height: 1.3;
}
.cls-header-subtitle {
    margin: 0.25rem 0 0;
    font-size: 0.75rem;
    font-weight: 400;
    letter-spacing: 0.02em;
    color: var(--app-muted, #64748b);
}
.cls-header-actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}
.cls-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0.5rem 1rem;
    border: 1px solid var(--app-control-border, #cbd5e1);
    border-radius: 0.5rem;
    background-color: var(--app-surface, #fff);
    color: var(--app-muted, #475569);
    font-weight: 500;
    font-size: 0.875rem;
    text-decoration: none;
    transition: background-color 0.15s ease, color 0.15s ease;
}
.cls-back-btn:hover {
    background-color: var(--app-hover, #f8fafc);
    color: var(--app-ink, #0f172a);
    text-decoration: none;
}
.cls-canvas {
    background-color: var(--app-thead-bg, #f7f9fc);
    padding: 1.5rem 2rem 2rem;
    min-height: 70vh;
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
    background-color: #fff;
    border: 1px solid #dce7f1;
    border-radius: 0.4rem;
    min-height: 38px;
    padding: 0.1rem 0.25rem;
}
.product-filter-select2 .select2-container--default.select2-container--focus .select2-selection--multiple,
.product-filter-select2 .select2-container--default.select2-container--open .select2-selection--multiple {
    border-color: #a7ebcb;
    box-shadow: 0 0 0 0.25rem rgba(86, 199, 146, 0.25);
}
.product-filter-select2 .select2-selection__choice {
    background-color: rgba(78, 115, 223, 0.1) !important;
    border: none !important;
    border-radius: 0.3rem !important;
    color: #4e73df !important;
    font-weight: 600;
    padding: 2px 8px !important;
}
.product-filter-select2 .select2-selection__choice__remove {
    color: #4e73df !important;
    margin-right: 4px !important;
}
.product-filter-select2 .select2-search--inline .select2-search__field {
    margin-top: 4px;
}
</style>
