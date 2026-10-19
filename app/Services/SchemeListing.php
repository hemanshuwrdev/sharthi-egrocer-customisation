<?php

namespace App\Services;

use App\Helpers\CommonHelper;
use App\Models\Scheme;
use App\Models\SellerProduct;
use Carbon\Carbon;
use Closure;

/**
 * Read-only "which offers are running" view of the distributor-owned scheme engine, shaped for the
 * retailer and salesman apps. SchemeEngine decides what a cart earns; this only describes the schemes.
 *
 * Callers decide WHICH distributors' schemes may be shown and pass an $isOrderable predicate saying
 * whether a given seller product can actually be bought by that caller — a scheme nobody can buy into
 * is dropped instead of being advertised.
 */
class SchemeListing
{
    /** Running schemes (status on, today within start..end) of the given distributors, soonest-ending first. */
    public static function runningQuery($sellerIds, ?string $type = null, string $search = '')
    {
        $productChain = 'masterProductVariant.masterProduct';

        return Scheme::active()
            ->whereIn('seller_id', $sellerIds)
            ->with([
                'seller:id,name,store_name,logo',
                'schemeProducts.sellerProduct.' . $productChain,
                'schemeProducts.sellerProduct.masterProductVariant.unit',
                'schemeProducts.sellerProduct.masterProductVariant.secondaryUnit',
                'schemeSlabs',
                'buyProduct.' . $productChain,
                'buyProduct.masterProductVariant.unit',
                'buyProduct.masterProductVariant.secondaryUnit',
                'freeProduct.' . $productChain,
                'freeProduct.masterProductVariant.unit',
                'freeProduct.masterProductVariant.secondaryUnit',
            ])
            ->when($type, fn ($q) => $q->where('type', $type))
            ->when($search !== '', fn ($q) => $q->where('name', 'like', '%' . $search . '%'))
            ->orderBy('end_date')
            ->orderByDesc('id');
    }

    /** Same "is it sellable at all" rules the product feeds apply, before any per-caller visibility rule. */
    public static function isLive(SellerProduct $sp): bool
    {
        $variant = $sp->masterProductVariant;
        $master  = $variant ? $variant->masterProduct : null;

        return $variant && $master
            && (int) $sp->status === 1
            && (int) $variant->status === 1
            && (int) $master->status === 1
            && (float) $sp->selling_price > 0
            && !(SellerProduct::hasFreeOnlyColumn() && $sp->is_free_only);
    }

    /**
     * @param Closure(SellerProduct):bool $isOrderable
     * @return array|null null when nothing in the scheme can be bought by this caller
     */
    public static function format(Scheme $s, Closure $isOrderable): ?array
    {
        $isBxgy = $s->type === Scheme::TYPE_BUY_X_GET_Y;

        $buy = $free = null;
        $products = [];
        $isMultiCombo = false;
        $comboCondition = $comboReward = '';

        if ($isBxgy) {
            // The free item may be a free-only product that is never sold, so only the buy side must be orderable.
            if (!$s->buyProduct || !$s->freeProduct || !$isOrderable($s->buyProduct)) {
                return null;
            }
            $buy = self::product($s->buyProduct) + [
                'qty'       => (float) $s->buy_qty,
                'qty_basis' => $s->buy_qty_basis ?: 'outer',
                'qty_unit'  => self::qtyUnit($s->buyProduct, $s->buy_qty_basis ?: 'outer'),
            ];
            $free = self::product($s->freeProduct) + [
                'qty'       => (float) $s->free_qty,
                'qty_basis' => $s->free_qty_basis ?: 'outer',
                'qty_unit'  => self::qtyUnit($s->freeProduct, $s->free_qty_basis ?: 'outer'),
            ];
        } else {
            $rows = $s->schemeProducts->filter(fn ($p) => $p->sellerProduct && $isOrderable($p->sellerProduct));
            if ($rows->isEmpty()) {
                return null;
            }

            // SchemeEngine treats a multi-product scheme whose rows carry their own conditions as ONE
            // combined basket governed by the first row. Plain slab schemes (rows without conditions) are not combos.
            $hasRowConditions = $s->schemeProducts->contains(fn ($p) => $p->min_qty !== null || $p->discount_type !== null);
            $isMultiCombo     = $hasRowConditions && $s->schemeProducts->count() > 1;

            $products = $rows->map(fn ($p) => self::product($p->sellerProduct) + [
                'qty_basis'      => $p->qty_basis ?: 'inner',
                'min_qty'        => $p->min_qty !== null ? (float) $p->min_qty : null,
                'max_qty'        => $p->max_qty !== null ? (float) $p->max_qty : null,
                'discount_type'  => $p->discount_type,
                'discount_value' => $p->discount_value !== null ? (float) $p->discount_value : null,
                'free_qty'       => $p->free_qty !== null ? (float) $p->free_qty : null,
                'free_qty_basis' => $p->free_qty_basis ?: 'inner',
                // In a combo the condition/reward belongs to the whole basket, not to this product —
                // blank here so the app shows combo_condition / combo_reward instead of a per-product rule.
                'conditions'     => $isMultiCombo ? '' : self::conditions($p, $p->sellerProduct),
                'reward'         => $isMultiCombo ? '' : self::reward($p, $p->sellerProduct),
            ])->values()->all();

            if ($isMultiCombo) {
                $first          = $s->schemeProducts->first();
                $comboCondition = self::conditions($first, null, 'Combined ');
                $comboReward    = self::reward($first, null);
            }
        }

        $seller = $s->seller;

        return [
            'id'              => $s->id,
            'name'            => $s->name,
            'description'     => $s->description ?? '',
            'type'            => $s->type,
            'tax_option'      => $s->tax_option ?? 'inclusive',
            'start_date'      => $s->start_date,
            'end_date'        => $s->end_date,
            'days_left'       => max(0, (int) now()->startOfDay()->diffInDays(Carbon::parse($s->end_date)->startOfDay(), false)),
            'seller'          => [
                'id'         => (int) $s->seller_id,
                'name'       => $seller ? $seller->name : null,
                'store_name' => $seller ? $seller->store_name : null,
                'logo'       => $seller ? CommonHelper::getImage($seller->logo) : '',
            ],
            // buy_x_get_y only (null for the other types)
            'buy'             => $buy,
            'free'            => $free,
            // every other type ([] for buy_x_get_y)
            'is_multi_combo'  => $isMultiCombo,
            'combo_condition' => $comboCondition,
            'combo_reward'    => $comboReward,
            'products'        => $products,
            // Slab threshold meaning: 'amount' = basket value in ₹, 'qty' = basket quantity.
            'slab_basis'      => $isBxgy || $s->schemeSlabs->isEmpty() ? null : ($s->type === Scheme::TYPE_GROUP_DISCOUNT_QTY ? 'qty' : 'amount'),
            'slabs'           => $isBxgy ? [] : $s->schemeSlabs->sortBy('min_value')->map(fn ($sl) => [
                'min_value'      => (float) $sl->min_value,
                'discount_type'  => $sl->discount_type,
                'discount_value' => (float) $sl->discount_value,
                'tax_option'     => $sl->tax_option ?? 'inclusive',
            ])->values()->all(),
        ];
    }

