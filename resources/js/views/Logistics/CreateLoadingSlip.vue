<template>
    <div class="container-fluid py-4">
        <!-- Header -->
        <div class="row align-items-center mb-4">
            <div class="col">
                <h1 class="h3 text-dark font-weight-bold mb-1">
                    <i class="fa fa-clipboard text-primary mr-2"></i>Create Loading Slip
                </h1>
                <p class="text-muted mb-0">Select delivery zone, assign driver and vehicle, and optimize the delivery routing.</p>
            </div>
            <div class="col-auto">
                <router-link :to="urlPrefix + '/loading_slips'" class="btn btn-outline-secondary btn-lg font-weight-bold rounded-pill">
                    <i class="fa fa-arrow-left mr-2"></i>Back to Slips
                </router-link>
            </div>
        </div>

        <div class="row">
            <!-- Left Side: Orders List & Filter -->
            <div class="col-lg-8 mb-4">
                <div class="card border-0 shadow-sm rounded-lg h-100">
                    <div class="card-header bg-white border-0 py-3">
                        <div class="row align-items-center">
                            <div class="col-md-6">
                                <h6 class="m-0 font-weight-bold text-dark">Unassigned Doorstep Orders</h6>
                            </div>
                            <!-- Zone Selector Filter -->
                            <div class="col-md-6">
                                <div class="d-flex align-items-center justify-content-md-end gap-2">
                                    <label class="mb-0 text-muted font-weight-bold mr-2 text-nowrap">Filter by Zone:</label>
                                    <select v-model="selectedZone" @change="getOrders" class="form-control form-select bg-light border-0 max-w-200">
                                        <option value="">All Zones</option>
                                        <option v-for="zone in zones" :key="zone" :value="zone">{{ formatZone(zone) }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body p-0 overflow-auto" style="max-height: 600px;">
                        <div class="table-responsive">
                            <table class="table align-items-center table-flush table-hover mb-0">
                                <thead class="thead-light">
                                    <tr>
                                        <th style="width: 40px;" class="text-center py-3">
                                            <div class="form-check">
                                                <input @change="toggleSelectAll" v-model="selectAll" class="form-check-input" type="checkbox">
                                            </div>
                                        </th>
                                        <th class="py-3 font-weight-bold text-muted">Order ID</th>
                                        <th class="py-3 font-weight-bold text-muted">Customer Name</th>
                                        <th class="py-3 font-weight-bold text-muted text-center">Zone</th>
                                        <th class="py-3 font-weight-bold text-muted text-right">Value</th>
                                        <th class="py-3 font-weight-bold text-muted text-right">Weight (kg)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="order in orders" :key="order.id" class="transition-all hover-bg-light cursor-pointer" @click="toggleOrderSelection(order)">
                                        <td class="text-center py-3" @click.stop>
                                            <div class="form-check">
                                                <input v-model="selectedOrderIds" :value="order.id" class="form-check-input" type="checkbox" @change="calculateWeightSum">
                                            </div>
                                        </td>
                                        <td class="font-weight-bold text-dark">#{{ order.id }}</td>
                                        <td>
                                            <div class="font-weight-bold text-dark mb-0">{{ order.user_name }}</div>
                                            <small class="text-muted text-truncate d-inline-block max-w-250">{{ order.address }}</small>
                                        </td>
                                        <td class="text-center">
                                            <span class="badge bg-soft-primary font-weight-bold">{{ formatZone(order.city_zone || 'Default') }}</span>
                                        </td>
                                        <td class="text-right font-weight-bold text-dark">₹{{ order.final_total }}</td>
                                        <td class="text-right font-weight-bold text-dark">
                                            {{ order.weight || 0 }} kg
                                        </td>
                                    </tr>
                                    <tr v-if="orders.length === 0">
                                        <td colspan="6" class="text-center py-5 text-muted">
                                            <i class="fa fa-check-circle fa-2x mb-3 text-success"></i>
                                            <p class="mb-0 font-weight-bold">Hurray! All doorstep orders are already assigned to slips.</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Side: Planning & Load Slider -->
            <div class="col-lg-4 mb-4">
                <div class="card border-0 shadow-sm rounded-lg position-sticky" style="top: 24px;">
                    <div class="card-header bg-white border-0 py-3">
                        <h6 class="m-0 font-weight-bold text-dark">Logistics Planner</h6>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="createLoadingSlip">
                            <!-- Vehicle Select -->
                            <div class="form-group mb-3">
                                <label class="form-control-label text-muted font-weight-bold mb-1">Select Delivery Vehicle <span class="text-danger">*</span></label>
                                <select v-model="selectedVehicleId" class="form-control form-select border shadow-none" required @change="updateVehicleCapacity">
                                    <option value="">-- Choose Vehicle --</option>
                                    <option v-for="v in vehicles" :key="v.id" :value="v.id">
                                        {{ v.name }} [{{ v.vehicle_number }}] - Cap: {{ v.capacity }} kg
                                    </option>
                                </select>
                            </div>

                            <!-- Driver Select -->
                            <div class="form-group mb-4">
                                <label class="form-control-label text-muted font-weight-bold mb-1">Select Active Driver / Rider <span class="text-danger">*</span></label>
                                <select v-model="selectedDriverId" class="form-control form-select border shadow-none" required>
                                    <option value="">-- Choose Driver --</option>
                                    <option v-for="d in drivers" :key="d.id" :value="d.id">
                                        {{ d.name }} [{{ d.mobile }}]
                                    </option>
                                </select>
                            </div>

                            <!-- Dynamic Weight Capacity Bar -->
                            <div class="card bg-light border-0 p-3 mb-4 rounded-lg">
                                <h6 class="font-weight-bold text-dark mb-2">Live Weight Load Bar</h6>
                                
                                <div v-if="!selectedVehicle" class="text-center py-2 text-muted small">
                                    <i class="fa fa-truck mr-1"></i> Choose a vehicle to visualize weight limits
                                </div>
                                <div v-else>
                                    <div class="d-flex justify-content-between font-weight-bold mb-1 small text-dark">
                                        <span>Current Load Weight</span>
                                        <span>{{ totalSelectedWeight }} / {{ selectedVehicle.capacity }} kg</span>
                                    </div>
                                    <!-- Progress Bar -->
                                    <div class="progress rounded-pill mb-2" style="height: 12px;">
                                        <div class="progress-bar rounded-pill transition-all" role="progressbar" :style="{ width: loadPercent + '%' }" :class="barClass"></div>
                                    </div>
                                    <div class="d-flex justify-content-between text-xs font-weight-bold">
                                        <span :class="loadPercent > 100 ? 'text-danger' : 'text-muted'">
                                            {{ loadPercent.toFixed(1) }}% Capacity Loaded
                                        </span>
                                        <span class="badge" :class="loadPercent > 100 ? 'bg-danger text-white' : 'bg-secondary text-dark'">
                                            {{ selectedOrderIds.length }} Orders Selected
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Alert warnings -->
                            <div v-if="loadPercent > 100" class="alert alert-danger border-0 rounded-lg p-3 small mb-4">
                                <i class="fa fa-exclamation-triangle mr-2"></i><strong>Vehicle Overloaded!</strong> Selected load exceeds the vehicle's maximum capability. Please remove some orders before scheduling.
                            </div>

                            <!-- Action button -->
                            <button type="submit" class="btn btn-primary btn-block btn-lg shadow-sm font-weight-bold rounded-pill" :disabled="loading || selectedOrderIds.length === 0 || loadPercent > 100">
                                <b-spinner v-if="loading" small class="mr-2"></b-spinner>
                                <i v-else class="fa fa-magic mr-2"></i>Generate Slip & Sequence Route
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
        barClass() {
            if (this.loadPercent > 100) return 'bg-danger';
            if (this.loadPercent > 85) return 'bg-warning';
            return 'bg-success';
        },
        urlPrefix() {
            return this.$route.path.startsWith('/seller') ? '/seller' : '';
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
            axios.get(this.$apiUrl + '/loading_slips/zones')
                .then(res => {
                    if (res.data.status === 1) {
                        this.zones = res.data.data;
                    }
                });
        },
        getVehicles() {
            axios.get(this.$apiUrl + '/vehicles/active')
                .then(res => {
                    if (res.data.status === 1) {
                        this.vehicles = res.data.data;
                    }
                });
        },
        getDrivers() {
            // Eager load delivery boys that are active
            axios.get(this.$apiUrl + '/delivery_boys', { params: { status: 1 } })
                .then(res => {
                    if (res.data.status === 1) {
                        this.drivers = res.data.data.data || res.data.data;
                    }
                });
        },
        getOrders() {
            axios.get(this.$apiUrl + '/loading_slips/orders', {
                params: { zone: this.selectedZone }
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
        createLoadingSlip() {
            this.loading = true;
            axios.post(this.$apiUrl + '/loading_slips/save', {
                vehicle_id: this.selectedVehicleId,
                driver_id: this.selectedDriverId,
                order_ids: this.selectedOrderIds
            }).then(res => {
                this.loading = false;
                if (res.data.status === 1) {
                    this.showSuccess('Loading Slip generated and route optimized successfully!');
                    this.$router.push(this.urlPrefix + '/loading_slips');
                } else {
                    this.showError(res.data.message);
                }
            }).catch(err => {
                this.loading = false;
                this.showError('An error occurred during slip creation.');
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
.max-w-200 {
    max-width: 200px;
}
.max-w-250 {
    max-width: 250px;
}
.transition-all {
    transition: all 0.25s ease-in-out;
}
.hover-bg-light:hover {
    background-color: rgba(248, 249, 250, 0.9) !important;
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
