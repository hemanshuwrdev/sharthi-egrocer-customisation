<template>
    <div class="scheme-form-page">
        <div class="page-heading mb-3">
            <div class="row align-items-center">
                <div class="col-12 col-md-6 order-md-1 order-last">
                    <h3 class="mb-1">{{ id ? __('edit_scheme') : __('add_scheme') }}</h3>
                    <p class="text-muted small mb-0">{{ __('create_scheme_subtitle', 'Create a new scheme for selected products with qty based discounts or free products.') }}</p>
                </div>
                <div class="col-12 col-md-6 order-md-2 order-first">
                    <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                        <ol class="breadcrumb mb-0">
                            <li class="breadcrumb-item"><router-link to="/seller/dashboard">{{ __('dashboard') }}</router-link></li>
                            <li class="breadcrumb-item"><router-link to="/seller/schemes">{{ __('schemes') }}</router-link></li>
                            <li class="breadcrumb-item active" aria-current="page">{{ id ? __('edit_scheme') : __('add_scheme') }}</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>

        <form ref="my-form" @submit.prevent="saveRecord">
            <!-- 1. Scheme Details -->
            <div class="card scheme-card shadow-sm mb-4">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <span class="step-num-badge me-2">1</span>
                        <h5 class="mb-0 font-weight-bold">{{ __('scheme_details') }}</h5>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6 mb-3">
                            <label class="form-label font-weight-bold">{{ __('scheme_name') }} <span class="text-danger">*</span></label>
                            <input type="text" v-model="record.name" class="form-control" :placeholder="__('enter_scheme_name_placeholder', 'Enter scheme name (e.g. Festival Offer)')" required>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label font-weight-bold">{{ __('scheme_type') }} <span class="text-danger">*</span></label>
                            <select class="form-control form-select" v-model="record.type" required>
                                <option value="group_discount">{{ __('group_discount', 'Group Discount') }}</option>
                                <option value="buy_x_get_y">{{ __('buy_x_get_y', 'Buy X Get Y (Direct)') }}</option>
                            </select>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label font-weight-bold">{{ __('discount_option', 'Discount Option') }}</label>
                            <select class="form-control form-select" v-model="record.tax_option">
                                <option value="inclusive">{{ __('discount_inclusive', 'Discount Inclusive') }}</option>
                                <option value="exclusive">{{ __('discount_exclusive', 'Discount Exclusive') }}</option>
                            </select>
                        </div>
                        <div class="col-12">
                            <label class="form-label font-weight-bold">{{ __('description', 'Description') }}</label>
                            <input type="text" v-model="record.description" class="form-control" :placeholder="__('enter_scheme_description_placeholder', 'Enter scheme description (optional)')">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Legacy Buy X Get Y simple configuration if type === 'buy_x_get_y' -->
            <div v-if="record.type === 'buy_x_get_y'" class="card scheme-card shadow-sm mb-4">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <span class="step-num-badge me-2">2</span>
                        <div>
                            <h5 class="mb-0 font-weight-bold">{{ t('buy_x_get_y_conditions', 'Buy X Get Y Conditions') }}</h5>
                            <p class="text-muted small mb-0">{{ t('buy_x_get_y_subtitle', 'Choose the trigger product and free product.') }}</p>
                        </div>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6 mb-3">
                            <label class="form-label font-weight-bold">{{ t('buy_product', 'Buy Product') }} <span class="text-danger">*</span></label>
                            <multiselect v-model="record.buy_product" :options="availableProducts" placeholder="Select Product" label="full_name" track-by="id"></multiselect>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label font-weight-bold">{{ t('buy_quantity', 'Buy Quantity') }} <span class="text-danger">*</span></label>
                            <div class="d-flex align-items-center gap-3 mb-2">
                                <div class="form-check form-check-inline m-0">
                                    <input class="form-check-input cursor-pointer" type="radio" name="buy_qty_basis" id="buy_basis_outer" value="outer" v-model="record.buy_qty_basis">
                                    <label class="form-check-label ms-1 cursor-pointer fw-semibold small" for="buy_basis_outer">{{ t('outer_qty', 'Outer Qty') }}</label>
                                </div>
                                <div class="form-check form-check-inline m-0">
                                    <input class="form-check-input cursor-pointer" type="radio" name="buy_qty_basis" id="buy_basis_inner" value="inner" v-model="record.buy_qty_basis">
                                    <label class="form-check-label ms-1 cursor-pointer fw-semibold small" for="buy_basis_inner">{{ t('inner_qty', 'Inner Qty') }}</label>
                                </div>
                            </div>
                            <div class="input-group">
                                <input type="number" min="1" step="any" v-model="record.buy_qty" class="form-control" placeholder="Qty" required>
                                <span class="input-group-text bg-white text-muted px-2 small">{{ record.buy_qty_basis === 'outer' ? (record.buy_product && record.buy_product.secondary_unit ? record.buy_product.secondary_unit : 'Outer') : (record.buy_product && record.buy_product.uom ? record.buy_product.uom : 'Units') }}</span>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label font-weight-bold">{{ t('free_product', 'Free Product') }} <span class="text-danger">*</span></label>
                            <multiselect v-model="record.free_product" :options="availableProducts" placeholder="Select Product" label="full_name" track-by="id"></multiselect>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label font-weight-bold">{{ t('free_quantity', 'Free Quantity') }} <span class="text-danger">*</span></label>
                            <div class="d-flex align-items-center gap-3 mb-2">
                                <div class="form-check form-check-inline m-0">
                                    <input class="form-check-input cursor-pointer" type="radio" name="free_qty_basis" id="free_basis_outer" value="outer" v-model="record.free_qty_basis">
                                    <label class="form-check-label ms-1 cursor-pointer fw-semibold small" for="free_basis_outer">{{ t('outer_qty', 'Outer Qty') }}</label>
                                </div>
                                <div class="form-check form-check-inline m-0">
                                    <input class="form-check-input cursor-pointer" type="radio" name="free_qty_basis" id="free_basis_inner" value="inner" v-model="record.free_qty_basis">
                                    <label class="form-check-label ms-1 cursor-pointer fw-semibold small" for="free_basis_inner">{{ t('inner_qty', 'Inner Qty') }}</label>
                                </div>
                            </div>
                            <div class="input-group">
                                <input type="number" min="1" step="any" v-model="record.free_qty" class="form-control" placeholder="Qty" required>
                                <span class="input-group-text bg-white text-muted px-2 small">{{ record.free_qty_basis === 'outer' ? (record.free_product && record.free_product.secondary_unit ? record.free_product.secondary_unit : 'Outer') : (record.free_product && record.free_product.uom ? record.free_product.uom : 'Units') }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 2. Select Products & Qty Conditions -->
            <div v-else class="card scheme-card shadow-sm mb-4">
                <div class="card-body p-4">
                    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                        <div class="d-flex align-items-center">
                            <span class="step-num-badge me-2">2</span>
                            <div>
                                <h5 class="mb-0 font-weight-bold">{{ t('select_products_qty_conditions', 'Select Products & Qty Conditions') }}</h5>
                                <p class="text-muted small mb-0">{{ t('select_products_subtitle', 'Add products and define scheme quantity (inner or outer) with minimum and maximum quantity.') }}</p>
                            </div>
                        </div>
                        <button type="button" class="btn btn-outline-primary btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2" @click="openProductModal">
                            <i class="fa fa-plus"></i>
                            <span>{{ t('add_products', 'Add Products') }}</span>
                        </button>
                    </div>

                    <!-- Global Scheme Conditions for Multiple Products (2+ items) -->
                    <div v-if="record.products.length > 1" class="global-scheme-card p-3 mb-3 rounded-3 border bg-light">
                        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2 pb-2 border-bottom">
                            <div class="d-flex align-items-center gap-2">
                                <span class="badge bg-primary text-white px-2 py-1"><i class="fa fa-layer-group me-1"></i> {{ t('multi_product_combined_scheme', 'Multi-Product Combined Scheme') }}</span>
                                <span class="text-muted small">({{ record.products.length }} {{ t('products_selected', 'products selected') }})</span>
                            </div>
                            <span class="badge bg-info text-dark border small">
                                {{ t('any_mix_hint_badge', 'Any combination of selected products qualifies') }}
                            </span>
                        </div>
                        <div class="alert alert-light border small py-2 px-3 mb-3 d-flex align-items-center gap-2">
                            <i class="fa fa-info-circle text-primary"></i>
                            <span><strong>{{ t('combined_qty_rule', 'Combined Qty Rule') }}:</strong> {{ t('combined_qty_rule_desc', 'Customer can purchase any combination of the products below (e.g. 4 of Product 1 and 1 of Product 2) totaling at least') }} <strong>{{ global_min_qty || 'X' }} {{ global_qty_basis === 'outer' ? t('outer', 'Outer') : t('inner', 'Inner') }}</strong> {{ t('to_qualify_for_discount', 'to qualify for the discount.') }}</span>
                        </div>
                        <div class="row g-3 align-items-end">
                            <div class="col-lg-3 col-md-4 col-sm-6">
                                <label class="form-label font-weight-bold small mb-1">{{ t('scheme_qty_basis', 'Scheme Qty Basis') }}</label>
                                <div class="d-flex align-items-center gap-3 pt-1">
                                    <div class="form-check form-check-inline m-0">
                                        <input class="form-check-input cursor-pointer" type="radio" name="global_qty_basis_head" id="global_basis_outer_head" value="outer" :checked="global_qty_basis === 'outer'" @change="syncAllQtyBasis('outer')">
                                        <label class="form-check-label ms-1 cursor-pointer fw-semibold small" for="global_basis_outer_head">{{ t('outer_qty', 'Outer Qty') }}</label>
                                    </div>
                                    <div class="form-check form-check-inline m-0">
                                        <input class="form-check-input cursor-pointer" type="radio" name="global_qty_basis_head" id="global_basis_inner_head" value="inner" :checked="global_qty_basis === 'inner'" @change="syncAllQtyBasis('inner')">
                                        <label class="form-check-label ms-1 cursor-pointer fw-semibold small" for="global_basis_inner_head">{{ t('inner_qty', 'Inner Qty') }}</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-2 col-md-4 col-sm-6">
                                <label class="form-label font-weight-bold small mb-1">{{ t('min_quantity', 'Min Quantity') }} <span class="text-danger">*</span></label>
                                <div class="input-group input-group-sm">
                                    <input type="number" min="0.01" step="any" v-model="global_min_qty" class="form-control text-center fw-bold" placeholder="Min" required>
                                    <span class="input-group-text bg-white text-muted px-2 small">{{ global_qty_basis === 'outer' ? t('outer', 'Outer') : t('inner', 'Inner') }}</span>
                                </div>
                            </div>
                            <div class="col-lg-2 col-md-4 col-sm-6">
                                <label class="form-label font-weight-bold small mb-1">{{ t('max_quantity', 'Max Quantity') }}</label>
                                <div class="input-group input-group-sm">
                                    <input type="number" min="0.01" step="any" v-model="global_max_qty" class="form-control text-center" placeholder="Max">
                                    <span class="input-group-text bg-white text-muted px-2 small">{{ global_qty_basis === 'outer' ? t('outer', 'Outer') : t('inner', 'Inner') }}</span>
                                </div>
                            </div>
                            <div class="col-lg-5 col-md-12">
                                <label class="form-label font-weight-bold small mb-1">{{ t('discount_or_free', 'Discount / Free') }} <span class="text-danger">*</span></label>
                                <div class="d-flex align-items-center gap-2 flex-nowrap">
                                    <select class="form-control form-select form-select-sm" v-model="global_discount_type" @change="onGlobalDiscountTypeChange" style="width: 160px; flex-shrink: 0;" required>
                                        <option value="percentage">{{ t('discount_percentage', 'Discount %') }}</option>
                                        <option value="flat">{{ t('flat_amount', 'Flat (₹)') }}</option>
                                        <option value="free_product">{{ t('free_product', 'Free Product') }}</option>
                                        <option value="discounted_product">{{ t('discounted_product', 'Discounted Product') }}</option>
                                    </select>

                                    <!-- Percentage -->
                                    <template v-if="global_discount_type === 'percentage'">
                                        <div class="input-group input-group-sm flex-nowrap" style="width: 120px; flex-shrink: 0;">
                                            <input type="number" step="0.01" min="0.01" max="100" v-model="global_discount_value" class="form-control text-center fw-bold" placeholder="10" required>
                                            <span class="input-group-text bg-white text-muted px-2">%</span>
                                        </div>
                                    </template>

                                    <!-- Flat -->
                                    <template v-else-if="global_discount_type === 'flat'">
                                        <div class="input-group input-group-sm flex-nowrap" style="width: 130px; flex-shrink: 0;">
                                            <input type="number" step="0.01" min="0.01" v-model="global_discount_value" class="form-control text-center fw-bold" placeholder="100" required>
                                            <span class="input-group-text bg-white text-muted px-2">₹</span>
                                        </div>
                                    </template>

                                    <!-- Free Product -->
                                    <template v-else-if="global_discount_type === 'free_product'">
                                        <div class="d-flex align-items-center gap-1 flex-nowrap flex-shrink-0">
                                            <input type="number" step="1" min="1" v-model="global_free_qty" class="form-control form-control-sm text-center fw-bold" style="width: 55px; flex-shrink: 0;" placeholder="1" required>
                                            <select class="form-control form-select form-select-sm" v-model="global_free_qty_basis" style="width: 85px; flex-shrink: 0;">
                                                <option value="inner">{{ t('inner', 'Inner') }}</option>
                                                <option value="outer">{{ t('outer', 'Outer') }}</option>
                                            </select>
                                            <span class="badge bg-success text-white ms-1">{{ t('free', 'FREE') }}</span>
                                        </div>
                                    </template>

                                    <!-- Discounted Product -->
                                    <template v-else-if="global_discount_type === 'discounted_product'">
                                        <div class="d-flex align-items-center gap-1 flex-nowrap flex-shrink-0">
                                            <input type="number" step="1" min="1" v-model="global_free_qty" class="form-control form-control-sm text-center fw-bold" style="width: 50px; flex-shrink: 0;" placeholder="1" required title="Number of discounted units">
                                            <select class="form-control form-select form-select-sm" v-model="global_free_qty_basis" style="width: 85px; flex-shrink: 0;">
                                                <option value="outer">{{ t('outer', 'Outer') }}</option>
                                                <option value="inner">{{ t('inner', 'Inner') }}</option>
                                            </select>
                                            <span class="text-muted fw-bold small px-1 flex-shrink-0">@</span>
                                            <div class="input-group input-group-sm flex-nowrap flex-shrink-0" style="width: 85px;">
                                                <input type="number" step="0.01" min="0.01" max="100" v-model="global_discount_value" class="form-control text-center px-1 fw-bold" placeholder="50" required title="Discount percentage">
                                                <span class="input-group-text bg-white text-muted px-2">%</span>
                                            </div>
                                            <span class="text-muted small fw-semibold flex-shrink-0 ms-1">{{ t('off', 'off') }}</span>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Products Table -->
                    <div class="table-responsive">
                        <!-- Single product or empty: full columns (current design) -->
                        <table v-if="record.products.length <= 1" class="table table-bordered align-middle scheme-products-table mb-0" style="min-width: 1200px;">
                            <thead class="bg-light text-muted">
                                <tr>
                                    <th style="width: 40px;" class="text-center">#</th>
                                    <th style="min-width: 230px;">{{ t('product', 'Product') }}</th>
                                    <th style="width: 80px;" class="text-center">{{ t('uom', 'UOM') }}</th>
                                    <th style="width: 190px;" class="text-center">{{ t('scheme_qty_basis', 'Scheme Qty Basis') }}</th>
                                    <th style="width: 135px;" class="text-center">{{ t('min_quantity', 'Min Quantity') }}</th>
                                    <th style="width: 135px;" class="text-center">{{ t('max_quantity', 'Max Quantity') }}</th>
                                    <th style="width: 440px;" class="text-center">{{ t('discount_or_free', 'Discount / Free') }}</th>
                                    <th style="width: 60px;" class="text-center">{{ t('actions', 'Actions') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in record.products" :key="item.id || item.seller_product_id || index">
                                    <td class="text-center font-weight-bold text-muted">{{ index + 1 }}</td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <img :src="item.image || '/images/default_product.png'" class="product-thumb rounded border me-2" alt="product" @error="onImgError">
                                            <div>
                                                <div class="fw-bold product-name-text">{{ item.name }}</div>
                                                <small class="text-muted d-block">SKU: {{ item.sku || 'N/A' }}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <span class="badge bg-light text-dark border px-2 py-1">{{ item.uom || 'Unit' }}</span>
                                    </td>
                                    <td class="text-center">
                                        <div class="d-inline-flex align-items-center gap-3">
                                            <div class="form-check form-check-inline m-0">
                                                <input class="form-check-input cursor-pointer" type="radio" :name="'qty_basis_' + index" :id="'basis_outer_' + index" value="outer" v-model="item.qty_basis">
                                                <label class="form-check-label ms-1 cursor-pointer" :for="'basis_outer_' + index">{{ __('outer_qty', 'Outer Qty') }}</label>
                                            </div>
                                            <div class="form-check form-check-inline m-0 ms-2">
                                                <input class="form-check-input cursor-pointer" type="radio" :name="'qty_basis_' + index" :id="'basis_inner_' + index" value="inner" v-model="item.qty_basis">
                                                <label class="form-check-label ms-1 cursor-pointer" :for="'basis_inner_' + index">{{ __('inner_qty', 'Inner Qty') }}</label>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="input-group input-group-sm">
                                            <input type="number" min="0.01" step="any" v-model="item.min_qty" class="form-control text-center" placeholder="Min" required>
                                            <span class="input-group-text bg-light text-muted px-2 small">{{ item.qty_basis === 'outer' ? (item.secondary_unit || 'Outer') : (item.uom || 'Units') }}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="input-group input-group-sm">
                                            <input type="number" min="0.01" step="any" v-model="item.max_qty" class="form-control text-center" placeholder="Max">
                                            <span class="input-group-text bg-light text-muted px-2 small">{{ item.qty_basis === 'outer' ? (item.secondary_unit || 'Outer') : (item.uom || 'Units') }}</span>
                                        </div>
                                    </td>
                                    <td style="width: 440px;">
                                        <div class="d-flex align-items-center gap-2 flex-nowrap">
                                            <select class="form-control form-select form-select-sm" v-model="item.discount_type" @change="onDiscountTypeChange(item)" style="width: 155px; flex-shrink: 0;" required>
                                                <option value="percentage">{{ __('discount_percentage', 'Discount %') }}</option>
                                                <option value="flat">{{ __('flat_amount', 'Flat (₹)') }}</option>
                                                <option value="free_product">{{ __('free_product', 'Free Product') }}</option>
                                                <option value="discounted_product">{{ __('discounted_product', 'Discounted Product') }}</option>
                                            </select>

                                            <!-- Percentage -->
                                            <template v-if="item.discount_type === 'percentage'">
                                                <div class="input-group input-group-sm flex-nowrap" style="width: 110px; flex-shrink: 0;">
                                                    <input type="number" step="0.01" min="0.01" max="100" v-model="item.discount_value" class="form-control text-center" placeholder="10" required>
                                                    <span class="input-group-text bg-light text-muted px-2">%</span>
                                                </div>
                                            </template>

                                            <!-- Flat -->
                                            <template v-else-if="item.discount_type === 'flat'">
                                                <div class="input-group input-group-sm flex-nowrap" style="width: 120px; flex-shrink: 0;">
                                                    <input type="number" step="0.01" min="0.01" v-model="item.discount_value" class="form-control text-center" placeholder="100" required>
                                                    <span class="input-group-text bg-light text-muted px-2">₹</span>
                                                </div>
                                            </template>

                                            <!-- Free Product -->
                                            <template v-else-if="item.discount_type === 'free_product'">
                                                <div class="d-flex align-items-center gap-1 flex-nowrap flex-shrink-0">
                                                    <input type="number" step="1" min="1" v-model="item.free_qty" class="form-control form-control-sm text-center" style="width: 55px; flex-shrink: 0;" placeholder="1" required>
                                                    <select class="form-control form-select form-select-sm" v-model="item.free_qty_basis" style="width: 85px; flex-shrink: 0;">
                                                        <option value="inner">{{ __('inner', 'Inner') }}</option>
                                                        <option value="outer">{{ __('outer', 'Outer') }}</option>
                                                    </select>
                                                    <span class="badge bg-success text-white ms-1">{{ __('free', 'FREE') }}</span>
                                                </div>
                                            </template>

                                            <!-- Discounted Product (e.g. 1 Outer @ 50% off) -->
                                            <template v-else-if="item.discount_type === 'discounted_product'">
                                                <div class="d-flex align-items-center gap-1 flex-nowrap flex-shrink-0">
                                                    <input type="number" step="1" min="1" v-model="item.free_qty" class="form-control form-control-sm text-center" style="width: 50px; flex-shrink: 0;" placeholder="1" required title="Number of discounted units">
                                                    <select class="form-control form-select form-select-sm" v-model="item.free_qty_basis" style="width: 85px; flex-shrink: 0;">
                                                        <option value="outer">{{ __('outer', 'Outer') }}</option>
                                                        <option value="inner">{{ __('inner', 'Inner') }}</option>
                                                    </select>
                                                    <span class="text-muted fw-bold small px-1 flex-shrink-0">@</span>
                                                    <div class="input-group input-group-sm flex-nowrap flex-shrink-0" style="width: 85px;">
                                                        <input type="number" step="0.01" min="0.01" max="100" v-model="item.discount_value" class="form-control text-center px-1" placeholder="50" required title="Discount percentage">
                                                        <span class="input-group-text bg-light text-muted px-2">%</span>
                                                    </div>
                                                    <span class="text-muted small fw-semibold flex-shrink-0 ms-1">{{ __('off', 'off') }}</span>
                                                </div>
                                            </template>
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <button type="button" class="btn btn-sm btn-outline-danger action-trash-btn" @click="removeProductRow(index)" title="Remove Product">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="record.products.length === 0">
                                    <td colspan="8" class="text-center py-5 text-muted">
                                        <i class="fa fa-box-open fa-3x mb-3 text-secondary opacity-50 d-block"></i>
                                        <p class="mb-2 font-weight-bold">{{ __('no_products_added_yet', 'No products added yet.') }}</p>
                                        <button type="button" class="btn btn-primary btn-sm px-3" @click="openProductModal">
                                            <i class="fa fa-plus me-1"></i> {{ __('add_products', 'Add Products') }}
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- Multiple products (2+): compact table without per-product min, max, discount -->
                        <table v-else class="table table-bordered align-middle scheme-products-table mb-0">
                            <thead class="bg-light text-muted">
                                <tr>
                                    <th style="width: 50px;" class="text-center">#</th>
                                    <th>{{ t('product', 'Product') }}</th>
                                    <th style="width: 120px;" class="text-center">{{ t('uom', 'UOM') }}</th>
                                    <th style="width: 240px;" class="text-center">{{ t('scheme_qty_basis', 'Scheme Qty Basis') }}</th>
                                    <th style="width: 80px;" class="text-center">{{ t('actions', 'Actions') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in record.products" :key="item.id || item.seller_product_id || index">
                                    <td class="text-center font-weight-bold text-muted">{{ index + 1 }}</td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <img :src="item.image || '/images/default_product.png'" class="product-thumb rounded border me-2" alt="product" @error="onImgError">
                                            <div>
                                                <div class="fw-bold product-name-text">{{ item.name }}</div>
                                                <small class="text-muted d-block">SKU: {{ item.sku || 'N/A' }}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <span class="badge bg-light text-dark border px-2 py-1">{{ item.uom || 'Unit' }}</span>
                                    </td>
                                    <td class="text-center">
                                        <div class="d-inline-flex align-items-center gap-3">
                                            <div class="form-check form-check-inline m-0">
                                                <input class="form-check-input cursor-pointer" type="radio" :name="'multi_qty_basis_' + index" :id="'multi_basis_outer_' + index" value="outer" :checked="item.qty_basis === 'outer'" @change="syncAllQtyBasis('outer')">
                                                <label class="form-check-label ms-1 cursor-pointer fw-semibold small" :for="'multi_basis_outer_' + index">{{ __('outer_qty', 'Outer Qty') }}</label>
                                            </div>
                                            <div class="form-check form-check-inline m-0 ms-2">
                                                <input class="form-check-input cursor-pointer" type="radio" :name="'multi_qty_basis_' + index" :id="'multi_basis_inner_' + index" value="inner" :checked="item.qty_basis === 'inner'" @change="syncAllQtyBasis('inner')">
                                                <label class="form-check-label ms-1 cursor-pointer fw-semibold small" :for="'multi_basis_inner_' + index">{{ __('inner_qty', 'Inner Qty') }}</label>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <button type="button" class="btn btn-sm btn-outline-danger action-trash-btn" @click="removeProductRow(index)" title="Remove Product">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 3. Validity & Status -->
            <div class="card scheme-card shadow-sm mb-4">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <span class="step-num-badge me-2">3</span>
                        <h5 class="mb-0 font-weight-bold">{{ __('validity_and_status', 'Validity & Status') }}</h5>
                    </div>
                    <div class="row align-items-center g-3">
                        <div class="col-md-4 mb-3">
                            <label class="form-label font-weight-bold">{{ __('start_date') }} <span class="text-danger">*</span></label>
                            <input type="date" v-model="record.start_date" class="form-control" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label font-weight-bold">{{ __('end_date') }} <span class="text-danger">*</span></label>
                            <input type="date" v-model="record.end_date" class="form-control" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label font-weight-bold d-block">{{ __('status') }}</label>
                            <div class="form-check form-switch mt-2 d-inline-flex align-items-center">
                                <input class="form-check-input" type="checkbox" role="switch" id="scheme-status" v-model="record.status" :true-value="1" :false-value="0">
                                <label class="form-check-label ms-2 font-weight-bold" for="scheme-status">
                                    <span v-if="record.status == 1" class="text-success">{{ __('active') }}</span>
                                    <span v-else class="text-danger">{{ __('deactive') }}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom Actions -->
            <div class="d-flex align-items-center justify-content-between mb-5">
                <router-link to="/seller/schemes" class="btn btn-light border px-4 py-2 text-muted fw-semibold">
                    {{ __('cancel', 'Cancel') }}
                </router-link>
                <button type="submit" class="btn btn-success px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2" :disabled="isLoading">
                    <i class="fa fa-save"></i>
                    <span>{{ isLoading ? __('saving', 'Saving...') : __('save_scheme', 'Save Scheme') }}</span>
                </button>
            </div>
        </form>

        <!-- Product Selector Modal -->
        <b-modal v-model="showProductModal" :title="__('select_products', 'Select Products')" size="lg" hide-footer centered>
            <div class="p-2">
                <div class="mb-3">
                    <div class="input-group">
                        <span class="input-group-text bg-white border-end-0"><i class="fa fa-search text-muted"></i></span>
                        <input type="search" v-model="productSearch" class="form-control border-start-0" :placeholder="__('search_by_name_or_sku', 'Search by name or SKU...')">
                    </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mb-2 px-1 text-muted small">
                    <span>{{ filteredModalProducts.length }} {{ __('products_found', 'products found') }}</span>
                    <div class="d-flex gap-2">
                        <a href="javascript:void(0)" class="text-decoration-none me-3" @click="selectAllModalProducts">{{ __('select_all', 'Select All') }}</a>
                        <a href="javascript:void(0)" class="text-decoration-none" @click="deselectAllModalProducts">{{ __('deselect_all', 'Deselect All') }}</a>
                    </div>
                </div>

                <div class="modal-products-list border rounded p-2" style="max-height: 380px; overflow-y: auto;">
                    <div v-for="p in filteredModalProducts" :key="p.id" class="d-flex align-items-center justify-content-between p-2 border-bottom hover-bg">
                        <div class="d-flex align-items-center">
                            <input type="checkbox" :id="'prod_' + p.id" :value="p.id" v-model="selectedModalProductIds" class="form-check-input me-3">
                            <label :for="'prod_' + p.id" class="d-flex align-items-center mb-0 cursor-pointer">
                                <img :src="p.image || '/images/default_product.png'" class="product-thumb rounded border me-2" alt="product" @error="onImgError">
                                <div>
                                    <div class="fw-bold product-name-text">{{ p.name }}</div>
                                    <small class="text-muted">SKU: {{ p.sku || 'N/A' }} | {{ __('uom', 'UOM') }}: {{ p.uom || 'Unit' }}</small>
                                </div>
                            </label>
                        </div>
                        <div class="text-end">
                            <div class="fw-bold text-primary">₹{{ p.price }}</div>
                            <small class="text-muted" v-if="p.secondary_unit && p.secondary_unit_value">1 {{ p.secondary_unit }} = {{ p.secondary_unit_value }} {{ p.uom }}</small>
                        </div>
                    </div>
                    <div v-if="filteredModalProducts.length === 0" class="text-center py-4 text-muted">
                        {{ __('no_products_match_search', 'No products match your search.') }}
                    </div>
                </div>

                <div class="d-flex justify-content-end gap-2 mt-3">
                    <button type="button" class="btn btn-light border px-3" @click="showProductModal = false">{{ __('cancel') }}</button>
                    <button type="button" class="btn btn-primary px-3" @click="addSelectedModalProducts">
                        {{ __('add_selected', 'Add Selected') }} ({{ selectedModalProductIds.length }})
                    </button>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
import axios from 'axios';
import Multiselect from 'vue-multiselect';

export default {
    components: { Multiselect },
    data: function () {
        return {
            id: this.$route.params.id,
            record: {
                name: '',
                type: 'group_discount',
                description: '',
                tax_option: 'inclusive',
                buy_product: null,
                buy_qty: null,
                buy_qty_basis: 'outer',
                free_product: null,
                free_qty: null,
                free_qty_basis: 'outer',
                products: [],
                start_date: '',
                end_date: '',
                status: 1
            },
            global_qty_basis: 'outer',
            global_min_qty: 1,
            global_max_qty: null,
            global_discount_type: 'percentage',
            global_discount_value: 10,
            global_free_qty: 1,
            global_free_qty_basis: 'inner',
            availableProducts: [],
            isLoading: false,
            showProductModal: false,
            productSearch: '',
            selectedModalProductIds: []
        };
    },
    computed: {
        filteredModalProducts() {
            if (!this.productSearch) {
                return this.availableProducts;
            }
            let q = this.productSearch.toLowerCase();
            return this.availableProducts.filter(p => {
                return (p.name && p.name.toLowerCase().includes(q)) ||
                       (p.sku && p.sku.toLowerCase().includes(q));
            });
        }
    },
    created: async function () {
        await this.getProducts();
        if (this.id) {
            this.getRecord();
        }
    },
    methods: {
        t(key, fallback) {
            const val = this.__(key);
            return (val && val !== key) ? val : (fallback || key);
        },
        onImgError(e) {
            e.target.src = '/images/default_product.png';
        },
        getProducts() {
            return axios.get(this.$sellerApiUrl + '/schemes/products')
                .then(response => {
                    if (response.data.status === 1) {
                        this.availableProducts = response.data.data;
                    }
                }).catch(() => {
                    console.error("Error fetching products");
                });
        },
        getRecord() {
            this.isLoading = true;
            axios.get(this.$sellerApiUrl + '/schemes/edit/' + this.id)
                .then(response => {
                    this.isLoading = false;
                    let data = response.data;
                    if (data.status === 1) {
                        let r = data.data;
                        this.record.name = r.name;
                        this.record.description = r.description || '';
                        this.record.type = (r.type === 'buy_x_get_y') ? 'buy_x_get_y' : 'group_discount';
                        this.record.tax_option = r.tax_option || 'inclusive';
                        this.record.buy_qty = r.buy_qty;
                        this.record.buy_qty_basis = r.buy_qty_basis || 'outer';
                        this.record.free_qty = r.free_qty;
                        this.record.free_qty_basis = r.free_qty_basis || 'outer';
                        this.record.start_date = r.start_date ? r.start_date.substring(0, 10) : '';
                        this.record.end_date = r.end_date ? r.end_date.substring(0, 10) : '';
                        this.record.status = r.status;
                        this.record.buy_product = this.availableProducts.find(p => p.id == r.buy_seller_product_id) || null;
                        this.record.free_product = this.availableProducts.find(p => p.id == r.free_seller_product_id) || null;

                        if (r.products && r.products.length > 0) {
                            if (r.products.length > 1) {
                                let p0 = r.products[0];
                                this.global_qty_basis = p0.qty_basis || 'outer';
                                this.global_min_qty = p0.min_qty !== null ? p0.min_qty : 1;
                                this.global_max_qty = p0.max_qty !== null ? p0.max_qty : null;
                                this.global_discount_type = p0.discount_type || 'percentage';
                                this.global_discount_value = p0.discount_value !== null ? p0.discount_value : 10;
                                this.global_free_qty = p0.free_qty !== null ? p0.free_qty : 1;
                                this.global_free_qty_basis = p0.free_qty_basis || 'inner';
                            }
                            this.record.products = r.products.map(p => {
                                let match = this.availableProducts.find(ap => ap.id == (p.seller_product_id || p.id));
                                return {
                                    id: p.seller_product_id || p.id,
                                    seller_product_id: p.seller_product_id || p.id,
                                    name: p.name || (match ? match.name : ''),
                                    sku: p.sku || (match ? match.sku : ''),
                                    image: p.image || (match ? match.image : ''),
                                    uom: p.uom || (match ? match.uom : 'Unit'),
                                    secondary_unit: p.secondary_unit || (match ? match.secondary_unit : 'Pack'),
                                    secondary_unit_value: p.secondary_unit_value || (match ? match.secondary_unit_value : null),
                                    price: p.price || (match ? match.price : 0),
                                    outer_price: p.outer_price || (match ? match.outer_price : 0),
                                    qty_basis: (r.products.length > 1 ? this.global_qty_basis : (p.qty_basis || 'outer')),
                                    min_qty: p.min_qty,
                                    max_qty: p.max_qty,
                                    discount_type: p.discount_type || 'percentage',
                                    discount_value: p.discount_value !== null ? p.discount_value : 10,
                                    free_qty: p.free_qty !== null ? p.free_qty : 1,
                                    free_qty_basis: p.free_qty_basis || 'inner'
                                };
                            });
                        } else if (r.product_ids && r.product_ids.length > 0) {
                            // Fallback from legacy scheme
                            this.record.products = this.availableProducts
                                .filter(p => r.product_ids.includes(p.id))
                                .map(p => ({
                                    id: p.id,
                                    seller_product_id: p.id,
                                    name: p.name,
                                    sku: p.sku,
                                    image: p.image,
                                    uom: p.uom,
                                    secondary_unit: p.secondary_unit,
                                    secondary_unit_value: p.secondary_unit_value,
                                    price: p.price,
                                    outer_price: p.outer_price,
                                    qty_basis: 'outer',
                                    min_qty: 1,
                                    max_qty: null,
                                    discount_type: 'percentage',
                                    discount_value: 10,
                                    free_qty: 1,
                                    free_qty_basis: 'inner'
                                }));
                        }
                    }
                }).catch(() => {
                    this.isLoading = false;
                    this.showError("Something went wrong");
                });
        },
        openProductModal() {
            this.selectedModalProductIds = this.record.products.map(p => p.id || p.seller_product_id);
            this.productSearch = '';
            this.showProductModal = true;
        },
        selectAllModalProducts() {
            this.selectedModalProductIds = this.filteredModalProducts.map(p => p.id);
        },
        deselectAllModalProducts() {
            this.selectedModalProductIds = [];
        },
        addSelectedModalProducts() {
            let existingMap = {};
            this.record.products.forEach(p => {
                existingMap[p.id || p.seller_product_id] = p;
            });

            let newProducts = [];
            this.selectedModalProductIds.forEach(id => {
                if (existingMap[id]) {
                    newProducts.push(existingMap[id]);
                } else {
                    let p = this.availableProducts.find(ap => ap.id == id);
                    if (p) {
                        newProducts.push({
                            id: p.id,
                            seller_product_id: p.id,
                            name: p.name,
                            sku: p.sku,
                            image: p.image,
                            uom: p.uom,
                            secondary_unit: p.secondary_unit,
                            secondary_unit_value: p.secondary_unit_value,
                            price: p.price,
                            outer_price: p.outer_price,
                            qty_basis: this.global_qty_basis || 'outer',
                            min_qty: this.global_min_qty || 1,
                            max_qty: this.global_max_qty || null,
                            discount_type: this.global_discount_type || 'percentage',
                            discount_value: this.global_discount_value !== null ? this.global_discount_value : 10,
                            free_qty: this.global_free_qty !== null ? this.global_free_qty : 1,
                            free_qty_basis: this.global_free_qty_basis || 'inner'
                        });
                    }
                }
            });

            if (newProducts.length > 1) {
                if (this.record.products.length === 1) {
                    let first = this.record.products[0];
                    this.global_qty_basis = first.qty_basis || 'outer';
                    this.global_min_qty = first.min_qty || 1;
                    this.global_max_qty = first.max_qty || null;
                    this.global_discount_type = first.discount_type || 'percentage';
                    this.global_discount_value = first.discount_value !== null ? first.discount_value : 10;
                    this.global_free_qty = first.free_qty !== null ? first.free_qty : 1;
                    this.global_free_qty_basis = first.free_qty_basis || 'inner';
                }
                newProducts.forEach(p => {
                    p.qty_basis = this.global_qty_basis;
                });
            }

            this.record.products = newProducts;
            this.showProductModal = false;
        },
        syncAllQtyBasis(basis) {
            this.global_qty_basis = basis;
            this.record.products.forEach(p => {
                p.qty_basis = basis;
            });
        },
        onGlobalDiscountTypeChange() {
            if (this.global_discount_type === 'discounted_product') {
                if (!this.global_free_qty || this.global_free_qty < 1) this.global_free_qty = 1;
                if (!this.global_free_qty_basis) this.global_free_qty_basis = 'outer';
                if (!this.global_discount_value || this.global_discount_value > 100) this.global_discount_value = 50;
            } else if (this.global_discount_type === 'free_product') {
                if (!this.global_free_qty || this.global_free_qty < 1) this.global_free_qty = 1;
                if (!this.global_free_qty_basis) this.global_free_qty_basis = 'inner';
            } else if (this.global_discount_type === 'percentage') {
                if (!this.global_discount_value || this.global_discount_value > 100) this.global_discount_value = 10;
            } else if (this.global_discount_type === 'flat') {
                if (!this.global_discount_value) this.global_discount_value = 50;
            }
        },
        onDiscountTypeChange(item) {
            if (item.discount_type === 'discounted_product') {
                if (!item.free_qty || item.free_qty < 1) item.free_qty = 1;
                if (!item.free_qty_basis) item.free_qty_basis = 'outer';
                if (!item.discount_value || item.discount_value > 100) item.discount_value = 50;
            } else if (item.discount_type === 'free_product') {
                if (!item.free_qty || item.free_qty < 1) item.free_qty = 1;
                if (!item.free_qty_basis) item.free_qty_basis = 'inner';
            } else if (item.discount_type === 'percentage') {
                if (!item.discount_value || item.discount_value > 100) item.discount_value = 10;
            } else if (item.discount_type === 'flat') {
                if (!item.discount_value) item.discount_value = 50;
            }
        },
        removeProductRow(index) {
            this.record.products.splice(index, 1);
            if (this.record.products.length === 1) {
                let p = this.record.products[0];
                p.qty_basis = this.global_qty_basis;
                p.min_qty = this.global_min_qty;
                p.max_qty = this.global_max_qty;
                p.discount_type = this.global_discount_type;
                p.discount_value = this.global_discount_value;
                p.free_qty = this.global_free_qty;
                p.free_qty_basis = this.global_free_qty_basis;
            }
        },
        saveRecord() {
            if (this.record.type === 'buy_x_get_y') {
                if (!this.record.buy_product || !this.record.free_product) {
                    this.showError("Please select buy and free products.");
                    return;
                }
            } else {
                if (this.record.products.length === 0) {
                    this.showError("Please add at least one product with quantity conditions.");
                    return;
                }

                if (this.record.products.length > 1) {
                    if (!this.global_min_qty || Number(this.global_min_qty) <= 0) {
                        this.showError("Please enter a valid Min Quantity.");
                        return;
                    }
                    if (this.global_max_qty && Number(this.global_max_qty) < Number(this.global_min_qty)) {
                        this.showError("Max Quantity cannot be less than Min Quantity.");
                        return;
                    }
                    if (this.global_discount_type === 'percentage' && Number(this.global_discount_value) > 100) {
                        this.showError("Percentage discount cannot exceed 100%.");
                        return;
                    }
                    if (this.global_discount_type === 'discounted_product' && Number(this.global_discount_value) > 100) {
                        this.showError("Discount percentage cannot exceed 100%.");
                        return;
                    }

                    // Sync all products with global multi-product settings
                    this.record.products.forEach(p => {
                        p.qty_basis = this.global_qty_basis;
                        p.min_qty = this.global_min_qty;
                        p.max_qty = this.global_max_qty;
                        p.discount_type = this.global_discount_type;
                        p.discount_value = this.global_discount_value;
                        p.free_qty = this.global_free_qty;
                        p.free_qty_basis = this.global_free_qty_basis;
                    });
                } else {
                    let p = this.record.products[0];
                    if (!p.min_qty || Number(p.min_qty) <= 0) {
                        this.showError("Please enter a valid Min Quantity for " + p.name);
                        return;
                    }
                    if (p.max_qty && Number(p.max_qty) < Number(p.min_qty)) {
                        this.showError("Max Quantity cannot be less than Min Quantity for " + p.name);
                        return;
                    }
                    if (p.discount_type === 'percentage' && Number(p.discount_value) > 100) {
                        this.showError("Percentage discount cannot exceed 100% for " + p.name);
                        return;
                    }
                    if (p.discount_type === 'discounted_product' && Number(p.discount_value) > 100) {
                        this.showError("Discount percentage cannot exceed 100% for " + p.name);
                        return;
                    }
                }
            }

            this.isLoading = true;
            let url = this.$sellerApiUrl + '/schemes/' + (this.id ? 'update' : 'save');
            let payload = {
                name: this.record.name,
                type: this.record.type,
                description: this.record.description,
                tax_option: this.record.tax_option,
                start_date: this.record.start_date,
                end_date: this.record.end_date,
                status: this.record.status
            };

            if (this.id) {
                payload.id = this.id;
            }

            if (this.record.type === 'buy_x_get_y') {
                payload.buy_seller_product_id = this.record.buy_product.id;
                payload.buy_qty = this.record.buy_qty;
                payload.buy_qty_basis = this.record.buy_qty_basis || 'outer';
                payload.free_seller_product_id = this.record.free_product.id;
                payload.free_qty = this.record.free_qty;
                payload.free_qty_basis = this.record.free_qty_basis || 'outer';
            } else {
                payload.products = this.record.products.map(p => ({
                    seller_product_id: p.seller_product_id || p.id,
                    qty_basis: p.qty_basis,
                    min_qty: p.min_qty,
                    max_qty: p.max_qty,
                    discount_type: p.discount_type,
                    discount_value: p.discount_value,
                    free_qty: p.free_qty,
                    free_qty_basis: p.free_qty_basis
                }));
            }

            axios.post(url, payload)
                .then(response => {
                    let data = response.data;
                    if (data.status === 1) {
                        this.showMessage("success", data.message);
                        setTimeout(() => {
                            this.$router.push({ path: '/seller/schemes' });
                        }, 1000);
                    } else {
                        this.showError(data.message);
                        this.isLoading = false;
                    }
                }).catch(error => {
                    this.isLoading = false;
                    if (error.response && error.response.data && error.response.data.message) {
                        this.showError(error.response.data.message);
                    } else if (error.message) {
                        this.showError(error.message);
                    } else {
                        this.showError("Something went wrong!");
                    }
                });
        }
    }
};
</script>

<style scoped>
.scheme-form-page {
    padding-bottom: 30px;
}
.scheme-card {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background-color: #ffffff;
}
.step-num-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: #2563eb;
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
}
.product-thumb {
    width: 42px;
    height: 42px;
    object-fit: cover;
}
.product-name-text {
    font-size: 13.5px;
    line-height: 1.25;
}
.scheme-products-table th {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 12px 10px;
}
.scheme-products-table td {
    padding: 10px 8px;
    vertical-align: middle;
}
.cursor-pointer {
    cursor: pointer;
}
.hover-bg:hover {
    background-color: #f8fafc;
}
.action-trash-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
