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
     *   'type'            => 'buy_x_get_y' | 'group_discount_price' | 'group_discount_qty',
     *   'benefit'         => float,
     *   'scheme_discount' => float,
     *   'free_items'      => [...],
     * ]
     */
    public static function evaluate(int $sellerId, array $lines): ?array
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
            ->with(['schemeProducts', 'schemeSlabs'])
            ->get();

        $best = null;
        foreach ($schemes as $scheme) {
            $result = match ($scheme->type) {
                Scheme::TYPE_BUY_X_GET_Y         => self::evaluateBuyXGetY($scheme, $qtyByProduct),
                Scheme::TYPE_GROUP_DISCOUNT_PRICE => self::evaluateGroupDiscountPrice($scheme, $totalByProduct),
                Scheme::TYPE_GROUP_DISCOUNT_QTY   => self::evaluateGroupDiscountQty($scheme, $qtyByProduct, $totalByProduct),
                default                           => null,
            };

            if ($result !== null && ($best === null || $result['benefit'] > $best['benefit'])) {
                $best = $result;
            }
        }

        return $best;
    }

    /**
     * Find the single nearest scheme that is NOT yet triggered — the one requiring
     * the smallest additional spend / qty to unlock.
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

        $nearest = null;

        foreach ($schemes as $scheme) {
            if ($scheme->type === Scheme::TYPE_BUY_X_GET_Y) {
                if ($scheme->id === $appliedSchemeId) {
                    continue;
                }
                if (!$scheme->buy_seller_product_id || !$scheme->buy_qty || !$scheme->free_seller_product_id || !$scheme->free_qty) {
                    continue;
                }

                $currentQty   = (float) ($qtyByProduct[(int) $scheme->buy_seller_product_id] ?? 0);
                $rawQtyNeeded = (float) $scheme->buy_qty - $currentQty;
                if ($rawQtyNeeded <= 0) {
                    continue;
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

                $qtyNeeded    = (int) ceil($rawQtyNeeded);
                $amountNeeded = round($qtyNeeded * $unitPrice, 2);
                $minimumAmount = round((float) $scheme->buy_qty * $unitPrice, 2);

                if ($nearest === null || $amountNeeded < $nearest['amountNeeded']) {
                    $nearest = [
                        'type'               => Scheme::TYPE_BUY_X_GET_Y,
                        'amountNeeded'       => $amountNeeded,
                        'minimumAmount'      => $minimumAmount,
                        'qtyNeeded'          => $qtyNeeded,
                        'scheme'             => $scheme,
                        'nextSlab'           => null,
                        'currentBuyQty'      => $currentQty,
                        'currentGroupTotal'  => null,
                        'currentGroupQty'    => null,
                        'groupQtyNeeded'     => null,
                        'minimumGroupQty'    => null,
                    ];
                }

            } elseif ($scheme->type === Scheme::TYPE_GROUP_DISCOUNT_PRICE) {
                $groupIds = $scheme->schemeProducts->pluck('seller_product_id')->all();
                if (empty($groupIds)) {
                    continue;
                }

                $groupTotal = 0.0;
                foreach ($groupIds as $spId) {
                    $groupTotal += $totalByProduct[(int) $spId] ?? 0;
                }

                $nextSlab = $scheme->schemeSlabs
                    ->where('min_value', '>', $groupTotal)
                    ->sortBy('min_value')
                    ->first();

                if (!$nextSlab) {
                    continue;
                }

                $amountNeeded  = round((float) $nextSlab->min_value - $groupTotal, 2);
                $minimumAmount = (float) $nextSlab->min_value;

                if ($nearest === null || $amountNeeded < $nearest['amountNeeded']) {
                    $nearest = [
                        'type'               => Scheme::TYPE_GROUP_DISCOUNT_PRICE,
                        'amountNeeded'       => $amountNeeded,
                        'minimumAmount'      => $minimumAmount,
                        'qtyNeeded'          => null,
                        'scheme'             => $scheme,
                        'nextSlab'           => $nextSlab,
                        'currentBuyQty'      => null,
                        'currentGroupTotal'  => round($groupTotal, 2),
                        'currentGroupQty'    => null,
                        'groupQtyNeeded'     => null,
                        'minimumGroupQty'    => null,
                    ];
                }

            } elseif ($scheme->type === Scheme::TYPE_GROUP_DISCOUNT_QTY) {
                $groupIds = $scheme->schemeProducts->pluck('seller_product_id')->all();
                if (empty($groupIds)) {
                    continue;
                }

                $groupQty   = 0.0;
                $groupTotal = 0.0;
                foreach ($groupIds as $spId) {
                    $groupQty   += $qtyByProduct[(int) $spId]   ?? 0;
                    $groupTotal += $totalByProduct[(int) $spId] ?? 0;
                }

                $nextSlab = $scheme->schemeSlabs
                    ->where('min_value', '>', $groupQty)
                    ->sortBy('min_value')
                    ->first();

                if (!$nextSlab) {
                    continue;
                }

                $groupQtyNeeded  = (int) ceil((float) $nextSlab->min_value - $groupQty);
                $minimumGroupQty = (int) $nextSlab->min_value;

                // Use qty gap as the comparison metric (treat as "amount needed" for ranking)
                if ($nearest === null || $groupQtyNeeded < $nearest['amountNeeded']) {
                    $nearest = [
                        'type'               => Scheme::TYPE_GROUP_DISCOUNT_QTY,
                        'amountNeeded'       => $groupQtyNeeded,
                        'minimumAmount'      => null,
                        'qtyNeeded'          => null,
                        'scheme'             => $scheme,
                        'nextSlab'           => $nextSlab,
                        'currentBuyQty'      => null,
                        'currentGroupTotal'  => round($groupTotal, 2),
                        'currentGroupQty'    => round($groupQty, 2),
                        'groupQtyNeeded'     => $groupQtyNeeded,
                        'minimumGroupQty'    => $minimumGroupQty,
                    ];
                }
            }
        }

        if (!$nearest) {
            return null;
        }

        $s      = $nearest['scheme'];
        $type   = $s->type;
        $isBxgy = $type === Scheme::TYPE_BUY_X_GET_Y;

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
            $freeProductData = $fp ? [
                'id'         => $fp->id,
                'name'       => trim(($fvariant->masterProduct->name ?? '') . ' — ' . ($fvariant->sku ?? '')),
                'image'      => $fp->image ?? ($fvariant->masterProduct->image ?? null),
                'unit_price' => (float) ($fp->discounted_price && (float) $fp->discounted_price > 0 ? $fp->discounted_price : $fp->selling_price),
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
            'offer_type'          => $type,
            // BXGY fields
            'amount_needed'       => $isBxgy ? $nearest['amountNeeded'] : ($type === Scheme::TYPE_GROUP_DISCOUNT_PRICE ? $nearest['amountNeeded'] : null),
            'minimum_amount'      => $isBxgy ? $nearest['minimumAmount'] : ($type === Scheme::TYPE_GROUP_DISCOUNT_PRICE ? $nearest['minimumAmount'] : null),
            'buy_qty'             => $isBxgy ? (int) $s->buy_qty  : null,
            'get_qty'             => $isBxgy ? (int) $s->free_qty : null,
            'current_buy_qty'     => $isBxgy ? $nearest['currentBuyQty'] : null,
            'qty_needed'          => $isBxgy ? $nearest['qtyNeeded'] : null,
            'buy_product'         => $buyProductData,
            'free_product'        => $freeProductData,
            // group_discount_price fields
            'current_group_total' => !$isBxgy ? $nearest['currentGroupTotal'] : null,
            // group_discount_qty fields
            'current_group_qty'   => $type === Scheme::TYPE_GROUP_DISCOUNT_QTY ? $nearest['currentGroupQty'] : null,
            'group_qty_needed'    => $type === Scheme::TYPE_GROUP_DISCOUNT_QTY ? $nearest['groupQtyNeeded'] : null,
            'minimum_group_qty'   => $type === Scheme::TYPE_GROUP_DISCOUNT_QTY ? $nearest['minimumGroupQty'] : null,
            // shared group fields
            'next_slab'           => !$isBxgy ? $nextSlabData : null,
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
        $freeQty   = $multiples * (int) $scheme->free_qty;

        $freeProduct = SellerProduct::with('masterProductVariant.masterProduct')
            ->find($scheme->free_seller_product_id);
        if (!$freeProduct || (int) $freeProduct->status !== 1) {
            return null;
        }

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

    private static function evaluateGroupDiscountPrice(Scheme $scheme, array $totalByProduct): ?array
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
            'type'            => Scheme::TYPE_GROUP_DISCOUNT_PRICE,
            'benefit'         => $discount,
            'scheme_discount' => $discount,
            'free_items'      => [],
        ];
    }

    private static function evaluateGroupDiscountQty(Scheme $scheme, array $qtyByProduct, array $totalByProduct): ?array
    {
        $groupIds = $scheme->schemeProducts->pluck('seller_product_id')->all();
        if (empty($groupIds)) {
            return null;
        }

        $groupQty   = 0.0;
        $groupTotal = 0.0;
        foreach ($groupIds as $spId) {
            $groupQty   += $qtyByProduct[(int) $spId]   ?? 0;
            $groupTotal += $totalByProduct[(int) $spId] ?? 0;
        }
        if ($groupQty <= 0) {
            return null;
        }

        // Slab min_value is unit count for this type
        $matched = $scheme->schemeSlabs
            ->where('min_value', '<=', $groupQty)
            ->sortByDesc('min_value')
            ->first();
        if (!$matched) {
            return null;
        }

        // Discount is applied to the ₹ group total
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
            'type'            => Scheme::TYPE_GROUP_DISCOUNT_QTY,
            'benefit'         => $discount,
            'scheme_discount' => $discount,
            'free_items'      => [],
        ];
    }
}
