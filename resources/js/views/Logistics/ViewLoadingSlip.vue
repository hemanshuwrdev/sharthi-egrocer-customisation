<template>
    <div class="lsv">
        <template v-if="slip">
            <!-- Header -->
            <header class="lsv-head">
                <div class="lsv-head__main">
                    <span class="lsv-eyebrow">{{ __('loading_slip') }}</span>
                    <div class="lsv-head__title">
                        <h1>{{ slip.slip_no }}</h1>
                        <span class="lsv-pill lsv-pill--lg" :class="'lsv-tone--' + slipStatus.tone">
                            <i class="fa" :class="slipStatus.icon"></i> {{ slipStatus.label }}
                        </span>
                    </div>
                    <p class="lsv-head__sub">{{ __('detailed_view_of_planned_route_sequence_loaded_goods_and_vehicle_status') }}</p>
                </div>
                <div class="lsv-head__side">
                    <div class="lsv-actions">
                        <router-link :to="urlPrefix + '/loading_slips'" class="lsv-btn lsv-btn--ghost">
                            <i class="fa fa-arrow-left"></i> {{ __('back_to_slips') }}
                        </router-link>
                        <button @click="printSlip" class="lsv-btn lsv-btn--primary">
                            <i class="fa fa-print"></i> {{ __('print_slip') }}
                        </button>
                        <button v-if="isSeller && slip.status == 0" @click="dispatchSlip" class="lsv-btn lsv-btn--success">
                            <i class="fa fa-paper-plane"></i> {{ __('dispatch_run') }}
                        </button>
                        <button v-if="isSeller && slip.status == 0" @click="cancelSlip" class="lsv-btn lsv-btn--danger">
                            <i class="fa fa-ban"></i> {{ __('cancel_slip') }}
                        </button>
                    </div>
                    <div class="lsv-rundate">
                        <i class="fa fa-calendar-alt"></i> {{ __('run_date') }}: {{ formatDate(slip.created_at) }}
                    </div>
                </div>
            </header>

            <!-- Summary stats -->
            <section class="lsv-stats">
                <div class="lsv-card lsv-stat">
                    <div class="lsv-tile lsv-tone--blue"><i class="fa fa-cube"></i></div>
                    <div class="lsv-stat__body">
                        <span class="lsv-stat__label">{{ __('Total Stops') }}</span>
                        <strong class="lsv-stat__value">{{ orders.length }}</strong>
                        <span class="lsv-stat__hint">{{ __('Deliveries in this route') }}</span>
                    </div>
                </div>

                <div class="lsv-card lsv-stat">
                    <div class="lsv-tile lsv-tone--green"><i class="fa fa-shopping-bag"></i></div>
                    <div class="lsv-stat__body">
                        <span class="lsv-stat__label">{{ __('Allocated Load') }}</span>
                        <strong class="lsv-stat__value">{{ formatNumber(slip.total_weight) }} <small>{{ __('kg') }}</small></strong>
                        <span class="lsv-stat__hint" v-if="hasCapacity">{{ __('Out of') }} {{ formatNumber(slip.vehicle.capacity) }} {{ __('kg') }} {{ __('capacity') }}</span>
                    </div>
                </div>

                <div class="lsv-card lsv-stat">
                    <div class="lsv-tile lsv-tone--purple"><i class="fa fa-truck"></i></div>
                    <div class="lsv-stat__body">
                        <span class="lsv-stat__label">{{ __('Vehicle Capacity') }}</span>
                        <strong class="lsv-stat__value" v-if="hasCapacity">{{ formatNumber(slip.vehicle.capacity) }} <small>{{ __('kg') }}</small></strong>
                        <strong class="lsv-stat__value" v-else>-</strong>
                        <div class="lsv-meter" v-if="hasCapacity">
                            <div class="lsv-meter__track">
                                <div class="lsv-meter__fill" :class="'lsv-meter__fill--' + loadTone" :style="{ width: loadBarWidth + '%' }"></div>
                            </div>
                            <span class="lsv-meter__pct" :class="'lsv-text--' + loadTone">{{ loadRatioPercent.toFixed(1) }}% {{ __('Used') }}</span>
                        </div>
                    </div>
                </div>

                <div class="lsv-card lsv-stat">
                    <div class="lsv-tile lsv-tone--amber"><i class="fa fa-money-bill-wave"></i></div>
                    <div class="lsv-stat__body">
                        <span class="lsv-stat__label">{{ __('Route Value') }}</span>
                        <strong class="lsv-stat__value">{{ $currency }}{{ formatMoney(routeValue) }}</strong>
                        <span class="lsv-stat__hint">{{ __('Across') }} {{ activeStopCount }} {{ activeStopCount === 1 ? __('active stop') : __('active stops') }}</span>
                    </div>
                </div>
            </section>

            <div class="lsv-grid">
                <!-- Left column: vehicle + driver -->
                <aside class="lsv-side">
                    <div class="lsv-card">
                        <div class="lsv-card__head">
                            <div class="lsv-tile lsv-tile--sm lsv-tone--blue"><i class="fa fa-truck"></i></div>
                            <h2>{{ __('vehicle_information') }}</h2>
                            <span class="lsv-pill lsv-pill--dot" :class="'lsv-tone--' + vehicleStatus.tone">
                                <span class="lsv-dot"></span>{{ vehicleStatus.label }}
                            </span>
                        </div>
                        <div class="lsv-card__body">
                            <div class="lsv-person" v-if="slip.vehicle">
                                <div class="lsv-vehicle-art"><i class="fa fa-truck"></i></div>
                                <div>
                                    <div class="lsv-person__name">{{ slip.vehicle.name }}</div>
                                    <span class="lsv-plate">{{ slip.vehicle.vehicle_number }}</span>
                                </div>
                            </div>
                            <ul class="lsv-facts">
                                <li>
                                    <span><i class="fa fa-archive"></i> {{ __('total_allowed_capacity') }}</span>
                                    <strong v-if="hasCapacity">{{ formatNumber(slip.vehicle.capacity) }} {{ __('kg') }}</strong>
                                    <strong v-else>-</strong>
                                </li>
                                <li>
                                    <span><i class="fa fa-shopping-bag"></i> {{ __('allocated_run_weight') }}</span>
                                    <strong>{{ formatNumber(slip.total_weight) }} {{ __('kg') }}</strong>
                                </li>
                                <li v-if="hasCapacity">
                                    <span><i class="fa fa-tachometer-alt"></i> {{ __('used_capacity_ratio') }}</span>
                                    <strong :class="'lsv-text--' + loadTone">{{ loadRatioPercent.toFixed(1) }}%</strong>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="lsv-card">
                        <div class="lsv-card__head">
                            <div class="lsv-tile lsv-tile--sm lsv-tone--green"><i class="fa fa-user"></i></div>
                            <h2>{{ __('driver_information') }}</h2>
                            <span class="lsv-pill lsv-pill--dot lsv-tone--green" v-if="slip.driver">
                                <span class="lsv-dot"></span>{{ __('active_rider') }}
                            </span>
                        </div>
                        <div class="lsv-card__body">
                            <template v-if="slip.driver">
                                <div class="lsv-person">
                                    <div class="lsv-avatar">{{ driverInitials }}</div>
                                    <div>
                                        <div class="lsv-person__name">{{ slip.driver.name }}</div>
                                        <a v-if="slip.driver.mobile" :href="'tel:' + slip.driver.mobile" class="lsv-person__sub">
                                            <i class="fa fa-phone"></i> {{ slip.driver.mobile }}
                                        </a>
                                    </div>
                                </div>
                                <ul class="lsv-facts">
                                    <li v-if="slip.vehicle">
                                        <span><i class="fa fa-id-card"></i> {{ __('Vehicle No') }}</span>
                                        <strong>{{ slip.vehicle.vehicle_number }}</strong>
                                    </li>
                                    <li>
                                        <span><i class="fa fa-calendar-alt"></i> {{ __('run_date') }}</span>
                                        <strong>{{ formatDate(slip.created_at) }}</strong>
                                    </li>
                                </ul>
                            </template>
                            <p class="lsv-empty" v-else>{{ __('No driver assigned') }}</p>
                        </div>
                    </div>
                </aside>

                <!-- Right column: route + progress -->
                <div class="lsv-main">
                    <div class="lsv-card">
                        <div class="lsv-card__head">
                            <div class="lsv-tile lsv-tile--sm lsv-tone--blue"><i class="fa fa-road"></i></div>
                            <div class="lsv-card__titles">
                                <h2>{{ __('Route Sequence') }}</h2>
                                <p>{{ __('logical_route_sequence_optimized_proximity') }}</p>
                            </div>
                            <span class="lsv-pill lsv-tone--blue">{{ orders.length }} {{ orders.length === 1 ? __('Stop') : __('Stops') }}</span>
                        </div>

                        <div class="lsv-card__body">
                            <p class="lsv-empty" v-if="orders.length === 0">{{ __('No stops on this slip') }}</p>

                            <div v-for="(order, idx) in orders" :key="order.id" class="lsv-stop"
                                :class="{ 'lsv-stop--last': idx === orders.length - 1 }">
                                <div class="lsv-stop__rail">
                                    <div class="lsv-stop__node" :class="'lsv-tone--' + stopStatus(order).tone">
                                        <i class="fa fa-check" v-if="stopStatus(order).key === 'delivered'"></i>
                                        <span v-else>{{ idx + 1 }}</span>
                                    </div>
                                    <div class="lsv-stop__line" v-if="idx < orders.length - 1"></div>
                                </div>

                                <div class="lsv-stop__card" :class="{ 'lsv-stop__card--muted': stopStatus(order).muted }">
                                    <div class="lsv-stop__top">
                                        <div class="lsv-stop__who">
                                            <div class="lsv-stop__title">
                                                <h3>{{ order.user_name || '-' }}</h3>
                                                <span class="lsv-chip">{{ __('order') }} #{{ order.id }}</span>
                                                <span class="lsv-pill lsv-pill--dot" :class="'lsv-tone--' + stopStatus(order).tone">
                                                    <span class="lsv-dot"></span>{{ stopStatus(order).label }}
                                                </span>
                                            </div>
                                            <p class="lsv-stop__addr" v-if="order.customer_address">
                                                <i class="fa fa-map-marker"></i> {{ order.customer_address }}
                                            </p>
                                        </div>
                                    </div>

                                    <div class="lsv-items" v-if="order.items && order.items.length > 0">
                                        <button type="button" class="lsv-items__toggle" @click="toggleItems(order)">
                                            <span><i class="fa fa-cubes"></i> {{ __('items_to_unload') }}
                                                <em>({{ order.items.length }} {{ order.items.length === 1 ? __('item') : __('items') }})</em></span>
                                            <i class="fa lsv-items__chev" :class="itemsOpen(order) ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                                        </button>
                                        <ul class="lsv-items__list" v-show="itemsOpen(order)">
                                            <li v-for="item in order.items" :key="item.id">
                                                <span class="lsv-items__name">
                                                    {{ item.product_name }}
                                                    <small v-if="item.variant_name">{{ item.variant_name }}</small>
                                                </span>
                                                <span class="lsv-qty">&times; {{ item.quantity }}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="lsv-stop__foot">
                                        <div>
                                            <span class="lsv-stop__flabel">{{ __('stop_value') }}</span>
                                            <strong>{{ $currency }}{{ formatMoney(order.final_total) }}</strong>
                                        </div>
                                        <div>
                                            <span class="lsv-stop__flabel">{{ __('Total Weight') }}</span>
                                            <strong>{{ formatNumber(order.weight) }} {{ __('kg') }}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="lsv-card">
                        <div class="lsv-card__head">
                            <div class="lsv-tile lsv-tile--sm lsv-tone--purple"><i class="fa fa-clock"></i></div>
                            <div class="lsv-card__titles">
                                <h2>{{ __('Delivery Progress') }}</h2>
                                <p>{{ __('Status of this run and its stops') }}</p>
                            </div>
                            <span class="lsv-pill lsv-tone--slate" v-if="progressStops > 0">
                                {{ completedStops }} / {{ progressStops }} {{ __('delivered') }}
                            </span>
                        </div>

                        <div class="lsv-card__body">
                            <ol class="lsv-steps">
                                <li v-for="step in lifecycle" :key="step.key" class="lsv-step" :class="'lsv-step--' + step.state">
                                    <span class="lsv-step__node"><i class="fa" :class="step.icon"></i></span>
                                    <span class="lsv-step__label">{{ step.label }}</span>
                                    <span class="lsv-step__time" v-if="step.time">{{ step.time }}</span>
                                </li>
                            </ol>

                            <div class="lsv-breakdown" v-if="orders.length > 0">
                                <div class="lsv-segbar">
                                    <span v-for="seg in stopSummary" :key="seg.key" class="lsv-segbar__seg"
                                        :class="'lsv-segbar__seg--' + seg.tone"
                                        :style="{ width: (seg.count / orders.length * 100) + '%' }"
                                        :title="seg.label + ': ' + seg.count"></span>
                                </div>
                                <ul class="lsv-legend">
                                    <li v-for="seg in stopSummary" :key="seg.key">
                                        <span class="lsv-legend__dot" :class="'lsv-segbar__seg--' + seg.tone"></span>
                                        {{ seg.label }} <strong>{{ seg.count }}</strong>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <div class="lsv-loading" v-else>
            <i class="fa fa-spinner fa-spin"></i> {{ __('loading') }}...
        </div>
    </div>
