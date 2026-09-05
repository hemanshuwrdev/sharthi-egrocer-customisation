<?php

namespace App\Helpers;

use App\Models\BrandDistributorMapping;
use App\Models\MasterProductVariant;
use App\Models\OrderItem;
use App\Models\OrderStatusList;
use App\Models\SellerProduct;
use App\Models\SellerProductSlabPrice;

/**
 * Sarthi master catalog order helpers — used by POS, retailer cart, retailer order placement.
 *
 * Centralizes:
 *  - Validating a (seller, master_variant) pair (assignment + activation + stock)
 *  - Enforcing secondary-unit (box) based quantity stepping
 *  - Resolving the slab-matched unit price at the moment of order
 *  - Decrementing seller_products.stock
 */
class MasterCatalogOrderHelper
{
    /**
     * Resolve a (seller, master variant, qty) tuple into the priced order line.
     *
     * Returns ['ok' => bool, 'error' => string|null,
     *          'seller_product' => SellerProduct|null,
     *          'master_variant' => MasterProductVariant|null,
     *          'unit_price' => float, 'slab' => [min_qty, max_qty]|null,
     *          'base_price' => float,
     *          'step' => float, 'secondary_unit' => string|null,
     *          'min_secondary_qty' => int, 'min_qty' => float ]
     */
    public static function resolveLine(int $sellerId, int $masterProductVariantId, float $qty, ?int $userId = null): array
    {
        $variant = MasterProductVariant::with(['masterProduct.tax', 'secondaryUnit'])->find($masterProductVariantId);
        if (!$variant || !$variant->masterProduct) {
            return self::fail('master_variant_not_found');
        }
        if ((int) $variant->status !== 1 || (int) $variant->masterProduct->status !== 1) {
            return self::fail('product_inactive');
        }

        $sp = SellerProduct::where('seller_id', $sellerId)
            ->where('master_product_variant_id', $masterProductVariantId)
            ->first();

        if (!$sp || (int) $sp->status !== 1) {
            return self::fail('seller_product_not_active');
        }

        // ── Secondary-unit (box) step validation ──────────────────────────────
        $qtyError = self::validateSecondaryQty($variant, $sp, $qty);
        if ($qtyError) {
            return self::fail($qtyError);
        }
        // ──────────────────────────────────────────────────────────────────────

        // ── Max order quantity limit (distributor-set, on the seller_product). $userId is
        // only passed at actual cart-mutation/order-placement call sites — a null
        // $userId (e.g. the getCart() re-pricing pass) skips this check, since
        // re-pricing an already-in-cart line isn't a new quantity decision.
        if ($userId !== null) {
            $qtyLimitError = self::validateQtyLimits($sp, $variant->id, $qty, $userId);
            if ($qtyLimitError) {
                return self::fail($qtyLimitError);
            }
        }
        // ──────────────────────────────────────────────────────────────────────

        if ((float) $sp->stock < $qty) {
            return self::fail('insufficient_stock');
        }

        $base = $sp->discounted_price && (float) $sp->discounted_price > 0
            ? (float) $sp->discounted_price
            : (float) $sp->selling_price;

        $matched = null;
        $slabs = SellerProductSlabPrice::where('seller_product_id', $sp->id)
            ->orderByDesc('min_qty')
            ->get();

        foreach ($slabs as $slab) {
            $inRange = $qty >= $slab->min_qty && ($slab->max_qty === null || $qty <= $slab->max_qty);
            if ($inRange) {
                $matched = $slab;
                break;
            }
        }

        $unitPrice = $matched ? (float) $matched->price : $base;

        // Matches the legacy checkout convention (ProductHelper::getTaxableAmount,
        // OrderApiController::placeOrder): unit_price is tax-EXCLUSIVE; tax is added on
        // top. customer/orders' getOrders() reads order_items.tax_amount as a PER-UNIT
        // value and adds it straight to the per-unit price/discounted_price it returns —
        // so tax_amount_per_unit here must stay per-unit, never multiplied by qty.
        $taxPercentage = (float) ($variant->masterProduct->tax->percentage ?? 0);
        $taxAmountPerUnit = $taxPercentage > 0 ? round($unitPrice * $taxPercentage / 100, 2) : 0;

        // Stepper metadata (used by mobile app to render the quantity stepper widget).
        // Loose-enabled products: any qty is orderable, so the app should render a plain
        // 1-at-a-time stepper (step=1, min_qty=1) rather than a box-multiple stepper.
        $allowLooseQty = (int) $sp->allow_loose_qty === 1;
        $step          = (float) ($variant->secondary_unit_value ?? 1);
        $step          = $step > 0 ? $step : 1;
        $minQty        = $step;
        if ($allowLooseQty) {
            $step   = 1;
            $minQty = 1;
        }
        $secondaryUnit = $variant->secondaryUnit ? $variant->secondaryUnit->name : null;

        return [
            'ok'             => true,
            'error'          => null,
            'seller_product' => $sp,
            'master_variant' => $variant,
            'unit_price'     => $unitPrice,
            'base_price'     => $base,
            'tax_percentage' => $taxPercentage,
            'tax_amount_per_unit' => $taxAmountPerUnit,
            'slab'           => $matched ? [
                'min_qty' => (int) $matched->min_qty,
                'max_qty' => $matched->max_qty !== null ? (int) $matched->max_qty : null,
                'price'   => (float) $matched->price,
            ] : null,
            // Stepper metadata — passed directly to app/frontend
            'step'           => $step,          // e.g. 20 (packets per box), or 1 if loose
            'secondary_unit' => $secondaryUnit, // e.g. "Box"
            'min_qty'        => $minQty,        // e.g. 20 (= 1 box × 20 packets), or 1 if loose
            'allow_loose_qty' => $allowLooseQty,
        ];
    }

