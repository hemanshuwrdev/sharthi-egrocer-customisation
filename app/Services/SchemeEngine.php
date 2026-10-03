<?php

namespace App\Services;

use App\Models\Scheme;
use App\Models\SchemeSlab;
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

        $qtyByProduct         = [];
        $totalByProduct       = [];
        $actualTotalByProduct = [];
        foreach ($lines as $line) {
            $spId = (int) $line['seller_product_id'];
            $qtyByProduct[$spId]         = ($qtyByProduct[$spId]         ?? 0) + (float) $line['qty'];
            $totalByProduct[$spId]       = ($totalByProduct[$spId]       ?? 0) + (float) $line['line_total'];
            // actual_line_total (pre-tax) is optional — callers that don't pass it fall
            // back to line_total, so an 'exclusive' slab just behaves like 'inclusive'.
            $actualTotalByProduct[$spId] = ($actualTotalByProduct[$spId] ?? 0) + (float) ($line['actual_line_total'] ?? $line['line_total']);
        }

        $schemes = Scheme::active()
            ->where('seller_id', $sellerId)
            ->with([
                'schemeProducts.sellerProduct.masterProductVariant.masterProduct',
                'schemeProducts.sellerProduct.masterProductVariant.unit',
                'schemeProducts.sellerProduct.masterProductVariant.secondaryUnit',
                'schemeSlabs',
            ])
            ->get();

        $best = null;
        foreach ($schemes as $scheme) {
            $hasRowConditions = ($scheme->type === Scheme::TYPE_PRODUCT_CONDITIONS)
                || $scheme->schemeProducts->contains(function ($sp) {
                    return $sp->min_qty !== null || $sp->discount_type !== null;
                });

            if ($hasRowConditions) {
                $result = self::evaluateProductConditionsScheme($scheme, $qtyByProduct, $totalByProduct, $actualTotalByProduct);
            } else {
                $result = match ($scheme->type) {
                    Scheme::TYPE_BUY_X_GET_Y         => self::evaluateBuyXGetY($scheme, $qtyByProduct),
                    Scheme::TYPE_GROUP_DISCOUNT_PRICE => self::evaluateGroupDiscountPrice($scheme, $totalByProduct, $actualTotalByProduct),
                    Scheme::TYPE_GROUP_DISCOUNT_QTY   => self::evaluateGroupDiscountQty($scheme, $qtyByProduct, $totalByProduct, $actualTotalByProduct),
                    default                           => null,
                };
            }

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
                // Only surface if the scheme's buy product is in the cart
                if ($currentQty <= 0) {
                    continue;
                }
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

                // Only surface if at least one group product is in cart
                if ($groupTotal <= 0) {
                    continue;
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

                // Only surface if at least one group product is in cart
                if ($groupQty <= 0) {
                    continue;
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
            } elseif ($scheme->id !== $appliedSchemeId && ($scheme->type === Scheme::TYPE_PRODUCT_CONDITIONS || $scheme->schemeProducts->contains(fn ($sp) => $sp->min_qty !== null))) {
                foreach ($scheme->schemeProducts as $sp) {
                    if (!$sp->min_qty || (float) $sp->min_qty <= 0) {
                        continue;
                    }
                    $spId = (int) $sp->seller_product_id;
                    $cartQty = (float) ($qtyByProduct[$spId] ?? 0);
                    if ($cartQty <= 0) {
                        continue;
                    }

                    $sellerProduct = $sp->sellerProduct;
                    if (!$sellerProduct) {
                        continue;
                    }
                    $variant = $sellerProduct->masterProductVariant;
                    $secVal = ($variant && (float) $variant->secondary_unit_value > 0) ? (float) $variant->secondary_unit_value : 1.0;

                    $effectiveQty = ($sp->qty_basis === 'outer') ? floor($cartQty / $secVal) : $cartQty;
                    $minQty = (float) $sp->min_qty;
                    if ($effectiveQty >= $minQty) {
                        continue;
                    }

                    $qtyNeededInBasis = $minQty - $effectiveQty;
                    $unitsNeeded = ($sp->qty_basis === 'outer') ? ($qtyNeededInBasis * $secVal) : $qtyNeededInBasis;
                    $unitPrice = (float) ($sellerProduct->discounted_price && (float) $sellerProduct->discounted_price > 0
                        ? $sellerProduct->discounted_price
                        : $sellerProduct->selling_price);
                    $amountNeeded = round($unitsNeeded * $unitPrice, 2);

                    if ($nearest === null || $amountNeeded < $nearest['amountNeeded']) {
                        $nearest = [
                            'type'               => 'group_discount',
                            'amountNeeded'       => $amountNeeded,
                            'minimumAmount'      => round($minQty * ($sp->qty_basis === 'outer' ? $secVal * $unitPrice : $unitPrice), 2),
                            'qtyNeeded'          => (int) ceil($qtyNeededInBasis),
                            'scheme'             => $scheme,
                            'nextSlab'           => null,
                            'currentBuyQty'      => $effectiveQty,
                            'currentGroupTotal'  => null,
                            'currentGroupQty'    => null,
                            'groupQtyNeeded'     => null,
                            'minimumGroupQty'    => null,
                        ];
                    }
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
                'id'         => $variant ? $variant->master_product_id : $bp->id,
                'name'       => trim(($variant->masterProduct->name ?? '') . ' — ' . ($variant->sku ?? '')),
                'image'      => $bp->image ?? ($variant->masterProduct->image ?? null),
                'unit_price' => $uprice,
            ] : null;

            $fp      = $s->freeProduct;
            $fvariant = $fp ? $fp->masterProductVariant : null;
            $freeProductData = $fp ? [
                'id'         => $fvariant ? $fvariant->master_product_id : $fp->id,
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
                    'id'         => $variant->master_product_id,
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
            'tax_option'     => $nearest['nextSlab']->tax_option ?? 'inclusive',
        ] : null;

        return [
            'id'                  => $s->id,
            'name'                => $s->name,
            'offer_type'          => $type,
            // BXGY / Group fields
            'amount_needed'       => $nearest['amountNeeded'] ?? null,
            'minimum_amount'      => $nearest['minimumAmount'] ?? null,
            'buy_qty'             => $isBxgy ? (int) $s->buy_qty  : null,
            'get_qty'             => $isBxgy ? (int) $s->free_qty : null,
            'current_buy_qty'     => $nearest['currentBuyQty'] ?? null,
            'qty_needed'          => $nearest['qtyNeeded'] ?? null,
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
                'tax_option'     => $sl->tax_option ?? 'inclusive',
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

    private static function evaluateGroupDiscountPrice(Scheme $scheme, array $totalByProduct, array $actualTotalByProduct = []): ?array
    {
        $groupIds = $scheme->schemeProducts->pluck('seller_product_id')->all();
        if (empty($groupIds)) {
            return null;
        }

        $groupTotal = 0.0;
        $groupActualTotal = 0.0;
        foreach ($groupIds as $spId) {
            $groupTotal += $totalByProduct[(int) $spId] ?? 0;
            $groupActualTotal += $actualTotalByProduct[(int) $spId] ?? ($totalByProduct[(int) $spId] ?? 0);
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

        $discount = self::computeSlabDiscount($matched, $groupTotal, $groupActualTotal);

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

    private static function evaluateGroupDiscountQty(Scheme $scheme, array $qtyByProduct, array $totalByProduct, array $actualTotalByProduct = []): ?array
    {
        $groupIds = $scheme->schemeProducts->pluck('seller_product_id')->all();
        if (empty($groupIds)) {
            return null;
        }

        $groupQty   = 0.0;
        $groupTotal = 0.0;
        $groupActualTotal = 0.0;
        foreach ($groupIds as $spId) {
            $groupQty   += $qtyByProduct[(int) $spId]   ?? 0;
            $groupTotal += $totalByProduct[(int) $spId] ?? 0;
            $groupActualTotal += $actualTotalByProduct[(int) $spId] ?? ($totalByProduct[(int) $spId] ?? 0);
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
        $discount = self::computeSlabDiscount($matched, $groupTotal, $groupActualTotal);

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

    /**
     * Resolve a matched slab's discount_value/discount_type/tax_option into the actual
     * ₹ amount to subtract from the (tax-inclusive) group total.
     *
     * tax_option = 'inclusive' (default): discount_value is a pre-tax figure — it comes
     *   off the Net Taxable Amount first, and tax is effectively recomputed on that
     *   smaller base (GST-style "discount before tax").
     *   - percentage: computed on the group's pre-tax (actual) total, not the inclusive
     *     total.
     *   - flat: grossed up by the group's own average tax rate before being subtracted
     *     from the inclusive total, since removing ₹X pre-tax also removes the tax that
     *     would've applied to that ₹X.
     * tax_option = 'exclusive': discount_value applies directly to the Total Amt
     *   (already tax-inclusive) — tax itself is unaffected.
     */
    private static function computeSlabDiscount(SchemeSlab $matched, float $groupTotal, float $groupActualTotal): float
    {
        $isPreTax = ($matched->tax_option ?? 'inclusive') === 'inclusive';

        if ($matched->discount_type === 'percentage') {
            $base = $isPreTax ? $groupActualTotal : $groupTotal;
            $discount = round($base * (float) $matched->discount_value / 100, 2);
        } else {
            $discount = (float) $matched->discount_value;
            if ($isPreTax && $groupActualTotal > 0) {
                $avgTaxPercent = ($groupTotal - $groupActualTotal) / $groupActualTotal * 100;
                $discount = round($discount * (1 + $avgTaxPercent / 100), 2);
            }
        }

        return min($discount, $groupTotal);
    }

    private static function evaluateProductConditionsScheme(Scheme $scheme, array $qtyByProduct, array $totalByProduct, array $actualTotalByProduct = []): ?array
    {
        $schemeDiscount = 0.0;
        $freeItems      = [];
        $hasAnyMatch    = false;

        $isPreTax = ($scheme->tax_option ?? 'inclusive') === 'inclusive';

        foreach ($scheme->schemeProducts as $sp) {
            $spId = (int) $sp->seller_product_id;
            $cartQty = (float) ($qtyByProduct[$spId] ?? 0);
            if ($cartQty <= 0) {
                continue;
            }

            $sellerProduct = $sp->sellerProduct;
            if (!$sellerProduct || (int) $sellerProduct->status !== 1) {
                continue;
            }

            $variant = $sellerProduct->masterProductVariant;
            $secVal  = ($variant && (float) $variant->secondary_unit_value > 0) ? (float) $variant->secondary_unit_value : 1.0;

            // Check trigger basis (outer vs inner)
            $effectiveQty = ($sp->qty_basis === 'outer')
                ? floor($cartQty / $secVal)
                : $cartQty;

            $minQty = (float) ($sp->min_qty ?? 0);
            if ($minQty > 0 && $effectiveQty < $minQty) {
                continue;
            }

            $maxQty = $sp->max_qty !== null ? (float) $sp->max_qty : null;
            if ($maxQty !== null && $maxQty > 0 && $effectiveQty > $maxQty) {
                $effectiveQty = $maxQty;
            }

            $hasAnyMatch = true;
            $lineTotal   = (float) ($totalByProduct[$spId] ?? 0);
            $actualLine  = (float) ($actualTotalByProduct[$spId] ?? $lineTotal);

            $cappedUnits = ($sp->qty_basis === 'outer') ? ($effectiveQty * $secVal) : $effectiveQty;
            $eligibleRatio = ($cartQty > 0) ? min(1.0, $cappedUnits / $cartQty) : 1.0;

            $unitPrice = (float) ($sellerProduct->discounted_price && (float) $sellerProduct->discounted_price > 0
                ? $sellerProduct->discounted_price
                : $sellerProduct->selling_price);

            $discType = $sp->discount_type ?: 'percentage';

            if ($discType === 'percentage') {
                $base = ($isPreTax ? $actualLine : $lineTotal) * $eligibleRatio;
                $pct = (float) ($sp->discount_value ?? 0);
                if ($pct > 0) {
                    $rowDisc = round($base * min($pct, 100) / 100, 2);
                    $schemeDiscount += min($rowDisc, $lineTotal);
                }
            } elseif ($discType === 'flat') {
                $flat = (float) ($sp->discount_value ?? 0);
                if ($flat > 0) {
                    if ($isPreTax && $actualLine > 0 && $lineTotal > $actualLine) {
                        $avgTaxPct = ($lineTotal - $actualLine) / $actualLine * 100;
                        $flat = round($flat * (1 + $avgTaxPct / 100), 2);
                    }
                    $schemeDiscount += min($flat, $lineTotal);
                }
            } elseif ($discType === 'free_product') {
                $rawFree = (float) ($sp->free_qty ?? 1);
                $freeUnits = ($sp->free_qty_basis === 'outer')
                    ? ($rawFree * $secVal)
                    : $rawFree;

                if ($freeUnits > 0) {
                    if ((float) $sellerProduct->stock >= $freeUnits + $cartQty) {
                        $freeItems[] = [
                            'seller_product_id'         => $sellerProduct->id,
                            'master_product_variant_id' => $variant->id ?? null,
                            'qty'                       => (int) $freeUnits,
                            'product_name'              => $variant->masterProduct->name ?? '',
                            'variant_name'              => $variant->sku ?? '',
                            'unit_value'                => $unitPrice,
                        ];
                    }
                }
            } elseif ($discType === 'discounted_product') {
                $discUnits = (float) ($sp->free_qty ?? 1);
                $freeUnitCount = ($sp->free_qty_basis === 'outer')
                    ? ($discUnits * $secVal)
                    : $discUnits;

                $pct = (float) ($sp->discount_value ?? 0);
                if ($pct > 0 && $freeUnitCount > 0) {
                    $discountedAmount = round($freeUnitCount * $unitPrice * min($pct, 100) / 100, 2);
                    $schemeDiscount += min($discountedAmount, $lineTotal);
                }
            }
        }

        if (!$hasAnyMatch) {
            return null;
        }

        $freeBenefit = 0.0;
        foreach ($freeItems as $fi) {
            $freeBenefit += (float) $fi['qty'] * (float) $fi['unit_value'];
        }

        $totalBenefit = $schemeDiscount + $freeBenefit;
        if ($totalBenefit <= 0) {
            return null;
        }

        return [
            'scheme_id'       => $scheme->id,
            'name'            => $scheme->name,
            'type'            => $scheme->type,
            'benefit'         => $totalBenefit,
            'scheme_discount' => $schemeDiscount,
            'free_items'      => $freeItems,
        ];
    }
}