</template>

<script>
import axios from 'axios';

// Order status ids (see App\Models\OrderStatusList).
const ORDER_STATUS = {
    outForDelivery: 5,
    delivered: 6,
    cancelled: 7,
    returned: 8,
    rescheduled: 12,
    partialDelivery: 13,
    notDelivered: 14,
};

export default {
    name: 'ViewLoadingSlip',
    data() {
        return {
            slip: null,
            orders: [],
            // order id -> bool; only holds the stops the user toggled by hand
            itemsToggled: {}
        };
    },
    computed: {
        hasCapacity() {
            return !!(this.slip && this.slip.vehicle && parseFloat(this.slip.vehicle.capacity) > 0);
        },
        loadRatioPercent() {
            if (!this.hasCapacity) return 0;
            return (parseFloat(this.slip.total_weight) / parseFloat(this.slip.vehicle.capacity)) * 100;
        },
        loadBarWidth() {
            const pct = Math.min(this.loadRatioPercent, 100);
            // keep a sliver visible so a tiny but non-zero load doesn't look empty
            return pct > 0 ? Math.max(pct, 2) : 0;
        },
        loadTone() {
            if (this.loadRatioPercent > 99) return 'red';
            if (this.loadRatioPercent > 80) return 'amber';
            return 'green';
        },
        urlPrefix() {
            return this.$route.path.startsWith('/seller') ? '/seller' : '';
        },
        isSeller() {
            return this.$route.path.startsWith('/seller');
        },
        apiBase() {
            return this.isSeller ? this.$sellerApiUrl : this.$apiUrl;
        },
        // slip.status: 0 planned, 1 dispatched, 2 completed, 3 cancelled
        slipStatus() {
            switch (Number(this.slip.status)) {
                case 0: return { label: __('planned'), tone: 'amber', icon: 'fa-clock' };
                case 2: return { label: __('completed'), tone: 'blue', icon: 'fa-check-circle' };
                case 3: return { label: __('cancelled'), tone: 'red', icon: 'fa-ban' };
                default: return { label: __('dispatched'), tone: 'green', icon: 'fa-truck' };
            }
        },
        vehicleStatus() {
            switch (Number(this.slip.status)) {
                case 0: return { label: __('Assigned'), tone: 'amber' };
                case 2: return { label: __('completed'), tone: 'blue' };
                case 3: return { label: __('Released'), tone: 'slate' };
                default: return { label: __('On Route'), tone: 'green' };
            }
        },
        driverInitials() {
            const name = (this.slip && this.slip.driver && this.slip.driver.name || '').trim();
            if (!name) return '?';
            const parts = name.split(/\s+/);
            return ((parts[0][0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
        },
        // Stops that still count towards the run (a cancelled / returned order won't be delivered)
        activeStops() {
            return this.orders.filter(o => ![ORDER_STATUS.cancelled, ORDER_STATUS.returned].includes(Number(o.active_status)));
        },
        activeStopCount() {
            return this.activeStops.length;
        },
        routeValue() {
            return this.activeStops.reduce((sum, o) => sum + (parseFloat(o.final_total) || 0), 0);
        },
        completedStops() {
            return this.orders.filter(o => [ORDER_STATUS.delivered, ORDER_STATUS.partialDelivery].includes(Number(o.active_status))).length;
        },
        progressStops() {
            return this.activeStopCount;
        },
        // Run lifecycle: Created -> Dispatched -> Completed (or a cancelled end state)
        lifecycle() {
            const status = Number(this.slip.status);
            const created = { key: 'created', label: __('Created'), icon: 'fa-file-alt', state: 'done', time: this.formatDate(this.slip.created_at) };
            if (status === 3) {
                return [created, { key: 'cancelled', label: __('cancelled'), icon: 'fa-ban', state: 'cancelled' }];
            }
            return [
                created,
                { key: 'dispatched', label: __('dispatched'), icon: 'fa-truck', state: status === 1 ? 'current' : (status >= 2 ? 'done' : 'pending') },
                { key: 'completed', label: __('completed'), icon: 'fa-flag-checkered', state: status === 2 ? 'done' : 'pending' },
            ];
        },
        // Per-status stop counts for the segmented bar (zero-count statuses are dropped)
        stopSummary() {
            const counts = {};
            const meta = {};
            this.orders.forEach(o => {
                const s = this.stopStatus(o);
                counts[s.key] = (counts[s.key] || 0) + 1;
                meta[s.key] = s;
            });
            const order = ['delivered', 'partial', 'out', 'pending', 'rescheduled', 'notDelivered', 'returned', 'cancelled'];
            return order.filter(k => counts[k]).map(k => ({ key: k, label: meta[k].label, tone: meta[k].tone, count: counts[k] }));
        }
    },
    mounted() {
        this.getSlipDetails();
    },
    methods: {
        getSlipDetails() {
            const id = this.$route.params.id;
            axios.get(this.apiBase + '/loading_slips/view/' + id)
                .then(res => {
                    if (res.data.status === 1) {
                        this.slip = res.data.data.slip;
                        this.orders = res.data.data.orders;
                    } else {
                        this.showError(res.data.message);
                    }
                }).catch(err => {
                    this.showError(__('could_not_load_slip_details'));
                });
        },
        dispatchSlip() {
            this.$swal.fire({
                title: __('confirm_dispatch'),
                text: __('this_will_change_status_to_dispatched_and_update_all_assigned_orders_to_out_for_delivery'),
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: __('yes_dispatch_now'),
                cancelButtonText: __('cancel'),
                confirmButtonColor: '#1cc88a',
                cancelButtonColor: '#858796',
            }).then(result => {
                if (result.isConfirmed) {
                    axios.post(this.apiBase + '/loading_slips/dispatch', { id: this.slip.id })
                        .then(res => {
                            if (res.data.status === 1) {
                                this.showMessage('success', res.data.message);
                                this.getSlipDetails();
                            } else {
                                this.showError(res.data.message);
                            }
                        }).catch(err => {
                            this.showError(__('an_error_occurred_during_dispatch'));
                        });
                }
            });
        },
        cancelSlip() {
            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('this_will_cancel_the_loading_slip_and_release_all_its_orders_so_they_can_be_added_to_a_new_slip'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: __('yes_cancel_slip'),
                cancelButtonText: __('no'),
                confirmButtonColor: '#e74a3b',
                cancelButtonColor: '#858796',
            }).then(result => {
                if (result.isConfirmed) {
                    axios.post(this.apiBase + '/loading_slips/cancel', { id: this.slip.id })
                        .then(res => {
                            if (res.data.status === 1) {
                                this.showMessage('success', res.data.message);
                                this.getSlipDetails();
                            } else {
                                this.showError(res.data.message);
                            }
                        }).catch(err => {
                            this.showError(__('an_error_occurred_during_cancellation'));
                        });
                }
            });
        },
        printSlip() {
            window.open(this.apiBase + '/loading_slips/print/' + this.slip.id, '_blank');
        },
        formatDate(dateStr) {
            return moment(dateStr).format('DD-MM-YYYY hh:mm A');
        },
        formatNumber(value) {
            const n = parseFloat(value);
            return isNaN(n) ? '0' : n.toLocaleString('en-IN', { maximumFractionDigits: 1 });
        },
        formatMoney(value) {
            const n = parseFloat(value);
            if (isNaN(n)) return '0';
            // whole amounts stay compact (4,000); fractional ones always show paise (8,336.30)
            const digits = Number.isInteger(n) ? 0 : 2;
            return n.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: 2 });
        },
        // Where this stop stands: label + colour for its pill and route node.
        // `muted` dims stops that will not be delivered.
        stopStatus(order) {
            switch (Number(order.active_status)) {
                case ORDER_STATUS.delivered:
                    return { key: 'delivered', label: __('Delivered'), tone: 'green' };
                case ORDER_STATUS.partialDelivery:
                    return { key: 'partial', label: __('Partial Delivery'), tone: 'amber' };
                case ORDER_STATUS.outForDelivery:
                    return { key: 'out', label: __('Out For Delivery'), tone: 'blue' };
                case ORDER_STATUS.rescheduled:
                    return { key: 'rescheduled', label: __('Rescheduled'), tone: 'purple' };
                case ORDER_STATUS.notDelivered:
                    return { key: 'notDelivered', label: __('Not Delivered'), tone: 'red' };
                case ORDER_STATUS.returned:
                    return { key: 'returned', label: __('Returned'), tone: 'slate', muted: true };
                case ORDER_STATUS.cancelled:
                    return { key: 'cancelled', label: __('cancelled'), tone: 'red', muted: true };
                default:
                    return { key: 'pending', label: __('Pending'), tone: 'slate' };
            }
        },
        // Short item lists start open; long ones start collapsed until clicked.
        itemsOpen(order) {
            if (Object.prototype.hasOwnProperty.call(this.itemsToggled, order.id)) {
                return this.itemsToggled[order.id];
            }
            return order.items.length <= 3;
        },
        toggleItems(order) {
            this.$set(this.itemsToggled, order.id, !this.itemsOpen(order));
        }
    }
};
</script>

