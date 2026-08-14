<?php

namespace App\Helpers;

use App\Models\BrandDistributorMapping;
use App\Models\MasterProductVariant;
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
    public static function resolveLine(int $sellerId, int $masterProductVariantId, float $qty): array
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

        // Stepper metadata (used by mobile app to render the quantity stepper widget)
        $step          = (float) ($variant->secondary_unit_value ?? 1);
        $step          = $step > 0 ? $step : 1;
        $minQty        = $step;
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
            'step'           => $step,          // e.g. 20 (packets per box)
            'secondary_unit' => $secondaryUnit, // e.g. "Box"
            'min_qty'        => $minQty,        // e.g. 20 (= 1 box × 20 packets)
        ];
    }

    /**
     * Validate that $qty is a whole-box multiple of secondary_unit_value.
     *
     * Wholesaler rule:
     *   - 1 box = secondary_unit_value packets (e.g. 20 packets per box)
     *   - Retailer orders in full boxes only: 20, 40, 60 ...
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
     * to a retailer in the given city. Honors the brand's overlap flag.
     *
     * Returns ['ok' => bool, 'error' => string|null, 'seller_id' => int|null, 'overlap_allowed' => bool]
     */
    public static function resolveSellerForRetailer(int $masterProductVariantId, int $cityId, ?int $preferredSellerId = null): array
    {
        $variant = MasterProductVariant::with('masterProduct.brand')->find($masterProductVariantId);
        if (!$variant || !$variant->masterProduct) {
            return ['ok' => false, 'error' => 'master_variant_not_found', 'seller_id' => null, 'overlap_allowed' => false];
        }
        $brandId = $variant->masterProduct->brand_id;
        $overlapAllowed = $variant->masterProduct->brand && (int) $variant->masterProduct->brand->is_overlap_allowed === 1;

        $sellerIds = BrandDistributorMapping::where('brand_id', $brandId)
            ->where('city_id', $cityId)
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
        ];
    }
}
