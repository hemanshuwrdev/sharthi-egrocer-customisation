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

    /**
     * Find the single nearest scheme that is NOT yet triggered — the one requiring
     * the smallest additional spend / qty to unlock.
     *
     * For buy_x_get_y : gap = (buy_qty - currentQty) × unit_price. Skipped when already applied.
     * For group_discount: gap = nextSlab.min_value - currentGroupTotal (next unmet slab, even if a
     *                     lower slab is already the applied_scheme — shows upgrade opportunity).
     *
     * Returns null when the cart is empty, all schemes are fully unlocked, or no active schemes exist.
     */
    public static function nearestUnapplied(int $sellerId, array $lines, ?int $appliedSchemeId = null): ?array
    {
        if (empty($lines)) {
            return null;
        }

        $qtyByProduct   = [];
        $totalByProduct = [];
        foreach ($lines as $line) {
            $spId = (int) $line['seller_product_id'];
            $qtyByProduct[$spId]   = ($qtyByProduct[$spId]   ?? 0) + (float) $line['qty'];
            $totalByProduct[$spId] = ($totalByProduct[$spId] ?? 0) + (float) $line['line_total'];
        }

        $schemes = Scheme::active()
            ->where('seller_id', $sellerId)
            ->with([
                'schemeSlabs',
                'schemeProducts.sellerProduct.masterProductVariant.masterProduct',
                'buyProduct.masterProductVariant.masterProduct',
                'freeProduct.masterProductVariant.masterProduct',
            ])
            ->get();

        $nearest = null; // ['amountNeeded', 'minimumAmount', 'qtyNeeded', 'scheme', 'nextSlab', 'currentBuyQty', 'currentGroupTotal']

        foreach ($schemes as $scheme) {
            if ($scheme->type === Scheme::TYPE_BUY_X_GET_Y) {
                // BXGY has no "upgrade" concept — skip if already the applied scheme.
                if ($scheme->id === $appliedSchemeId) {
                    continue;
                }

                if (!$scheme->buy_seller_product_id || !$scheme->buy_qty || !$scheme->free_seller_product_id || !$scheme->free_qty) {
                    continue;
                }

                $currentQty    = (float) ($qtyByProduct[(int) $scheme->buy_seller_product_id] ?? 0);
                $rawQtyNeeded  = (float) $scheme->buy_qty - $currentQty;
                if ($rawQtyNeeded <= 0) {
                    continue; // already qualifies (SchemeEngine picked something better)
                }

                $buyProduct = $scheme->buyProduct;
                if (!$buyProduct) {
                    continue;
                }
                $unitPrice = (float) ($buyProduct->discounted_price && (float) $buyProduct->discounted_price > 0
                    ? $buyProduct->discounted_price
                    : $buyProduct->selling_price);
                if ($unitPrice <= 0) {
                    continue;
                }

                $qtyNeeded     = (int) ceil($rawQtyNeeded);
                $amountNeeded  = round($qtyNeeded * $unitPrice, 2);
                $minimumAmount = round((float) $scheme->buy_qty * $unitPrice, 2);

                if ($nearest === null || $amountNeeded < $nearest['amountNeeded']) {
                    $nearest = [
                        'amountNeeded'       => $amountNeeded,
                        'minimumAmount'      => $minimumAmount,
                        'qtyNeeded'          => $qtyNeeded,
                        'scheme'             => $scheme,
                        'nextSlab'           => null,
                        'currentBuyQty'      => $currentQty,
                        'currentGroupTotal'  => null,
                    ];
                }

            } else { // group_discount
                $groupIds = $scheme->schemeProducts->pluck('seller_product_id')->all();
                if (empty($groupIds)) {
                    continue;
                }

                $groupTotal = 0.0;
                foreach ($groupIds as $spId) {
                    $groupTotal += $totalByProduct[(int) $spId] ?? 0;
                }

                // Next unmet slab — works for both unapplied schemes and upgrade hints.
                $nextSlab = $scheme->schemeSlabs
                    ->where('min_value', '>', $groupTotal)
                    ->sortBy('min_value')
                    ->first();

                if (!$nextSlab) {
                    continue; // all slabs already unlocked or no slabs defined
                }

                $amountNeeded  = round((float) $nextSlab->min_value - $groupTotal, 2);
                $minimumAmount = (float) $nextSlab->min_value;

                if ($nearest === null || $amountNeeded < $nearest['amountNeeded']) {
                    $nearest = [
                        'amountNeeded'       => $amountNeeded,
                        'minimumAmount'      => $minimumAmount,
                        'scheme'             => $scheme,
                        'nextSlab'           => $nextSlab,
                        'currentBuyQty'      => null,
                        'currentGroupTotal'  => round($groupTotal, 2),
                    ];
                }
            }
        }

        if (!$nearest) {
            return null;
        }

        $s      = $nearest['scheme'];
        $isBxgy = $s->type === Scheme::TYPE_BUY_X_GET_Y;

        $buyProductData  = null;
        $freeProductData = null;
        if ($isBxgy) {
            $bp      = $s->buyProduct;
            $variant = $bp ? $bp->masterProductVariant : null;
            $uprice  = $bp ? (float) ($bp->discounted_price && (float) $bp->discounted_price > 0 ? $bp->discounted_price : $bp->selling_price) : 0;
            $buyProductData = $bp ? [
                'id'         => $bp->id,
                'name'       => trim(($variant->masterProduct->name ?? '') . ' — ' . ($variant->sku ?? '')),
                'image'      => $bp->image ?? ($variant->masterProduct->image ?? null),
                'unit_price' => $uprice,
            ] : null;

            $fp      = $s->freeProduct;
            $fvariant = $fp ? $fp->masterProductVariant : null;
            $fprice  = $fp ? (float) ($fp->discounted_price && (float) $fp->discounted_price > 0 ? $fp->discounted_price : $fp->selling_price) : 0;
            $freeProductData = $fp ? [
                'id'         => $fp->id,
                'name'       => trim(($fvariant->masterProduct->name ?? '') . ' — ' . ($fvariant->sku ?? '')),
                'image'      => $fp->image ?? ($fvariant->masterProduct->image ?? null),
                'unit_price' => $fprice,
            ] : null;
        }

        $productsData = null;
        if (!$isBxgy) {
            $productsData = $s->schemeProducts->map(function ($p) {
                $sp      = $p->sellerProduct ?? null;
                $variant = $sp ? $sp->masterProductVariant : null;
                if (!$sp || !$variant) {
                    return null;
                }
                return [
                    'id'         => $sp->id,
                    'name'       => trim(($variant->masterProduct->name ?? '') . ' — ' . ($variant->sku ?? '')),
                    'image'      => $sp->image ?? ($variant->masterProduct->image ?? null),
                    'unit_price' => (float) ($sp->discounted_price && (float) $sp->discounted_price > 0 ? $sp->discounted_price : $sp->selling_price),
                ];
            })->filter()->values();
        }

        $nextSlabData = $nearest['nextSlab'] ? [
            'min_value'      => (float) $nearest['nextSlab']->min_value,
            'discount_type'  => $nearest['nextSlab']->discount_type,
            'discount_value' => (float) $nearest['nextSlab']->discount_value,
        ] : null;

        return [
            'id'                  => $s->id,
            'name'                => $s->name,
            'offer_type'          => $s->type,
            'amount_needed'       => $nearest['amountNeeded'],
            'minimum_amount'      => $nearest['minimumAmount'],
            // BXGY fields
            'buy_qty'             => $isBxgy ? (int) $s->buy_qty  : null,
            'get_qty'             => $isBxgy ? (int) $s->free_qty : null,
            'current_buy_qty'     => $isBxgy ? $nearest['currentBuyQty'] : null,
            'qty_needed'          => $isBxgy ? $nearest['qtyNeeded']     : null,
            'buy_product'         => $buyProductData,
            'free_product'        => $freeProductData,
            // group_discount fields
            'current_group_total' => !$isBxgy ? $nearest['currentGroupTotal'] : null,
            'next_slab'           => $nextSlabData,
            'products'            => $productsData,
            'slabs'               => !$isBxgy ? $s->schemeSlabs->sortBy('min_value')->map(fn ($sl) => [
                'min_value'      => (float) $sl->min_value,
                'discount_type'  => $sl->discount_type,
                'discount_value' => (float) $sl->discount_value,
            ])->values() : null,
        ];
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