    /**
     * Validate that $qty is a whole-box multiple of secondary_unit_value.
     *
     * Wholesaler rule:
     *   - 1 box = secondary_unit_value packets (e.g. 20 packets per box)
     *   - Retailer orders in full boxes only: 20, 40, 60 ...
     *
     * Exception: if the distributor's seller_product has allow_loose_qty=1, the retailer
     * can order any qty (≥ 1 primary unit) — the box-multiple rule is only a display
     * "step" hint for that product, not an enforced restriction.
     *
     * Returns an error string key on failure, null on success.
     * Products with no secondary unit configured (NULL / 0) → no restriction applied.
     */
    public static function validateSecondaryQty(
        MasterProductVariant $variant,
        SellerProduct $sp,
        float $qty
    ): ?string {
        $step = (float) ($variant->secondary_unit_value ?? 0);

        // No secondary unit configured → no box restriction, any qty ≥ 1 is fine
        if ($step <= 0) {
            return null;
        }

        // Loose selling allowed → skip the box-multiple restriction, just require ≥ 1.
        if ((int) $sp->allow_loose_qty === 1) {
            return $qty < 1 ? 'minimum_qty_is_1' : null;
        }

        $minQty = $step; // e.g. step=20 → minQty=20

        // Must meet minimum order quantity
        if ($qty < $minQty) {
            return 'minimum_qty_is_' . (int) $minQty;
        }

        // Must be an exact multiple of step (float-safe epsilon check)
        $remainder = fmod($qty, $step);
        $epsilon   = 0.0001;
        if ($remainder > $epsilon && ($step - $remainder) > $epsilon) {
            return 'qty_must_be_multiple_of_' . (int) $step;
        }

        return null; // ✓ valid
    }

    /**
     * Enforce the distributor-set maximum order quantity (seller_products.max_qty_mode /
     * max_qty_value) for a line — each distributor selling this variant sets their own cap.
     *
     * Per Order: $qty alone must not exceed the cap.
     * Per Day: $qty PLUS everything this retailer already ordered today from this
     * distributor for this exact variant (excluding cancelled orders) must not exceed the cap.
     *
     * Optional — null/0 means no restriction. Returns an error string key on failure,
     * null on success.
     */
    public static function validateQtyLimits(
        SellerProduct $sp,
        int $masterProductVariantId,
        float $qty,
        int $userId
    ): ?string {
        if (!$sp->max_qty_value) {
            return null;
        }

        if ($sp->max_qty_mode === 'per_day') {
            $orderedToday = OrderItem::join('orders', 'orders.id', '=', 'order_items.order_id')
                ->where('orders.user_id', $userId)
                ->where('order_items.master_product_variant_id', $masterProductVariantId)
                ->where('order_items.seller_id', $sp->seller_id)
                ->whereDate('orders.created_at', now()->toDateString())
                ->where('orders.active_status', '!=', OrderStatusList::$cancelled)
                ->sum('order_items.quantity');

            if (((float) $orderedToday + $qty) > $sp->max_qty_value) {
                return 'maximum_order_quantity_per_day_exceeded';
            }

            return null;
        }

        // Default / 'per_order' mode
        if ($qty > $sp->max_qty_value) {
            return 'maximum_order_quantity_per_order_exceeded';
        }

        return null;
    }

