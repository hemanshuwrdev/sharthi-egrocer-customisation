<template>
    <div class="vh vh-scope">
        <!-- Header -->
        <header class="vh-head">
            <div>
                <span class="vh-eyebrow">{{ __('Fleet') }}</span>
                <h1>{{ __('manage_vehicles') }}</h1>
                <p class="vh-head__sub">{{ __('add_edit_and_manage_your_distribution_fleet_and_load_capacities') }}</p>
            </div>
            <button v-if="isSeller" @click="openCreateModal" class="vh-btn vh-btn--primary">
                <i class="fa fa-plus"></i> {{ __('add_new_vehicle') }}
            </button>
        </header>

        <!-- Fleet stats (whole fleet, not just the visible page) -->
        <section class="vh-stats">
            <div class="vh-card vh-stat">
                <div class="vh-tile vh-tone--blue"><i class="fa fa-truck"></i></div>
                <div class="vh-stat__body">
                    <span class="vh-stat__label">{{ __('total_vehicles') }}</span>
                    <strong class="vh-stat__value">{{ summary.total }}</strong>
                    <span class="vh-stat__hint">{{ __('Registered in your fleet') }}</span>
                </div>
            </div>
            <div class="vh-card vh-stat">
                <div class="vh-tile vh-tone--green"><i class="fa fa-check-circle"></i></div>
                <div class="vh-stat__body">
                    <span class="vh-stat__label">{{ __('active_fleet') }}</span>
                    <strong class="vh-stat__value">{{ summary.active }}</strong>
                    <span class="vh-stat__hint">{{ summary.inactive }} {{ __('inactive') }}</span>
                </div>
            </div>
            <div class="vh-card vh-stat">
                <div class="vh-tile vh-tone--purple"><i class="fa fa-road"></i></div>
                <div class="vh-stat__body">
                    <span class="vh-stat__label">{{ __('On Route') }}</span>
                    <strong class="vh-stat__value">{{ summary.on_route }}</strong>
                    <span class="vh-stat__hint">{{ __('Out on a trip right now') }}</span>
                </div>
            </div>
            <div class="vh-card vh-stat">
                <div class="vh-tile vh-tone--amber"><i class="fa fa-balance-scale"></i></div>
                <div class="vh-stat__body">
                    <span class="vh-stat__label">{{ __('total_capacity') }}</span>
                    <strong class="vh-stat__value">{{ formatNumber(summary.active_capacity) }} <small>{{ __('kg') }}</small></strong>
                    <span class="vh-stat__hint">{{ __('Across active vehicles') }}</span>
                </div>
            </div>
        </section>

        <!-- Toolbar -->
        <div class="vh-card vh-toolbar">
            <div class="vh-search">
                <i class="fa fa-search"></i>
                <input v-model="filter" type="text" :placeholder="__('Search by name, number or ID')" :aria-label="__('search')">
                <button v-if="filter" type="button" class="vh-search__clear" @click="filter = ''" :title="__('Clear')">
                    <i class="fa fa-times"></i>
                </button>
            </div>
            <div class="vh-chips" role="tablist">
                <button v-for="chip in statusChips" :key="chip.value" type="button" class="vh-chip"
                    :class="{ 'vh-chip--on': statusFilter === chip.value }" @click="statusFilter = chip.value">
                    {{ chip.label }} <span>{{ chip.count }}</span>
                </button>
            </div>
            <button type="button" class="vh-iconbtn" :title="__('refresh')" @click="getVehicles()">
                <i class="fa fa-sync-alt" :class="{ 'fa-spin': isLoading }"></i>
            </button>
        </div>

        <!-- Loading skeleton (first load only) -->
        <div class="vh-grid" v-if="firstLoad">
            <div class="vh-card vh-vehicle vh-skeleton" v-for="n in 6" :key="n">
                <div class="vh-skeleton__row"><span class="vh-skeleton__box"></span><span class="vh-skeleton__lines"><i></i><i></i></span></div>
                <div class="vh-skeleton__bar"></div>
            </div>
        </div>

        <!-- Empty state -->
        <div class="vh-card vh-empty" v-else-if="vehicles.length === 0">
            <div class="vh-empty__icon"><i class="fa fa-truck"></i></div>
            <template v-if="hasActiveFilters">
                <h3>{{ __('No vehicles match your search') }}</h3>
                <p>{{ __('Try a different name or number, or clear the filters.') }}</p>
                <button type="button" class="vh-btn vh-btn--ghost" @click="clearFilters">
                    <i class="fa fa-times"></i> {{ __('Clear filters') }}
                </button>
            </template>
            <template v-else>
                <h3>{{ __('No vehicles yet') }}</h3>
                <p>{{ isSeller ? __('Add your first vehicle to start creating loading slips.') : __('no_records_to_show') }}</p>
                <button v-if="isSeller" type="button" class="vh-btn vh-btn--primary" @click="openCreateModal">
                    <i class="fa fa-plus"></i> {{ __('add_new_vehicle') }}
                </button>
            </template>
        </div>

        <!-- Vehicle cards -->
        <div class="vh-grid" :class="{ 'vh-grid--busy': isLoading }" v-else>
            <article v-for="v in vehicles" :key="v.id" class="vh-card vh-vehicle" :class="{ 'vh-vehicle--off': v.status != 1 }">
                <div class="vh-vehicle__top">
                    <div class="vh-tile vh-tile--sm" :class="'vh-tone--' + vehicleStatus(v).tone"><i class="fa fa-truck"></i></div>
                    <div class="vh-vehicle__id">
                        <h3 :title="v.name">{{ v.name }}</h3>
                        <span class="vh-plate">{{ v.vehicle_number }}</span>
                    </div>
                    <span class="vh-pill vh-pill--dot" :class="'vh-tone--' + vehicleStatus(v).tone">
                        <span class="vh-dot"></span>{{ vehicleStatus(v).label }}
                    </span>
                </div>

                <div class="vh-vehicle__stats">
                    <div>
                        <span>{{ __('Load Capacity') }}</span>
                        <strong>{{ formatNumber(v.capacity) }} <small>{{ __('kg') }}</small></strong>
                    </div>
                    <div>
                        <span>{{ __('Trips') }}</span>
                        <strong>{{ v.loading_slips_count || 0 }}</strong>
                    </div>
                    <div>
                        <span>ID</span>
                        <strong>#{{ v.id }}</strong>
                    </div>
                </div>

                <div class="vh-vehicle__foot" v-if="isSeller">
                    <label class="vh-switchrow" :title="v.status == 1 ? __('Click to mark inactive') : __('Click to mark active')">
                        <button type="button" role="switch" class="vh-switch" :class="{ 'vh-switch--on': v.status == 1 }"
                            :aria-checked="v.status == 1 ? 'true' : 'false'" :disabled="togglingId === v.id"
                            @click="toggleStatus(v)"><span></span></button>
                        <span>{{ __('Available for dispatch') }}</span>
                    </label>
                    <div class="vh-vehicle__actions">
                        <button type="button" class="vh-iconbtn" :title="__('edit')" @click="openEditModal(v)">
                            <i class="fa fa-pencil-alt"></i>
                        </button>
                        <button type="button" class="vh-iconbtn vh-iconbtn--danger" @click="deleteVehicle(v)"
                            :disabled="(v.loading_slips_count || 0) > 0"
                            :title="(v.loading_slips_count || 0) > 0 ? __('Used in loading slips, mark it inactive instead') : __('delete')">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                </div>
            </article>
        </div>

        <!-- Pagination -->
        <div class="vh-pager" v-if="!firstLoad && total > 0">
            <div class="vh-pager__size">
                <label for="vh-per-page">{{ __('per_page') }}</label>
                <b-form-select id="vh-per-page" v-model="perPage" :options="pageOptions" size="sm" class="form-control form-select"></b-form-select>
            </div>
            <span class="vh-pager__count">{{ rangeText }}</span>
            <b-pagination v-if="total > perPage" v-model="page" :total-rows="total" :per-page="perPage" size="sm" class="my-0"></b-pagination>
        </div>

        <!-- Add / edit vehicle -->
        <b-modal id="vehicle-modal" v-model="modalShow" hide-footer hide-header centered body-class="p-0" modal-class="vh-modal">
            <div class="vh-scope vh-form">
                <div class="vh-form__head">
                    <div class="vh-tile vh-tile--sm vh-tone--blue"><i class="fa fa-truck"></i></div>
                    <div>
                        <h2>{{ isEdit ? __('edit_vehicle_details') : __('register_new_vehicle') }}</h2>
                        <p>{{ isEdit ? __('Update this vehicle\'s details or availability.') : __('Add a vehicle you can assign to loading slips.') }}</p>
                    </div>
                    <button type="button" class="vh-iconbtn vh-form__close" @click="modalShow = false" :title="__('cancel')">
                        <i class="fa fa-times"></i>
                    </button>
                </div>

                <form @submit.prevent="saveVehicle" class="vh-form__body">
                    <div class="vh-field">
                        <label>{{ __('vehicle_model_name') }} <em>*</em></label>
                        <input v-model="form.name" type="text" class="vh-input" placeholder="e.g. Tata Ace, Mahindra Bolero" required maxlength="255">
                    </div>

                    <div class="vh-field">
                        <label>{{ __('vehicle_registration_number') }} <em>*</em></label>
                        <input v-model="form.vehicle_number" type="text" class="vh-input vh-input--plate" placeholder="e.g. MH-12-AB-1234" required maxlength="255">
                    </div>

                    <div class="vh-field">
                        <label>{{ __('load_weight_capacity_in_kilograms') }} <em>*</em></label>
                        <div class="vh-input-group">
                            <input v-model.number="form.capacity" type="number" step="0.01" min="0.1" class="vh-input" placeholder="e.g. 500" required>
                            <span>{{ __('kg') }}</span>
                        </div>
                        <div class="vh-quick">
                            <button type="button" v-for="q in quickCapacities" :key="q" class="vh-chip"
                                :class="{ 'vh-chip--on': Number(form.capacity) === q }" @click="form.capacity = q">
                                {{ formatNumber(q) }} {{ __('kg') }}
                            </button>
                        </div>
                    </div>

                    <div class="vh-field vh-field--row" v-if="isEdit">
                        <div>
                            <label>{{ __('vehicle_fleet_status') }}</label>
                            <p class="vh-field__hint">{{ form.status == 1 ? __('active_ready_for_dispatch') : __('inactive_maintenance') }}</p>
                        </div>
                        <button type="button" role="switch" class="vh-switch" :class="{ 'vh-switch--on': form.status == 1 }"
                            :aria-checked="form.status == 1 ? 'true' : 'false'"
                            @click="form.status = form.status == 1 ? 0 : 1"><span></span></button>
                    </div>

                    <div class="vh-form__foot">
                        <button type="button" class="vh-btn vh-btn--ghost" @click="modalShow = false">{{ __('cancel') }}</button>
                        <button type="submit" class="vh-btn vh-btn--primary" :disabled="loading">
                            <i class="fa fa-spinner fa-spin" v-if="loading"></i>
                            {{ isEdit ? __('save_changes') : __('register_vehicle') }}
                        </button>
                    </div>
                </form>
            </div>
        </b-modal>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ManageVehicles',
    data() {
        return {
            vehicles: [],
            total: 0,
            summary: { total: 0, active: 0, inactive: 0, on_route: 0, active_capacity: 0 },
            page: 1,
            perPage: this.$perPage,
            pageOptions: this.$pageOptions,
            filter: '',
            statusFilter: 'all', // 'all' | '1' | '0'
            searchTimer: null,
            modalShow: false,
            isEdit: false,
            loading: false,
            isLoading: false,
            firstLoad: true,
            togglingId: null,
            quickCapacities: [500, 1000, 2000, 5000],
            form: {
                id: null,
                name: '',
                vehicle_number: '',
                capacity: '',
                status: 1
            }
        };
    },
    computed: {
        isSeller() {
            return this.$route.path.startsWith('/seller');
        },
        apiPath() {
            return this.isSeller ? '/seller/vehicles' : '/vehicles';
        },
        statusChips() {
            return [
                { value: 'all', label: __('All'), count: this.summary.total },
                { value: '1', label: __('active'), count: this.summary.active },
                { value: '0', label: __('inactive'), count: this.summary.inactive },
            ];
        },
        hasActiveFilters() {
            return this.filter.trim() !== '' || this.statusFilter !== 'all';
        },
        rangeText() {
            if (!this.total) return '';
            const from = (this.page - 1) * this.perPage + 1;
            const to = Math.min(this.page * this.perPage, this.total);
            return from + '-' + to + ' / ' + this.total;
        }
    },
    watch: {
        page() {
            this.getVehicles();
        },
        perPage() {
            this.page = 1;
            this.getVehicles();
        },
        statusFilter() {
            this.page = 1;
            this.getVehicles();
        },
        // debounce typing so each keystroke doesn't hit the API
        filter() {
            clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => {
                this.page = 1;
                this.getVehicles();
            }, 350);
        }
    },
    mounted() {
        this.getVehicles();
    },
    beforeDestroy() {
        clearTimeout(this.searchTimer);
    },
    methods: {
        // `silent` refreshes the data without dimming the grid (used after a quick toggle)
        getVehicles(silent = false) {
            if (!silent) this.isLoading = true;
            axios.get(this.$apiUrl + this.apiPath, {
                params: {
                    page: this.page,
                    per_page: this.perPage,
                    filter: this.filter.trim(),
                    status: this.statusFilter === 'all' ? undefined : this.statusFilter
                }
            }).then(res => {
                this.isLoading = false;
                this.firstLoad = false;
                if (res.data.status === 1) {
                    this.vehicles = res.data.data.data || res.data.data || [];
                    this.total = res.data.total != null ? res.data.total : this.vehicles.length;
                    if (res.data.summary) this.summary = res.data.summary;
                    // deleted / filtered the last item on a later page: step back instead of showing an empty page
                    if (this.vehicles.length === 0 && this.page > 1) this.page = this.page - 1;
                }
            }).catch(err => {
                this.isLoading = false;
                this.firstLoad = false;
                this.showError(__('could_not_load_vehicles_data'));
            });
        },
        clearFilters() {
            this.filter = '';
            this.statusFilter = 'all';
        },
        // Pill for the card: inactive > on a dispatched trip > idle & ready
        vehicleStatus(v) {
            if (v.status != 1) return { label: __('inactive'), tone: 'slate' };
            if ((v.active_trips_count || 0) > 0) return { label: __('On Route'), tone: 'blue' };
            return { label: __('active'), tone: 'green' };
        },
        formatNumber(value) {
            const n = parseFloat(value);
            return isNaN(n) ? '0' : n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
        },
        openCreateModal() {
            this.isEdit = false;
            this.form = {
                id: null,
                name: '',
                vehicle_number: '',
                capacity: '',
                status: 1
            };
            this.modalShow = true;
        },
        openEditModal(vehicle) {
            this.isEdit = true;
            this.form = {
                id: vehicle.id,
                name: vehicle.name,
                vehicle_number: vehicle.vehicle_number,
                capacity: vehicle.capacity,
                status: parseInt(vehicle.status)
            };
            this.modalShow = true;
        },
        saveVehicle() {
            this.loading = true;
            const endpoint = this.apiPath + (this.isEdit ? '/update' : '/save');
            const payload = Object.assign({}, this.form, {
                name: (this.form.name || '').trim(),
                vehicle_number: (this.form.vehicle_number || '').trim().toUpperCase()
            });
            axios.post(this.$apiUrl + endpoint, payload)
                .then(res => {
                    this.loading = false;
                    if (res.data.status === 1) {
                        this.showMessage('success', res.data.message);
                        this.modalShow = false;
                        this.getVehicles();
                    } else {
                        this.showError(res.data.message);
                    }
                }).catch(err => {
                    this.loading = false;
                    this.showError(__('an_error_occurred_while_saving_the_vehicle'));
                });
        },
        // Flip active / inactive straight from the card (the update endpoint needs the full record)
        toggleStatus(vehicle) {
            if (this.togglingId) return;
            const next = vehicle.status == 1 ? 0 : 1;
            this.togglingId = vehicle.id;
            axios.post(this.$apiUrl + this.apiPath + '/update', {
                id: vehicle.id,
                name: vehicle.name,
                vehicle_number: vehicle.vehicle_number,
                capacity: vehicle.capacity,
                status: next
            }).then(res => {
                if (res.data.status === 1) {
                    vehicle.status = next;
                    this.showMessage('success', res.data.message);
                    this.getVehicles(true); // refresh the stat cards / filter counts
                } else {
                    this.showError(res.data.message);
                }
            }).catch(err => {
                this.showError(__('an_error_occurred_while_saving_the_vehicle'));
            }).finally(() => {
                this.togglingId = null;
            });
        },
        deleteVehicle(vehicle) {
            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('you_want_to_delete_this_vehicle_this_action_is_irreversible'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: __('yes_delete'),
                cancelButtonText: __('cancel'),
                confirmButtonColor: '#e74a3b',
                cancelButtonColor: '#858796',
            }).then(result => {
                if (result.isConfirmed) {
                    axios.post(this.$apiUrl + this.apiPath + '/delete', { id: vehicle.id })
                        .then(res => {
                            if (res.data.status === 1) {
                                this.showMessage('success', res.data.message);
                                this.getVehicles();
                            } else {
                                this.showError(res.data.message);
                            }
                        }).catch(err => {
                            this.showError(__('an_error_occurred_while_deleting_the_vehicle'));
                        });
                }
            });
        }
    }
};
</script>