<style scoped>
/* ---------- tokens ---------- */
.lsv {
    --lsv-card: #ffffff;
    --lsv-border: #e5eaf2;
    --lsv-text: #0f172a;
    --lsv-muted: #64748b;
    --lsv-soft: #f4f7fb;
    --lsv-primary: #1e3a8a;
    --lsv-primary-hover: #172d6e;
    --lsv-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 6px 20px rgba(15, 23, 42, 0.04);

    --lsv-green-bg: #e7f7ef;  --lsv-green-fg: #047857;  --lsv-green: #10b981;
    --lsv-amber-bg: #fff6e0;  --lsv-amber-fg: #b45309;  --lsv-amber: #f59e0b;
    --lsv-red-bg: #fdecec;    --lsv-red-fg: #b91c1c;    --lsv-red: #ef4444;
    --lsv-blue-bg: #e8f0fe;   --lsv-blue-fg: #1d4ed8;   --lsv-blue: #3b82f6;
    --lsv-purple-bg: #f1eafe; --lsv-purple-fg: #6d28d9; --lsv-purple: #8b5cf6;
    --lsv-slate-bg: #eef1f6;  --lsv-slate-fg: #475569;  --lsv-slate: #94a3b8;

    padding: 24px;
    color: var(--lsv-text);
    font-variant-numeric: tabular-nums;
}

