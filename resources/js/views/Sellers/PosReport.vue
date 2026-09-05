<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('pos_orders_report') }}</h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><router-link to="/seller/dashboard">{{ __('dashboard')
                                        }}</router-link></li>
                                <li class="breadcrumb-item active" aria-current="page">{{ __('pos_orders_report') }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <section class="section">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">{{ __('pos_orders_report') }}</h4>
                    </div>
                    <div class="card-body">
                        <b-row class="mb-2 align-items-end">
                            <b-col md="5">
                                <label class="box-title d-block mb-1">{{ __('from_and_to_date') }}</label>
                                <div class="d-flex align-items-center">
                                    <date-range-picker :append-to-body="true" :single-date-picker="'range'" :autoApply=false :showDropdowns=true v-model="dateRange"
                                        :maxDate="maxDate" @update="getPosOrders" :locale-data="dateRangePickerLocale" :ranges="dateRangePickerRanges"></date-range-picker>
                                    <button class="btn btn-sm btn-danger ml-1 flex-shrink-0"
                                        @click="dateRange.startDate = null, dateRange.endDate = null, getPosOrders()">
                                        {{ __('clear') }}
                                    </button>
                                </div>
                            </b-col>
                            <b-col md="3">
                                <label class="box-title d-block mb-1">{{ __('payment_method') }}</label>
                                <b-form-select class="form-select" v-model="selectedPaymentMethod"
                                    :options="paymentMethodOptions" @change="getPosOrders"></b-form-select>
                            </b-col>
                            <b-col md="3">
                                <label class="box-title d-block mb-1">{{ __('search') }}</label>
                                <b-form-input id="filter-input" v-model="filter" type="search"
                                    :placeholder="__('search')" @input="onFilterChanged"></b-form-input>
                            </b-col>
                            <b-col md="1">
                                <button class="btn btn-primary btn_refresh" v-b-tooltip.hover :title="__('refresh')"
                                    @click="getPosOrders()">
                                    <i class="fa fa-refresh" aria-hidden="true"></i>
                                </button>
                            </b-col>
                        </b-row>

                        <div class="table-responsive">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th class="text-center">{{ __('order_id') }}</th>
                                        <th class="text-center">{{ __('customer') }}</th>
                                        <th class="text-center">{{ __('mobile') }}</th>
                                        <th class="text-center">{{ __('date') }}</th>
                                        <th class="text-center">{{ __('total_amount') }}</th>
                                        <th class="text-center">{{ __('payment_method') }}</th>
                                        <th class="text-center">{{ __('invoice') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="isLoading">
                                        <td colspan="7" class="text-center text-black my-2">
                                            <b-spinner class="align-middle"></b-spinner>
                                            <strong>{{ __('loading') }}...</strong>
                                        </td>
                                    </tr>
                                    <tr v-else-if="filteredItems.length === 0">
                                        <td colspan="7" class="text-center">{{ __('no_records_matching_your_request') }}</td>
                                    </tr>
                                    <template v-else>
                                        <tr v-for="item in paginatedItems" :key="item.id">
                                            <td class="text-center">{{ item.id }}</td>
                                            <td class="text-center">{{ item.customer_name }}</td>
                                            <td class="text-center">{{ item.customer_mobile || '-' }}</td>
                                            <td class="text-center">{{ item.created_at }}</td>
                                            <td class="text-center">{{ $currency }} {{ item.total_amount }}</td>
                                            <td class="text-center">{{ item.payment_method }}</td>
                                            <td class="text-center">
                                                <button class="btn btn-sm btn-primary mr-1"
                                                    @click="viewInvoice(item.id)">
                                                    <i class="fa fa-print"></i>
                                                </button>

                                                <button class="btn btn-sm btn-secondary"
                                                    @click="openThermalModal(item.id)">
                                                    <img src="https://img.icons8.com/?size=100&id=80268&format=png&color=ffffff"
                                                        alt="Thermal" style="width:16px; height:16px;">
                                                </button>


                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                                <tfoot>
                                    <tr class="font-weight-bold">
                                        <td class="text-center">{{ __('total') }}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td class="text-center">{{ $currency }} {{ footerTotal }}</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <b-row>
                            <b-col md="2" class="my-1">
                                <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right"
                                    label-size="sm" class="mb-0">
                                    <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"
                                        size="sm" class="form-control form-select"
                                        @change="onPerPageChange"></b-form-select>
                                </b-form-group>
                            </b-col>
                            <b-col md="4" class="my-1 d-flex align-items-center justify-content-center">
                                <div class="total-amount-display">
                                    <strong>{{ __('total_amount') }}:</strong> {{ $currency }} {{ totalAmount }}
                                </div>
                            </b-col>
                            <b-col md="6" class="my-1">
                                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
                                    align="fill" size="sm" class="my-0" @change="onPageChange"></b-pagination>
                            </b-col>
                        </b-row>
                    </div>
                </div>
            </section>
        </div>
        <!-- Invoice Modal -->
        <b-modal id="invoice-modal" size="xl" :title="__('pos_invoice')" hide-footer>
            <div class="invoice-container">
                <iframe :src="invoiceUrl" frameborder="0" style="width: 100%; height: 80vh;"></iframe>
            </div>
            <div class="text-center mt-3">
                <button class="btn btn-secondary" @click="$bvModal.hide('invoice-modal')">{{ __('close') }}</button>
                <button class="btn btn-primary ml-2" @click="printInvoice">{{ __('print') }}</button>
            </div>
        </b-modal>
        <!-- Thermal Print Modal -->
        <b-modal id="thermal-modal" :title="__('thermal_preview')" hide-footer centered>
            <div class="preview-wrapper">
                <div v-if="sellerSettings && thermalOrder" id="thermal-print-area"
                    :style="{ width: sellerSettings.thermal_paper_width + 'mm' }" class="receipt-container">

                    <div class="text-center mb-2" v-if="sellerSettings.invoice_logo">
                        <img :src="sellerSettings.invoice_logo" class="receipt-logo">
                    </div>
                    <div class="text-center store-name">{{ sellerSettings.name }}</div>
                    <div class="text-center"><strong>Email:</strong>{{ sellerSettings.email }}</div>
                    <div class="text-center"><strong>Mobile No:</strong>{{ sellerSettings.mobile }}</div>

                    <div class="dashed-line"></div>

                    <div class="receipt-info">
                        <div><strong>Invoice No:</strong> #{{ thermalOrder.order_id }}</div>
                        <div><strong>Date:</strong> {{ formatDateTime(thermalOrder.created_at) }}</div>
                        <div><strong>Payment:</strong> {{ thermalOrder.payment_method.toUpperCase() }}</div>
                    </div>

                    <div class="dashed-line"></div>

                    <table class="receipt-table">
                        <thead>
                            <tr>
                                <th class="col-item text-left">Item</th>
                                <th class="col-rate text-right">Rate</th>
                                <th class="col-qty text-right">Qty</th>
                                <th class="col-amt text-right">Amt</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in thermalOrder.items" :key="i">
                                <td class="col-item text-left">{{ item.name }}</td>
                                <td class="col-rate text-right">{{ item.unit_price }}</td>
                                <td class="col-qty text-right">{{ item.qty }}</td>
                                <td class="col-amt text-right">{{ item.subtotal }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="dashed-line"></div>

                    <div class="totals">
                        <div class="d-flex justify-content-between">
                            <span>Total Qty:</span>
                            <span>{{ thermalOrder.total_qty }}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>Subtotal:</span>
                            <span>₹ {{ thermalOrder.items_total }}</span>
                        </div>
                        <div v-if="thermalOrder.discount_amount > 0" class="d-flex justify-content-between text-danger">
                            <span>Discount:</span>
                            <span>- ₹ {{ thermalOrder.discount_amount }}</span>
                        </div>
                        <div v-for="(charge, index) in thermalOrder.additional_charges" :key="'c' + index"
                            class="d-flex justify-content-between">
                            <span>{{ charge.charge_name }}:</span>
                            <span>₹ {{ charge.amount }}</span>
                        </div>
                        <div class="dashed-line-thin"></div>
                        <div class="d-flex justify-content-between grand-total font-weight-bold">
                            <span>Grand Total:</span>
                            <span>₹ {{ thermalOrder.grand_total }}</span>
                        </div>
                    </div>

                    <div class="dashed-line"></div>
                    <div class="text-center footer-thanks">Thank you for your purchase!</div>
                </div>
            </div>

            <div class="modal-footer-custom text-center mt-3">
                <button class="btn btn-secondary" @click="$bvModal.hide('thermal-modal')">{{ __('close') }}</button>
                <button class="btn btn-success ml-2" @click="printThermal">
                    <i class="fa fa-print"></i> {{ __('print_now') }}
                </button>
            </div>
        </b-modal>
        <!-- Thermal Print Modal end -->


    </div>
</template>
<script>
import DateRangePicker from 'vue2-daterange-picker';
import DateRangePickerMixin from '../../mixins/DateRangePickerMixin';
import moment from "moment";
export default {
    name: "pos_reports",
    mixins: [DateRangePickerMixin],
    components: { DateRangePicker },
    data: function () {
        return {
            dateRange: { startDate: null, endDate: null },
            maxDate: new Date(),
            invoiceUrl: '',
            fields: [
                { key: 'id', label: __('order_id'), sortable: true, class: 'text-center' },
                { key: 'customer_name', label: __('customer'), sortable: true, class: 'text-center' },
                { key: 'customer_mobile', label: __('mobile'), sortable: true, class: 'text-center' },
                { key: 'created_at', label: __('date'), sortable: true, class: 'text-center', formatter: this.formatDate },
                { key: 'total_amount', label: __('total_amount'), sortable: true, class: 'text-center' },
                { key: 'payment_method', label: __('payment_method'), sortable: true, class: 'text-center' },
                { key: 'actions', label: __('invoice'), class: 'text-center', tdClass: 'invoice-action-cell' },
            ],
            tableKey: 0, // Key to force table re-render
            totalRows: 0,
            currentPage: 1,
            perPage: this.$perPage,
            pageOptions: this.$pageOptions,
            filter: null,
            isLoading: false,
            posOrders: [],
            filteredItems: [],
            selectedPaymentMethod: null,
            paymentMethodOptions: [
                { value: null, text: __('all_payment_methods') },
                { value: 'cash', text: __('cash') },
                { value: 'upi', text: __('upi') },
                { value: 'card', text: __('card') }
            ],
            footerTotal: '0.00',
            totalAmount: '0.00',

            // ===== THERMAL PRINT DATA =====
            thermalOrder: null,
            sellerSettings: {
                name: '',
                invoice_logo: null,
                thermal_paper_width: null
            }

        }

    },
    mounted() {
        this.getPosOrders();
    },
    methods: {

        openThermalModal(orderId) {

            axios.get(this.$sellerApiUrl + '/seller/reports/thermal-print', {
                params: {
                    order_id: orderId
                }
            })
                .then(res => {
                    if (res.data.status) {

                        //  single order object
                        this.thermalOrder = res.data.order;
                        this.sellerSettings = res.data.seller;
                        this.$bvModal.show('thermal-modal');
                    }
                })
                .catch(err => {
                    console.error(err);
                });

        },

        formatDateTime(date) {
            return moment(date).format('DD-MM-YY hh:mm A');
        },

        getPosOrders() {
            this.isLoading = true;
            let params = {
                "startDate": (this.dateRange.startDate != null) ? moment(this.dateRange.startDate).format('YYYY-MM-DD') : "",
                "endDate": (this.dateRange.endDate != null) ? moment(this.dateRange.endDate).format('YYYY-MM-DD') : "",
                "payment_method": this.selectedPaymentMethod
            };

            axios.get(this.$sellerApiUrl + '/pos_reports', { params })
                .then((response) => {
                    this.isLoading = false;
                    if (response.data.status) {
                        this.posOrders = response.data.data;
                        this.filteredItems = [...this.posOrders];

                        // Debug: Log the structure of the data
                        console.log("POS Orders Data:", this.posOrders.length > 0 ? this.posOrders[0] : 'No orders');
                        console.log("Fields:", this.fields);

                        this.totalRows = this.filteredItems.length;
                        this.calculateFooterTotal();
                        this.calculateTotalAmount();

                        // Force table refresh
                        this.tableKey++;
                    } else {
                        this.showError(response.data.message);
                    }
                })
                .catch(error => {
                    this.isLoading = false;
                    this.showError("Error fetching POS orders");
                });
        },

        formatDate(dateString) {
            return moment(dateString).format('DD/MM/YYYY');
        },

        viewInvoice(orderId) {
            // Set the invoice URL and show modal instead of opening in new tab
            this.invoiceUrl = `/pos/invoice/${orderId}`;
            this.$bvModal.show('invoice-modal');
        },

        calculateTotalAmount() {
            // Calculate grand total (all orders)
            this.totalAmount = this.posOrders.reduce((total, item) => {
                return total + parseFloat(item.total_amount || 0);
            }, 0).toFixed(2);
        },

        calculateFooterTotal() {
            // Calculate total for just the current page
            const start = (this.currentPage - 1) * this.perPage;
            const end = Math.min(start + this.perPage, this.filteredItems.length);
            const currentPageItems = this.filteredItems.slice(start, end);

            this.footerTotal = currentPageItems.reduce((total, item) => {
                return total + parseFloat(item.total_amount || 0);
            }, 0).toFixed(2);
        },

        onFilterChanged() {
            if (this.filter) {
                const filterLC = this.filter.toLowerCase();
                this.filteredItems = this.posOrders.filter(item => {
                    return this.fields.some(field => {
                        const value = item[field.key];
                        return value && String(value).toLowerCase().includes(filterLC);
                    });
                });
            } else {
                this.filteredItems = [...this.posOrders];
            }

            this.totalRows = this.filteredItems.length;
            this.currentPage = 1; // Reset to first page when filtering
            this.tableKey++; // Force table re-render
            this.calculateFooterTotal();
        },

        onPageChange() {
            this.calculateFooterTotal();
            this.tableKey++; // Force table re-render
        },

        onPerPageChange() {
            this.currentPage = 1; // Reset to first page when changing per page
            this.calculateFooterTotal();
            this.tableKey++; // Force table re-render
        },

        printInvoice() {
            const iframe = document.querySelector('#invoice-modal iframe');
            if (iframe) {
                iframe.contentWindow.print();
            }
        },

        printThermal() {
            // 1. Get the content to print
            const printContents = document.getElementById('thermal-print-area').innerHTML;
            const paperWidth = this.sellerSettings.thermal_paper_width || 80;

            // 2. temporary window
            const printWindow = window.open('', '_blank', `width=${paperWidth * 4},height=600`);

            // 3. Document structure 
            printWindow.document.open();

            // 4. Basic HTML structure
            printWindow.document.write('<html><head><title>Print Receipt</title></head><body><div id="print-root"></div></body></html>');

            // 5. Copy styles
            document.querySelectorAll('style, link[rel="stylesheet"]').forEach(style => {
                printWindow.document.head.appendChild(style.cloneNode(true));
            });

            // 6. Add custom styles for thermal printing
            const styleSheet = printWindow.document.createElement("style");
            styleSheet.innerText = `@page { size: ${paperWidth}mm auto; margin: 0; } 
                            body { margin: 0 auto; padding: 2mm; width: ${paperWidth}mm !important;}`;
            printWindow.document.head.appendChild(styleSheet);

            // 7. Insert content
            printWindow.document.getElementById('print-root').innerHTML = printContents;

            printWindow.document.close();

            // 8. Print when loaded
            printWindow.onload = function () {
                printWindow.focus();
                printWindow.print();
                printWindow.close();
            };

            // Backup timeout in case onload doesn't fire
            setTimeout(() => {
                if (!printWindow.closed) {
                    printWindow.focus();
                    printWindow.print();
                    printWindow.close();
                }
            }, 700);
        }



    },
    computed: {
        paginatedItems() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = Math.min(start + this.perPage, this.filteredItems.length);
            return this.filteredItems.slice(start, end);
        }
    }
};
</script>

<style scoped>
@import "../../../../node_modules/vue2-daterange-picker/dist/vue2-daterange-picker.css";

.list-toolbar > .d-flex {
    flex-shrink: 0;
}

.total-amount-display {
    font-weight: bold;
    font-size: 1.1rem;
    color: #435ebe;
}

.invoice-action-cell {
    min-width: 100px;
}

/* THERMAL PRINT STYLES */

/* 1. Preview Background Wrapper */
.preview-wrapper {
    display: flex;
    justify-content: center;
    background: #eee;
    padding: 20px;
}

/* 2. Main Receipt Container */
.receipt-container {
    background: white;
    padding: 4mm;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    font-family: 'Courier New', Courier, monospace;
    color: #000;
    font-size: 11px;
    line-height: 1.2;
}

/* 3. TABLE  */
.receipt-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;

    margin: 5px 0;
}

.receipt-table th,
.receipt-table td {
    padding: 2px 0;
    vertical-align: top;
    word-wrap: break-word;
    overflow: hidden;
}

/* Column Widths (Fixed Balance) */
.col-item {
    width: 35%;
    text-align: left;
}

.col-rate {
    width: 30%;
    text-align: right;
}

.col-qty {
    width: 10%;
    text-align: right;
}

.col-amt {
    width: 25%;
    text-align: right;
}

/* 4. Store & Header Styling */
.receipt-logo {
    max-width: 60px;
    filter: grayscale(100%);
    margin: 0 auto 5px auto;
    display: block;
}

.store-name {
    font-size: 13px;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
}

.receipt-info {
    font-size: 10px;
    margin-top: 5px;
}

/* 5. Totals Section Styling */
.totals-section {
    width: 100%;
    margin-top: 5px;
}

.total-row {
    display: flex;
    justify-content: space-between;
    padding: 1px 0;
}

.grand-total {
    font-size: 13px;
    font-weight: bold;
    border-top: 1px dashed #000;
    border-bottom: 1px dashed #000;
    padding: 4px 0;
    margin-top: 4px;
}

/* 6. Lines */
.dashed-line {
    border-top: 1px dashed #000;
    margin: 6px 0;
}

.dashed-line-thin {
    border-top: 1px dotted #888;
    margin: 3px 0;
}

.text-center {
    text-align: center;
}

.text-right {
    text-align: right;
}

.font-weight-bold {
    font-weight: bold;
}

.footer-thanks {
    font-style: italic;
    margin-top: 10px;
    font-size: 10px;
}

/* 7. NARROW PAPER OPTIMIZATION (58mm) */
#thermal-print-area[style*="width: 58mm"] {
    font-size: 9px;
    padding: 2mm;
}

#thermal-print-area[style*="width: 58mm"] .col-item {
    width: 30%;
}

#thermal-print-area[style*="width: 58mm"] .col-rate {
    width: 35%;
}

/* 8. PRINT LOGIC */
@media print {

    html,
    body,
    #app,
    .main-content,
    .sidebar,
    .navbar,
    .modal-header,
    .modal-footer,
    .btn {
        visibility: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    .modal-backdrop,
    .page-heading,
    .section,
    .breadcrumb {
        display: none !important;
    }

    #thermal-print-area,
    #thermal-print-area * {
        visibility: visible !important;
    }

    #thermal-print-area {
        position: fixed !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 2mm !important;
        box-shadow: none !important;
        border: none !important;
    }

    body {
        overflow: visible !important;
    }
}
</style>