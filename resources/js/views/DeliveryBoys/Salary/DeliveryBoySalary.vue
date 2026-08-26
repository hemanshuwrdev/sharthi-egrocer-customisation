<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('delivery_boy_salary') }}</h3>
            <button class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap"
                v-if="$route.path.includes('/seller')" @click="create_new = true">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add_salary') }}</span>
            </button>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
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

                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input v-model="filter" type="search" :placeholder="__('search')"></b-form-input>
                </div>

                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')"
                    @click="getSalaries()">
                    <i class="fa fa-refresh"></i>
                </button>
            </div>

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
                        <div class="list-actions">
                            <button class="list-action-btn is-edit" v-if="$route.path.includes('/seller')"
                                @click="editRecord(row.item)" v-b-tooltip.hover :title="__('edit')">
                                <i class="fa fa-pencil-alt"></i>
                            </button>
                            <button class="list-action-btn is-delete" v-if="$route.path.includes('/seller')"
                                @click="deleteRecord(row.item.id)" v-b-tooltip.hover :title="__('delete')">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </template>
                </b-table>
            </div>

            <div class="list-footer">
                <div class="list-perpage">
                    <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right"
                        label-size="sm" class="mb-0">
                        <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"
                            size="sm" class="form-control form-select"></b-form-select>
                    </b-form-group>
                </div>
                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
                    align="fill" size="sm" class="list-pagination"></b-pagination>
            </div>
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
