<template>
    <div class="container-fluid py-4">
        <!-- Header Section -->
        <div class="row align-items-center mb-4">
            <div class="col">
                <h1 class="h3 font-weight-bold mb-1">
                    <i class="fa fa-file-text text-primary mr-2"></i>{{ __('loading_slips_and_dispatches') }}
                </h1>
                <p class="text-muted mb-0">{{ __('track_and_dispatch_warehouse_loading_slips') }}</p>
            </div>
            <div class="col-auto">
                <router-link :to="urlPrefix + '/loading_slips/create'" class="btn btn-primary btn-lg shadow-sm font-weight-bold rounded-pill">
                    <i class="fa fa-plus-circle mr-2"></i>{{ __('plan_new_slip') }}
                </router-link>
            </div>
        </div>

        <!-- Listing Card -->
        <div class="card border-0 shadow-sm rounded-lg overflow-hidden">
            <div class="card-header border-0 py-3">
                <h6 class="m-0 font-weight-bold">{{ __('distribution_runs') }}</h6>
            </div>
            <div class="card-body p-0">
                <div class="p-3 border-bottom">
                    <b-row class="mb-2">
                        <b-col md="4" offset-md="7">
                            <h6 class="box-title">{{ __('search') }}</h6>
                            <b-form-input id="filter-input" v-model="filter" @input="getSlips" type="search"
                                :placeholder="__('search_by_slip_no_vehicle_driver')"></b-form-input>
                        </b-col>
                        <b-col md="1" class="text-center">
                            <h6 class="box-title" style="visibility: hidden;">{{ __('refresh') }}</h6>
                            <button class="btn btn-primary btn_refresh" v-b-tooltip.hover :title="__('refresh')"
                                @click="getSlips()">
                                <i class="fa fa-refresh" aria-hidden="true"></i>
                            </button>
                        </b-col>
                    </b-row>
                </div>
                <div class="table-responsive">
                    <table class="table align-items-center table-flush table-hover mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th class="py-3 font-weight-bold text-muted">{{ __('slip_no') }}</th>
                                <th class="py-3 font-weight-bold text-muted">{{ __('vehicle_details') }}</th>
                                <th class="py-3 font-weight-bold text-muted">{{ __('driver_rider') }}</th>
                                <th class="py-3 font-weight-bold text-muted text-center">{{ __('orders') }}</th>
                                <th class="py-3 font-weight-bold text-muted text-right">{{ __('total_weight') }}</th>
                                <th class="py-3 font-weight-bold text-muted text-center">{{ __('status') }}</th>
                                <th class="py-3 font-weight-bold text-muted text-center">{{ __('actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="slip in slips" :key="slip.id" class="transition-all">
                                <td class="font-weight-bold text-primary py-3">
                                    <router-link :to="urlPrefix + '/loading_slips/view/' + slip.id">
                                        {{ slip.slip_no }}
                                    </router-link>
                                </td>
                                <td>
                                    <div class="font-weight-bold" v-if="slip.vehicle">{{ slip.vehicle.name }}</div>
                                    <small class="text-muted" v-if="slip.vehicle">{{ slip.vehicle.vehicle_number }}</small>
                                </td>
                                <td>
                                    <div class="font-weight-bold" v-if="slip.driver">{{ slip.driver.name }}</div>
                                    <small class="text-muted" v-if="slip.driver">{{ slip.driver.mobile }}</small>
                                </td>
                                <td class="text-center font-weight-bold">
                                    <span class="badge bg-soft-info text-info">{{ slip.total_orders }} {{ __('orders') }}</span>
                                </td>
                                <td class="text-right font-weight-bold">
                                    {{ slip.total_weight }} {{ __('kg') }}
                                </td>
                                <td class="text-center">
                                    <span v-if="slip.status == 0" class="badge bg-soft-warning font-weight-bold">
                                        <i class="fa fa-clock-o mr-1 text-warning"></i> {{ __('planned') }}
                                    </span>
                                    <span v-else class="badge bg-soft-success font-weight-bold">
                                        <i class="fa fa-truck mr-1 text-success"></i> {{ __('dispatched') }}
                                    </span>
                                </td>
                                <td class="text-center">
                                    <div class="d-flex align-items-center justify-content-center gap-2">
                                        <router-link :to="urlPrefix + '/loading_slips/view/' + slip.id" class="btn btn-sm btn-soft-primary" :title="__('view_details')">
                                            <i class="fa fa-eye"></i>
                                        </router-link>
                                        
                                        <button v-if="slip.status == 0" @click="dispatchSlip(slip.id)" class="btn btn-sm btn-soft-success" :title="__('dispatch_out_for_delivery')">
                                            <i class="fa fa-send"></i> {{ __('dispatch') }}
                                        </button>

                                        <button @click="printSlip(slip.id)" class="btn btn-sm btn-soft-secondary" :title="__('print_loading_slip')">
                                            <i class="fa fa-print"></i> {{ __('print') }}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="slips.length === 0">
                                <td colspan="7" class="text-center py-5 text-muted">
                                    <i class="fa fa-folder-open fa-2x mb-3 text-light"></i>
                                    <p class="mb-0">{{ __('no_distribution_slips_found') }}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- Pagination -->
            <div class="card-footer border-0 py-3" v-if="total > per_page">
                <b-pagination v-model="page" :total-rows="total" :per-page="per_page" align="right" class="mb-0" @input="getSlips"></b-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ManageLoadingSlips',
    data() {
        return {
            slips: [],
            total: 0,
            page: 1,
            per_page: 10,
            filter: '',
            loading: false
        };
    },
    computed: {
        urlPrefix() {
            return this.$route.path.startsWith('/seller') ? '/seller' : '';
        }
    },
    mounted() {
        this.getSlips();
    },
    methods: {
        getSlips() {
            axios.get(this.$apiUrl + '/loading_slips', {
                params: {
                    page: this.page,
                    per_page: this.per_page,
                    filter: this.filter
                }
            }).then(res => {
                if (res.data.status === 1) {
                    this.slips = res.data.data.data || res.data.data;
                    this.total = res.data.data.total || this.slips.length;
                }
            });
        },
        dispatchSlip(id) {
            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('this_will_change_loading_slip_status_to_dispatched_and_update_all_assigned_orders_to_out_for_delivery'),
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: __('yes_dispatch_now'),
                cancelButtonText: __('cancel'),
                confirmButtonColor: '#1cc88a',
                cancelButtonColor: '#858796',
            }).then(result => {
                if (result.isConfirmed) {
                    axios.post(this.$apiUrl + '/loading_slips/dispatch', { id: id })
                        .then(res => {
                            if (res.data.status === 1) {
                                this.showMessage('success', res.data.message);
                                this.getSlips();
                            } else {
                                this.showError(res.data.message);
                            }
                        }).catch(err => {
                            this.showError(__('an_error_occurred_during_dispatch'));
                        });
                }
            });
        },
        printSlip(id) {
            window.open(this.$baseUrl + '/api/loading_slips/print/' + id, '_blank');
        }
    }
};
</script>