.theme-dark .lsv {
    --lsv-card: #1e1e2d;
    --lsv-border: #2f2f45;
    --lsv-text: #eef2f7;
    --lsv-muted: #9aa5b8;
    --lsv-soft: #262639;
    --lsv-primary: #3d5fd6;
    --lsv-primary-hover: #5373e6;
    --lsv-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);

    --lsv-green-bg: rgba(16, 185, 129, 0.16);  --lsv-green-fg: #4ade9f;
    --lsv-amber-bg: rgba(245, 158, 11, 0.16);  --lsv-amber-fg: #fbbf4a;
    --lsv-red-bg: rgba(239, 68, 68, 0.16);     --lsv-red-fg: #f87171;
    --lsv-blue-bg: rgba(59, 130, 246, 0.18);   --lsv-blue-fg: #7fb0ff;
    --lsv-purple-bg: rgba(139, 92, 246, 0.18); --lsv-purple-fg: #b69cff;
    --lsv-slate-bg: rgba(148, 163, 184, 0.14); --lsv-slate-fg: #b6c0d1;
}

/* tone helpers: set --tone-* once, reused by pills, tiles and route nodes */
.lsv-tone--green  { --tone-bg: var(--lsv-green-bg);  --tone-fg: var(--lsv-green-fg); }
.lsv-tone--amber  { --tone-bg: var(--lsv-amber-bg);  --tone-fg: var(--lsv-amber-fg); }
.lsv-tone--red    { --tone-bg: var(--lsv-red-bg);    --tone-fg: var(--lsv-red-fg); }
.lsv-tone--blue   { --tone-bg: var(--lsv-blue-bg);   --tone-fg: var(--lsv-blue-fg); }
.lsv-tone--purple { --tone-bg: var(--lsv-purple-bg); --tone-fg: var(--lsv-purple-fg); }
.lsv-tone--slate  { --tone-bg: var(--lsv-slate-bg);  --tone-fg: var(--lsv-slate-fg); }

