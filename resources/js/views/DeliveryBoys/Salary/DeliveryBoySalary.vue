<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('delivery_boy_salary') }}</h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item">
                                    <router-link to="/dashboard">{{ __('dashboard') }}</router-link>
                                </li>
                                <li class="breadcrumb-item active" aria-current="page">{{ __('delivery_boy_salary') }}
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <section class="section">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">{{ __('delivery_boy_salary') }}</h4>
                        <span class="pull-right">
                            <button class="btn btn-primary" v-if="$route.path.includes('/seller')" @click="create_new = true">{{
                                __('add_salary') }}</button>
                        </span>
                    </div>
                    <div class="card-body">
                        <b-row class="mb-3 align-items-end">

                            <!-- Date Range -->
                            <b-col md="4">
                                <h6 class="box-title">{{ __('from_to_date') }}</h6>
                                <div class="d-flex align-items-center">
                                    <date-range-picker :single-date-picker="'range'" :autoApply="false"
                                        :showDropdowns="true" v-model="dateRange" :maxDate="maxDate"
                                        @update="getSalaries" opens="right" append-to-body></date-range-picker>

                                    <button class="btn btn-sm btn-danger ml-1"
                                        @click="dateRange.startDate = null; dateRange.endDate = null; getSalaries()">
                                        {{ __('clear') }}
                                    </button>
                                </div>
                            </b-col>

                            <!-- Search -->
                            <b-col md="3" offset-md="4">
                                <h6>{{ __('search') }}</h6>
                                <b-form-input v-model="filter" type="search" :placeholder="__('search')"></b-form-input>
                            </b-col>

                            <!-- Refresh -->
                            <b-col md="1" class="text-center">

                                <button class="btn btn-primary ml-2" v-b-tooltip.hover :title="__('refresh')"
                                    @click="getSalaries()">
                                    <i class="fa fa-refresh"></i>
                                </button>
                            </b-col>

                        </b-row>

                        <div class="table-responsive">
                            <b-table :items="salaries" :fields="fields" :current-page="currentPage" :per-page="perPage"
                                :filter="filter" :filter-included-fields="filterOn" :sort-by.sync="sortBy"
                                :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :bordered="true"
                                :busy="isLoading" stacked="md" show-empty small>
                                <template #table-busy>
                                    <div class="text-center text-black my-2">
                                        <b-spinner class="align-middle"></b-spinner>
                                        <strong>{{ __('loading') }}...</strong>
                                    </div>
                                </template>
                                <template #head(amount)="data">
                                    {{ __('salary') }}{{ ' (' + $currency + ')' }}
                                </template>
                                <template #cell(paid_on)="row">
                                    {{ formatDate(row.item.paid_on) }}
                                </template>
                                <template #cell(actions)="row">
                                    <b-button v-if="$route.path.includes('/seller')" size="sm" variant="primary"
                                        @click="editRecord(row.item)" class="mr-1">
                                        <i class="fa fa-pencil-alt"></i>
                                    </b-button>
                                    <b-button v-if="$route.path.includes('/seller')" size="sm" variant="danger"
                                        @click="deleteRecord(row.item.id)">
                                        <i class="fa fa-trash"></i>
                                    </b-button>
                                </template>
                            </b-table>
                        </div>
                        <b-row>
                            <b-col md="2" class="my-1">
                                <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right"
                                    label-size="sm" class="mb-0">
                                    <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"
                                        size="sm" class="form-control form-select"></b-form-select>
                                </b-form-group>
                            </b-col>
                            <b-col md="4" class="my-1" offset-md="6">
                                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
                                    align="fill" size="sm" class="my-0"></b-pagination>
                            </b-col>
                        </b-row>
                    </div>
                </div>
            </section>

        </div>
        <!-- Add / Edit -->
        <edit-salary v-if="create_new || edit_record" :record="edit_record" :deliveryBoys="deliveryBoys"
            @modalClose="hideModal()"></edit-salary>
    </div>
</template>
<script>
import EditSalary from './EditSalary';
import DateRangePicker from 'vue2-daterange-picker'
import moment from "moment";

export default {
    name: 'DeliveryBoySalary',
    components: {
        'edit-salary': EditSalary,
    },
    data: function () {
        return {
            fields: [
                { key: 'id', label: __('id'), sortable: true, sortDirection: 'desc' },
                { key: 'delivery_boy_name', label: __('delivery_boy'), sortable: true, class: 'text-center' },
                { key: 'amount', label: __('salary'), sortable: true, class: 'text-center' },
                { key: 'message', label: __('message'), sortable: true, class: 'text-center' },
                //{ key: 'status', label: __('status'), sortable: true, class: 'text-center' },
                { key: 'paid_on', label: __('date'), sortable: true, class: 'text-center' },
                { key: 'actions', label: __('actions'), class: 'text-center' }
            ],
            dateRange: { startDate: null, endDate: null },
            maxDate: new Date(),
            deliveryBoys: [],
            deliveryBoy: "",
            totalRows: 1,
            currentPage: 1,
            perPage: this.$perPage,
            pageOptions: this.$pageOptions,
            sortBy: '',
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,
            filterOn: [],
            isLoading: false,
            create_new: null,
            edit_record: null,
            deliveryBoys: [],
            salaries: [],
            dateFormat: 'DD-MM-YYYY',
        }
    },
    mounted() {
        this.totalRows = this.salaries.length
    },
    components: {
        DateRangePicker,
        'edit-salary': EditSalary
    },
    created: function () {
        this.$eventBus.$on('salarySaved', (message) => {
            this.showMessage("success", message);
            this.getSalaries();
            this.create_new = null;
        });
        this.getSalaries();
    },
    methods: {
        convertFormat(format) {
            if (!format) return 'DD-MM-YYYY';
            const map = { 'd': 'DD', 'm': 'MM', 'M': 'MMM', 'Y': 'YYYY' };
            return format.replace(/d|m|M|Y/g, match => map[match] || match);
        },

        formatDate(date) {
            if (!date) return '';
            return moment(date).format(this.dateFormat);
        },
        getSalaries() {
            this.isLoading = true;

            let param = {
                startDate: this.dateRange.startDate
                    ? moment(this.dateRange.startDate).format('YYYY-MM-DD')
                    : "",
                endDate: this.dateRange.endDate
                    ? moment(this.dateRange.endDate).format('YYYY-MM-DD')
                    : "",
                delivery_boy_id: this.deliveryBoy
            };

            axios.get(this.$apiUrl + '/delivery_boy_salary', {
                params: param
            }).then((response) => {
                this.salaries = response.data.data.salaries;
                this.deliveryBoys = response.data.data.deliveryBoys;
                this.dateFormat = this.convertFormat(response.data.data.date_format);
                this.totalRows = this.salaries.length;
                this.isLoading = false;

            });
        },
        editRecord(record) {
            this.edit_record = record;
        },
        deleteRecord(id) {
            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('you_wont_be_able_to_revert_this'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: __('yes_delete_it'),
                cancelButtonText: __('cancel'),
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.post(this.$apiUrl + '/delivery_boy_salary/delete', { id: id })
                        .then((response) => {
                            if (response.data.status === 1) {
                                this.showMessage("success", response.data.message);
                                this.getSalaries();
                            } else {
                                this.showError(response.data.message);
                            }
                        });
                }
            });
        },
        hideModal() {
            this.create_new = false
            this.edit_record = false
        },
    }
};
</script>
<style>
@import "../../../../../node_modules/vue2-daterange-picker/dist/vue2-daterange-picker.css";

.vue-daterange-picker[data-v-1ebd09d2] {
    min-width: 80%;
}
</style>
