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
                        <div class="d-flex gap-2 align-items-center flex-wrap">
                            <!-- Type filter tabs -->
                            <div class="btn-group btn-group-sm" role="group">
                                <button
                                    v-for="t in typeOptions" :key="t.value"
                                    type="button"
                                    class="btn"
                                    :class="typeFilter === t.value ? 'btn-primary' : 'btn-outline-secondary'"
                                    @click="setType(t.value)">
                                    {{ t.label }}
                                </button>
                            </div>
                            <input
                                type="text"
                                v-model="filter"
                                @input="load"
                                class="form-control form-control-sm"
                                :placeholder="__('search') + ' ' + __('driver') + ' / ' + __('salesman')"
                                style="min-width:200px">
                            <button class="btn btn-sm btn-outline-secondary" @click="load">
                                <i class="fa fa-refresh"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <div v-if="loading" class="text-center py-5"><b-spinner></b-spinner></div>
                        <div v-else-if="rows.length === 0" class="text-center text-muted py-5">
                            <i class="fa fa-users fa-2x mb-2 d-block"></i>
                            {{ __('no_data_found') }}
                        </div>
                        <div v-else class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th class="ps-3">{{ __('date') }}</th>
                                        <th>{{ __('type') }}</th>
                                        <th>{{ __('driver_rider') }}</th>
                                        <th class="text-end">{{ __('cash') }}</th>
                                        <th class="text-center">{{ __('status') }}</th>
                                        <th class="text-center">{{ __('reconciliation_status') }}</th>
                                        <th class="text-center">{{ __('actions') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="row in rows" :key="row.type + '_' + row.id">
                                        <td class="ps-3">
                                            <span class="fw-bold">{{ row.date }}</span>
                                        </td>
                                        <td>
                                            <span class="badge" :class="row.type === 'driver' ? 'bg-info' : 'bg-purple'">
                                                <i :class="row.type === 'driver' ? 'fa fa-truck' : 'fa fa-user-tie'" class="me-1"></i>
                                                {{ row.type === 'driver' ? __('driver') : __('salesman') }}
                                            </span>
                                        </td>
                                        <td>
                                            <div class="fw-semibold">{{ row.person_name }}</div>
                                            <div class="text-muted small">{{ row.person_mobile }}</div>
                                        </td>
                                        <td class="text-end">
                                            <span class="fw-bold">{{ $currency }} {{ fmt(row.total_cash) }}</span>
                                            <div class="text-muted small" v-if="row.total_upi > 0 || row.total_cheque > 0">
                                                + {{ $currency }} {{ fmt((row.total_upi || 0) + (row.total_cheque || 0) + (row.total_signature || 0)) }} digital
                                            </div>
                                        </td>
                                        <td class="text-center">
                                            <span class="badge" :class="settlementStatusClass(row.status)">
                                                <i :class="settlementStatusIcon(row.status)" class="me-1"></i>
                                                {{ row.status_text }}
                                            </span>
                                        </td>
                                        <td class="text-center">
                                            <span class="recon-pill" :class="reconClass(row.reconciliation_status || 'unreconciled')">
                                                <i :class="reconIcon(row.reconciliation_status || 'unreconciled')" class="me-1"></i>
                                                {{ reconLabel(row.reconciliation_status || 'unreconciled') }}
                                            </span>
                                        </td>
                                        <td class="text-center">
                                            <router-link
                                                v-if="row.id"
                                                :to="{ path: '/seller/trips/' + row.id, query: { type: row.type } }"
                                                class="btn btn-sm"
                                                :class="row.status === 'reconciled' ? 'btn-outline-success' : 'btn-primary'">
                                                <i :class="row.status === 'reconciled' ? 'fa fa-check-circle' : 'fa fa-retweet'" class="me-1"></i>
                                                {{ row.status === 'reconciled' ? __('view') : __('reconcile') }}
                                            </router-link>
                                            <span v-else class="text-muted small">-</span>
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
            loading:    false,
            rows:       [],
            total:      0,
            page:       1,
            perPage:    15,
            filter:     '',
            typeFilter: 'all',
            typeOptions: [
                { value: 'all',      label: 'All' },
                { value: 'driver',   label: 'Driver' },
                { value: 'salesman', label: 'Salesman' },
            ],
        };
    },
    created() {
        this.load();
    },
    methods: {
        setType(t) {
            this.typeFilter = t;
            this.page = 1;
            this.load();
        },
        load() {
            this.loading = true;
            axios.get(this.$apiUrl + '/seller/trips', {
                params: { page: this.page, filter: this.filter, type: this.typeFilter },
            }).then(res => {
                const d      = res.data.data;
                this.rows    = d.data || [];
                this.total   = d.total || this.rows.length;
                this.loading = false;
            }).catch(() => { this.loading = false; });
        },
        fmt(val) {
            if (val == null) return '0.00';
            return parseFloat(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },
        settlementStatusClass(s) {
            return { open: 'bg-warning text-dark', locked: 'bg-info', reconciled: 'bg-success' }[s] || 'bg-secondary';
        },
        settlementStatusIcon(s) {
            return { open: 'fa fa-clock-o', locked: 'fa fa-lock', reconciled: 'fa fa-check-circle' }[s] || 'fa fa-circle';
        },
        reconLabel(s) {
            return {
                unreconciled:  __('unreconciled'),
                partial_match: __('partial_match'),
                full_match:    __('full_match'),
                overpaid:      __('overpaid'),
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
.bg-purple { background-color: #7c3aed !important; color: #fff !important; }

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