<style scoped>
/* ---------- tokens (also applied to the modal body, which renders outside the page root) ---------- */
.vh-scope {
    --vh-card: #ffffff;
    --vh-border: #e5eaf2;
    --vh-text: #0f172a;
    --vh-muted: #64748b;
    --vh-soft: #f4f7fb;
    --vh-primary: #1e3a8a;
    --vh-primary-hover: #172d6e;
    --vh-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 6px 20px rgba(15, 23, 42, 0.04);

    --vh-green-bg: #e7f7ef;  --vh-green-fg: #047857;  --vh-green: #10b981;
    --vh-amber-bg: #fff6e0;  --vh-amber-fg: #b45309;  --vh-amber: #f59e0b;
    --vh-red-bg: #fdecec;    --vh-red-fg: #b91c1c;    --vh-red: #ef4444;
    --vh-blue-bg: #e8f0fe;   --vh-blue-fg: #1d4ed8;   --vh-blue: #3b82f6;
    --vh-purple-bg: #f1eafe; --vh-purple-fg: #6d28d9; --vh-purple: #8b5cf6;
    --vh-slate-bg: #eef1f6;  --vh-slate-fg: #475569;  --vh-slate: #94a3b8;

    color: var(--vh-text);
    font-variant-numeric: tabular-nums;
}
.theme-dark .vh-scope {
    --vh-card: #1e1e2d;
    --vh-border: #2f2f45;
    --vh-text: #eef2f7;
    --vh-muted: #9aa5b8;
    --vh-soft: #262639;
    --vh-primary: #3d5fd6;
    --vh-primary-hover: #5373e6;
    --vh-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);

    --vh-green-bg: rgba(16, 185, 129, 0.16);  --vh-green-fg: #4ade9f;
    --vh-amber-bg: rgba(245, 158, 11, 0.16);  --vh-amber-fg: #fbbf4a;
    --vh-red-bg: rgba(239, 68, 68, 0.16);     --vh-red-fg: #f87171;
    --vh-blue-bg: rgba(59, 130, 246, 0.18);   --vh-blue-fg: #7fb0ff;
    --vh-purple-bg: rgba(139, 92, 246, 0.18); --vh-purple-fg: #b69cff;
    --vh-slate-bg: rgba(148, 163, 184, 0.14); --vh-slate-fg: #b6c0d1;
}
.vh { padding: 24px; }

