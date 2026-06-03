<template>
    <div class="container-fluid py-4">
        <!-- Header Section -->
        <div class="row align-items-center mb-4">
            <div class="col">
                <h1 class="h3 text-dark font-weight-bold mb-1">
                    <i class="fa fa-truck text-primary mr-2"></i>Manage Vehicles
                </h1>
                <p class="text-muted mb-0">Add, edit, and manage your distribution fleet and load capacities.</p>
            </div>
            <div class="col-auto">
                <button @click="openCreateModal" class="btn btn-primary btn-lg shadow-sm font-weight-bold rounded-pill">
                    <i class="fa fa-plus mr-2"></i>Add New Vehicle
                </button>
            </div>
        </div>

        <!-- Stats Overview Cards -->
        <div class="row mb-4">
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card h-100 shadow-sm rounded-lg card-light-primary">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-uppercase mb-1 text-primary">Total Vehicles</div>
                                <div class="h5 mb-0 font-weight-bold text-dark">{{ total }}</div>
                            </div>
                            <div class="col-auto">
                                <i class="fa fa-truck fa-2x text-primary opacity-75"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card h-100 shadow-sm rounded-lg card-light-success">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-uppercase mb-1 text-success">Active Fleet</div>
                                <div class="h5 mb-0 font-weight-bold text-dark">{{ activeCount }}</div>
                            </div>
                            <div class="col-auto">
                                <i class="fa fa-check-circle fa-2x text-success opacity-75"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card h-100 shadow-sm rounded-lg card-light-warning">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-uppercase mb-1 text-warning">Total Capacity</div>
                                <div class="h5 mb-0 font-weight-bold text-dark">{{ totalCapacity }} kg</div>
                            </div>
                            <div class="col-auto">
                                <i class="fa fa-balance-scale fa-2x text-warning opacity-75"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content Table Card -->
        <div class="card border-0 shadow-sm rounded-lg overflow-hidden">
            <div class="card-header bg-white border-0 py-3">
                <h4 class="m-0 font-weight-bold text-dark">Vehicles</h4>
            </div>
            <div class="card-body">
                <b-row class="mb-2">
                    <b-col md="3" offset-md="8">
                        <h6 class="box-title">Search</h6>
                        <b-form-input
                            id="filter-input"
                            v-model="filter"
                            type="search"
                            placeholder="Search"
                        ></b-form-input>
                    </b-col>
                    <b-col md="1" class="text-center">
                        <button class="btn btn-primary btn_refresh" v-b-tooltip.hover title="Refresh" @click="getVehicles()">
                            <i class="fa fa-refresh" aria-hidden="true"></i>
                        </button>
                    </b-col>
                </b-row>

                <b-table
                    :items="vehicles"
                    :fields="fields"
                    :bordered="true"
                    :busy="isLoading"
                    stacked="md"
                    show-empty
                    small
                    empty-text="No records to show"
                    empty-filtered-text="No records to show">

                    <template #table-busy>
                        <div class="text-center text-black my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>Loading...</strong>
                        </div>
                    </template>

                    <template #cell(name)="row">
                        <div class="d-flex align-items-center">
                            <div class="avatar-circle mr-3 bg-soft-primary">
                                <i class="fa fa-truck text-primary"></i>
                            </div>
                            {{ row.item.name }}
                        </div>
                    </template>

                    <template #cell(vehicle_number)="row">
                        <span class="badge bg-soft-secondary font-weight-bold text-dark border">{{ row.item.vehicle_number }}</span>
                    </template>

                    <template #cell(capacity)="row">
                        {{ row.item.capacity }} kg
                    </template>

                    <template #cell(status)="row">
                        <span class="badge bg-success" v-if="row.item.status == 1">Active</span>
                        <span class="badge bg-danger" v-if="row.item.status == 0">Inactive</span>
                    </template>

                    <template #cell(actions)="row">
                        <button class="btn btn-sm btn-primary mr-2" @click="openEditModal(row.item)" v-b-tooltip.hover title="Edit"><i class="fa fa-pencil-alt"></i></button>
                        <button class="btn btn-sm btn-danger" @click="deleteVehicle(row.item.id)" v-b-tooltip.hover title="Delete"><i class="fa fa-trash"></i></button>
                    </template>

                </b-table>

                <b-row>
                    <b-col md="2" class="my-1">
                        <label>
                            <b-form-group
                                label="Per page"
                                label-for="per-page-select"
                                label-align-sm="right"
                                label-size="sm"
                                class="mb-0">
                                <b-form-select
                                    id="per-page-select"
                                    v-model="perPage"
                                    :options="pageOptions"
                                    size="sm"
                                    class="form-control form-select"
                                ></b-form-select>
                            </b-form-group>
                        </label>
                    </b-col>
                    <b-col md="4" class="my-1" offset-md="6">
                        <label>Total Records :- {{ total }} </label>
                        <b-pagination
                            v-model="page"
                            :total-rows="total"
                            :per-page="perPage"
                            align="fill"
                            size="sm"
                            class="my-0"
                        ></b-pagination>
                    </b-col>
                </b-row>
            </div>
        </div>

        <!-- Add/Edit Vehicle Modal -->
        <b-modal id="vehicle-modal" v-model="modalShow" :title="isEdit ? 'Edit Vehicle Details' : 'Register New Vehicle'" hide-footer centered body-class="p-4" header-class="border-0 pb-0" title-class="font-weight-bold text-dark h4">
            <form @submit.prevent="saveVehicle">
                <div class="form-group mb-3">
                    <label class="form-control-label text-muted font-weight-bold">Vehicle Model / Name <span class="text-danger">*</span></label>
                    <input v-model="form.name" type="text" class="form-control form-control-lg border shadow-none" placeholder="e.g. Tata Ace, Mahindra Bolero" required>
                </div>
                <div class="form-group mb-3">
                    <label class="form-control-label text-muted font-weight-bold">Vehicle Registration Number <span class="text-danger">*</span></label>
                    <input v-model="form.vehicle_number" type="text" class="form-control form-control-lg border shadow-none" placeholder="e.g. MH-12-AB-1234" required>
                </div>
                <div class="form-group mb-3">
                    <label class="form-control-label text-muted font-weight-bold">Load Weight Capacity (in Kilograms) <span class="text-danger">*</span></label>
                    <div class="input-group">
                        <input v-model.number="form.capacity" type="number" step="0.01" class="form-control form-control-lg border shadow-none" placeholder="e.g. 500" required>
                        <span class="input-group-text bg-light border font-weight-bold text-muted">kg</span>
                    </div>
                </div>
                <div class="form-group mb-4" v-if="isEdit">
                    <label class="form-control-label text-muted font-weight-bold d-block">Vehicle Fleet Status</label>
                    <div class="form-check form-switch fs-5 pl-0">
                        <input class="form-check-input ms-0" type="checkbox" id="vehicle-status" v-model="form.status" :true-value="1" :false-value="0">
                        <label class="form-check-label ml-2 font-weight-bold text-dark" for="vehicle-status">
                            {{ form.status == 1 ? 'Active & Ready for Dispatch' : 'Inactive / Maintenance' }}
                        </label>
                    </div>
                </div>

                <div class="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                    <b-button @click="modalShow = false" variant="light" class="btn-lg px-4 font-weight-bold rounded-pill">Cancel</b-button>
                    <b-button type="submit" variant="primary" class="btn-lg px-4 font-weight-bold rounded-pill" :disabled="loading">
                        <b-spinner v-if="loading" small class="mr-2"></b-spinner>
                        {{ isEdit ? 'Save Changes' : 'Register Vehicle' }}
                    </b-button>
                </div>
            </form>
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
            page: 1,
            perPage: this.$perPage,
            pageOptions: this.$pageOptions,
            filter: '',
            modalShow: false,
            isEdit: false,
            loading: false,
            isLoading: false,
            fields: [
                { key: 'id', label: 'ID', class: 'text-center', sortable: true },
                { key: 'name', label: 'Vehicle Name', class: 'text-center', sortable: true },
                { key: 'vehicle_number', label: 'Vehicle Number', class: 'text-center', sortable: true },
                { key: 'capacity', label: 'Capacity (kg)', class: 'text-center', sortable: true },
                { key: 'status', label: 'Status', class: 'text-center', sortable: true },
                { key: 'actions', label: 'Actions', class: 'text-center' }
            ],
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
        activeCount() {
            return this.vehicles.filter(v => v.status == 1).length;
        },
        totalCapacity() {
            return this.vehicles.reduce((acc, v) => acc + parseFloat(v.capacity || 0), 0).toFixed(2);
        }
    },
    watch: {
        page(newPage) {
            this.getVehicles();
        },
        perPage(newPerPage) {
            this.getVehicles();
        },
        filter(newFilter, oldFilter) {
            this.page = 1;
            this.getVehicles();
        }
    },
    mounted() {
        this.getVehicles();
    },
    methods: {
        getVehicles() {
            this.isLoading = true;
            axios.get(this.$apiUrl + '/vehicles', {
                params: {
                    page: this.page,
                    per_page: this.perPage,
                    filter: this.filter
                }
            }).then(res => {
                this.isLoading = false;
                if (res.data.status === 1) {
                    this.vehicles = res.data.data.data || res.data.data;
                    this.total = res.data.data.total || this.vehicles.length;
                }
            }).catch(err => {
                this.isLoading = false;
                this.showError('Could not load vehicles data.');
            });
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
            const endpoint = this.isEdit ? '/vehicles/update' : '/vehicles/save';
            axios.post(this.$apiUrl + endpoint, this.form)
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
                    this.showError('An error occurred while saving the vehicle.');
                });
        },
        deleteVehicle(id) {
            this.$swal.fire({
                title: 'Are you sure?',
                text: 'You want to delete this vehicle? This action is irreversible!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Delete',
                confirmButtonColor: '#e74a3b',
                cancelButtonColor: '#858796',
            }).then(result => {
                if (result.isConfirmed) {
                    axios.post(this.$apiUrl + '/vehicles/delete', { id: id })
                        .then(res => {
                            if (res.data.status === 1) {
                                this.showMessage('success', res.data.message);
                                this.getVehicles();
                            } else {
                                this.showError(res.data.message);
                            }
                        }).catch(err => {
                            this.showError('An error occurred while deleting the vehicle.');
                        });
                }
            });
        }
    }
};
</script>

