<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('trip_reconciliation') }}</h3>
                        <p class="text-subtitle text-muted">{{ __('all_trips') }}</p>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item">
                                    <router-link to="/seller/dashboard">{{ __('dashboard') }}</router-link>
                                </li>
                                <li class="breadcrumb-item active">{{ __('trip_reconciliation') }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

            <section class="section">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <h4 class="card-title mb-0">{{ __('all_trips') }}</h4>
                        <div class="d-flex gap-2">
                            <input
                                type="text"
                                v-model="filter"
                                @input="load"
                                class="form-control form-control-sm"
                                :placeholder="__('search') + ' ' + __('slip_no') + ' / ' + __('driver')"
                                style="min-width:220px">
                            <button class="btn btn-sm btn-outline-secondary" @click="load">
                                <i class="fa fa-refresh"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <div v-if="loading" class="text-center py-5"><b-spinner></b-spinner></div>
                        <div v-else-if="slips.length === 0" class="text-center text-muted py-5">
                            <i class="fa fa-truck fa-2x mb-2 d-block"></i>
                            {{ __('no_data_found') }}
                        </div>
                        <div v-else class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th class="ps-3">{{ __('slip_no') }}</th>
                                        <th>{{ __('driver_rider') }}</th>
                                        <th>{{ __('vehicle_details') }}</th>
                                        <th class="text-center">{{ __('orders') }}</th>
                                        <th class="text-center">{{ __('status') }}</th>
                                        <th class="text-center">{{ __('reconciliation_status') }}</th>
                                        <th class="text-center">{{ __('actions') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="slip in slips" :key="slip.id">
                                        <td class="ps-3">
                                            <span class="fw-bold text-primary">{{ slip.slip_no }}</span>
                                        </td>
                                        <td>
                                            <div class="fw-semibold">{{ slip.driver ? slip.driver.name : '-' }}</div>
                                            <div class="text-muted small">{{ slip.driver ? slip.driver.mobile : '' }}</div>
                                        </td>
                                        <td>
                                            <div class="fw-semibold">{{ slip.vehicle ? slip.vehicle.name : '-' }}</div>
                                            <div class="text-muted small">{{ slip.vehicle ? slip.vehicle.vehicle_number : '' }}</div>
                                        </td>
                                        <td class="text-center">
                                            <span class="badge bg-primary">{{ slip.total_orders }}</span>
                                        </td>
                                        <td class="text-center">
                                            <span class="badge" :class="slipStatusClass(slip.status)">
                                                <i :class="slipStatusIcon(slip.status)" class="me-1"></i>
                                                {{ slip.status_text }}
                                            </span>
                                        </td>
                                        <td class="text-center">
                                            <span class="recon-pill" :class="reconClass(slip.reconciliation_status || 'unreconciled')">
                                                <i :class="reconIcon(slip.reconciliation_status || 'unreconciled')" class="me-1"></i>
                                                {{ reconLabel(slip.reconciliation_status || 'unreconciled') }}
                                            </span>
                                        </td>
                                        <td class="text-center">
                                            <router-link
                                                v-if="slip.status >= 1"
                                                :to="'/seller/trips/' + slip.id"
                                                class="btn btn-sm btn-primary">
                                                <i class="fa fa-retweet mr-1"></i> {{ __('reconcile') }}
                                            </router-link>
                                            <span v-else class="text-muted small">{{ __('not_dispatched') }}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer py-2" v-if="total > perPage">
                        <b-pagination
                            v-model="page"
                            :total-rows="total"
                            :per-page="perPage"
                            align="right"
                            class="mb-0"
                            @input="load">
                        </b-pagination>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SellerTripsList',
    data() {
        return {
            loading: false,
            slips:   [],
            total:   0,
            page:    1,
            perPage: 10,
            filter:  '',
        };
    },
    created() {
        this.load();
    },
    methods: {
        load() {
            this.loading = true;
            axios.get(this.$apiUrl + '/seller/trips', {
                params: { page: this.page, filter: this.filter },
            }).then(res => {
                this.slips   = res.data.data.data || res.data.data || [];
                this.total   = res.data.data.total || this.slips.length;
                this.loading = false;
            }).catch(() => { this.loading = false; });
        },
        slipStatusClass(s) {
            return { 0: 'bg-warning text-dark', 1: 'bg-info', 2: 'bg-success', 3: 'bg-danger' }[s] || 'bg-secondary';
        },
        slipStatusIcon(s) {
            return { 0: 'fa fa-clock-o', 1: 'fa fa-truck', 2: 'fa fa-check-circle', 3: 'fa fa-times-circle' }[s] || 'fa fa-circle';
        },
        reconLabel(s) {
            return {
                unreconciled: __('unreconciled'),
                partial_match: __('partial_match'),
                full_match: __('full_match'),
                overpaid: __('overpaid'),
            }[s] || s;
        },
        reconIcon(s) {
            return {
                unreconciled:  'fa fa-circle-o',
                partial_match: 'fa fa-exclamation-triangle',
                full_match:    'fa fa-check-circle',
                overpaid:      'fa fa-arrow-up',
            }[s] || 'fa fa-circle-o';
        },
        reconClass(s) {
            return {
                unreconciled:  'recon-pill--grey',
                partial_match: 'recon-pill--orange',
                full_match:    'recon-pill--green',
                overpaid:      'recon-pill--blue',
            }[s] || 'recon-pill--grey';
        },
    },
};
</script>

<style scoped>
.recon-pill {
    display: inline-flex; align-items: center;
    font-size: 11px; font-weight: 700;
    padding: 4px 10px; border-radius: 20px;
}
.recon-pill--grey   { background: #f3f4f6; color: #6b7280; }
.recon-pill--orange { background: #fff7ed; color: #ea580c; }
.recon-pill--green  { background: #dcfce7; color: #16a34a; }
.recon-pill--blue   { background: #e0f2fe; color: #0284c7; }
</style>
