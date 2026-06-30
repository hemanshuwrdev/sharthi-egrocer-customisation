<template>
    <div class="container-fluid py-4">
        <!-- Header -->
        <div class="row align-items-center mb-4">
            <div class="col">
                <h1 class="h3 font-weight-bold mb-1">
                    <i class="fa fa-clipboard text-primary mr-2"></i>{{ __('create_loading_slip') }}
                </h1>
                <p class="text-muted mb-0">{{ __('select_delivery_zone_assign_driver_and_vehicle_and_optimize_the_delivery_routing') }}</p>
            </div>
            <div class="col-auto">
                <router-link :to="urlPrefix + '/loading_slips'" class="btn btn-outline-secondary btn-lg font-weight-bold rounded-pill">
                    <i class="fa fa-arrow-left mr-2"></i>{{ __('back_to_slips') }}
                </router-link>
            </div>
        </div>

        <div class="row">
            <!-- Left Side: Orders List & Filter -->
            <div class="col-lg-8 mb-4">
                <div class="card border-0 shadow-sm rounded-lg h-100">
                    <div class="card-header border-0 py-3">
                        <div class="row align-items-center">
                            <div class="col-md-4">
                                <h6 class="m-0 font-weight-bold">{{ __('unassigned_doorstep_orders') }}</h6>
                            </div>
                            <!-- Zone & Rescheduled Selector Filters -->
                            <div class="col-md-8">
                                <div class="d-flex align-items-center justify-content-md-end gap-3 flex-wrap">
                                    <div class="d-flex align-items-center">
                                        <label class="mb-0 text-muted font-weight-bold mr-2 text-nowrap">{{ __('filter_by_zone') }}:</label>
                                        <select v-model="selectedZone" @change="getOrders" class="form-control form-select border-0 max-w-200 shadow-none">
                                            <option value="">{{ __('all_zones') }}</option>
                                            <option v-for="zone in zones" :key="zone" :value="zone">{{ formatZone(zone) }}</option>
                                        </select>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <label class="mb-0 text-muted font-weight-bold mr-2 text-nowrap">Rescheduled:</label>
                                        <select v-model="selectedRescheduled" @change="getOrders" class="form-control form-select border-0 max-w-200 shadow-none">
                                            <option value="">All Orders</option>
                                            <option value="1">Rescheduled Only</option>
                                            <option value="0">Regular Only</option>
                                        </select>
                                    </div>
                                </div>
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
                                        <th class="py-3 font-weight-bold text-muted text-right">{{ __('value') }}</th>
                                        <th class="py-3 font-weight-bold text-muted text-right">{{ __('weight_kg') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="order in orders" :key="order.id" class="transition-all cursor-pointer" @click="toggleOrderSelection(order)">
                                        <td class="py-3 pl-4" @click.stop>
                                            <div class="form-check mb-0">
                                                <input v-model="selectedOrderIds" :value="order.id" class="form-check-input" type="checkbox" @change="calculateWeightSum">
                                            </div>
                                        </td>
                                        <td class="font-weight-bold">#{{ order.id }}</td>
                                        <td>
                                            <div class="d-flex align-items-center mb-0">
                                                <span class="font-weight-bold mr-2">{{ order.user_name }}</span>
                                                <span v-if="order.is_rescheduled" class="badge bg-soft-warning text-warning font-weight-bold">Rescheduled</span>
                                            </div>
                                            <small class="text-muted text-truncate d-inline-block max-w-250">{{ order.address }}</small>
                                        </td>
                                        <td class="text-center">
                                            <span class="badge bg-soft-primary font-weight-bold">{{ formatZone(order.city_zone || 'Default') }}</span>
                                        </td>
                                        <td class="text-right font-weight-bold">₹{{ order.final_total }}</td>
                                        <td class="text-right font-weight-bold">
                                            {{ order.weight || 0 }} kg
                                        </td>
                                    </tr>
                                    <tr v-if="orders.length === 0">
                                        <td colspan="6" class="text-center py-5 text-muted">
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
                        <form @submit.prevent="createLoadingSlip">
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
                            <button type="submit" class="btn btn-primary btn-block btn-lg shadow-sm font-weight-bold rounded-pill" :disabled="loading || selectedOrderIds.length === 0 || loadPercent > 100">
                                <b-spinner v-if="loading" small class="mr-2"></b-spinner>
                                <i v-else class="fa fa-magic mr-2"></i>{{ __('generate_slip_and_sequence_route') }}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'CreateLoadingSlip',
    data() {
        return {
            orders: [],
            zones: [],
            vehicles: [],
            drivers: [],
            selectedZone: '',
            selectedRescheduled: '',
            selectedVehicleId: '',
            selectedVehicle: null,
            selectedDriverId: '',
            selectedOrderIds: [],
            selectAll: false,
            totalSelectedWeight: 0,
            loadPercent: 0,
            loading: false
        };
    },
    computed: {
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
        this.getZones();
        this.getVehicles();
        this.getDrivers();
        this.getOrders();
    },
    methods: {
        getZones() {
            axios.get(this.apiBase + '/loading_slips/zones')
                .then(res => {
                    if (res.data.status === 1) {
                        this.zones = res.data.data;
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
            axios.get(this.apiBase + '/loading_slips/orders', {
                params: {
                    zone: this.selectedZone,
                    is_rescheduled: this.selectedRescheduled
                }
            }).then(res => {
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
            
            if (this.selectedVehicle) {
                this.loadPercent = Math.min((this.totalSelectedWeight / parseFloat(this.selectedVehicle.capacity)) * 100, 120);
            } else {
                this.loadPercent = 0;
            }
        },
        formatZone(zone) {
            if (!zone) return 'All';
            return zone.charAt(0).toUpperCase() + zone.slice(1);
        },
        createLoadingSlip(confirmStock = false) {
            this.loading = true;
            axios.post(this.apiBase + '/loading_slips/save', {
                vehicle_id: this.selectedVehicleId,
                driver_id: this.selectedDriverId,
                order_ids: this.selectedOrderIds,
                confirm_stock_shortage: confirmStock
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
</style>