<style scoped>
/* Premium aesthetics CSS */
.card-light-primary {
    background-color: #f0f4ff;
    border: 1px solid rgba(78, 115, 223, 0.15) !important;
}
.card-light-success {
    background-color: #eafaf1;
    border: 1px solid rgba(28, 200, 138, 0.15) !important;
}
.card-light-warning {
    background-color: #fef9ec;
    border: 1px solid rgba(246, 194, 62, 0.15) !important;
}
.bg-soft-primary {
    background-color: rgba(78, 115, 223, 0.1) !important;
}
.bg-soft-secondary {
    background-color: rgba(133, 135, 150, 0.1) !important;
}
.bg-soft-success {
    background-color: rgba(28, 200, 138, 0.1) !important;
    color: #1cc88a !important;
}
.bg-soft-danger {
    background-color: rgba(231, 74, 59, 0.1) !important;
    color: #e74a3b !important;
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
.btn-soft-danger {
    background-color: rgba(231, 74, 59, 0.1);
    color: #e74a3b;
    border: none;
    transition: all 0.2s;
}
.btn-soft-danger:hover {
    background-color: #e74a3b;
    color: white;
}
.avatar-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
}
.transition-all {
    transition: all 0.25s ease-in-out;
}
.hover-bg-light:hover {
    background-color: rgba(248, 249, 250, 0.9) !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
}
.form-control-lg {
    border-radius: 10px;
    font-size: 0.95rem;
}
.rounded-pill {
    border-radius: 50rem !important;
}
.gap-2 {
    gap: 0.5rem;
}
</style>
