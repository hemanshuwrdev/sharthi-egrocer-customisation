<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('orders_export') }}</h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item">
                                    <router-link to="/seller/dashboard">{{ __('dashboard') }}</router-link>
                                </li>
                                <li class="breadcrumb-item active" aria-current="page">{{ __('orders_export') }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <section class="section">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">{{ __('orders_export') }}</h4>
                    </div>
                    <div class="card-body">
                        <b-row class="mb-2 ms-1">
                            <b-col md="4">
                                <h6 class="box-title">{{ __('from_and_to_date') }}</h6>
                                <div class="d-flex justify-content-center align-items-center">
                                    <date-range-picker
                                        :append-to-body="true"
                                        :single-date-picker="'range'"
                                        :locale-data="dateRangePickerLocale"
                                        :ranges="dateRangePickerRanges"
                                        :autoApply=false
                                        :showDropdowns="true"
                                        v-model="dateRange"
                                        :maxDate="maxDate"
                                    ></date-range-picker>
                                    <button class="btn btn-sm btn-danger ml-1" @click="dateRange.startDate = null, dateRange.endDate = null">
                                        {{ __('clear') }}
                                    </button>
                                </div>
                            </b-col>
                            <b-col md="2" class="d-flex align-items-end">
                                <button class="btn btn-primary" :disabled="!dateRange.startDate || !dateRange.endDate || isDownloading" @click="downloadCsv()">
                                    <i class="fa fa-download" aria-hidden="true"></i>
                                    {{ isDownloading ? __('loading') + '...' : __('download_csv') }}
                                </button>
                            </b-col>
                        </b-row>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
<script>
import DateRangePicker from 'vue2-daterange-picker';
import DateRangePickerMixin from '../../mixins/DateRangePickerMixin';
import moment from "moment";

export default {
    name: "SellerOrdersExport",
    mixins: [DateRangePickerMixin],
    components: {DateRangePicker},
    data: function () {
        return {
            dateRange: {startDate: null, endDate: null},
            maxDate: new Date(),
            isDownloading: false,
        }
    },
    methods: {
        downloadCsv() {
            if (!this.dateRange.startDate || !this.dateRange.endDate) {
                return;
            }
            this.isDownloading = true;
            let param = {
                startDate: moment(this.dateRange.startDate).format('YYYY-MM-DD'),
                endDate: moment(this.dateRange.endDate).format('YYYY-MM-DD'),
            }
            axios({
                url: this.$sellerApiUrl + '/orders/export_csv',
                method: 'get',
                params: param,
                responseType: 'blob',
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'orders_' + param.startDate + '_to_' + param.endDate + '.csv');
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                this.isDownloading = false;
            }).catch(() => {
                this.isDownloading = false;
            });
        },
    }
};
</script>

<style scoped>
@import "../../../../node_modules/vue2-daterange-picker/dist/vue2-daterange-picker.css";
.vue-daterange-picker[data-v-1ebd09d2] {
    min-width: 80%;
}
@media only screen and (min-width: 600px) {
    .vue-daterange-picker[data-v-1ebd09d2] {
        min-width: 90%;
    }
}
</style>
