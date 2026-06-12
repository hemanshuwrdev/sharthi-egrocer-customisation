<template>
    <div>
        <div class="page-heading view_order">
            <div class="row">
                <div class="col-12 col-md-6 order-md-1 order-last">
                    <h3>{{ __('view_order') }}</h3>
                </div>
                <div class="col-12 col-md-6 order-md-2 order-first">
                    <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item" v-if="isSellerRoute">
                                <router-link to="/seller/dashboard">{{ __('dashboard') }}</router-link>
                            </li>
                            <li class="breadcrumb-item" v-else-if="isDeliveryBoyRoute">
                                <router-link to="/delivery_boy/">{{ __('dashboard') }}</router-link>
                            </li>
                            <li class="breadcrumb-item" v-else>
                                <router-link to="/dashboard">{{ __('dashboard') }}</router-link>
                            </li>
                            <li class="breadcrumb-item" v-if="isSellerRoute">
                                <router-link to="/seller/orders">{{ __('view_order') }}</router-link>
                            </li>
                            <li class="breadcrumb-item" v-else-if="isDeliveryBoyRoute">
                                <router-link to="/delivery_boy/orders">{{ __('view_order') }}</router-link>
                            </li>
                            <li class="breadcrumb-item" v-else>
                                <router-link to="/orders">{{ __('view_order') }}</router-link>
                            </li>
                            <li class="breadcrumb-item active" aria-current="page">
                                {{ __('order_details') }}
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div v-if="order" class="row">
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header">
                            <h4>{{ __('order_details') }}</h4>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <th class="th-width">{{ __('order_id') }}</th>
                                            <td>{{ order.order_id }}</td>
                                        </tr>
                                        <tr>
                                            <th class="th-width">{{ __('email') }}</th>
                                            <td>{{ order.user_email }}</td>
                                        </tr>
                                        <tr>
                                            <th class="th-width">{{ __('order_note') }}</th>
                                            <td>{{ order.order_note }}</td>
                                        </tr>
                                        <tr>
                                            <th class="th-width">{{ __('status') }}</th>
                                            <td>
                                                {{ getDisplayName(order.status_name_translation) || order.status_name }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th class="th-width">{{ __('name') }}</th>
                                            <td>{{ order.user_name }}</td>
                                        </tr>
                                        <tr>
                                            <th class="th-width">{{ __('mobile') }}</th>
                                            <td>{{ order.user_mobile | mobileMask }}</td>
                                        </tr>
                                        <tr>
                                            <th class="th-width">{{ __('area') }}</th>
                                            <td>{{ order.address }}</td>
                                        </tr>
                                        <tr>
                                            <th class="th-width">{{ __('pincode') }}</th>
                                            <td>{{ order.pincode }}</td>
                                        </tr>

                                        <tr>
                                            <th class="th-width">{{ __('delivery_boy') }}</th>
                                            <td>
                                                <template
                                                    v-if="order.delivery_boy_name || getDisplayName(order.delivery_boy_name_translation)">
                                                    {{ getDisplayName(order.delivery_boy_name_translation) ||
                                                        order.delivery_boy_name }}
                                                </template>
                                                <template v-else>
                                                    {{ __('not_assign') }}
                                                </template>
                                            </td>
                                        </tr>
                                        <tr v-if="this.$roleDeliveryBoy !== this.login_user.role.name">
                                            <th class="th-width">{{ __('assign_delivery_boy') }}</th>
                                            <td>
                                                <form class="row g-3 align-items-center" ref="my-form"
                                                    @submit.prevent="assignDeliveryBoy">

                                                    <div class="input-group">
                                                        <label class="visually-hidden" for="delivery_boy_id">{{
                                                            __('delivery_boy') }}</label>
                                                        <select id="delivery_boy_id" name="status"
                                                            class="form-control form-select" v-model="delivery_boy_id">
                                                            <option value="">{{ __('select_delivery_boy') }}</option>
                                                            <option v-for="boy in deliveryBoys" :value='boy.id'>{{
                                                                getDisplayName(boy.name) }} ({{
                                                                    __('pending_order_count') }}: {{ boy.pending_order_count
                                                                }})
                                                            </option>
                                                        </select>
                                                        <div class="input-group-append" v-if="$can('order_update')">
                                                            <button type="submit" class="btn btn-primary"
                                                                :disabled="delivery_boy_id === '' || isLoadingDboy">
                                                                <template v-if="isLoadingDboy"><b-spinner small
                                                                        label="Spinning"></b-spinner></template> {{
                                                                            __('update') }} </button>
                                                        </div>
                                                    </div>

                                                </form>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th class="th-width">{{ __('update_status') }}</th>
                                            <td>
                                                <form class="row g-3 align-items-center" ref="my-form"
                                                    @submit.prevent="updateStatus">

                                                    <div class="input-group">
                                                        <label class="visually-hidden" for="status">{{ __('status')
                                                        }}</label>
                                                        <select id="status" name="status"
                                                            class="form-control form-select" v-model="order_status_id">
                                                            <option value="">{{ __('select_order_status') }}</option>
                                                            <option v-for="status in statuses" :value='status.id'>{{
                                                                getStatusDisplayName(status) }}</option>
                                                        </select>
                                                        <div class="input-group-append" v-if="$can('order_update')">
                                                            <button type="submit" class="btn btn-primary"
                                                                :disabled="order_status_id === '' || isLoadingUstatus">
                                                                <template v-if="isLoadingUstatus"><b-spinner small
                                                                        label="Spinning"></b-spinner></template> {{
                                                                            __('update') }} </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header">
                            <h4>{{ __('billing_details') }}</h4>
                            <span class="pull-right">

                                <button @click="downloadInvoice" v-b-tooltip.hover :title="__('download_invoice')"
                                    class="btn btn-secondary btn-sm" :disabled="isLoading">
                                    <template v-if="isLoading">
                                        <b-spinner small label="Spinning"></b-spinner> {{ __('downloading') }}...
                                    </template>
                                    <template v-else>
                                        <i class="fa fa-download"></i> {{ __('download_invoice') }}
                                    </template>
                                </button>

                                <router-link :to="invoiceRoute" v-b-tooltip.hover :title="__('generate_invoice')"
                                    class="btn btn-primary btn-sm">
                                    <i class="fa fa-file" aria-hidden="true"></i> {{ __('generate_invoice') }}
                                </router-link>
                            </span>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <th class="th-width">{{ __('order_date') }}</th>
                                            <td> {{ order.orders_created_at }}</td>
                                        </tr>
                                        <tr>
                                            <th class="th-width">{{ __('address') }}</th>
                                            <td colspan="3">{{ order.order_address }}</td>
                                        </tr>
                                        <tr>
                                            <th class="th-width">{{ __('delivery_time') }}</th>
                                            <td>{{ order.delivery_time }}</td>
                                        </tr>
                                        <tr>
                                            <th class="th-width">{{ __('total') }} ({{ $currency }})</th>
                                            <td>{{ order.total }}</td>
                                        </tr>
                                        <tr>
                                            <th class="th-width">{{ __('discount') }} {{ $currency }}( % )</th>
                                            <td>{{ discount_in_rupees + ' ( ' + order.discount + '% )' }}</td>
                                        </tr>
                                        <tr>
                                            <th class="th-width">{{ __('wallet_used') }} ({{ $currency }})</th>
                                            <td>{{ order.wallet_balance }}</td>

                                        </tr>
                                        <tr>
                                            <th class="th-width">{{ __('promo_discount') }} ({{ $currency }})</th>
                                            <td>{{ order.promo_discount }}</td>
                                        </tr>
                                        <tr>
                                            <th class="th-width">{{ __('promo_code') }}</th>
                                            <td>{{ order.promo_code }}</td>
                                        </tr>
                                        <tr v-if="order.scheme_id">
                                            <th class="th-width">{{ __('scheme') }}</th>
                                            <td><span class="badge bg-info">{{ order.scheme_name || ('#' + order.scheme_id) }}</span></td>
                                        </tr>
                                        <tr v-if="order.scheme_discount > 0">
                                            <th class="th-width">{{ __('scheme_discount') }} ({{ $currency }})</th>
                                            <td>{{ order.scheme_discount }}</td>
                                        </tr>
                                        <tr>
                                            <th class="th-width">{{ __('delivery_charge') }} ({{ $currency }})</th>
                                            <td>{{ order.delivery_charge }}</td>
                                        </tr>
                                        <tr v-if="getAdditionalChargesTotal(order.additional_charges) > 0">
                                            <th class="th-width">{{ __('additional_charges') }} ({{ $currency }})</th>
                                            <td>{{ getAdditionalChargesTotal(order.additional_charges) }}</td>
                                        </tr>
                                        <tr>
                                            <th class="th-width">{{ __('payable_total') }} ({{ $currency }} )</th>
                                            <td>
                                                <input type="number" class="form-control" name="final_total"
                                                    :value="order.remaining_final" disabled>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th class="th-width">{{ __('payment_method') }}</th>
                                            <td>{{ order.payment_method }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-12 mt-4">
                    <h4>{{ __('list_of_order_items') }}</h4>
                    <div class="row">
                        <div class="col-md-4" v-for="item in order_items" :key="item.id">
                            <div class="card position-relative">
                                <div v-if="item.is_free_item == 1"
                                    class="badge bg-success position-absolute" style="top: 10px; left: 10px;">
                                    {{ __('free') }}
                                </div>
                                <div v-if="item.active_status == 7 || item.active_status == 8"
                                    class="badge bg-danger position-absolute" style="top: 10px; right: 10px;">
                                    {{ getDisplayName(item.status_name_translation) || item.status_name }}
                                </div>
                                <button v-if="canCancelItem(item) && !isDeliveryBoyRoute" v-b-tooltip.hover :title="__('cancel_item')"
                                    class="btn btn-sm btn-danger cancel-item-btn position-absolute"
                                    @click="cancelOrderItem(item)" :disabled="isLoadingCancel">
                                    <i class="fa fa-times"></i>
                                </button>
                                <div class="card-body">
                                    <b>{{ __('name') }} :- </b>{{ item.product_name + " (" + item.variant_name + ")" }}
                                    <br>
                                    <b>{{ __('quantity') }} :- </b>{{ item.quantity }}
                                    <br>
                                    <b>{{ __('variant') }} :- </b>{{ item.variant_name }}
                                    <br>
                                    <b>{{ __('subtotal') }} ({{ $currency }} ) :- </b>{{ item.sub_total }}
                                    <br>
                                    <b>{{ __('status') }} :- </b>{{ getDisplayName(item.status_name_translation) ||
                                        item.status_name }}
                                    <br>
                                    <span v-if="item.active_status == 7"><b>{{ __('reason') }} :- </b>{{
                                        item.cancellation_reason
                                    }}</span>

                                    <div class="row mt-3">
                                        <div class="col-6">
                                            <b-button v-b-tooltip.hover title="View Item Details"
                                                class="btn btn-block btn-primary" @click="sendInfo(item)">
                                                {{ __('view_item_details') }}
                                            </b-button>
                                        </div>
                                        <div class="col-6" v-if="isSellerRoute">
                                            <router-link
                                                :to="{ name: 'SellerViewProduct', params: { id: item.product_id } }"
                                                v-b-tooltip.hover title="View Product"
                                                class="btn btn-block btn-light-primary">{{
                                                    __('view_product') }}</router-link>
                                        </div>
                                        <div class="col-6" v-else-if="isDeliveryBoyRoute">
                                            <router-link
                                                :to="{ name: 'DeliveryBoyViewProduct', params: { id: item.product_id } }"
                                                v-b-tooltip.hover title="View Product"
                                                class="btn btn-block btn-light-primary">{{
                                                    __('view_product') }}</router-link>
                                        </div>
                                        <div class="col-6" v-else>
                                            <router-link :to="{ name: 'ViewProduct', params: { id: item.product_id } }"
                                                v-b-tooltip.hover title="View Product"
                                                class="btn btn-block btn-light-primary">{{
                                                    __('view_product')
                                                }}</router-link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <b-modal v-model="itemModalShow" v-bind:hide-footer="true" :title="__('order_item_details')">
                <b-container fluid>
                    <div class="row">
                        <ul class="list-group">
                            <li class="list-group-item"><b>{{ __('name') }} :- </b>{{ item.product_name + " (" +
                                item.variant_name +
                                ")" }}</li>
                            <li class="list-group-item capitalize" v-if="item.active_status">
                                <b>{{ __('status') }} :- </b>{{ getDisplayName(item.status_name_translation) ||
                                    item.status_name }}
                            </li>
                            <li class="list-group-item">
                                <span><b>{{ __('product_id') }} :- </b>{{ item.product_id }}</span>
                                <router-link :to="viewProductRoute" v-b-tooltip.hover title="View"
                                    class="btn btn-primary btn-sm pull-right"><i class="fa fa-eye"></i></router-link>
                            </li>
                            <li class="list-group-item"
                                v-if="item.seller_name || getDisplayName(item.seller_name_translation)">
                                <b>{{ __('seller_name') }} :- </b>{{
                                    getDisplayName(item.seller_name_translation) || item.seller_name }}
                            </li>
                            <li class="list-group-item"><b>{{ __('user_name') }} :- </b>{{ item.user_name }}</li>
                            <li class="list-group-item"><b>{{ __('variant_id') }} :- </b>{{ item.product_variant_id }}
                            </li>
                            <li class="list-group-item"><b>{{ __('quantity') }} :- </b>{{ item.quantity }}</li>
                            <li class="list-group-item"><b>{{ __('price') }} :- </b>{{ item.price }}</li>
                            <li class="list-group-item"><b>{{ __('discounted_price') }} ({{ $currency }} ) :- </b>{{
                                item.discounted_price }}</li>
                            <li class="list-group-item"><b>{{ __('tax_amount') }} ({{ $currency }} ) :- </b>{{
                                item.tax_amount }}
                            </li>
                            <li class="list-group-item"><b>{{ __('tax_percentage') }} (%) :- </b>{{ item.tax_percentage
                            }}</li>
                            <li class="list-group-item"><b>{{ __('subtotal') }} ({{ $currency }} ) :- </b>{{
                                item.sub_total }}</li>
                            <li class="list-group-item">
                                <a class=" col-sm-12 btn btn-success"
                                    :href="whatsappMessageLink(order.country_code, order.mobile, order.user_name, order.id, item.id)"
                                    target="_blank" title="Send Whatsapp Notification">
                                    <i class="fab fa-whatsapp"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </b-container>
            </b-modal>

        </div>
    </div>
</template>
<script>
import axios from "axios";
import Auth from '../../Auth.js';

export default {
    data: function () {
        return {
            login_user: Auth.user,

            isLoading: false,
            isLoadingDboy: false,
            isLoadingUstatus: false,
            isLoadingCancel: false,

            id: null,
            order: [],
            order_items: [],

            discount_in_rupees: 0,
            whatsapp_message: "",

            order_status_id: "",

            selectedItems: [],
            select: '',
            all_select: false,

            statuses: '',
            status_id: '',

            deliveryBoys: '',
            delivery_boy_id: '',
            itemModalShow: false,
            item: '',
            userRole: '', // Change this based on the user's role
            order: {
                order_id: '', // Replace with the actual order ID
            },
        }

    },
    computed: {
        isSellerRoute() {
            // Use this.$route to access the current route
            return this.$route.path.startsWith('/seller/');
        },
        isDeliveryBoyRoute() {
            // Use this.$route to access the current route
            return this.$route.path.startsWith('/delivery_boy/');
        },
        invoiceRoute() {
            // Define route configurations based on user roles
            let routeConfig = null;
            switch (this.login_user.role.name) {
                case 'Seller':
                    routeConfig = {
                        name: 'SellerInvoiceOrder',
                        params: { id: this.order.order_id },
                    };
                    break;
                case 'Delivery Boy':
                    routeConfig = {
                        name: 'DeliveryBoyInvoiceOrder',
                        params: { id: this.order.order_id },
                    };
                    break;
                case 'Admin':
                    routeConfig = {
                        name: 'InvoiceOrder',
                        params: { id: this.order.order_id },
                    };
                    break;
                case 'Super Admin':
                    routeConfig = {
                        name: 'InvoiceOrder',
                        params: { id: this.order.order_id },
                    };
                    break;
                default:
                    // Handle any other roles or cases
                    break;
            }

            return routeConfig;
        },
        viewProductRoute() {
            // Define route configurations based on user roles
            let routeConfig = null;
            switch (this.login_user.role.name) {
                case 'Seller':
                    routeConfig = {
                        name: 'SellerViewProduct',
                        params: { id: this.item.product_id },
                    };
                    break;
                case 'Delivery Boy':
                    routeConfig = {
                        name: 'DeliveryBoyViewProduct',
                        params: { id: this.item.product_id },
                    };
                    break;
                case 'Admin':
                    routeConfig = {
                        name: 'ViewProduct',
                        params: { id: this.item.product_id },
                    };
                    break;
                case 'Super Admin':
                    routeConfig = {
                        name: 'ViewProduct',
                        params: { id: this.item.product_id },
                    };
                    break;
                default:
                    // Handle any other roles or cases
                    break;
            }

            return routeConfig;
        },
    },
    created: function () {
        this.id = this.$route.params.id;
        //this.record = this.$route.params.record;
        if (this.id) {
            this.getOrderStatus();
            this.getOrder();
        }
        if (this.order.discount > 0) {
            let discounted_amount = this.order.total * this.order.discount / 100;
            let remaining_final = this.order.total - discounted_amount;
            this.discount_in_rupees = this.order.total - remaining_final;
        }

    },
    methods: {

        getDisplayName(name) {
            if (name == null) return '';
            if (typeof name === 'string') return name;
            if (typeof name === 'object' && !Array.isArray(name)) {
                if ('name' in name && 'lang' in name) return String(name.name || '').trim();
                const appLocale = window.appLocale || window.localStorage.getItem('lang') || 'en';
                const forLocale = name[appLocale];
                if (forLocale != null && String(forLocale).trim() !== '') return String(forLocale).trim();
                const firstNonEmpty = Object.values(name).find(val => val != null && String(val).trim() !== '');
                return firstNonEmpty != null ? String(firstNonEmpty).trim() : '';
            }
            return '';
        },
        getStatusDisplayName(status) {
            if (!status) return '';
            const sn = status.status_name;
            if (sn == null) return status.status || '';
            if (typeof sn === 'string') return sn.trim() || status.status || '';
            if (typeof sn === 'object' && !Array.isArray(sn)) {
                const appLocale = window.appLocale || window.localStorage.getItem('lang') || 'en';
                const forLocale = sn[appLocale];
                if (forLocale != null && String(forLocale).trim() !== '') return String(forLocale).trim();
                const first = Object.values(sn).find(val => val != null && String(val).trim() !== '');
                return first != null ? String(first).trim() : (status.status || '');
            }
            return status.status || '';
        },
        getOrderStatus: function () {
            let vm = this;
            axios.get(this.$apiUrl + '/order_statuses').then((response) => {

                this.isLoading = false
                let data = response.data;
                const statusesToRemoveIds = [7, 8];
                this.statuses = data.data.filter(status => !statusesToRemoveIds.includes(status.id));
            }).catch(error => {
                vm.isLoading = false;
                if (error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError("Something went wrong!");
                }
            });
        },
        formatDate(dateTime) {
            const date = new Date(dateTime);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
            const year = date.getFullYear();

            return `${day}-${month}-${year}`;
        },
        getOrder() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/orders/view/' + this.id)
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    if (data.status === 1) {
                        this.order = response.data.data.order;
                        this.order_items = response.data.data.order_items;
                        this.deliveryBoys = response.data.data.deliveryBoys;

                        this.delivery_boy_id = (this.order.delivery_boy_id != 0 && this.order.delivery_boy_id != "") ? this.order.delivery_boy_id : "";
                        this.order_status_id = (this.order.active_status != 0 && this.order.active_status != "") ? this.order.active_status : "";

                    } else {
                        this.showError(data.message);
                        setTimeout(() => {
                            this.$router.back();
                        }, 1000);
                    }
                }).catch(error => {
                    this.isLoading = false;
                    if (error.request.statusText) {
                        this.showError(error.request.statusText);
                    } else if (error.message) {
                        this.showError(error.message);
                    } else {
                        this.showError("Something went wrong!");
                    }
                });
        },

        sendInfo(item) {
            this.item = item;
            this.itemModalShow = true;
        },


        whatsappMessageLink(country_code, mobile, user_name, order_id, item_id) {
            return "https://api.whatsapp.com/send?phone=+" + country_code + " " + mobile + "&text=Hello " + user_name + " ,Your order with ID :" + order_id + " is  " + item_id + ". Please take a note of it. If you have further queries feel free to contact us. Thank you.";
        },
        updateStatus() {
            let vm = this;
            this.$swal.fire({
                title: "Are you Sure?",
                text: "You want be able to revert this",
                confirmButtonText: "Yes, Sure",
                cancelButtonText: "Cancel",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#37a279',
                cancelButtonColor: '#d33',
            }).then(result => {
                if (result.value) {
                    this.isLoadingUstatus = true
                    let postData = {
                        order_id: this.id,
                        status_id: this.order_status_id,
                    }
                    axios.post(this.$apiUrl + '/orders/update_status', postData).then((response) => {
                        this.isLoadingUstatus = false
                        let data = response.data;
                        if (data.status === 1) {
                            //this.showSuccess(data.message);
                            this.order_status_id = '';
                            this.getOrder();
                            this.showMessage("success", data.message);
                            setTimeout(
                                function () {
                                    vm.$swal.close();
                                }, 2000);
                        } else {
                            vm.showError(data.message);
                            vm.isLoadingUstatus = false;
                        }
                    }).catch(error => {
                        vm.isLoadingUstatus = false;
                        this.showError("Something went wrong!");
                    });
                }
            });
        },

        assignDeliveryBoy() {
            this.isLoadingDboy = true
            let postData = {
                order_id: this.id,
                delivery_boy_id: this.delivery_boy_id
            }
            axios.post(this.$apiUrl + '/orders/assign_delivery_boy', postData).then((response) => {
                this.isLoadingDboy = false
                let data = response.data;
                if (data.status === 1) {

                    this.delivery_boy_id = '';
                    this.getOrder();
                    this.showMessage("success", data.message);
                    setTimeout(
                        function () {
                            vm.$swal.close();
                        }, 2000);
                } else {
                    this.showMessage("error", data.message);
                    this.isLoadingDboy = false;
                }
            }).catch(error => {
                this.isLoadingDboy = false;
                this.showError("Something went wrong!");
            });
        },

        downloadInvoice() {
            this.isLoading = true;
            let postData = {
                order_id: this.id,
            }
            axios({
                url: this.$apiUrl + '/orders/invoice_download',
                method: 'post',
                responseType: 'blob',

                data: postData
            }).then((response) => {
                var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                var fileLink = document.createElement('a');
                fileLink.href = fileURL;
                fileLink.setAttribute('download', 'Invoice-No:#' + this.id + '.pdf');
                document.body.appendChild(fileLink);
                fileLink.click();
                this.isLoading = false;
            }).catch(error => {
                if (error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError("Something went wrong!");
                }
                this.isLoading = false;
            });
        },


        allSelectCheckBox() {
            if (this.all_select == false) {
                this.all_select = true
                this.order_items.forEach(item => {
                    this.selectedItems.push(item.id)
                });
            } else {
                this.all_select = false
                this.selectedItems = []
            }
        },
        selectCheckBox() {
            let uniqueSelectedItems = [...new Set(this.selectedItems)];
            if (this.order_items.length === uniqueSelectedItems.length) {
                this.all_select = true
            } else {
                this.all_select = false
            }
        },
        updateItemsStatus() {
            let vm = this;
            let uniqueSelectedItems = [...new Set(this.selectedItems)];
            if (uniqueSelectedItems.length !== 0) {
                this.$swal.fire({
                    title: "Are you Sure?",
                    text: "You want be able to revert this",
                    confirmButtonText: "Yes, Sure",
                    cancelButtonText: "Cancel",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#37a279',
                    cancelButtonColor: '#d33',
                }).then(result => {
                    if (result.value) {
                        let ids = uniqueSelectedItems.toString();
                        this.isLoading = true
                        let postData = {
                            ids: ids,
                            status_id: this.status_id
                        }
                        axios.post(this.$apiUrl + '/orders/update_items_status', postData).then((response) => {
                            this.isLoading = false
                            let data = response.data;
                            if (data.status === 1) {

                                this.getOrder();
                                this.status_id = '';
                                this.selectedItems = [];
                                this.all_select = false;
                                this.showMessage("success", data.message);
                                setTimeout(
                                    function () {
                                        vm.$swal.close();
                                    }, 2000);
                            } else {
                                vm.showError(data.message);
                                vm.isLoading = false;
                            }
                        }).catch(error => {
                            vm.isLoading = false;
                            this.showError("Something went wrong!");
                        });
                    }
                });
            } else {
                this.showWarning("Select at least one record!");
            }
        },
        getAdditionalChargesTotal(charges) {
            if (!charges || !Array.isArray(charges)) return 0;
            return charges.reduce((total, charge) => total + (parseFloat(charge.amount) || 0), 0).toFixed(2);
        },
        canCancelItem(item) {
            // 6=delivered, 7=cancelled, 8=returned
            return item.active_status != 6 && item.active_status != 7 && item.active_status != 8
                && item.active_status != 11; // 11=selfPickupPicked
        },
        cancelOrderItem(item) {
            this.$swal.fire({
                title: this.__('are_you_sure'),
                input: 'textarea',
                inputLabel: this.__('cancellation_reason'),
                inputPlaceholder: this.__('enter_cancellation_reason'),
                showCancelButton: true,
                confirmButtonText: this.__('yes_sure'),
                cancelButtonText: this.__('no'),
                confirmButtonColor: '#37a279',
                cancelButtonColor: '#d33',
                icon: 'warning',
                inputValidator: (value) => {
                    if (!value || !value.trim()) {
                        return this.__('cancellation_reason') + ' ' + this.__('is_required');
                    }
                },
                showLoaderOnConfirm: true,
                allowOutsideClick: () => !this.$swal.isLoading(),
                preConfirm: (reason) => {
                    let postData = {
                        order_item_id: item.id,
                        cancellation_reason: reason,
                    };
                    return axios.post(this.$apiUrl + '/orders/cancel_order_item', postData)
                        .then((response) => {
                            return response.data;
                        }).catch(error => {
                            this.$swal.showValidationMessage('Something went wrong!');
                        });
                },
            }).then(result => {
                if (result.isConfirmed) {
                    let data = result.value;
                    if (data.status === 1) {
                        this.getOrder();
                        this.showMessage("success", data.message);
                    } else {
                        this.showError(data.message);
                    }
                }
            });
        },

    }
};
</script>
<style scoped>
.th-width {
    width: auto;
    background: #f7f7f7;
}

.modal-dialog {
    border-radius: 20px;
}

.cancel-item-btn {
    top: 5px;
    right: 5px;
    z-index: 2;
    width: 28px;
    height: 28px;
    padding: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.cancel-item-btn:hover {
    opacity: 1;
}
</style>