.vh-tone--green  { --tone-bg: var(--vh-green-bg);  --tone-fg: var(--vh-green-fg); }
.vh-tone--amber  { --tone-bg: var(--vh-amber-bg);  --tone-fg: var(--vh-amber-fg); }
.vh-tone--red    { --tone-bg: var(--vh-red-bg);    --tone-fg: var(--vh-red-fg); }
.vh-tone--blue   { --tone-bg: var(--vh-blue-bg);   --tone-fg: var(--vh-blue-fg); }
.vh-tone--purple { --tone-bg: var(--vh-purple-bg); --tone-fg: var(--vh-purple-fg); }
.vh-tone--slate  { --tone-bg: var(--vh-slate-bg);  --tone-fg: var(--vh-slate-fg); }

/* ---------- header + buttons ---------- */
.vh-head { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 16px 24px; margin-bottom: 24px; }
.vh-eyebrow { display: block; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--vh-muted); margin-bottom: 4px; }
.vh-head h1 { margin: 0; font-size: 34px; line-height: 1.15; font-weight: 800; letter-spacing: -0.02em; color: var(--vh-text); }
.vh-head__sub { margin: 8px 0 0; font-size: 14px; color: var(--vh-muted); }

.vh-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    height: 44px; padding: 0 20px; border-radius: 12px; border: 1px solid transparent;
    font-size: 14px; font-weight: 600; line-height: 1; white-space: nowrap; cursor: pointer;
    text-decoration: none !important;
    transition: background-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
}
.vh-btn:active { transform: translateY(1px); }
.vh-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.vh-btn--primary { background: var(--vh-primary); color: #fff; box-shadow: 0 4px 14px rgba(30, 58, 138, 0.28); }
.vh-btn--primary:hover:not(:disabled) { background: var(--vh-primary-hover); color: #fff; }
.vh-btn--ghost { background: var(--vh-card); color: var(--vh-text); border-color: var(--vh-border); }
.vh-btn--ghost:hover { background: var(--vh-soft); color: var(--vh-text); }

.vh-iconbtn {
    width: 38px; height: 38px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center;
    border-radius: 10px; border: 1px solid var(--vh-border); background: var(--vh-card); color: var(--vh-muted);
    font-size: 14px; cursor: pointer; transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
.vh-iconbtn:hover:not(:disabled) { background: var(--vh-soft); color: var(--vh-primary); }
.vh-iconbtn--danger:hover:not(:disabled) { background: var(--vh-red-bg); color: var(--vh-red-fg); border-color: var(--vh-red); }
.vh-iconbtn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ---------- shared ---------- */
.vh-card { background: var(--vh-card); border: 1px solid var(--vh-border); border-radius: 18px; box-shadow: var(--vh-shadow); }
.vh-tile {
    flex-shrink: 0; width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center;
    font-size: 22px; background: var(--tone-bg); color: var(--tone-fg);
}
.vh-tile--sm { width: 44px; height: 44px; border-radius: 12px; font-size: 18px; }
.vh-pill {
    display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 999px;
    font-size: 12px; font-weight: 600; line-height: 1.2; white-space: nowrap; background: var(--tone-bg); color: var(--tone-fg);
}
.vh-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.vh-plate {
    display: inline-block; padding: 3px 10px; border-radius: 8px;
    font-family: SFMono-Regular, Menlo, Consolas, monospace; font-size: 12.5px; font-weight: 600; letter-spacing: 0.04em;
    background: var(--vh-soft); color: var(--vh-text); border: 1px solid var(--vh-border);
}

/* ---------- stats ---------- */
.vh-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin-bottom: 24px; }
.vh-stat { display: flex; align-items: center; gap: 16px; padding: 20px; }
.vh-stat__body { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.vh-stat__label { font-size: 13px; color: var(--vh-muted); }
.vh-stat__value { font-size: 28px; line-height: 1.15; font-weight: 800; letter-spacing: -0.02em; color: var(--vh-text); }
.vh-stat__value small { font-size: 15px; font-weight: 600; color: var(--vh-muted); letter-spacing: 0; }
.vh-stat__hint { font-size: 12.5px; color: var(--vh-muted); }

/* ---------- toolbar ---------- */
.vh-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 16px; padding: 14px 16px; margin-bottom: 20px; }
.vh-search { position: relative; flex: 1; min-width: 220px; }
.vh-search > .fa-search { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--vh-slate); font-size: 14px; pointer-events: none; }
.vh-search input {
    width: 100%; height: 42px; padding: 0 38px 0 40px; border-radius: 12px; border: 1px solid var(--vh-border);
    background: var(--vh-soft); color: var(--vh-text); font-size: 14px; outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}
.vh-search input::placeholder { color: var(--vh-muted); }
.vh-search input:focus { background: var(--vh-card); border-color: var(--vh-blue); box-shadow: 0 0 0 3px var(--vh-blue-bg); }
.vh-search__clear { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); width: 26px; height: 26px; border: 0; border-radius: 50%; background: transparent; color: var(--vh-muted); cursor: pointer; }
.vh-search__clear:hover { background: var(--vh-slate-bg); }