<style scoped>
.bg-soft-primary {
    background-color: rgba(78, 115, 223, 0.1) !important;
    color: #4e73df !important;
}
.bg-soft-secondary {
    background-color: rgba(133, 135, 150, 0.1) !important;
    color: #858796 !important;
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
.btn-soft-primary {
    background-color: rgba(78, 115, 223, 0.1);
    color: #4e73df;
    border: none;
    transition: all 0.2s;
}
.btn-soft-primary:hover {
    background-color: #4e73df;
    color: white;
}
.btn-soft-success {
    background-color: rgba(28, 200, 138, 0.1);
    color: #1cc88a;
    border: none;
    transition: all 0.2s;
}
.btn-soft-success:hover {
    background-color: #1cc88a;
    color: white;
}
.btn-soft-secondary {
    background-color: rgba(133, 135, 150, 0.1);
    color: #858796;
    border: none;
    transition: all 0.2s;
}
.btn-soft-secondary:hover {
    background-color: #858796;
    color: white;
}
.transition-all {
    transition: all 0.25s ease-in-out;
}
.hover-bg-light:hover {
    background-color: rgba(248, 249, 250, 0.9) !important;
    transform: translateY(-1px);
}
.gap-2 {
    gap: 0.5rem;
}
.rounded-pill {
    border-radius: 50rem !important;
}
</style>
