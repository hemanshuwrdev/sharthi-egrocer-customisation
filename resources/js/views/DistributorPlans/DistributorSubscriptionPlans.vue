<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('subscription_plan') }}</h3>
            <button class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2" @click="openCreateModal">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add') }}</span>
            </button>
        </div>

        <ul class="nav nav-tabs mb-3">
            <li class="nav-item">
                <a class="nav-link" :class="{ active: activeTab === 'plans' }" href="javascript:void(0)" @click="activeTab = 'plans'">
                    {{ __('distributor_subscription_plans') }}
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" :class="{ active: activeTab === 'assignments' }" href="javascript:void(0)" @click="activeTab = 'assignments'; fetchAssignments()">
                    {{ __('distributor_subscriptions') }}
                </a>
            </li>
        </ul>

        <div v-if="activeTab === 'plans'" class="list-surface">
            <div class="table-responsive">
                <b-table :items="plans" :fields="planFields" :busy="isLoading" :bordered="true" stacked="md" show-empty small>
                    <template #table-busy>
                        <div class="text-center text-black my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>{{ __('loading') }}...</strong>
                        </div>
                    </template>
                    <template #cell(price)="row">
                        <template v-if="row.item.discounted_price">
                            <strong>{{ $currency }} {{ row.item.discounted_price }}</strong>
                            <span class="text-muted small"><s>{{ $currency }} {{ row.item.price }}</s></span>
                        </template>
                        <template v-else>
                            {{ $currency }} {{ row.item.price }}
                        </template>
                    </template>
                    <template #cell(duration)="row">
                        {{ row.item.duration_type === 'limited' ? row.item.duration_days + ' ' + __('days') : __('unlimited') }}
                    </template>
                    <template #cell(status)="row">
                        <b-form-checkbox switch v-model="row.item.status" :value="true" :unchecked-value="false" @change="toggleStatus(row.item)"></b-form-checkbox>
                    </template>
                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <button class="list-action-btn is-edit" @click="openEditModal(row.item)" v-b-tooltip.hover :title="__('edit')"><i class="fa fa-pencil-alt"></i></button>
                            <button class="list-action-btn is-edit" @click="openAssignModal(row.item)" v-b-tooltip.hover :title="__('assign_to_distributor')"><i class="fa fa-user-plus"></i></button>
                            <button class="list-action-btn is-delete" @click="deletePlan(row.item.id)" v-b-tooltip.hover :title="__('delete')"><i class="fa fa-trash"></i></button>
                        </div>
                    </template>
                </b-table>
            </div>
        </div>

        <div v-if="activeTab === 'assignments'" class="list-surface">
            <div class="table-responsive">
                <b-table :items="assignments" :fields="assignmentFields" :busy="isAssignmentsLoading" :bordered="true" stacked="md" show-empty small>
                    <template #table-busy>
                        <div class="text-center text-black my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>{{ __('loading') }}...</strong>
                        </div>
                    </template>
                    <template #cell(seller)="row">
                        {{ row.item.seller ? (row.item.seller.store_name || row.item.seller.name) : '-' }}
                    </template>
                    <template #cell(status)="row">
                        <span class="badge" :class="assignmentBadgeClass(row.item.status)">{{ row.item.status }}</span>
                    </template>
                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <button class="list-action-btn is-delete" v-if="row.item.status === 'active'"
                                @click="cancelAssignment(row.item.id)" v-b-tooltip.hover :title="__('cancel')">
                                <i class="fa fa-times"></i>
                            </button>
                        </div>
                    </template>
                </b-table>
            </div>
        </div>

        <!-- Create / Edit Plan Modal -->
        <b-modal v-model="planModalOpen" :title="isEdit ? __('edit') : __('add')" size="xl" hide-footer no-close-on-backdrop>
            <form @submit.prevent="savePlan">
                <div class="row">
                    <div class="col-lg-8 mb-3">
                        <div class="card h-100">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="card-title mb-0">{{ __('subscription_information') }}</h5>
                                <b-form-checkbox switch v-model="form.status" :value="1" :unchecked-value="0">{{ __('active') }}</b-form-checkbox>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6 form-group mb-3">
                                        <label class="font-weight-bold">{{ __('name') }} *</label>
                                        <input v-model="form.name" type="text" class="form-control" required>
                                    </div>
                                    <div class="col-md-6 form-group mb-3">
                                        <label class="font-weight-bold d-block">{{ __('duration') }} *</label>
                                        <b-form-radio-group v-model="form.duration_type" :options="[
                                            { text: __('limited'), value: 'limited' },
                                            { text: __('unlimited'), value: 'unlimited' },
                                        ]" class="pt-2"></b-form-radio-group>
                                        <input v-if="form.duration_type === 'limited'" v-model.number="form.duration_days"
                                            type="number" min="1" class="form-control mt-2" :placeholder="__('days')" required>
                                    </div>
                                </div>
                                <div class="form-group mb-3">
                                    <label class="font-weight-bold">{{ __('description') }} *</label>
                                    <textarea v-model="form.description" class="form-control" rows="3" required></textarea>
                                </div>
                                <div class="form-group mb-0">
                                    <label class="font-weight-bold d-block">{{ __('publish') }}</label>
                                    <b-form-checkbox switch v-model="form.publish" :value="1" :unchecked-value="0">
                                        {{ form.publish ? __('yes') : __('no') }}
                                    </b-form-checkbox>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4 mb-3">
                        <div class="card h-100">
                            <div class="card-header">
                                <h5 class="card-title mb-0">{{ __('price_details') }}</h5>
                            </div>
                            <div class="card-body">
                                <div class="form-group mb-3">
                                    <label class="font-weight-bold">{{ __('price') }} *</label>
                                    <input v-model.number="form.price" type="number" step="0.01" min="0" class="form-control" required>
                                </div>
                                <div class="form-group mb-3">
                                    <label class="font-weight-bold">{{ __('discount_price') }}</label>
                                    <input v-model.number="form.discounted_price" type="number" step="0.01" min="0" class="form-control">
                                </div>
                                <div class="form-group mb-3">
                                    <label class="font-weight-bold">{{ __('tax_type') }} *</label>
                                    <select v-model="form.tax_type" class="form-control">
                                        <option value="inclusive">{{ __('tax_included_in_price') }}</option>
                                        <option value="exclusive">{{ __('tax_excluded_from_price') }}</option>
                                    </select>
                                </div>
                                <div class="form-group mb-3">
                                    <label class="font-weight-bold">{{ __('select_tax') }}</label>
                                    <select v-model="form.tax_id" class="form-control">
                                        <option :value="null">{{ __('none') }}</option>
                                        <option v-for="t in taxes" :key="t.id" :value="t.id">{{ t.title }} ({{ t.percentage }}%)</option>
                                    </select>
                                </div>
                                <div class="form-group mb-0">
                                    <label class="font-weight-bold">{{ __('commission') }} (%)</label>
                                    <input v-model.number="form.commission_percentage" type="number" step="0.01" min="0" max="100" class="form-control">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-end mt-3">
                    <button type="button" class="btn btn-secondary me-2" @click="planModalOpen = false">{{ __('cancel') }}</button>
                    <button type="submit" class="btn btn-primary" :disabled="saving">
                        {{ __('save') }} <b-spinner small v-if="saving"></b-spinner>
                    </button>
                </div>
            </form>
        </b-modal>

        <!-- Assign to Distributor Modal -->
        <b-modal v-model="assignModalOpen" :title="__('assign_to_distributor')" @ok="assignPlan" :ok-title="__('assign')"
            :cancel-title="__('cancel')" :ok-disabled="assigning">
            <div class="form-group mb-3">
                <label class="font-weight-bold">{{ __('select_distributor') }} *</label>
                <select v-model="assignForm.seller_id" class="form-control" required>
                    <option :value="null">{{ __('select_distributor') }}</option>
                    <option v-for="s in sellers" :key="s.id" :value="s.id">{{ s.store_name || s.name }}</option>
                </select>
            </div>
            <div class="form-group mb-0">
                <label class="font-weight-bold">{{ __('start_date') }} *</label>
                <input v-model="assignForm.start_date" type="date" class="form-control" required>
            </div>
        </b-modal>
    </div>