.lsv-text--green { color: var(--lsv-green-fg); }
.lsv-text--amber { color: var(--lsv-amber-fg); }
.lsv-text--red   { color: var(--lsv-red-fg); }

/* ---------- header ---------- */
.lsv-head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px 24px;
    margin-bottom: 24px;
}
.lsv-eyebrow {
    display: block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--lsv-muted);
    margin-bottom: 4px;
}
.lsv-head__title { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; }
.lsv-head__title h1 {
    margin: 0;
    font-size: 40px;
    line-height: 1.1;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--lsv-text);
}
.lsv-head__sub { margin: 8px 0 0; font-size: 14px; color: var(--lsv-muted); }
.lsv-head__side { display: flex; flex-direction: column; align-items: flex-end; gap: 12px; }
.lsv-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 10px; }
.lsv-rundate { font-size: 13px; color: var(--lsv-muted); }
.lsv-rundate .fa { margin-right: 6px; }

.lsv-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 44px;
    padding: 0 20px;
    border-radius: 12px;
    border: 1px solid transparent;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    text-decoration: none !important;
    transition: background-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
}
.lsv-btn:active { transform: translateY(1px); }
.lsv-btn--ghost { background: var(--lsv-card); color: var(--lsv-text); border-color: var(--lsv-border); box-shadow: var(--lsv-shadow); }
.lsv-btn--ghost:hover { background: var(--lsv-soft); color: var(--lsv-text); }
.lsv-btn--primary { background: var(--lsv-primary); color: #fff; box-shadow: 0 4px 14px rgba(30, 58, 138, 0.28); }
.lsv-btn--primary:hover { background: var(--lsv-primary-hover); color: #fff; }
.lsv-btn--success { background: var(--lsv-green); color: #fff; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.28); }
.lsv-btn--success:hover { filter: brightness(0.94); color: #fff; }
.lsv-btn--danger { background: var(--lsv-card); color: var(--lsv-red-fg); border-color: var(--lsv-red); }
.lsv-btn--danger:hover { background: var(--lsv-red-bg); }

/* ---------- shared bits ---------- */
.lsv-card {
    background: var(--lsv-card);
    border: 1px solid var(--lsv-border);
    border-radius: 18px;
    box-shadow: var(--lsv-shadow);
}
.lsv-card__head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 18px 20px 0;
}
.lsv-card__head h2 { margin: 0; font-size: 16px; font-weight: 700; color: var(--lsv-text); white-space: nowrap; }
.lsv-card__head > h2 { flex: 1; min-width: 0; }
.lsv-card__titles { flex: 1; min-width: 0; }
.lsv-card__titles h2 { white-space: normal; }
.lsv-card__titles p { margin: 2px 0 0; font-size: 13px; color: var(--lsv-muted); }
.lsv-card__body { padding: 18px 20px 20px; }

.lsv-tile {
    flex-shrink: 0;
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    background: var(--tone-bg);
    color: var(--tone-fg);
}
.lsv-tile--sm { width: 40px; height: 40px; border-radius: 12px; font-size: 17px; }

.lsv-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.2;
    white-space: nowrap;
    background: var(--tone-bg);
    color: var(--tone-fg);
}
.lsv-pill--lg { padding: 8px 16px; font-size: 15px; font-weight: 700; gap: 8px; }
.lsv-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }

.lsv-chip {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    background: var(--lsv-soft);
    color: var(--lsv-muted);
    border: 1px solid var(--lsv-border);
}
.lsv-empty { margin: 0; text-align: center; color: var(--lsv-muted); font-size: 14px; padding: 12px 0; }

/* ---------- stat cards ---------- */
.lsv-stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}
.lsv-stat { display: flex; align-items: center; gap: 16px; padding: 20px; }
.lsv-stat__body { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 2px; }
.lsv-stat__label { font-size: 13px; color: var(--lsv-muted); }
.lsv-stat__value { font-size: 28px; line-height: 1.15; font-weight: 800; letter-spacing: -0.02em; color: var(--lsv-text); }
.lsv-stat__value small { font-size: 15px; font-weight: 600; color: var(--lsv-muted); letter-spacing: 0; }
.lsv-stat__hint { font-size: 12.5px; color: var(--lsv-muted); }