.vh-chips, .vh-quick { display: flex; flex-wrap: wrap; gap: 8px; }
.vh-chip {
    display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 14px; border-radius: 999px;
    border: 1px solid var(--vh-border); background: var(--vh-card); color: var(--vh-muted);
    font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s ease;
}
.vh-chip span { padding: 1px 8px; border-radius: 999px; font-size: 12px; background: var(--vh-slate-bg); color: var(--vh-slate-fg); }
.vh-chip:hover { border-color: var(--vh-blue); color: var(--vh-text); }
.vh-chip--on { background: var(--vh-primary); border-color: var(--vh-primary); color: #fff; }
.vh-chip--on span { background: rgba(255, 255, 255, 0.2); color: #fff; }

/* ---------- vehicle cards ---------- */
.vh-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; transition: opacity 0.15s ease; }
.vh-grid--busy { opacity: 0.55; pointer-events: none; }
.vh-vehicle { display: flex; flex-direction: column; padding: 18px; transition: box-shadow 0.15s ease, transform 0.15s ease; }
.vh-vehicle:hover { box-shadow: 0 8px 28px rgba(15, 23, 42, 0.08); transform: translateY(-2px); }
.vh-vehicle--off { background: var(--vh-soft); }
.vh-vehicle--off .vh-vehicle__stats strong { color: var(--vh-muted); }
.vh-vehicle__top { display: flex; align-items: center; gap: 12px; }
.vh-vehicle__id { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
.vh-vehicle__id h3 {
    margin: 0; max-width: 100%; font-size: 16px; line-height: 1.3; font-weight: 700; color: var(--vh-text);
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; word-break: break-word;
}

.vh-vehicle__stats { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 0; margin: 16px 0; padding: 14px 0; border-top: 1px solid var(--vh-border); border-bottom: 1px solid var(--vh-border); }
.vh-vehicle__stats > div { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.vh-vehicle__stats > div + div { padding-left: 16px; border-left: 1px solid var(--vh-border); }
.vh-vehicle__stats span { font-size: 12.5px; color: var(--vh-muted); }
.vh-vehicle__stats strong { font-size: 18px; font-weight: 800; letter-spacing: -0.01em; color: var(--vh-text); }
.vh-vehicle__stats small { font-size: 12px; font-weight: 600; color: var(--vh-muted); }

.vh-vehicle__foot { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.vh-vehicle__actions { display: flex; gap: 8px; }
.vh-switchrow { display: inline-flex; align-items: center; gap: 10px; margin: 0; font-size: 13px; font-weight: 500; color: var(--vh-muted); cursor: pointer; }

.vh-switch {
    position: relative; flex-shrink: 0; width: 42px; height: 24px; padding: 0; border: 0; border-radius: 999px;
    background: var(--vh-slate); cursor: pointer; transition: background-color 0.2s ease;
}
.vh-switch span { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25); transition: transform 0.2s ease; }
.vh-switch--on { background: var(--vh-green); }
.vh-switch--on span { transform: translateX(18px); }
.vh-switch:disabled { opacity: 0.6; cursor: wait; }

/* ---------- empty / skeleton ---------- */
.vh-empty { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; padding: 56px 24px; }
.vh-empty__icon { width: 72px; height: 72px; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 30px; margin-bottom: 8px; background: var(--vh-blue-bg); color: var(--vh-blue-fg); }
.vh-empty h3 { margin: 0; font-size: 18px; font-weight: 700; color: var(--vh-text); }
.vh-empty p { margin: 0 0 12px; max-width: 360px; font-size: 14px; color: var(--vh-muted); }

.vh-skeleton { gap: 16px; pointer-events: none; }
.vh-skeleton__row { display: flex; align-items: center; gap: 12px; }
.vh-skeleton__box, .vh-skeleton__lines i, .vh-skeleton__bar {
    display: block; border-radius: 10px;
    background: linear-gradient(90deg, var(--vh-slate-bg) 25%, var(--vh-soft) 50%, var(--vh-slate-bg) 75%);
    background-size: 200% 100%; animation: vh-shimmer 1.3s infinite linear;
}
.vh-skeleton__box { width: 44px; height: 44px; border-radius: 12px; }
.vh-skeleton__lines { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.vh-skeleton__lines i { height: 12px; width: 70%; }
.vh-skeleton__lines i + i { width: 40%; }
.vh-skeleton__bar { height: 56px; }
@keyframes vh-shimmer { to { background-position: -200% 0; } }

/* ---------- pagination ---------- */
.vh-pager { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 20px; margin-top: 20px; }
.vh-pager__size { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--vh-muted); }
.vh-pager__size label { margin: 0; }
.vh-pager__size .form-select { width: auto; min-width: 72px; }
.vh-pager__count { flex: 1; font-size: 13px; color: var(--vh-muted); white-space: nowrap; }

/* ---------- modal ---------- */
.vh-form { background: var(--vh-card); border-radius: 16px; overflow: hidden; }
.vh-form__head { display: flex; align-items: center; gap: 14px; padding: 22px 24px 18px; border-bottom: 1px solid var(--vh-border); }
.vh-form__head h2 { margin: 0; font-size: 18px; font-weight: 700; color: var(--vh-text); }
.vh-form__head p { margin: 2px 0 0; font-size: 13px; color: var(--vh-muted); }
.vh-form__head > div:nth-child(2) { flex: 1; min-width: 0; }
.vh-form__body { padding: 20px 24px 24px; }
.vh-field { margin-bottom: 18px; }
.vh-field label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; color: var(--vh-text); }
.vh-field label em { font-style: normal; color: var(--vh-red); }
.vh-field__hint { margin: 2px 0 0; font-size: 13px; color: var(--vh-muted); }
.vh-field--row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 16px; border-radius: 12px; background: var(--vh-soft); border: 1px solid var(--vh-border); }
.vh-field--row label { margin: 0; }
.vh-input {
    width: 100%; height: 46px; padding: 0 14px; border-radius: 12px; border: 1px solid var(--vh-border);
    background: var(--vh-card); color: var(--vh-text); font-size: 15px; outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.vh-input::placeholder { color: var(--vh-slate); }
.vh-input:focus { border-color: var(--vh-blue); box-shadow: 0 0 0 3px var(--vh-blue-bg); }
.vh-input--plate { text-transform: uppercase; font-family: SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: 0.04em; }
.vh-input-group { display: flex; align-items: stretch; }
.vh-input-group .vh-input { border-top-right-radius: 0; border-bottom-right-radius: 0; }
.vh-input-group > span {
    display: flex; align-items: center; padding: 0 16px; border: 1px solid var(--vh-border); border-left: 0;
    border-radius: 0 12px 12px 0; background: var(--vh-soft); color: var(--vh-muted); font-size: 14px; font-weight: 600;
}
.vh-quick { margin-top: 10px; }
.vh-quick .vh-chip { height: 32px; padding: 0 12px; font-size: 12.5px; }
.vh-form__foot { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--vh-border); }

/* ---------- responsive ---------- */
@media (max-width: 1399px) {
    .vh-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 767px) {
    .vh { padding: 16px; }
    .vh-head h1 { font-size: 28px; }
    .vh-head > .vh-btn { width: 100%; }
    .vh-stats { grid-template-columns: 1fr; }
    .vh-grid { grid-template-columns: 1fr; }
    .vh-search { flex-basis: 100%; }
    .vh-chips { flex: 1; gap: 4px; }
    .vh-chip { padding: 0 9px; gap: 6px; font-size: 12.5px; }
    .vh-pager__count { flex: none; margin-left: auto; white-space: nowrap; }
    .vh-pager .pagination { width: 100%; justify-content: center; }
}
</style>