</template>
<script>
import axios from "axios";

export default {
    data() {
        return {
            activeTab: 'plans',
            plans: [],
            assignments: [],
            taxes: [],
            sellers: [],
            isLoading: false,
            isAssignmentsLoading: false,
            saving: false,
            assigning: false,
            isEdit: false,
            planModalOpen: false,
            assignModalOpen: false,
            planFields: [
                { key: 'id', label: __('id') },
                { key: 'name', label: __('name') },
                { key: 'duration', label: __('duration') },
                { key: 'price', label: __('price') },
                { key: 'status', label: __('status') },
                { key: 'actions', label: __('actions'), class: 'text-center' },
            ],
            assignmentFields: [
                { key: 'id', label: __('id') },
                { key: 'seller', label: __('distributor') },
                { key: 'plan_name', label: __('name') },
                { key: 'start_date', label: __('start_date') },
                { key: 'end_date', label: __('end_date') },
                { key: 'status', label: __('status') },
                { key: 'actions', label: __('actions'), class: 'text-center' },
            ],
            form: this.emptyForm(),
            assignForm: { plan_id: null, seller_id: null, start_date: '' },
        };
    },
    created() {
        this.fetchPlans();
        this.fetchTaxes();
        this.fetchSellers();
    },
    methods: {
        emptyForm() {
            return {
                id: null,
                name: '',
                description: '',
                duration_type: 'unlimited',
                duration_days: null,
                price: 0,
                discounted_price: null,
                tax_type: 'inclusive',
                tax_id: null,
                commission_percentage: null,
                publish: 1,
                status: 1,
            };
        },
        fetchPlans() {
            this.isLoading = true;
            axios.get(this.$apiUrl + '/distributor_subscription_plans')
                .then(response => {
                    const data = (response.data && response.data.data) || {};
                    this.plans = data.records || [];
                    this.isLoading = false;
                })
                .catch(() => { this.isLoading = false; });
        },
        fetchAssignments() {
            this.isAssignmentsLoading = true;
            axios.get(this.$apiUrl + '/distributor_subscription_plans/assignments')
                .then(response => {
                    const data = (response.data && response.data.data) || {};
                    this.assignments = data.records || [];
                    this.isAssignmentsLoading = false;
                })
                .catch(() => { this.isAssignmentsLoading = false; });
        },
        fetchTaxes() {
            axios.get(this.$apiUrl + '/taxes', { params: { limit: 0 } })
                .then(response => {
                    const data = (response.data && response.data.data) || [];
                    this.taxes = Array.isArray(data) ? data : (data.records || []);
                })
                .catch(() => {});
        },
        fetchSellers() {
            axios.get(this.$apiUrl + '/distributor_subscription_plans/sellers')
                .then(response => {
                    const data = (response.data && response.data.data) || {};
                    this.sellers = data.records || [];
                })
                .catch(() => {});
        },
        openCreateModal() {
            this.isEdit = false;
            this.form = this.emptyForm();
            this.planModalOpen = true;
        },
        openEditModal(item) {
            this.isEdit = true;
            this.form = {
                id: item.id,
                name: item.name,
                description: item.description,
                duration_type: item.duration_type,
                duration_days: item.duration_days,
                price: item.price,
                discounted_price: item.discounted_price,
                tax_type: item.tax_type,
                tax_id: item.tax_id,
                commission_percentage: item.commission_percentage,
                publish: item.publish ? 1 : 0,
                status: item.status ? 1 : 0,
            };
            this.planModalOpen = true;
        },
        savePlan() {
            if (this.form.discounted_price && parseFloat(this.form.discounted_price) >= parseFloat(this.form.price)) {
                this.showMessage('error', __('discount_price_must_be_less_than_price'));
                return;
            }
            this.saving = true;
            const url = this.isEdit
                ? this.$apiUrl + '/distributor_subscription_plans/update/' + this.form.id
                : this.$apiUrl + '/distributor_subscription_plans/save';
            axios.post(url, this.form)
                .then(response => {
                    this.saving = false;
                    this.planModalOpen = false;
                    this.showMessage('success', response.data.message);
                    this.fetchPlans();
                })
                .catch(err => {
                    this.saving = false;
                    this.showMessage('error', (err.response && err.response.data && err.response.data.message) || __('something_went_wrong'));
                });
        },
        toggleStatus(item) {
            axios.post(this.$apiUrl + '/distributor_subscription_plans/update_status/' + item.id, { status: item.status })
                .then(response => {
                    this.showMessage('success', response.data.message);
                })
                .catch(() => {
                    this.fetchPlans();
                });
        },
        deletePlan(id) {
            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('you_want_be_able_to_revert_this'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: __('yes_sure'),
                cancelButtonText: __('cancel'),
                confirmButtonColor: '#37a279',
                cancelButtonColor: '#d33',
            }).then(result => {
                if (result.value) {
                    axios.post(this.$apiUrl + '/distributor_subscription_plans/delete/' + id)
                        .then(response => {
                            this.showMessage('success', response.data.message);
                            this.fetchPlans();
                        });
                }
            });
        },
        openAssignModal(item) {
            this.assignForm = { plan_id: item.id, seller_id: null, start_date: new Date().toISOString().slice(0, 10) };
            this.assignModalOpen = true;
        },
        assignPlan(bvModalEvent) {
            bvModalEvent.preventDefault();
            this.assigning = true;
            axios.post(this.$apiUrl + '/distributor_subscription_plans/assign', this.assignForm)
                .then(response => {
                    this.assigning = false;
                    this.assignModalOpen = false;
                    this.showMessage('success', response.data.message);
                })
                .catch(err => {
                    this.assigning = false;
                    this.showMessage('error', (err.response && err.response.data && err.response.data.message) || __('something_went_wrong'));
                });
        },
        cancelAssignment(id) {
            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('you_want_be_able_to_revert_this'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: __('yes_sure'),
                cancelButtonText: __('cancel'),
                confirmButtonColor: '#37a279',
                cancelButtonColor: '#d33',
            }).then(result => {
                if (result.value) {
                    axios.post(this.$apiUrl + '/distributor_subscription_plans/assignments/' + id + '/cancel')
                        .then(response => {
                            this.showMessage('success', response.data.message);
                            this.fetchAssignments();
                        });
                }
            });
        },
        assignmentBadgeClass(status) {
            return { active: 'bg-success', expired: 'bg-secondary', cancelled: 'bg-danger' }[status] || 'bg-secondary';
        },
    },
};
</script>