.lsv-meter { display: flex; align-items: center; gap: 10px; margin-top: 6px; }
.lsv-meter__track { flex: 1; height: 8px; border-radius: 999px; background: var(--lsv-slate-bg); overflow: hidden; }
.lsv-meter__fill { height: 100%; border-radius: 999px; transition: width 0.4s ease; }
.lsv-meter__fill--green { background: var(--lsv-green); }
.lsv-meter__fill--amber { background: var(--lsv-amber); }
.lsv-meter__fill--red   { background: var(--lsv-red); }
.lsv-meter__pct { font-size: 12.5px; font-weight: 600; white-space: nowrap; }

/* ---------- layout ---------- */
.lsv-grid { display: grid; grid-template-columns: 360px minmax(0, 1fr); gap: 24px; align-items: start; }
.lsv-side, .lsv-main { display: flex; flex-direction: column; gap: 24px; min-width: 0; }

/* ---------- vehicle / driver ---------- */
.lsv-person { display: flex; align-items: center; gap: 16px; padding-bottom: 16px; margin-bottom: 4px; }
.lsv-person__name { font-size: 17px; font-weight: 700; color: var(--lsv-text); }
.lsv-person__sub { display: inline-block; margin-top: 2px; font-size: 14px; color: var(--lsv-muted); text-decoration: none; }
.lsv-person__sub:hover { color: var(--lsv-primary); }
.lsv-person__sub .fa { margin-right: 4px; }
.lsv-vehicle-art {
    width: 84px;
    height: 64px;
    flex-shrink: 0;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    color: var(--lsv-blue-fg);
    background: linear-gradient(135deg, var(--lsv-blue-bg), var(--lsv-soft));
}
.lsv-plate {
    display: inline-block;
    margin-top: 4px;
    padding: 3px 10px;
    border-radius: 8px;
    font-family: SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.04em;
    background: var(--lsv-soft);
    color: var(--lsv-text);
    border: 1px solid var(--lsv-border);
}
.lsv-avatar {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: var(--lsv-blue-fg);
    background: var(--lsv-blue-bg);
}
.lsv-facts { list-style: none; margin: 0; padding: 4px 0 0; border-top: 1px solid var(--lsv-border); }
.lsv-facts li { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 11px 0; font-size: 14px; }
.lsv-facts li + li { border-top: 1px dashed var(--lsv-border); }
.lsv-facts span { color: var(--lsv-muted); }
.lsv-facts span .fa { width: 20px; color: var(--lsv-slate); }
.lsv-facts strong { font-weight: 700; color: var(--lsv-text); text-align: right; }

