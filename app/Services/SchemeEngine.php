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

                $currentQty = (float) ($qtyByProduct[(int) $scheme->buy_seller_product_id] ?? 0);
                // Only surface if the scheme's buy product is in the cart
                if ($currentQty <= 0) {
                    continue;
                }

                $buyProduct = $scheme->buyProduct;
                if (!$buyProduct) {
                    continue;
                }

                $buyVariant = $buyProduct->masterProductVariant;
                $buySecVal = ($buyVariant && (float) $buyVariant->secondary_unit_value > 0) ? (float) $buyVariant->secondary_unit_value : 1.0;
                $buyBasis = $scheme->buy_qty_basis ?: 'inner';

                $effectiveCartQty = ($buyBasis === 'outer') ? floor($currentQty / $buySecVal) : $currentQty;
                $rawQtyNeeded = (float) $scheme->buy_qty - $effectiveCartQty;
                if ($rawQtyNeeded <= 0) {
                    continue;
                }

                $unitPrice = (float) ($buyProduct->discounted_price && (float) $buyProduct->discounted_price > 0
                    ? $buyProduct->discounted_price
                    : $buyProduct->selling_price);
                if ($unitPrice <= 0) {
                    continue;
                }

                $qtyNeededInBasis = (int) ceil($rawQtyNeeded);
                $unitsNeeded = ($buyBasis === 'outer') ? ($qtyNeededInBasis * $buySecVal) : $qtyNeededInBasis;
                $amountNeeded = round($unitsNeeded * $unitPrice, 2);
                $minimumAmount = round(($buyBasis === 'outer' ? (float) $scheme->buy_qty * $buySecVal : (float) $scheme->buy_qty) * $unitPrice, 2);

                if ($nearest === null || $amountNeeded < $nearest['amountNeeded']) {
                    $nearest = [
                        'type'               => Scheme::TYPE_BUY_X_GET_Y,
                        'amountNeeded'       => $amountNeeded,
                        'minimumAmount'      => $minimumAmount,
                        'qtyNeeded'          => $qtyNeededInBasis,
                        'scheme'             => $scheme,
                        'nextSlab'           => null,
                        'currentBuyQty'      => $effectiveCartQty,
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
                if ($scheme->schemeProducts->count() > 1) {
                    $firstSp = $scheme->schemeProducts->first();
                    $minQty = (float) ($firstSp->min_qty ?? 0);
                    if ($minQty > 0) {
                        $combinedEffective = 0.0;
                        $hasAnyInCart = false;
                        $sampleUnitPrice = 0.0;
                        $sampleSecVal = 1.0;

                        foreach ($scheme->schemeProducts as $sp) {
                            $spId = (int) $sp->seller_product_id;
                            $cQty = (float) ($qtyByProduct[$spId] ?? 0);
                            if ($cQty > 0) {
                                $hasAnyInCart = true;
                            }
                            $sellerProduct = $sp->sellerProduct;
                            $variant = $sellerProduct?->masterProductVariant;
                            $secVal = ($variant && (float) $variant->secondary_unit_value > 0) ? (float) $variant->secondary_unit_value : 1.0;
                            $eff = ($sp->qty_basis === 'outer') ? floor($cQty / $secVal) : $cQty;
                            $combinedEffective += $eff;

                            if ($sampleUnitPrice <= 0 && $sellerProduct) {
                                $sampleUnitPrice = (float) ($sellerProduct->discounted_price && (float) $sellerProduct->discounted_price > 0 ? $sellerProduct->discounted_price : $sellerProduct->selling_price);
                                $sampleSecVal = $secVal;
                            }
                        }

                        if ($hasAnyInCart && $combinedEffective < $minQty) {
                            $qtyNeededInBasis = $minQty - $combinedEffective;
                            $unitsNeeded = ($firstSp->qty_basis === 'outer') ? ($qtyNeededInBasis * $sampleSecVal) : $qtyNeededInBasis;
                            $amountNeeded = round($unitsNeeded * $sampleUnitPrice, 2);

                            if ($nearest === null || $amountNeeded < $nearest['amountNeeded']) {
                                $nearest = [
                                    'type'               => 'group_discount',
                                    'amountNeeded'       => $amountNeeded,
                                    'minimumAmount'      => round($minQty * ($firstSp->qty_basis === 'outer' ? $sampleSecVal * $sampleUnitPrice : $sampleUnitPrice), 2),
                                    'qtyNeeded'          => (int) ceil($qtyNeededInBasis),
                                    'scheme'             => $scheme,
                                    'nextSlab'           => null,
                                    'currentBuyQty'      => $combinedEffective,
                                    'currentGroupTotal'  => null,
                                    'currentGroupQty'    => null,
                                    'groupQtyNeeded'     => null,
                                    'minimumGroupQty'    => null,
                                ];
                            }
                        }
                    }
                } else {
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

        $cartQty = (float) ($qtyByProduct[(int) $scheme->buy_seller_product_id] ?? 0);
        if ($cartQty <= 0) {
            return null;
        }

        $buyProduct = SellerProduct::with('masterProductVariant')->find($scheme->buy_seller_product_id);
        $buyVariant = $buyProduct?->masterProductVariant;
        $buySecVal = ($buyVariant && (float) $buyVariant->secondary_unit_value > 0) ? (float) $buyVariant->secondary_unit_value : 1.0;

        $buyBasis = $scheme->buy_qty_basis ?: 'inner';
        $effectiveBuyCartQty = ($buyBasis === 'outer') ? floor($cartQty / $buySecVal) : $cartQty;

        if ($effectiveBuyCartQty < (float) $scheme->buy_qty) {
            return null;
        }

        $multiples = (int) floor($effectiveBuyCartQty / (float) $scheme->buy_qty);

        $freeProduct = SellerProduct::with('masterProductVariant.masterProduct')
            ->find($scheme->free_seller_product_id);
        if (!$freeProduct || (int) $freeProduct->status !== 1) {
            return null;
        }

        $freeVariant = $freeProduct->masterProductVariant;
        $freeSecVal = ($freeVariant && (float) $freeVariant->secondary_unit_value > 0) ? (float) $freeVariant->secondary_unit_value : 1.0;

        $freeBasis = $scheme->free_qty_basis ?: 'inner';
        $freeUnitsPerMultiple = ($freeBasis === 'outer') ? ((float) $scheme->free_qty * $freeSecVal) : (float) $scheme->free_qty;
        $totalFreeUnits = (int) ($multiples * $freeUnitsPerMultiple);

        $alreadyInCart = (float) ($qtyByProduct[(int) $freeProduct->id] ?? 0);
        if ((float) $freeProduct->stock < $totalFreeUnits + $alreadyInCart) {
            return null;
        }

        $unitValue = $freeProduct->discounted_price && (float) $freeProduct->discounted_price > 0
            ? (float) $freeProduct->discounted_price
            : (float) $freeProduct->selling_price;

        return [
            'scheme_id'       => $scheme->id,
            'name'            => $scheme->name,
            'type'            => Scheme::TYPE_BUY_X_GET_Y,
            'benefit'         => $totalFreeUnits * $unitValue,
            'scheme_discount' => 0.0,
            'free_items'      => [[
                'seller_product_id'         => $freeProduct->id,
                'master_product_variant_id' => $freeVariant->id ?? null,
                'qty'                       => $totalFreeUnits,
                'product_name'              => $freeVariant->masterProduct->name ?? '',
                'variant_name'              => $freeVariant->sku ?? '',
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
            'tax_option'      => $matched->tax_option ?? 'inclusive',
            'scheme_discount_pretax' => self::slabPretaxPortion($matched, $discount, $groupTotal, $groupActualTotal),
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
            'tax_option'      => $matched->tax_option ?? 'inclusive',
            'scheme_discount_pretax' => self::slabPretaxPortion($matched, $discount, $groupTotal, $groupActualTotal),
            'free_items'      => [],
        ];
    }

    /**
     * A flat discount's effect on the tax-inclusive total, plus the before-tax part of it.
     *
     * 'inclusive' (pre-tax): $flat is measured before tax, so the total drops by $flat plus
     *   the tax that would have been charged on it — grossed up by the group's own average
     *   tax rate. e.g. flat ₹105 on 5% GST lines: total drops ₹110.25, of which ₹105 is the
     *   before-tax part (Net Taxable) and ₹5.25 is tax no longer charged.
     * 'exclusive': $flat comes straight off the total; there is no before-tax part.
     * Both are capped at what the lines are actually worth ($lineTotal).
     *
     * Every flat path (single product, multi-product, slab) goes through here so the option
     * can't be honoured in one and silently ignored in another.
     *
     * @return array{0: float, 1: float} [₹ off the total, before-tax part of that]
     */
    private static function flatDiscount(float $flat, float $lineTotal, float $actualTotal, bool $isPreTax): array
    {
        $gross = $flat;
        if ($isPreTax && $actualTotal > 0 && $lineTotal > $actualTotal) {
            $avgTaxPct = ($lineTotal - $actualTotal) / $actualTotal * 100;
            $gross = round($flat * (1 + $avgTaxPct / 100), 2);
        }
        $off = min($gross, $lineTotal);
        $pretax = 0.0;
        if ($isPreTax && $gross > 0) {
            $pretax = $off >= $gross ? $flat : round($flat * $off / $gross, 2);
        }

        return [$off, $pretax];
    }

    /**
     * Before-tax part of a slab discount, for invoice display. Only a flat 'inclusive' slab
     * has one — a percentage slab isn't grossed up (see computeSlabDiscount), so it can't be
     * shown as a before-tax deduction without misstating what was actually taken off.
     */
    private static function slabPretaxPortion(SchemeSlab $matched, float $discount, float $groupTotal, float $groupActualTotal): ?float
    {
        if (($matched->tax_option ?? 'inclusive') !== 'inclusive' || $matched->discount_type === 'percentage') {
            return null;
        }
        $flat = (float) $matched->discount_value;
        if ($flat <= 0 || $discount <= 0) {
            return null;
        }
        [, $pretax] = self::flatDiscount($flat, $groupTotal, $groupActualTotal, true);

        return $pretax > 0 ? $pretax : null;
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
            [$discount] = self::flatDiscount((float) $matched->discount_value, $groupTotal, $groupActualTotal, $isPreTax);
        }

        return min($discount, $groupTotal);
    }

    private static function evaluateProductConditionsScheme(Scheme $scheme, array $qtyByProduct, array $totalByProduct, array $actualTotalByProduct = []): ?array
    {
        $schemeDiscount = 0.0;
        $freeItems      = [];
        $hasAnyMatch    = false;

        $isPreTax = ($scheme->tax_option ?? 'inclusive') === 'inclusive';
        $isMultiProduct = $scheme->schemeProducts->count() > 1;

        // Split of the ₹ discount for invoice display: what came off as a before-tax flat
        // amount vs everything else (percentage / discounted_product). The invoice can only
        // show a before-tax breakdown when the whole discount is the former.
        $pretaxPart = 0.0;
        $otherPart  = 0.0;

        if ($isMultiProduct) {
            // Multi-product scheme: combined quantity condition across all products in the scheme
            $firstSp = $scheme->schemeProducts->first();
            $minQty = (float) ($firstSp->min_qty ?? 0);
            $maxQty = $firstSp->max_qty !== null ? (float) $firstSp->max_qty : null;
            $discType = $firstSp->discount_type ?: 'percentage';
            $discVal = (float) ($firstSp->discount_value ?? 0);
            $freeQty = (float) ($firstSp->free_qty ?? 1);
            $freeQtyBasis = $firstSp->free_qty_basis ?: 'inner';

            $combinedEffectiveQty = 0.0;
            $matchingLines = [];
            $totalGroupSpend = 0.0;

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

                $effectiveQty = ($sp->qty_basis === 'outer')
                    ? floor($cartQty / $secVal)
                    : $cartQty;

                if ($effectiveQty <= 0) {
                    continue;
                }

                $combinedEffectiveQty += $effectiveQty;
                $lineTotal   = (float) ($totalByProduct[$spId] ?? 0);
                $actualLine  = (float) ($actualTotalByProduct[$spId] ?? $lineTotal);
                $totalGroupSpend += $lineTotal;

                $matchingLines[] = [
                    'sp'            => $sp,
                    'sellerProduct' => $sellerProduct,
                    'variant'       => $variant,
                    'cartQty'       => $cartQty,
                    'effectiveQty'  => $effectiveQty,
                    'secVal'        => $secVal,
                    'lineTotal'     => $lineTotal,
                    'actualLine'    => $actualLine,
                ];
            }

            if ($minQty > 0 && $combinedEffectiveQty < $minQty) {
                return null;
            }

            if (empty($matchingLines) || $combinedEffectiveQty <= 0) {
                return null;
            }

            $hasAnyMatch = true;
            $eligibleRatio = 1.0;
            if ($maxQty !== null && $maxQty > 0 && $combinedEffectiveQty > $maxQty) {
                $eligibleRatio = min(1.0, $maxQty / $combinedEffectiveQty);
            }

            if ($discType === 'percentage') {
                foreach ($matchingLines as $line) {
                    $base = ($isPreTax ? $line['actualLine'] : $line['lineTotal']) * $eligibleRatio;
                    if ($discVal > 0) {
                        $rowDisc = round($base * min($discVal, 100) / 100, 2);
                        $piece = min($rowDisc, $line['lineTotal']);
                        $schemeDiscount += $piece;
                        $otherPart += $piece;
                    }
                }
            } elseif ($discType === 'flat') {
                $flat = $discVal;
                if ($flat > 0) {
                    // Same rule as a single product's flat discount — this branch used to take
                    // $flat straight off the total whatever the option, so an 'inclusive'
                    // (before-tax) multi-product scheme under-discounted by the tax.
                    $groupActual = array_sum(array_column($matchingLines, 'actualLine'));
                    [$off, $pre] = self::flatDiscount($flat, $totalGroupSpend, $groupActual, $isPreTax);
                    $schemeDiscount += $off;
                    if ($isPreTax) {
                        $pretaxPart += $pre;
                    } else {
                        $otherPart += $off;
                    }
                }
            } elseif ($discType === 'free_product') {
                $freeSellerProduct = $firstSp->sellerProduct;
                $freeVariant = $freeSellerProduct?->masterProductVariant;
                $freeSecVal = ($freeVariant && (float) $freeVariant->secondary_unit_value > 0) ? (float) $freeVariant->secondary_unit_value : 1.0;
                $freeUnits = ($freeQtyBasis === 'outer') ? ($freeQty * $freeSecVal) : $freeQty;
                if ($freeUnits > 0 && $freeSellerProduct) {
                    $unitPrice = (float) ($freeSellerProduct->discounted_price && (float) $freeSellerProduct->discounted_price > 0
                        ? $freeSellerProduct->discounted_price
                        : $freeSellerProduct->selling_price);

                    if ((float) $freeSellerProduct->stock >= $freeUnits) {
                        $freeItems[] = [
                            'seller_product_id'         => $freeSellerProduct->id,
                            'master_product_variant_id' => $freeVariant->id ?? null,
                            'qty'                       => (int) $freeUnits,
                            'product_name'              => $freeVariant->masterProduct->name ?? '',
                            'variant_name'              => $freeVariant->sku ?? '',
                            'unit_value'                => $unitPrice,
                        ];
                    }
                }
            } elseif ($discType === 'discounted_product') {
                $firstLine = $matchingLines[0];
                $discUnits = (float) ($firstSp->free_qty ?? 1);
                $freeUnitCount = ($firstSp->free_qty_basis === 'outer')
                    ? ($discUnits * $firstLine['secVal'])
                    : $discUnits;
                $unitPrice = (float) ($firstLine['sellerProduct']->discounted_price && (float) $firstLine['sellerProduct']->discounted_price > 0
                    ? $firstLine['sellerProduct']->discounted_price
                    : $firstLine['sellerProduct']->selling_price);

                if ($discVal > 0 && $freeUnitCount > 0) {
                    $discountedAmount = round($freeUnitCount * $unitPrice * min($discVal, 100) / 100, 2);
                    $piece = min($discountedAmount, $totalGroupSpend);
                    $schemeDiscount += $piece;
                    $otherPart += $piece;
                }
            }
        } else {
            // Single product row scheme — evaluate each product row independently (existing logic)
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
                        $piece = min($rowDisc, $lineTotal);
                        $schemeDiscount += $piece;
                        $otherPart += $piece;
                    }
                } elseif ($discType === 'flat') {
                    $flat = (float) ($sp->discount_value ?? 0);
                    if ($flat > 0) {
                        [$off, $pre] = self::flatDiscount($flat, $lineTotal, $actualLine, $isPreTax);
                        $schemeDiscount += $off;
                        if ($isPreTax) {
                            $pretaxPart += $pre;
                        } else {
                            $otherPart += $off;
                        }
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
                        $piece = min($discountedAmount, $lineTotal);
                        $schemeDiscount += $piece;
                        $otherPart += $piece;
                    }
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
            'tax_option'      => $scheme->tax_option ?? 'inclusive',
            // Before-tax part of scheme_discount — set only when the whole discount is a
            // flat 'inclusive' one, so the invoice can show it as a deduction from Net
            // Taxable (and the tax saved = scheme_discount - this). Otherwise null.
            'scheme_discount_pretax' => ($isPreTax && $pretaxPart > 0 && $otherPart <= 0) ? round($pretaxPart, 2) : null,
            'free_items'      => $freeItems,
        ];
    }
}
