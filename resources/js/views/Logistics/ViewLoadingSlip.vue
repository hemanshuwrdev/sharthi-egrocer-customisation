<template>
    <div class="container-fluid py-4" v-if="slip">
        <!-- Header -->
        <div class="row align-items-center mb-4">
            <div class="col">
                <h1 class="h3 text-dark font-weight-bold mb-1">
                    <i class="fa fa-info-circle text-primary mr-2"></i>Loading Slip: {{ slip.slip_no }}
                </h1>
                <p class="text-muted mb-0">Detailed view of planned route sequence, loaded goods, and vehicle status.</p>
            </div>
            <div class="col-auto d-flex gap-2">
                <router-link to="/loading_slips" class="btn btn-outline-secondary font-weight-bold rounded-pill">
                    <i class="fa fa-arrow-left mr-2"></i>Back to Slips
                </router-link>
                <button @click="printSlip" class="btn btn-secondary font-weight-bold rounded-pill">
                    <i class="fa fa-print mr-2"></i>Print Slip
                </button>
                <button v-if="slip.status == 0" @click="dispatchSlip" class="btn btn-success font-weight-bold rounded-pill">
                    <i class="fa fa-send mr-2"></i>Dispatch Run
                </button>
            </div>
        </div>

        <div class="row">
            <!-- Left Side: Summary Cards -->
            <div class="col-lg-4 mb-4">
                <!-- Status Badge Card -->
                <div class="card border-0 shadow-sm rounded-lg mb-4 text-center p-4" :class="slip.status == 0 ? 'bg-soft-warning' : 'bg-soft-success'">
                    <div class="h6 font-weight-bold text-uppercase mb-1">Distribution Status</div>
                    <div class="h3 font-weight-bold mb-0" :class="slip.status == 0 ? 'text-warning' : 'text-success'">
                        <i :class="slip.status == 0 ? 'fa fa-clock-o' : 'fa fa-truck'"></i>
                        {{ slip.status == 0 ? 'Planned' : 'Dispatched' }}
                    </div>
                    <p class="text-muted mt-2 mb-0 small" v-if="slip.status == 0">Warehouse operations are active. Ready for driver loading.</p>
                    <p class="text-muted mt-2 mb-0 small" v-else>The vehicle is currently on the delivery route.</p>
                </div>

                <!-- Vehicle Details -->
                <div class="card border-0 shadow-sm rounded-lg mb-4">
                    <div class="card-header bg-white border-0 py-3">
                        <h6 class="m-0 font-weight-bold text-dark">Vehicle Information</h6>
                    </div>
                    <div class="card-body pt-0">
                        <div class="d-flex align-items-center mb-3">
                            <div class="avatar-circle bg-soft-primary mr-3"><i class="fa fa-truck text-primary"></i></div>
                            <div>
                                <div class="font-weight-bold text-dark" v-if="slip.vehicle">{{ slip.vehicle.name }}</div>
                                <span class="badge bg-soft-secondary font-weight-bold text-dark border" v-if="slip.vehicle">{{ slip.vehicle.vehicle_number }}</span>
                            </div>
                        </div>
                        <div class="border-top pt-3">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Total Allowed Capacity:</span>
                                <span class="font-weight-bold text-dark" v-if="slip.vehicle">{{ slip.vehicle.capacity }} kg</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Allocated Run Weight:</span>
                                <span class="font-weight-bold text-dark">{{ slip.total_weight }} kg</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span class="text-muted">Used Capacity Ratio:</span>
                                <span class="font-weight-bold" :class="loadRatioClass" v-if="slip.vehicle">{{ loadRatioPercent.toFixed(1) }}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Driver Details -->
                <div class="card border-0 shadow-sm rounded-lg mb-4">
                    <div class="card-header bg-white border-0 py-3">
                        <h6 class="m-0 font-weight-bold text-dark">Driver Information</h6>
                    </div>
                    <div class="card-body pt-0">
                        <div class="d-flex align-items-center mb-3" v-if="slip.driver">
                            <div class="avatar-circle bg-soft-info mr-3"><i class="fa fa-user text-info"></i></div>
                            <div>
                                <div class="font-weight-bold text-dark">{{ slip.driver.name }}</div>
                                <small class="text-muted">{{ slip.driver.mobile }}</small>
                            </div>
                        </div>
                        <div class="border-top pt-3" v-if="slip.driver">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">License Plate Number:</span>
                                <span class="font-weight-bold text-dark">{{ slip.driver.license_plate || 'Active Rider' }}</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span class="text-muted">Run Date:</span>
                                <span class="font-weight-bold text-dark">{{ formatDate(slip.created_at) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Side: Sequence Stops -->
            <div class="col-lg-8 mb-4">
                <div class="card border-0 shadow-sm rounded-lg">
                    <div class="card-header bg-white border-0 py-3">
                        <h6 class="m-0 font-weight-bold text-dark">Logical Route Sequence (Optimized Proximity)</h6>
                    </div>
                    <div class="card-body p-0">
                        <div class="timeline p-4">
                            <div v-for="(order, idx) in orders" :key="order.id" class="timeline-item mb-4 d-flex">
                                <!-- Step Number Pin -->
                                <div class="timeline-step mr-3">
                                    <div class="step-circle bg-primary text-white font-weight-bold">{{ idx + 1 }}</div>
                                    <div class="step-line" v-if="idx < orders.length - 1"></div>
                                </div>
                                <!-- Stop Info Card -->
                                <div class="card border w-100 rounded-lg overflow-hidden shadow-none">
                                    <div class="card-body py-3">
                                        <div class="row align-items-center">
                                            <div class="col">
                                                <div class="d-flex align-items-center gap-2 mb-1">
                                                    <h5 class="h6 font-weight-bold text-dark mb-0">Stop: {{ order.user_name }}</h5>
                                                    <span class="badge bg-soft-info">Order #{{ order.id }}</span>
                                                </div>
                                                <p class="text-muted text-sm mb-2"><i class="fa fa-map-marker mr-1 text-danger"></i>{{ order.customer_address }}</p>
                                                <!-- Item list summary -->
                                                <div class="bg-light p-2 rounded small text-dark" v-if="order.items && order.items.length > 0">
                                                    <div class="font-weight-bold mb-1 border-bottom pb-1">Items to Unload:</div>
                                                    <div v-for="item in order.items" :key="item.id" class="d-flex justify-content-between">
                                                        <span>{{ item.product_name }} ({{ item.variant_name }})</span>
                                                        <span class="font-weight-bold">x{{ item.quantity }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-auto text-right border-left pl-4">
                                                <div class="text-xs font-weight-bold text-muted text-uppercase mb-1">Stop Value</div>
                                                <div class="h6 font-weight-bold text-dark mb-2">₹{{ order.final_total }}</div>
                                                <div class="text-xs font-weight-bold text-muted text-uppercase mb-1">Weight</div>
                                                <div class="font-weight-bold text-dark">{{ order.weight }} kg</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ViewLoadingSlip',
    data() {
        return {
            slip: null,
            orders: []
        };
    },
    computed: {
        loadRatioPercent() {
            if (!this.slip || !this.slip.vehicle) return 0;
            return (parseFloat(this.slip.total_weight) / parseFloat(this.slip.vehicle.capacity)) * 100;
        },
        loadRatioClass() {
            if (this.loadRatioPercent > 99) return 'text-danger';
            if (this.loadRatioPercent > 80) return 'text-warning';
            return 'text-success';
        }
    },
    mounted() {
        this.getSlipDetails();
    },
    methods: {
        getSlipDetails() {
            const id = this.$route.params.id;
            axios.get(this.$apiUrl + '/loading_slips/view/' + id)
                .then(res => {
                    if (res.data.status === 1) {
                        this.slip = res.data.data.slip;
                        this.orders = res.data.data.orders;
                    } else {
                        this.showError(res.data.message);
                    }
                }).catch(err => {
                    this.showError('Could not load slip details.');
                });
        },
        dispatchSlip() {
            this.$swal.fire({
                title: 'Confirm Dispatch?',
                text: 'This will change status to Dispatched and update all assigned orders to "Out for Delivery"!',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, Dispatch Now',
                confirmButtonColor: '#1cc88a',
                cancelButtonColor: '#858796',
            }).then(result => {
                if (result.isConfirmed) {
                    axios.post(this.$apiUrl + '/loading_slips/dispatch', { id: this.slip.id })
                        .then(res => {
                            if (res.data.status === 1) {
                                this.showMessage('success', res.data.message);
                                this.getSlipDetails();
                            } else {
                                this.showError(res.data.message);
                            }
                        }).catch(err => {
                            this.showError('An error occurred during dispatch.');
                        });
                }
            });
        },
        printSlip() {
            window.open(this.$baseUrl + '/api/loading_slips/print/' + this.slip.id, '_blank');
        },
        formatDate(dateStr) {
            return moment(dateStr).format('DD-MM-YYYY hh:mm A');
        }
    }
};
</script>

<style scoped>
.bg-soft-primary {
    background-color: rgba(78, 115, 223, 0.1) !important;
    color: #4e73df !important;
}
.bg-soft-info {
    background-color: rgba(54, 185, 204, 0.1) !important;
    color: #36b9cc !important;
}
.bg-soft-success {
    background-color: rgba(28, 200, 138, 0.1) !important;
    color: #1cc88a !important;
}
.bg-soft-warning {
    background-color: rgba(246, 194, 62, 0.1) !important;
    color: #f6c23e !important;
}
.bg-soft-secondary {
    background-color: rgba(133, 135, 150, 0.1) !important;
    color: #858796 !important;
}
.avatar-circle {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
}
.timeline-step {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.step-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    z-index: 2;
}
.step-line {
    position: absolute;
    top: 32px;
    bottom: -24px;
    width: 2px;
    background-color: #e3e6f0;
    z-index: 1;
}
.gap-2 {
    gap: 0.5rem;
}
.rounded-pill {
    border-radius: 50rem !important;
}
</style>