/* ---------- route sequence ---------- */
.lsv-stop { display: flex; gap: 16px; padding-bottom: 16px; }
.lsv-stop--last { padding-bottom: 0; }
.lsv-stop__rail { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; width: 40px; }
.lsv-stop__node {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 700;
    background: var(--tone-bg);
    color: var(--tone-fg);
    box-shadow: 0 0 0 4px var(--lsv-card);
}
.lsv-stop__node.lsv-tone--slate,
.lsv-stop__node.lsv-tone--blue { background: var(--lsv-primary); color: #fff; }
.lsv-stop__line { flex: 1; width: 2px; margin-top: 4px; border-radius: 2px; background: var(--lsv-border); }

.lsv-stop__card {
    flex: 1;
    min-width: 0;
    padding: 16px 18px;
    border: 1px solid var(--lsv-border);
    border-radius: 14px;
    background: var(--lsv-card);
    transition: box-shadow 0.15s ease, border-color 0.15s ease;
}
.lsv-stop__card:hover { box-shadow: var(--lsv-shadow); }
.lsv-stop__card--muted { opacity: 0.7; background: var(--lsv-soft); }
.lsv-stop__title { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; }
.lsv-stop__title h3 { margin: 0; font-size: 17px; font-weight: 700; color: var(--lsv-text); }
.lsv-stop__addr { margin: 8px 0 0; font-size: 13.5px; line-height: 1.5; color: var(--lsv-muted); }
.lsv-stop__addr .fa { color: var(--lsv-red); margin-right: 6px; }

.lsv-items { margin-top: 14px; border: 1px solid var(--lsv-border); border-radius: 12px; overflow: hidden; background: var(--lsv-soft); }
.lsv-items__toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 10px 14px;
    border: 0;
    background: transparent;
    font-size: 13.5px;
    font-weight: 600;
    color: var(--lsv-text);
    text-align: left;
    cursor: pointer;
}
.lsv-items__toggle .fa-cubes { color: var(--lsv-slate); margin-right: 6px; }
.lsv-items__toggle em { font-style: normal; font-weight: 500; color: var(--lsv-muted); white-space: nowrap; }
.lsv-items__chev { font-size: 11px; color: var(--lsv-muted); }
.lsv-items__list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--lsv-border); background: var(--lsv-card); }
.lsv-items__list li { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 14px; font-size: 13.5px; }
.lsv-items__list li + li { border-top: 1px dashed var(--lsv-border); }
.lsv-items__name { min-width: 0; font-weight: 500; color: var(--lsv-text); }
.lsv-items__name small { display: block; margin-top: 1px; font-size: 12px; color: var(--lsv-muted); }
.lsv-qty { flex-shrink: 0; padding: 2px 10px; border-radius: 8px; font-weight: 700; font-size: 13px; background: var(--lsv-soft); color: var(--lsv-text); }