    private static function product(SellerProduct $sp): array
    {
        $variant = $sp->masterProductVariant;
        $master  = $variant ? $variant->masterProduct : null;
        $price   = (float) ($sp->discounted_price && (float) $sp->discounted_price > 0 ? $sp->discounted_price : $sp->selling_price);
        $secVal  = $variant && (float) $variant->secondary_unit_value > 0 ? (float) $variant->secondary_unit_value : null;

        return [
            'seller_product_id'    => $sp->id,
            'product_variant_id'   => $sp->master_product_variant_id,
            'product_id'           => $variant ? $variant->master_product_id : null,
            'name'                 => $master ? $master->name : '',
            'sku'                  => $variant ? ($variant->sku ?? '') : '',
            'image'                => CommonHelper::getImage($variant ? ($variant->image ?: ($master ? $master->image : null)) : null),
            'unit'                 => self::unitLabel($variant ? $variant->unit : null, 'Unit'),
            'secondary_unit'       => self::unitLabel($variant ? $variant->secondaryUnit : null, 'Pack'),
            'secondary_unit_value' => $secVal,
            'price'                => $price,
            'outer_price'          => $secVal ? round($price * $secVal, 2) : $price,
        ];
    }

    private static function unitLabel($unit, string $fallback): string
    {
        return $unit ? ($unit->short_code ?: $unit->name) : $fallback;
    }

    /** "Box"/"Pack" for outer, "Pcs"/"Unit" for inner. With no product (a combo spans several) falls back to generic words. */
    private static function qtyUnit(?SellerProduct $sp, ?string $basis): string
    {
        $variant = $sp ? $sp->masterProductVariant : null;

        return $basis === 'outer'
            ? self::unitLabel($variant ? $variant->secondaryUnit : null, 'Pack')
            : self::unitLabel($variant ? $variant->unit : null, 'Unit');
    }

    private static function conditions($row, ?SellerProduct $sp, string $prefix = ''): string
    {
        $unit  = self::qtyUnit($sp, $row->qty_basis);
        $parts = [];
        if ($row->min_qty !== null) {
            $parts[] = $prefix . 'Min ' . self::num($row->min_qty) . ' ' . $unit;
        }
        if ($row->max_qty !== null) {
            $parts[] = ($parts ? '' : $prefix) . 'Max ' . self::num($row->max_qty) . ' ' . $unit;
        }

        return implode(', ', $parts);
    }

    private static function reward($row, ?SellerProduct $sp): string
    {
        $value = self::num($row->discount_value);
        $free  = self::num($row->free_qty) . ' ' . self::qtyUnit($sp, $row->free_qty_basis);

        return match ($row->discount_type) {
            'percentage'         => "{$value}% off",
            'flat'               => "₹{$value} off",
            'free_product'       => "Get {$free} free",
            'discounted_product' => "Get {$free} @ {$value}% off",
            default              => '',
        };
    }

    /** 10.0000 -> "10", 2.50 -> "2.5" */
    private static function num($value): string
    {
        return rtrim(rtrim(number_format((float) $value, 4, '.', ''), '0'), '.');
    }
}