    /**
     * Decrement seller_products.stock after order item is recorded.
     * Auto-deactivates the row when stock reaches 0.
     */
    public static function decrementStock(int $sellerProductId, float $qty): void
    {
        $sp = SellerProduct::find($sellerProductId);
        if (!$sp) return;
        $sp->stock = max(0, (float) $sp->stock - $qty);
        if ($sp->stock <= 0) {
            $sp->status = 0;
        }
        $sp->save();
    }

    /**
     * For the retailer flow: resolve which seller_id should serve a given master variant
     * to a retailer whose zone covers the given city ids (pass the FULL zone-expanded set
     * from CommonHelper::getDeliverableZoneCityIds(), not just the single matched city, so
     * a distributor mapped to a sibling city in the same zone is still found). Honors the
     * brand's overlap flag.
     *
     * Returns ['ok' => bool, 'error' => string|null, 'seller_id' => int|null, 'overlap_allowed' => bool]
     */
    public static function resolveSellerForRetailer(int $masterProductVariantId, array $cityIds, ?int $preferredSellerId = null): array
    {
        $variant = MasterProductVariant::with('masterProduct.brand')->find($masterProductVariantId);
        if (!$variant || !$variant->masterProduct) {
            return ['ok' => false, 'error' => 'master_variant_not_found', 'seller_id' => null, 'overlap_allowed' => false];
        }
        $brandId = $variant->masterProduct->brand_id;
        $overlapAllowed = $variant->masterProduct->brand && (int) $variant->masterProduct->brand->is_overlap_allowed === 1;

        $sellerIds = BrandDistributorMapping::where('brand_id', $brandId)
            ->whereIn('city_id', $cityIds)
            ->pluck('seller_id');

        if ($sellerIds->isEmpty()) {
            return ['ok' => false, 'error' => 'product_not_available_in_your_area', 'seller_id' => null, 'overlap_allowed' => $overlapAllowed];
        }

        if ($preferredSellerId && $sellerIds->contains($preferredSellerId)) {
            return ['ok' => true, 'error' => null, 'seller_id' => (int) $preferredSellerId, 'overlap_allowed' => $overlapAllowed];
        }

        if (!$overlapAllowed) {
            return ['ok' => true, 'error' => null, 'seller_id' => (int) $sellerIds->first(), 'overlap_allowed' => false];
        }

        // Overlap allowed but caller didn't pick: choose the cheapest active offer.
        $sp = SellerProduct::whereIn('seller_id', $sellerIds)
            ->where('master_product_variant_id', $masterProductVariantId)
            ->where('status', 1)
            ->where('selling_price', '>', 0)
            ->orderByRaw('CASE WHEN discounted_price > 0 THEN discounted_price ELSE selling_price END ASC')
            ->first();

        if (!$sp) {
            return ['ok' => false, 'error' => 'product_not_available_in_your_area', 'seller_id' => null, 'overlap_allowed' => true];
        }

        return ['ok' => true, 'error' => null, 'seller_id' => (int) $sp->seller_id, 'overlap_allowed' => true];
    }

    private static function fail(string $err): array
    {
        return [
            'ok'                => false,
            'error'             => $err,
            'seller_product'    => null,
            'master_variant'    => null,
            'unit_price'        => 0,
            'base_price'        => 0,
            'tax_percentage'    => 0,
            'tax_amount_per_unit' => 0,
            'slab'              => null,
            'step'              => 1,
            'secondary_unit'    => null,
            'min_secondary_qty' => 1,
            'min_qty'           => 1,
            'allow_loose_qty'   => false,
        ];
    }
}