.lsv-stop__foot { display: flex; flex-wrap: wrap; gap: 14px 0; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--lsv-border); }
.lsv-stop__foot > div { flex: 1; min-width: 140px; display: flex; flex-direction: column; gap: 2px; }
.lsv-stop__foot > div + div { padding-left: 20px; border-left: 1px solid var(--lsv-border); }
.lsv-stop__flabel { font-size: 12.5px; color: var(--lsv-muted); }
.lsv-stop__foot strong { font-size: 19px; font-weight: 800; letter-spacing: -0.01em; color: var(--lsv-text); }

/* ---------- delivery progress ---------- */
.lsv-steps { list-style: none; margin: 0; padding: 0; display: flex; align-items: flex-start; }
.lsv-step { position: relative; flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; }
.lsv-step::before {
    content: '';
    position: absolute;
    top: 19px;
    right: 50%;
    width: 100%;
    border-top: 2px dashed var(--lsv-border);
}
.lsv-step:first-child::before { display: none; }
.lsv-step--done::before, .lsv-step--current::before { border-top: 2px solid var(--lsv-green); }
.lsv-step--cancelled::before { border-top: 2px solid var(--lsv-red); }
.lsv-step__node {
    position: relative;
    z-index: 1;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    background: var(--lsv-card);
    color: var(--lsv-slate);
    border: 2px solid var(--lsv-border);
}
.lsv-step--done .lsv-step__node { background: var(--lsv-green); border-color: var(--lsv-green); color: #fff; }
.lsv-step--current .lsv-step__node { border-color: var(--lsv-green); color: var(--lsv-green-fg); background: var(--lsv-green-bg); box-shadow: 0 0 0 5px var(--lsv-green-bg); }
.lsv-step--cancelled .lsv-step__node { background: var(--lsv-red); border-color: var(--lsv-red); color: #fff; }
.lsv-step__label { font-size: 13.5px; font-weight: 700; color: var(--lsv-text); }
.lsv-step--pending .lsv-step__label { color: var(--lsv-muted); font-weight: 600; }
.lsv-step__time { font-size: 12px; color: var(--lsv-muted); }

.lsv-breakdown { margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--lsv-border); }
.lsv-segbar { display: flex; gap: 3px; height: 10px; border-radius: 999px; overflow: hidden; background: var(--lsv-slate-bg); }
.lsv-segbar__seg { display: block; height: 100%; }
.lsv-segbar__seg--green  { background: var(--lsv-green); }
.lsv-segbar__seg--amber  { background: var(--lsv-amber); }
.lsv-segbar__seg--red    { background: var(--lsv-red); }
.lsv-segbar__seg--blue   { background: var(--lsv-blue); }
.lsv-segbar__seg--purple { background: var(--lsv-purple); }
.lsv-segbar__seg--slate  { background: var(--lsv-slate); }
.lsv-legend { list-style: none; margin: 14px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px 22px; font-size: 13px; color: var(--lsv-muted); }
.lsv-legend li { display: inline-flex; align-items: center; gap: 8px; }
.lsv-legend strong { color: var(--lsv-text); }
.lsv-legend__dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; }

.lsv-loading { padding: 80px 0; text-align: center; font-size: 15px; color: var(--lsv-muted); }

/* ---------- responsive ---------- */
@media (max-width: 1399px) {
    .lsv-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 1199px) {
    .lsv-grid { grid-template-columns: 1fr; }
    .lsv-side { flex-direction: row; flex-wrap: wrap; }
    .lsv-side > .lsv-card { flex: 1; min-width: 300px; }
}
@media (max-width: 767px) {
    .lsv { padding: 16px; }
    .lsv-head__side { align-items: flex-start; width: 100%; }
    .lsv-actions { justify-content: flex-start; }
    .lsv-head__title h1 { font-size: 32px; }
    .lsv-stats { grid-template-columns: 1fr; }
    .lsv-stop__foot > div { min-width: 0; }
    .lsv-stop__foot > div + div { padding-left: 14px; }
    .lsv-stop__foot strong { font-size: 17px; }
    .lsv-step__time { display: none; }
}
</style>
