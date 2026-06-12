<?php

namespace App\Services;

use App\Models\Scheme;
use App\Models\SellerProduct;

class SchemeEngine
{
    /**
     * Evaluate all active schemes of a seller against cart lines and return
     * the single best one (max benefit), or null when none applies.
     *
     * $lines = [ ['seller_product_id' => int, 'qty' => float, 'line_total' => float], ... ]
     *
     * Return shape:
     * [
     *   'scheme_id'       => int,
     *   'name'            => string,
     *   'type'            => 'buy_x_get_y' | 'group_discount',
     *   'benefit'         => float,   // money value used to pick the best scheme
     *   'scheme_discount' => float,   // amount to subtract from order total (group only)
     *   'free_items'      => [ ['seller_product_id', 'master_product_variant_id', 'qty', 'product_name', 'variant_name', 'unit_value'], ... ],
     * ]
     */
    public static function evaluate(int $sellerId, array $lines): ?array
    {
        if (empty($lines)) {
            return null;
        }

        $qtyByProduct = [];
        $totalByProduct = [];
        foreach ($lines as $line) {
            $spId = (int) $line['seller_product_id'];
            $qtyByProduct[$spId] = ($qtyByProduct[$spId] ?? 0) + (float) $line['qty'];
            $totalByProduct[$spId] = ($totalByProduct[$spId] ?? 0) + (float) $line['line_total'];
        }

        $schemes = Scheme::active()
            ->where('seller_id', $sellerId)
            ->with(['schemeProducts', 'schemeSlabs'])
            ->get();

        $best = null;
        foreach ($schemes as $scheme) {
            $result = $scheme->type === Scheme::TYPE_BUY_X_GET_Y
                ? self::evaluateBuyXGetY($scheme, $qtyByProduct)
                : self::evaluateGroupDiscount($scheme, $totalByProduct);

            if ($result !== null && ($best === null || $result['benefit'] > $best['benefit'])) {
                $best = $result;
            }
        }

        return $best;
    }

    private static function evaluateBuyXGetY(Scheme $scheme, array $qtyByProduct): ?array
    {
        if (!$scheme->buy_seller_product_id || !$scheme->buy_qty || !$scheme->free_seller_product_id || !$scheme->free_qty) {
            return null;
        }

        $cartQty = $qtyByProduct[(int) $scheme->buy_seller_product_id] ?? 0;
        if ($cartQty < $scheme->buy_qty) {
            return null;
        }

        $multiples = (int) floor($cartQty / $scheme->buy_qty);
        $freeQty = $multiples * (int) $scheme->free_qty;

        $freeProduct = SellerProduct::with('masterProductVariant.masterProduct')
            ->find($scheme->free_seller_product_id);
        if (!$freeProduct || (int) $freeProduct->status !== 1) {
            return null;
        }

        // Stock must cover the free units PLUS whatever the cart already takes of the same product.
        $alreadyInCart = $qtyByProduct[(int) $freeProduct->id] ?? 0;
        if ((float) $freeProduct->stock < $freeQty + $alreadyInCart) {
            return null;
        }

        $unitValue = $freeProduct->discounted_price && (float) $freeProduct->discounted_price > 0
            ? (float) $freeProduct->discounted_price
            : (float) $freeProduct->selling_price;

        $variant = $freeProduct->masterProductVariant;

        return [
            'scheme_id'       => $scheme->id,
            'name'            => $scheme->name,
            'type'            => Scheme::TYPE_BUY_X_GET_Y,
            'benefit'         => $freeQty * $unitValue,
            'scheme_discount' => 0.0,
            'free_items'      => [[
                'seller_product_id'         => $freeProduct->id,
                'master_product_variant_id' => $variant->id ?? null,
                'qty'                       => $freeQty,
                'product_name'              => $variant->masterProduct->name ?? '',
                'variant_name'              => $variant->sku ?? '',
                'unit_value'                => $unitValue,
            ]],
        ];
    }

    private static function evaluateGroupDiscount(Scheme $scheme, array $totalByProduct): ?array
    {
        $groupIds = $scheme->schemeProducts->pluck('seller_product_id')->all();
        if (empty($groupIds)) {
            return null;
        }

        $groupTotal = 0.0;
        foreach ($groupIds as $spId) {
            $groupTotal += $totalByProduct[(int) $spId] ?? 0;
        }
        if ($groupTotal <= 0) {
            return null;
        }

        $matched = $scheme->schemeSlabs
            ->where('min_value', '<=', $groupTotal)
            ->sortByDesc('min_value')
            ->first();
        if (!$matched) {
            return null;
        }

        $discount = $matched->discount_type === 'percentage'
            ? round($groupTotal * (float) $matched->discount_value / 100, 2)
            : (float) $matched->discount_value;
        $discount = min($discount, $groupTotal);

        if ($discount <= 0) {
            return null;
        }

        return [
            'scheme_id'       => $scheme->id,
            'name'            => $scheme->name,
            'type'            => Scheme::TYPE_GROUP_DISCOUNT,
            'benefit'         => $discount,
            'scheme_discount' => $discount,
            'free_items'      => [],
        ];
    }
}
