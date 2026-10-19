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

            <div v-if="order && order.order_id" class="order-view">

                <!-- Header: what the order is, where it stands, and the downloads -->
                <div class="card mb-3">
                    <div class="card-body d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div>
                            <div class="d-flex align-items-center flex-wrap gap-2">
                                <h4 class="mb-0">{{ __('Order') }} #{{ order.order_id }}</h4>
                                <span class="badge status-pill" :class="statusBadgeClass(order.active_status)">
                                    {{ getDisplayName(order.status_name_translation) || order.status_name }}
                                </span>
                                <span v-if="order.invoice_number" class="badge bg-light text-dark border">
                                    {{ order.invoice_number }}
                                </span>
                            </div>
                            <div class="text-muted small mt-1">
                                {{ order.orders_created_at }}
                                <template v-if="order.delivery_date"> &middot; {{ __('delivery_date') }}: {{ order.delivery_date }}</template>
                                &middot;
                                <template v-if="order.placed_by === 'salesman'">{{ __('salesman') }}: {{ order.salesman_name }}</template>
                                <template v-else>{{ __('retailer') }}</template>
                            </div>
                        </div>

                        <div class="d-flex align-items-center flex-wrap gap-2">
                            <button v-if="order.active_status == $delivered || order.active_status == 6"
                                @click="downloadInvoice" v-b-tooltip.hover :title="__('download_invoice')"
                                class="btn btn-secondary btn-sm" :disabled="isLoading">
                                <template v-if="isLoading">
                                    <b-spinner small label="Spinning"></b-spinner> {{ __('downloading') }}...
                                </template>
                                <template v-else>
                                    <i class="fa fa-download"></i> {{ __('download_invoice') }}
                                </template>
                            </button>

                            <template v-if="credit_notes && credit_notes.length > 0">
                                <button v-if="credit_notes.length === 1"
                                    @click="downloadCreditNote(credit_notes[0].id)"
                                    class="btn btn-secondary btn-sm"
                                    :disabled="isDownloadingCreditNote"
                                    v-b-tooltip.hover :title="'Download Credit Note ' + credit_notes[0].credit_note_no">
                                    <template v-if="isDownloadingCreditNote">
                                        <b-spinner small label="Spinning"></b-spinner> {{ __('downloading') }}...
                                    </template>
                                    <template v-else>
                                        <i class="fa fa-download"></i> Download Credit Note
                                    </template>
                                </button>
                                <b-dropdown v-else text="Download Credit Note" variant="secondary" size="sm">
                                    <b-dropdown-item v-for="cn in credit_notes" :key="cn.id" @click="downloadCreditNote(cn.id)">
                                        <i class="fa fa-download me-1"></i> {{ cn.credit_note_no }} ({{ cn.reason_type === 'return' ? 'Return' : (cn.reason_type === 'partial' ? 'Partial' : 'Cancel') }}) - {{ $currency }}{{ cn.total_amount }}
                                    </b-dropdown-item>
                                </b-dropdown>
                                <button v-if="isSellerRoute" @click="openCreditNotePreview" class="btn btn-outline-primary btn-sm">
                                    <i class="fa fa-eye"></i> {{ __('View credit note') }}
                                </button>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- Customer / Delivery / Payment -->
                <div class="row g-3 mb-3">
                    <div class="col-lg-4">
                        <div class="card h-100">
                            <div class="card-header"><h5 class="mb-0">{{ __('Customer') }}</h5></div>
                            <div class="card-body">
                                <div class="fw-bold fs-5">{{ order.shop_name || order.party_name || order.user_name }}</div>
                                <div class="text-muted" v-if="order.shop_name && order.user_name">{{ order.user_name }}</div>
                                <dl class="info-list mt-3 mb-0">
                                    <template v-if="order.user_mobile">
                                        <dt>{{ __('mobile') }}</dt>
                                        <dd>{{ order.user_mobile | mobileMask }}</dd>
                                    </template>
                                    <template v-if="order.user_email">
                                        <dt>{{ __('email') }}</dt>
                                        <dd>{{ order.user_email }}</dd>
                                    </template>
                                    <template v-if="order.order_address">
                                        <dt>{{ __('address') }}</dt>
                                        <dd>{{ order.order_address }}</dd>
                                    </template>
                                    <template v-if="order.area_name || order.retailer_area_name">
                                        <dt>{{ __('area') }}</dt>
                                        <dd>{{ order.area_name || order.retailer_area_name }}</dd>
                                    </template>
                                    <template v-if="order.pincode">
                                        <dt>{{ __('pincode') }}</dt>
                                        <dd>{{ order.pincode }}</dd>
                                    </template>
                                    <template v-if="order.order_note">
                                        <dt>{{ __('order_note') }}</dt>
                                        <dd>{{ order.order_note }}</dd>
                                    </template>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="card h-100">
                            <div class="card-header"><h5 class="mb-0">{{ __('Delivery') }}</h5></div>
                            <div class="card-body">
                                <dl class="info-list mb-0">
                                    <dt>{{ __('delivery_boy') }}</dt>
                                    <dd>
                                        <template
                                            v-if="order.delivery_boy_name || getDisplayName(order.delivery_boy_name_translation)">
                                            {{ getDisplayName(order.delivery_boy_name_translation) || order.delivery_boy_name }}
                                        </template>
                                        <template v-else>
                                            <span class="text-muted">{{ __('not_assign') }}</span>
                                        </template>
                                    </dd>
                                    <template v-if="order.loading_slip_no">
                                        <dt>{{ __('Loading slip') }}</dt>
                                        <dd>{{ order.loading_slip_no }}</dd>
                                    </template>
                                    <template v-if="order.delivery_date">
                                        <dt>{{ __('delivery_date') }}</dt>
                                        <dd>{{ order.delivery_date }}</dd>
                                    </template>
                                    <template v-if="order.delivery_time">
                                        <dt>{{ __('delivery_time') }}</dt>
                                        <dd>{{ order.delivery_time }}</dd>
                                    </template>
                                    <dt>{{ __('ordered_by') }}</dt>
                                    <dd>
                                        <template v-if="order.placed_by === 'salesman'">
                                            <span class="badge bg-info me-1">{{ __('salesman') }}</span>{{ order.salesman_name }}
                                        </template>
                                        <template v-else>
                                            <span class="badge bg-secondary me-1">{{ __('retailer') }}</span>{{ order.shop_name || order.user_name }}
                                        </template>
                                    </dd>
                                </dl>

                                <!-- "Assign delivery boy" and "Update status" were switched off in the old layout (commented
                                     out as table rows). Kept verbatim below so they can be brought back; they need to be
                                     re-laid-out as form rows if restored. The methods (assignDeliveryBoy, updateStatus) still exist.
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

                                -->
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="card h-100">
                            <div class="card-header"><h5 class="mb-0">{{ __('Payment') }}</h5></div>
                            <div class="card-body">
                                <div class="money-row">
                                    <span>{{ __('Items total') }}</span>
                                    <span>{{ $currency }}{{ money(order.total) }}</span>
                                </div>
                                <div class="money-row" v-if="num(order.discount) > 0">
                                    <span>{{ __('discount') }}</span>
                                    <span>- {{ $currency }}{{ money(order.discount) }}</span>
                                </div>
                                <!-- Schemes stack: one row per applied scheme. Orders placed before that
                                     have no per-scheme rows and keep the single row below. -->
                                <template v-if="order.applied_schemes && order.applied_schemes.length">
                                    <template v-for="s in order.applied_schemes">
                                        <div class="money-row" :key="'scheme-' + s.scheme_id" v-if="num(s.discount) > 0">
                                            <span>{{ __('scheme') }}
                                                <span class="badge bg-info ms-1">{{ s.name }}</span>
                                            </span>
                                            <span>- {{ $currency }}{{ money(s.discount) }}</span>
                                        </div>
                                    </template>
                                </template>
                                <div class="money-row" v-else-if="order.scheme_id && num(order.scheme_discount) > 0">
                                    <span>{{ __('scheme') }}
                                        <span class="badge bg-info ms-1">{{ order.scheme_name || ('#' + order.scheme_id) }}</span>
                                    </span>
                                    <span>- {{ $currency }}{{ money(order.scheme_discount) }}</span>
                                </div>
                                <div class="money-row" v-if="num(order.promo_discount) > 0">
                                    <span>{{ __('promo_discount') }}
                                        <span class="badge bg-light text-dark border ms-1" v-if="order.promo_code">{{ order.promo_code }}</span>
                                    </span>
                                    <span>- {{ $currency }}{{ money(order.promo_discount) }}</span>
                                </div>
                                <div class="money-row" v-if="num(order.wallet_balance) > 0">
                                    <span>{{ __('wallet_used') }}</span>
                                    <span>- {{ $currency }}{{ money(order.wallet_balance) }}</span>
                                </div>
                                <div class="money-row" v-if="num(order.cash_discount_amount) > 0">
                                    <span>{{ __('Cash / Bank discount') }}</span>
                                    <span>- {{ $currency }}{{ money(order.cash_discount_amount) }}</span>
                                </div>
                                <!-- Delivery charge stays hidden (client does not want it) -->
                                <div class="money-row" v-if="num(getAdditionalChargesTotal(order.additional_charges)) > 0">
                                    <span>{{ __('additional_charges') }}</span>
                                    <span>+ {{ $currency }}{{ money(getAdditionalChargesTotal(order.additional_charges)) }}</span>
                                </div>
                                <div class="money-row total">
                                    <span>{{ __('payable_total') }}</span>
                                    <span>{{ $currency }}{{ money(payableTotal) }}</span>
                                </div>
                                <div class="text-muted small mt-2">
                                    {{ __('payment_method') }}: <span class="fw-semibold text-body">{{ order.payment_method }}</span>
                                </div>
                                <div class="mt-2" v-if="credit_notes && credit_notes.length > 0">
                                    <span v-for="cn in credit_notes" :key="cn.id" class="badge bg-secondary me-1 mb-1">
                                        {{ cn.credit_note_no }} ({{ creditNoteTypeLabel(cn.reason_type) }} &mdash; {{ $currency }}{{ money(cn.total_amount) }})
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Items -->
                <div class="card">
                    <div class="card-header d-flex align-items-center justify-content-between">
                        <h5 class="mb-0">{{ __('list_of_order_items') }}</h5>
                        <span class="text-muted small">{{ order_items.length }} {{ order_items.length === 1 ? __('Item') : __('Items') }}</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0 order-items-table">
                                <thead>
                                    <tr>
                                        <th style="width:44px">#</th>
                                        <th>{{ __('Product') }}</th>
                                        <th class="text-end">{{ __('quantity') }}</th>
                                        <th class="text-end">{{ __('Rate') }} ({{ $currency }})</th>
                                        <th class="text-end">{{ __('Tax') }}</th>
                                        <th class="text-end">{{ __('Amount') }} ({{ $currency }})</th>
                                        <th>{{ __('status') }}</th>
                                        <th class="text-end">{{ __('actions') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in order_items" :key="item.id"
                                        :class="{ 'item-inactive': item.active_status == 7 || item.active_status == 8 }">
                                        <td class="text-muted">{{ index + 1 }}</td>
                                        <td>
                                            <div class="fw-semibold">
                                                {{ item.product_name }}
                                                <span v-if="item.is_free_item == 1" class="badge bg-success ms-1">{{ __('free') }}</span>
                                            </div>
                                            <div class="text-muted small" v-if="item.variant_name">{{ item.variant_name }}</div>
                                            <div v-if="item.active_status == 7 && item.cancellation_reason" class="small text-danger">
                                                {{ __('reason') }}: {{ item.cancellation_reason }}
                                            </div>
                                            <div v-if="hasShortfall(item)" class="small text-danger">
                                                {{ __('delivered_quantity') }}: {{ item.delivered_quantity }} / {{ item.quantity }}
                                                <template v-if="item.shortfall_reason"> &middot; {{ __(item.shortfall_reason) }}</template>
                                                <a v-if="item.damage_photo" :href="damagePhotoUrl(item.damage_photo)" target="_blank" class="ms-1">
                                                    {{ __('view_damage_photo') }}
                                                </a>
                                            </div>
                                        </td>
                                        <td class="text-end">{{ item.quantity }}</td>
                                        <td class="text-end">{{ money(item.price) }}</td>
                                        <td class="text-end">
                                            <span v-if="num(item.tax_percentage) > 0">{{ item.tax_percentage }}%</span>
                                            <span v-else class="text-muted">&mdash;</span>
                                        </td>
                                        <td class="text-end fw-semibold">{{ money(item.sub_total) }}</td>
                                        <td>
                                            <span class="badge" :class="statusBadgeClass(item.active_status)">
                                                {{ getDisplayName(item.status_name_translation) || item.status_name }}
                                            </span>
                                        </td>
                                        <td class="text-end text-nowrap">
                                            <b-button size="sm" variant="outline-primary" v-b-tooltip.hover
                                                :title="__('view_item_details')" @click="sendInfo(item)">
                                                <i class="fa fa-eye"></i>
                                            </b-button>
                                            <router-link :to="productRoute(item)" v-b-tooltip.hover :title="__('view_product')"
                                                class="btn btn-sm btn-outline-secondary">
                                                <i class="fa fa-box"></i>
                                            </router-link>
                                            <button v-if="canCancelItem(item) && !isDeliveryBoyRoute" v-b-tooltip.hover
                                                :title="__('cancel_item')" class="btn btn-sm btn-outline-danger"
                                                @click="cancelOrderItem(item)" :disabled="isLoadingCancel">
                                                <i class="fa fa-times"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="5" class="text-end text-muted">{{ __('Active items total') }}</td>
                                        <td class="text-end fw-bold">{{ money(itemsSubtotal) }}</td>
                                        <td colspan="2"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <b-modal v-model="creditNotePreviewShow" size="xl" scrollable hide-footer
                title="Credit Note - Excel Preview">
                <div v-if="creditNotePreviewLoading" class="text-center py-5">
                    <b-spinner label="Loading"></b-spinner>
                </div>
                <template v-else-if="creditNotePreview.rows.length > 0">
                    <p class="text-muted small mb-2">
                        Exactly what the Credit Note Excel export (Export Center) contains for this order:
                        {{ creditNotePreview.headers.length }} columns,
                        {{ creditNotePreview.rows.length }} row{{ creditNotePreview.rows.length > 1 ? 's' : '' }}.
                    </p>
                    <div class="table-responsive credit-note-preview">
                        <table class="table table-bordered table-sm mb-0">
                            <thead>
                                <tr>
                                    <th v-for="(header, hi) in creditNotePreview.headers" :key="hi">{{ header }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, ri) in creditNotePreview.rows" :key="ri">
                                    <td v-for="(cell, ci) in row" :key="ci">{{ cell }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
                <p v-else class="text-muted text-center py-4 mb-0">No data found for this credit note.</p>
            </b-modal>

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
            credit_notes: [],
            isDownloadingCreditNote: false,
            creditNotePreviewShow: false,
            creditNotePreviewLoading: false,
            creditNotePreview: { headers: [], rows: [] },
        }

    },
    computed: {
        // What is still payable. remaining_final is empty on some older orders; show the final total then
        // rather than a false 0.00.
        payableTotal() {
            const o = this.order || {};
            return (o.remaining_final !== null && o.remaining_final !== undefined && o.remaining_final !== '')
                ? o.remaining_final : o.final_total;
        },
        // Sum of the lines still active (cancelled / returned ones don't count), for the table footer.
        itemsSubtotal() {
            return (this.order_items || [])
                .filter(i => i.active_status != 7 && i.active_status != 8)
                .reduce((sum, i) => sum + (parseFloat(i.sub_total) || 0), 0);
        },
        isSellerRoute() {
            // Use this.$route to access the current route
            return this.$route.path.startsWith('/seller/');
        },
        isDeliveryBoyRoute() {
            // Use this.$route to access the current route
            return this.$route.path.startsWith('/delivery_boy/');
        },
        viewProductRoute() {
            // Define route configurations based on user roles
            if (this.item.master_product_id) {
                if (this.login_user.role.name === 'Seller') {
                    return {
                        name: 'SellerMyProducts',
                        query: { master_product_id: this.item.master_product_id },
                    };
                }
                return {
                    name: 'EditMasterProduct',
                    params: { id: this.item.master_product_id },
                };
            }

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

    },
    methods: {

        num(v) {
            return parseFloat(v) || 0;
        },
        // 5335 -> "5,335.00"
        money(v) {
            return this.num(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },
        // Colour for a status badge, by order_status_lists id (see OrderStatusList).
        statusBadgeClass(statusId) {
            const id = parseInt(statusId, 10);
            if ([6, 11].includes(id)) return 'bg-success';                 // delivered, picked up
            if ([7, 8].includes(id)) return 'bg-danger';                   // cancelled, returned
            if (id === 5) return 'bg-info';                                // out for delivery
            if ([12, 13].includes(id)) return 'bg-warning text-dark';      // rescheduled, partial delivery
            if ([2, 3, 4, 10].includes(id)) return 'bg-primary';           // received .. ready for pickup
            return 'bg-secondary';
        },
        // The order endpoint already returns the photo as a full URL; only prefix the storage URL when
        // it is a bare path (prefixing a full URL made "storage/https://.../storage/...").
        damagePhotoUrl(photo) {
            if (!photo) return '';
            return /^https?:\/\//i.test(photo) ? photo : this.$storageUrl + photo;
        },
        hasShortfall(item) {
            return !!item.shortfall_reason
                || (item.delivered_quantity !== null && item.delivered_quantity !== undefined && item.delivered_quantity < item.quantity);
        },
        // Where "view product" goes, per who is looking and what kind of product the line is.
        productRoute(item) {
            if (this.isSellerRoute && item.master_product_id) {
                return { name: 'SellerMyProducts', query: { master_product_id: item.master_product_id } };
            }
            if (this.isSellerRoute) {
                return { name: 'SellerViewProduct', params: { id: item.product_id } };
            }
            if (this.isDeliveryBoyRoute) {
                return { name: 'DeliveryBoyViewProduct', params: { id: item.product_id } };
            }
            if (item.master_product_id) {
                return { name: 'EditMasterProduct', params: { id: item.master_product_id } };
            }
            return { name: 'ViewProduct', params: { id: item.product_id } };
        },
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
                const statusesToRemoveIds = [1, 4, 7, 8];
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
        creditNoteTypeLabel(reasonType) {
            if (reasonType === 'return') return 'Sales Return';
            if (reasonType === 'partial') return 'Partial Delivery';
            return 'Order Cancelled';
        },
        // Same header + rows the Credit Note Excel export produces for this order.
        openCreditNotePreview() {
            this.creditNotePreviewShow = true;
            this.creditNotePreviewLoading = true;
            this.creditNotePreview = { headers: [], rows: [] };
            axios.get(this.$sellerApiUrl + '/credit-notes/preview', { params: { order_id: this.id } })
                .then((response) => {
                    let res = response.data;
                    if (res.status == 1 && res.data) {
                        this.creditNotePreview = { headers: res.data.headers || [], rows: res.data.rows || [] };
                    } else {
                        this.showError(res.message || "Failed to load credit note preview!");
                    }
                })
                .catch((error) => {
                    this.showError((error.response && error.response.data && error.response.data.message)
                        || error.message || "Failed to load credit note preview!");
                })
                .finally(() => {
                    this.creditNotePreviewLoading = false;
                });
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
                        this.credit_notes = response.data.data.credit_notes || [];

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

        downloadCreditNote(creditNoteId) {
            this.isDownloadingCreditNote = true;
            let postData = {
                order_id: this.id,
                credit_note_id: creditNoteId
            };
            axios({
                url: this.$apiUrl + '/orders/credit_note_download',
                method: 'post',
                responseType: 'blob',
                data: postData
            }).then((response) => {
                if (response.data && response.data.type === 'application/json') {
                    let reader = new FileReader();
                    reader.onload = () => {
                        try {
                            let res = JSON.parse(reader.result);
                            this.showError(res.message || "Failed to download credit note!");
                        } catch (e) {
                            this.showError("Failed to download credit note!");
                        }
                        this.isDownloadingCreditNote = false;
                    };
                    reader.readAsText(response.data);
                    return;
                }

                let blob = new Blob([response.data], { type: 'application/pdf' });
                var fileURL = window.URL.createObjectURL(blob);
                var fileLink = document.createElement('a');
                fileLink.href = fileURL;

                let filename = 'CreditNote-Order-#' + this.id + '.pdf';
                if (creditNoteId && this.credit_notes) {
                    let found = this.credit_notes.find(c => c.id === creditNoteId);
                    if (found && found.credit_note_no) {
                        filename = 'CreditNote-' + found.credit_note_no.replace(/[/\\?%*:|"<>]/g, '_') + '.pdf';
                    }
                }
                fileLink.setAttribute('download', filename);
                document.body.appendChild(fileLink);
                fileLink.click();
                setTimeout(() => {
                    if (fileLink.parentNode) {
                        fileLink.parentNode.removeChild(fileLink);
                    }
                    window.URL.revokeObjectURL(fileURL);
                }, 200);
                this.isDownloadingCreditNote = false;
            }).catch(error => {
                if (error.request && error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError("Failed to download credit note!");
                }
                this.isDownloadingCreditNote = false;
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
.status-pill {
    font-size: 0.85rem;
}

/* label / value pairs: label column fixed, value wraps */
.info-list {
    display: grid;
    grid-template-columns: 105px 1fr;
    gap: 0.55rem 0.75rem;
}

.info-list dt {
    color: #6c757d;
    font-weight: 500;
}

.info-list dd {
    margin: 0;
    word-break: break-word;
}

.money-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    padding: 0.4rem 0;
    border-bottom: 1px dashed rgba(128, 128, 128, 0.3);
}

.money-row.total {
    border-bottom: 0;
    border-top: 2px solid rgba(128, 128, 128, 0.35);
    margin-top: 0.4rem;
    padding-top: 0.7rem;
    font-size: 1.2rem;
    font-weight: 700;
}

.order-items-table thead th {
    background: rgba(128, 128, 128, 0.08);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: #6c757d;
    white-space: nowrap;
}

/* keep the first and last columns off the card edge */
.order-items-table th:first-child,
.order-items-table td:first-child {
    padding-left: 1.25rem;
}

.order-items-table th:last-child,
.order-items-table td:last-child {
    padding-right: 1.25rem;
}

.order-items-table tfoot td {
    border-top: 2px solid rgba(128, 128, 128, 0.35);
}

.item-inactive td {
    opacity: 0.55;
}

.modal-dialog {
    border-radius: 20px;
}

.credit-note-preview th {
    white-space: pre-line;
    min-width: 150px;
    background: #f7f7f7;
    vertical-align: bottom;
    position: sticky;
    top: 0;
}

.credit-note-preview td {
    white-space: nowrap;
}
</style>
