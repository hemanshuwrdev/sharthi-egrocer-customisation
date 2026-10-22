<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Scheme;
use App\Models\SchemeProduct;
use App\Models\SchemeSlab;
use App\Models\SchemeTier;
use App\Models\SellerProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SchemesApiController extends Controller
{
    private function currentSellerId(): int
    {
        return (int) (auth()->user()->seller->id ?? 0);
    }

    public function getSchemes(Request $request)
    {
        $sellerId = $this->currentSellerId();
        if (!$sellerId) {
            return CommonHelper::responseError('seller_not_found');
        }

        $query = Scheme::with(array_merge(['schemeProducts.sellerProduct.masterProductVariant.masterProduct', 'schemeSlabs', 'buyProduct.masterProductVariant.masterProduct', 'freeProduct.masterProductVariant.masterProduct'], SchemeTier::tableExists() ? ['schemeTiers'] : []))
            ->where('seller_id', $sellerId)
            ->orderBy('id', 'DESC');

        if ($request->filled('filter')) {
            $query->where('name', 'like', '%' . $request->filter . '%');
        }

        $schemes = $query->get()->map(function ($s) {
            return self::formatScheme($s);
        });

        return CommonHelper::responseWithData($schemes, $schemes->count());
    }

    public function edit($id)
    {
        $sellerId = $this->currentSellerId();
        $scheme = Scheme::with(array_merge([
            'schemeProducts.sellerProduct.masterProductVariant.masterProduct',
            'schemeProducts.sellerProduct.masterProductVariant.unit',
            'schemeProducts.sellerProduct.masterProductVariant.secondaryUnit',
            'schemeSlabs',
        ], SchemeTier::tableExists() ? ['schemeTiers'] : []))
            ->where('id', $id)->where('seller_id', $sellerId)->first();
        if (!$scheme) {
            return CommonHelper::responseError('scheme_not_found');
        }

        return CommonHelper::responseWithData([
            'id'                     => $scheme->id,
            'name'                   => $scheme->name,
            'description'            => $scheme->description,
            'type'                   => $scheme->type,
            'tax_option'             => $scheme->tax_option ?? 'inclusive',
            // Cart Value Discount counting the whole cart (no products selected).
            'applies_to_all'         => (bool) $scheme->applies_to_all,
            'buy_seller_product_id'  => $scheme->buy_seller_product_id,
            'buy_qty'                => $scheme->buy_qty,
            'buy_qty_basis'          => $scheme->buy_qty_basis ?: 'outer',
            'free_seller_product_id' => $scheme->free_seller_product_id,
            'free_qty'               => $scheme->free_qty,
            'free_qty_basis'         => $scheme->free_qty_basis ?: 'outer',
            'start_date'             => $scheme->start_date,
            'end_date'               => $scheme->end_date,
            'status'                 => $scheme->status,
            'products'               => $scheme->schemeProducts->map(function ($sp) {
                $sellerProd = $sp->sellerProduct;
                $mv = $sellerProd ? $sellerProd->masterProductVariant : null;
                $mp = $mv ? $mv->masterProduct : null;
                $rawImg = $mv ? ($mv->image ?: ($mp ? $mp->image : null)) : null;
                $price = (float) ($sellerProd && $sellerProd->discounted_price && (float) $sellerProd->discounted_price > 0 ? $sellerProd->discounted_price : ($sellerProd->selling_price ?? 0));
                $secVal = $mv && $mv->secondary_unit_value > 0 ? (float) $mv->secondary_unit_value : null;

                return [
                    'id'                   => $sellerProd ? $sellerProd->id : $sp->seller_product_id,
                    'seller_product_id'    => $sp->seller_product_id,
                    'name'                 => $mp ? $mp->name : '',
                    'sku'                  => $mv ? ($mv->sku ?? '') : '',
                    'image'                => $rawImg ? CommonHelper::getImage($rawImg) : '',
                    'uom'                  => $mv && $mv->unit ? ($mv->unit->short_code ?: $mv->unit->name) : 'Unit',
                    'secondary_unit'       => $mv && $mv->secondaryUnit ? ($mv->secondaryUnit->short_code ?: $mv->secondaryUnit->name) : 'Pack',
                    'secondary_unit_value' => $secVal,
                    'price'                => $price,
                    'outer_price'          => $secVal ? round($price * $secVal, 2) : $price,
                    'qty_basis'            => $sp->qty_basis ?: 'inner',
                    'min_qty'              => $sp->min_qty !== null ? (float) $sp->min_qty : null,
                    'max_qty'              => $sp->max_qty !== null ? (float) $sp->max_qty : null,
                    'discount_type'        => $sp->discount_type ?: 'percentage',
                    'discount_value'       => $sp->discount_value !== null ? (float) $sp->discount_value : null,
                    'free_qty'             => $sp->free_qty !== null ? (float) $sp->free_qty : 1,
                    'free_qty_basis'       => $sp->free_qty_basis ?: 'inner',
                ];
            })->values(),
            'product_ids'            => $scheme->schemeProducts->pluck('seller_product_id'),
            // Quantity tiers, lowest first — only for a scheme with 2+ (empty = the plain min/max/discount on
            // `products`). Tier 1 is also what `products` carries, so clients that don't know tiers still work.
            'tiers'                  => $scheme->isTiered() ? $scheme->schemeTiers->map(fn ($t) => [
                'min_qty'        => (float) $t->min_qty,
                'max_qty'        => $t->max_qty !== null ? (float) $t->max_qty : null,
                'discount_value' => $t->discount_value !== null ? (float) $t->discount_value : null,
                'free_qty'       => $t->free_qty !== null ? (float) $t->free_qty : null,
            ])->values() : [],
            'slabs'                  => $scheme->schemeSlabs->sortBy('min_value')->map(fn ($sl) => [
                'min_value'      => $sl->min_value,
                'max_value'      => $sl->max_value,
                'discount_type'  => $sl->discount_type,
                'discount_value' => $sl->discount_value,
                'tax_option'     => $sl->tax_option ?? 'inclusive',
            ])->values(),
        ]);
    }

    public function save(Request $request)
    {
        return $this->persist($request, null);
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), ['id' => 'required|integer']);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $scheme = Scheme::where('id', $request->id)->where('seller_id', $this->currentSellerId())->first();
        if (!$scheme) {
            return CommonHelper::responseError('scheme_not_found');
        }

        return $this->persist($request, $scheme);
    }

    public function delete(Request $request)
    {
        $scheme = Scheme::where('id', $request->id)->where('seller_id', $this->currentSellerId())->first();
        if (!$scheme) {
            return CommonHelper::responseError('scheme_not_found');
        }
        $scheme->delete();

        return CommonHelper::responseSuccess(__('scheme_deleted_successfully'));
    }

    /**
     * Light product picker for the scheme form: the seller's activated products.
     */
    public function getSellerProducts()
    {
        $sellerId = $this->currentSellerId();
        if (!$sellerId) {
            return CommonHelper::responseError('seller_not_found');
        }

        $products = SellerProduct::with([
            'masterProductVariant.masterProduct',
            'masterProductVariant.unit',
            'masterProductVariant.secondaryUnit',
        ])
            ->where('seller_id', $sellerId)
            ->where('status', 1)
            ->get()
            ->map(function ($sp) {
                $mv = $sp->masterProductVariant;
                $mp = $mv ? $mv->masterProduct : null;
                $price = (float) ($sp->discounted_price && (float) $sp->discounted_price > 0 ? $sp->discounted_price : $sp->selling_price);
                $secVal = $mv && $mv->secondary_unit_value > 0 ? (float) $mv->secondary_unit_value : null;
                $rawImg = $mv ? ($mv->image ?: ($mp ? $mp->image : null)) : null;

                return [
                    'id'                   => $sp->id,
                    'name'                 => $mp ? $mp->name : '',
                    'full_name'            => trim(($mp->name ?? '') . ' — ' . ($mv->sku ?? '')),
                    'sku'                  => $mv ? ($mv->sku ?? '') : '',
                    'image'                => $rawImg ? CommonHelper::getImage($rawImg) : '',
                    'uom'                  => $mv && $mv->unit ? ($mv->unit->short_code ?: $mv->unit->name) : 'Unit',
                    'secondary_unit'       => $mv && $mv->secondaryUnit ? ($mv->secondaryUnit->short_code ?: $mv->secondaryUnit->name) : 'Pack',
                    'secondary_unit_value' => $secVal,
                    'price'                => $price,
                    'outer_price'          => $secVal ? round($price * $secVal, 2) : $price,
                    'stock'                => (float) $sp->stock,
                    // Free-item-only products are offered as a scheme's free product but not as a
                    // buy / group product (they can't be purchased, so can never trigger a scheme).
                    'is_free_only'         => (bool) ($sp->is_free_only ?? false),
                ];
            })->values();

        return CommonHelper::responseWithData($products);
    }

    private function persist(Request $request, ?Scheme $scheme)
    {
        $sellerId = $this->currentSellerId();
        if (!$sellerId) {
            return CommonHelper::responseError('seller_not_found');
        }

        $rules = [
            'name'        => 'required|string|max:255',
            'type'        => 'required|in:buy_x_get_y,group_discount,group_discount_price,group_discount_qty,product_conditions',
            'description' => 'nullable|string',
            'tax_option'  => 'nullable|in:inclusive,exclusive',
            // Cart Value Discount only (type group_discount_price): count the whole cart, not selected products.
            'applies_to_all' => 'nullable|boolean',
            'start_date'  => 'required|date',
            'end_date'    => 'required|date|after_or_equal:start_date',
            'status'      => 'required|integer|in:0,1',
        ];

        $isBxgy = $request->type === 'buy_x_get_y';

        // Slab-based types (older app builds) carry no per-product conditions, so the slabs
        // are the whole offer — without them the scheme saves but can never apply.
        if (in_array($request->type, [Scheme::TYPE_GROUP_DISCOUNT_PRICE, Scheme::TYPE_GROUP_DISCOUNT_QTY], true)) {
            $rules += [
                'slabs'                  => 'required|array|min:1',
                'slabs.*.min_value'      => 'required|numeric|min:1',
                'slabs.*.max_value'      => 'nullable|numeric|min:0.01',
                'slabs.*.discount_type'  => 'required|in:percentage,flat',
                'slabs.*.discount_value' => 'required|numeric|min:0.01',
                'slabs.*.tax_option'     => 'nullable|in:inclusive,exclusive',
            ];
        }

        if ($isBxgy) {
            $rules += [
                'buy_seller_product_id'  => 'required|integer|exists:seller_products,id',
                'buy_qty'                => 'required|integer|min:1',
                'buy_qty_basis'          => 'nullable|in:inner,outer',
                'free_seller_product_id' => 'required|integer|exists:seller_products,id',
                'free_qty'               => 'required|integer|min:1',
                'free_qty_basis'         => 'nullable|in:inner,outer',
            ];
        }

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        // Cart Value Discount: the value counted is the whole cart (no products), and each tier may carry an
        // upper end. Older clients send neither, so their slabs stay open-ended exactly as before.
        $isPriceSlabs = $request->type === Scheme::TYPE_GROUP_DISCOUNT_PRICE;
        $appliesToAll = $isPriceSlabs && $request->boolean('applies_to_all');
        $slabRows     = $request->filled('slabs') && is_array($request->slabs) ? array_values($request->slabs) : [];
        $hasTierEnds  = collect($slabRows)->contains(fn ($s) => isset($s['max_value']) && $s['max_value'] !== '' && $s['max_value'] !== null);
        if ($isPriceSlabs && ($appliesToAll || $hasTierEnds)) {
            if (!Scheme::cartValueColumnsExist()) {
                return CommonHelper::responseError('Cart Value Discount is not available yet — the database update (php artisan migrate) has not been run.');
            }
            [$slabRows, $slabError] = self::normaliseValueSlabs($slabRows, $request->tax_option ?? 'inclusive');
            if ($slabError) {
                return CommonHelper::responseError($slabError);
            }
        }
        if ($appliesToAll) {
            // No products of its own: ignore any that were sent.
            $request->merge(['products' => [], 'product_ids' => []]);
        }

        $productsInput = $request->input('products');
        if (is_string($productsInput)) {
            $productsInput = json_decode($productsInput, true);
        }

        if (!$isBxgy && !$appliesToAll) {
            if ((!is_array($productsInput) || count($productsInput) === 0) && !$request->filled('product_ids')) {
                return CommonHelper::responseError('Please select at least one product.');
            }

            // An update that only sends product_ids / slabs would delete and rebuild the
            // scheme's rows without their min/max qty, basis and discount, silently turning an
            // advanced scheme into one that never applies. Refuse instead of corrupting it.
            $sendsRowConditions = is_array($productsInput) && count($productsInput) > 0;
            if ($scheme && !$sendsRowConditions && $scheme->schemeProducts()
                    ->where(fn ($q) => $q->whereNotNull('min_qty')->orWhereNotNull('discount_type'))
                    ->exists()) {
                return CommonHelper::responseError('This scheme uses quantity conditions this app version cannot edit. Please edit it from the web panel.');
            }
        }

        // Quantity tiers (2+). Fewer than two is just the plain rule on the product rows.
        $tiers = [];
        $tiersInput = $request->input('tiers');
        if (is_string($tiersInput)) {
            $tiersInput = json_decode($tiersInput, true);
        }
        if (!$isBxgy && is_array($tiersInput) && count($tiersInput) > 1) {
            if (!SchemeTier::tableExists()) {
                return CommonHelper::responseError('Quantity tiers are not available yet — the database update (php artisan migrate) has not been run.');
            }
            if (!is_array($productsInput) || count($productsInput) === 0) {
                return CommonHelper::responseError('Please select at least one product.');
            }
            [$tiers, $tierError] = self::normaliseTiers($tiersInput, $productsInput[0]['discount_type'] ?? 'percentage');
            if ($tierError) {
                return CommonHelper::responseError($tierError);
            }
        }

        // A client that predates tiers sends no `tiers` at all; saving its copy of a tiered scheme would
        // silently drop every tier but the first. Refuse instead of corrupting it.
        if ($scheme && !$isBxgy && !$request->has('tiers') && $scheme->isTiered()) {
            return CommonHelper::responseError('This scheme has quantity tiers this app version cannot edit. Please edit it from the web panel.');
        }

        // Percentage discount cannot exceed 100%
        if (is_array($productsInput)) {
            foreach ($productsInput as $p) {
                $dt = $p['discount_type'] ?? null;
                if (($dt === 'percentage' || $dt === 'discounted_product') && (float) ($p['discount_value'] ?? 0) > 100) {
                    return CommonHelper::responseError('percentage_discount_cannot_exceed_100');
                }
            }
        }
        if ($request->type !== 'buy_x_get_y' && is_array($request->slabs)) {
            foreach ($request->slabs as $slab) {
                if (($slab['discount_type'] ?? null) === 'percentage' && (float) ($slab['discount_value'] ?? 0) > 100) {
                    return CommonHelper::responseError('percentage_discount_cannot_exceed_100');
                }
            }
        }

        // Every referenced product must belong to this distributor.
        if ($isBxgy) {
            $referenced = [(int) $request->buy_seller_product_id, (int) $request->free_seller_product_id];
        } elseif (is_array($productsInput) && count($productsInput) > 0) {
            $referenced = array_map(fn ($p) => (int) ($p['seller_product_id'] ?? $p['id'] ?? 0), $productsInput);
        } elseif ($request->filled('product_ids')) {
            $referenced = array_map('intval', (array) $request->product_ids);
        } else {
            $referenced = [];
        }

        $referenced = array_filter(array_unique($referenced));
        if (!empty($referenced)) {
            $owned = SellerProduct::where('seller_id', $sellerId)->whereIn('id', $referenced)->count();
            if ($owned !== count($referenced)) {
                return CommonHelper::responseError('product_not_owned_by_seller');
            }

            // A free-item-only product can't be bought, so it can never trigger a scheme. The web
            // form hides them from the buy / group pickers; enforce it here for clients that don't.
            // (As the BXGY *free* product it is fine.)
            $triggerIds = $isBxgy ? [(int) $request->buy_seller_product_id] : $referenced;
            if (SellerProduct::hasFreeOnlyColumn()
                && SellerProduct::whereIn('id', $triggerIds)->where('is_free_only', 1)->exists()) {
                return CommonHelper::responseError('A free-item-only product cannot be used as a buy or group product.');
            }
        }

        try {
            DB::transaction(function () use ($request, $sellerId, $isBxgy, $productsInput, $tiers, $appliesToAll, $slabRows, &$scheme) {
                $data = [
                    'seller_id'              => $sellerId,
                    'name'                   => $request->name,
                    'description'            => $request->description,
                    'type'                   => $request->type,
                    'tax_option'             => $request->tax_option ?? 'inclusive',
                    'buy_seller_product_id'  => $isBxgy ? $request->buy_seller_product_id : null,
                    'buy_qty'                => $isBxgy ? $request->buy_qty : null,
                    // Basis omitted = a client that predates it, whose quantities were always units
                    // ('inner'). On update keep what is stored rather than flipping it. The web form
                    // always sends an explicit basis, so it is unaffected.
                    'buy_qty_basis'          => $isBxgy ? ($request->buy_qty_basis ?: ($scheme?->buy_qty_basis ?: 'inner')) : null,
                    'free_seller_product_id' => $isBxgy ? $request->free_seller_product_id : null,
                    'free_qty'               => $isBxgy ? $request->free_qty : null,
                    'free_qty_basis'         => $isBxgy ? ($request->free_qty_basis ?: ($scheme?->free_qty_basis ?: 'inner')) : null,
                    'start_date'             => $request->start_date,
                    'end_date'               => $request->end_date,
                    'status'                 => $request->status,
                ];
                if (Scheme::cartValueColumnsExist()) {
                    $data['applies_to_all'] = $appliesToAll;
                }

                if ($scheme) {
                    $scheme->update($data);
                    $scheme->schemeProducts()->delete();
                    $scheme->schemeSlabs()->delete();
                    if (SchemeTier::tableExists()) {
                        $scheme->schemeTiers()->delete();
                    }
                } else {
                    $scheme = Scheme::create($data);
                }

                if (!$isBxgy) {
                    if (is_array($productsInput) && count($productsInput) > 0) {
                        foreach ($productsInput as $p) {
                            // Tiered: the product rows carry tier 1 (the lowest range), whatever the client sent.
                            if (!empty($tiers)) {
                                $p['min_qty']        = $tiers[0]['min_qty'];
                                $p['max_qty']        = $tiers[0]['max_qty'];
                                $p['discount_value'] = $tiers[0]['discount_value'];
                                $p['free_qty']       = $tiers[0]['free_qty'] ?? ($p['free_qty'] ?? null);
                            }
                            $spId = (int) ($p['seller_product_id'] ?? $p['id'] ?? 0);
                            if ($spId > 0) {
                                SchemeProduct::create([
                                    'scheme_id'         => $scheme->id,
                                    'seller_product_id' => $spId,
                                    'qty_basis'         => in_array($p['qty_basis'] ?? '', ['inner', 'outer']) ? $p['qty_basis'] : 'inner',
                                    'min_qty'           => isset($p['min_qty']) && $p['min_qty'] !== '' ? (float) $p['min_qty'] : null,
                                    'max_qty'           => isset($p['max_qty']) && $p['max_qty'] !== '' ? (float) $p['max_qty'] : null,
                                    'discount_type'     => $p['discount_type'] ?? 'percentage',
                                    'discount_value'    => isset($p['discount_value']) && $p['discount_value'] !== '' ? (float) $p['discount_value'] : null,
                                    'free_qty'          => isset($p['free_qty']) && $p['free_qty'] !== '' ? (float) $p['free_qty'] : null,
                                    'free_qty_basis'    => in_array($p['free_qty_basis'] ?? '', ['inner', 'outer']) ? $p['free_qty_basis'] : 'inner',
                                ]);
                            }
                        }
                    } elseif ($request->filled('product_ids')) {
                        foreach (array_unique(array_map('intval', (array) $request->product_ids)) as $spId) {
                            SchemeProduct::create(['scheme_id' => $scheme->id, 'seller_product_id' => $spId]);
                        }
                    }

                    foreach ($tiers as $tier) {
                        SchemeTier::create(['scheme_id' => $scheme->id] + $tier);
                    }

                    foreach ($slabRows as $slab) {
                        SchemeSlab::create([
                            'scheme_id'      => $scheme->id,
                            'min_value'      => $slab['min_value'],
                            'discount_type'  => $slab['discount_type'],
                            'discount_value' => $slab['discount_value'],
                            'tax_option'     => $slab['tax_option'] ?? 'inclusive',
                        ] + (Scheme::cartValueColumnsExist()
                            ? ['max_value' => isset($slab['max_value']) && $slab['max_value'] !== '' ? $slab['max_value'] : null]
                            : []));
                    }
                }
            });
        } catch (\Throwable $e) {
            return CommonHelper::responseError($e->getMessage());
        }

        return CommonHelper::responseWithData([
            'id'      => $scheme->id,
            'message' => __('scheme_saved_successfully'),
        ]);
    }

    /**
     * Clean, sorted tiers of a Cart Value Discount, or [[], error]. A tier runs From..To (both inclusive, in ₹
     * including GST); only the last may leave To blank (no upper limit), and tiers must not overlap. A cart
     * value between two tiers — or above the last To — simply gets no discount.
     *
     * @return array{0: array, 1: ?string}
     */
    private static function normaliseValueSlabs(array $input, string $defaultTaxOption): array
    {
        $slabs = [];
        foreach (array_values($input) as $i => $s) {
            $n   = $i + 1;
            $min = isset($s['min_value']) && $s['min_value'] !== '' ? (float) $s['min_value'] : 0.0;
            $max = isset($s['max_value']) && $s['max_value'] !== '' ? (float) $s['max_value'] : null;
            if ($min <= 0) {
                return [[], "Tier {$n}: please enter a valid From amount."];
            }
            if ($max !== null && $max < $min) {
                return [[], "Tier {$n}: To amount cannot be less than From amount."];
            }
            $slabs[] = [
                'min_value'      => $min,
                'max_value'      => $max,
                'discount_type'  => $s['discount_type'],
                'discount_value' => (float) $s['discount_value'],
                'tax_option'     => $s['tax_option'] ?? $defaultTaxOption,
            ];
        }

        usort($slabs, fn ($a, $b) => $a['min_value'] <=> $b['min_value']);

        $last = count($slabs) - 1;
        foreach ($slabs as $i => $s) {
            $n = $i + 1;
            if ($i < $last && $s['max_value'] === null) {
                return [[], "Tier {$n}: To amount is required - only the last tier can have no upper limit."];
            }
            if ($i > 0 && $s['min_value'] <= $slabs[$i - 1]['max_value']) {
                return [[], "Tier {$n}: From amount must be more than Tier " . $i . "'s To amount."];
            }
        }

        return [$slabs, null];
    }

    /**
     * Clean, sorted tiers from the request, or [null, error]. Every tier needs a Min and an amount; the Max
     * may be blank only on the last tier (no upper limit), and ranges must not overlap. The amount is what
     * the scheme's discount type measures: free quantity for Free Product, otherwise the % / ₹ value.
     *
     * @return array{0: array, 1: ?string}
     */
    private static function normaliseTiers(array $input, string $discountType): array
    {
        $isFree = $discountType === 'free_product';
        $tiers  = [];

        foreach (array_values($input) as $i => $t) {
            $n   = $i + 1;
            $min = isset($t['min_qty']) && $t['min_qty'] !== '' ? (float) $t['min_qty'] : 0.0;
            $max = isset($t['max_qty']) && $t['max_qty'] !== '' ? (float) $t['max_qty'] : null;
            if ($min <= 0) {
                return [[], "Tier {$n}: please enter a valid Min Quantity."];
            }
            if ($max !== null && $max < $min) {
                return [[], "Tier {$n}: Max Quantity cannot be less than Min Quantity."];
            }

            $value = isset($t['discount_value']) && $t['discount_value'] !== '' ? (float) $t['discount_value'] : null;
            $free  = isset($t['free_qty']) && $t['free_qty'] !== '' ? (float) $t['free_qty'] : null;
            if ($isFree) {
                if ($free === null || $free < 1) {
                    return [[], "Tier {$n}: please enter the free quantity."];
                }
                $value = null;
            } else {
                if ($value === null || $value <= 0) {
                    return [[], "Tier {$n}: please enter the discount amount."];
                }
                if (in_array($discountType, ['percentage', 'discounted_product'], true) && $value > 100) {
                    return [[], 'percentage_discount_cannot_exceed_100'];
                }
                $free = null;
            }

            $tiers[] = ['min_qty' => $min, 'max_qty' => $max, 'discount_value' => $value, 'free_qty' => $free];
        }

        usort($tiers, fn ($a, $b) => $a['min_qty'] <=> $b['min_qty']);

        $last = count($tiers) - 1;
        foreach ($tiers as $i => $t) {
            if ($i === $last) {
                break;
            }
            $n = $i + 1;
            if ($t['max_qty'] === null) {
                return [[], "Tier {$n}: Max Quantity is required — only the last tier can have no upper limit."];
            }
            if ($tiers[$i + 1]['min_qty'] <= $t['max_qty']) {
                return [[], 'Tier ' . ($n + 1) . ": Min Quantity must be more than Tier {$n}'s Max Quantity."];
            }
        }

        return [$tiers, null];
    }

    /** Reward wording for a discount type — "₹321 off", "10% off", "Get 1 outer free". */
    private static function rewardText(?string $type, $discountValue, $freeQty, ?string $freeBasis): string
    {
        return match ($type) {
            'percentage'         => "{$discountValue}% off",
            'flat'               => "₹{$discountValue} off",
            'free_product'       => "Get {$freeQty} {$freeBasis} free",
            'discounted_product' => "Get {$freeQty} {$freeBasis} @ {$discountValue}% off",
            default              => '',
        };
    }

    /** One line per tier for the scheme list — empty unless the scheme has 2+ tiers. */
    private static function tierLines(Scheme $s, bool $combined): array
    {
        if (!$s->isTiered()) {
            return [];
        }

        $first = $s->schemeProducts->first();
        if (!$first) {
            return [];
        }

        return $s->schemeTiers->map(function ($t) use ($first, $combined) {
            $cond = [($combined ? 'Combined ≥ ' : '≥ ') . (float) $t->min_qty . ' ' . $first->qty_basis];
            if ($t->max_qty !== null) {
                $cond[] = '≤ ' . (float) $t->max_qty . ' ' . $first->qty_basis;
            }

            return [
                'min_qty'    => (float) $t->min_qty,
                'max_qty'    => $t->max_qty !== null ? (float) $t->max_qty : null,
                'conditions' => implode(', ', $cond),
                'reward'     => self::rewardText(
                    $first->discount_type,
                    $t->discount_value !== null ? (float) $t->discount_value : $first->discount_value,
                    $t->free_qty !== null ? (float) $t->free_qty : $first->free_qty,
                    $first->free_qty_basis
                ),
            ];
        })->values()->all();
    }

    private static function formatScheme(Scheme $s): array
    {
        $productName = fn ($sp) => $sp
            ? trim(($sp->masterProductVariant->masterProduct->name ?? '') . ' — ' . ($sp->masterProductVariant->sku ?? ''))
            : null;

        $isBxgy = $s->type === Scheme::TYPE_BUY_X_GET_Y;

        $productsDetail = [];
        if (!$isBxgy) {
            $productsDetail = $s->schemeProducts->map(function ($p) use ($productName) {
                $name = $productName($p->sellerProduct);
                if (!$name) {
                    return null;
                }
                $cond = [];
                if ($p->min_qty !== null) {
                    $cond[] = "≥ {$p->min_qty} {$p->qty_basis}";
                }
                if ($p->max_qty !== null) {
                    $cond[] = "≤ {$p->max_qty} {$p->qty_basis}";
                }
                $reward = '';
                if ($p->discount_type === 'percentage') {
                    $reward = "{$p->discount_value}% off";
                } elseif ($p->discount_type === 'flat') {
                    $reward = "₹{$p->discount_value} off";
                } elseif ($p->discount_type === 'free_product') {
                    $reward = "Get {$p->free_qty} {$p->free_qty_basis} free";
                } elseif ($p->discount_type === 'discounted_product') {
                    $reward = "Get {$p->free_qty} {$p->free_qty_basis} @ {$p->discount_value}% off";
                }
                return [
                    'product'    => $name,
                    'conditions' => implode(', ', $cond),
                    'reward'     => $reward,
                    'summary'    => trim($name . ($cond ? ' (' . implode(', ', $cond) . ')' : '') . ($reward ? ' → ' . $reward : '')),
                ];
            })->filter()->values();
        }

        $isMultiCombo = !$isBxgy && $s->schemeProducts->count() > 1;
        $comboCondition = '';
        $comboReward = '';
        if ($isMultiCombo) {
            $firstSp = $s->schemeProducts->first();
            $cond = [];
            if ($firstSp->min_qty !== null) {
                $cond[] = "Combined ≥ {$firstSp->min_qty} {$firstSp->qty_basis}";
            }
            if ($firstSp->max_qty !== null) {
                $cond[] = "≤ {$firstSp->max_qty} {$firstSp->qty_basis}";
            }
            $comboCondition = implode(', ', $cond);
            if ($firstSp->discount_type === 'percentage') {
                $comboReward = "{$firstSp->discount_value}% off";
            } elseif ($firstSp->discount_type === 'flat') {
                $comboReward = "₹{$firstSp->discount_value} off";
            } elseif ($firstSp->discount_type === 'free_product') {
                $comboReward = "Get {$firstSp->free_qty} {$firstSp->free_qty_basis} free";
            } elseif ($firstSp->discount_type === 'discounted_product') {
                $comboReward = "Get {$firstSp->free_qty} {$firstSp->free_qty_basis} @ {$firstSp->discount_value}% off";
            }
        }

        return [
            'id'              => $s->id,
            'name'            => $s->name,
            'description'     => $s->description,
            'type'            => $s->type,
            'tax_option'      => $s->tax_option ?? 'inclusive',
            'start_date'      => $s->start_date,
            'end_date'        => $s->end_date,
            'status'          => $s->status,
            'is_multi_combo'  => $isMultiCombo,
            'combo_condition' => $comboCondition,
            'combo_reward'    => $comboReward,
            // Every quantity tier, lowest first; empty unless the scheme has 2+ (then the fields above and
            // `products_detail` show tier 1 only).
            'tiers'           => !$isBxgy ? self::tierLines($s, $isMultiCombo) : [],
            // BXGY fields (null for group types)
            'buy_product'     => $isBxgy ? $productName($s->buyProduct)  : null,
            'buy_qty'         => $isBxgy ? $s->buy_qty                   : null,
            'buy_qty_basis'   => $isBxgy ? ($s->buy_qty_basis ?: 'outer') : null,
            'free_product'    => $isBxgy ? $productName($s->freeProduct) : null,
            'free_qty'        => $isBxgy ? $s->free_qty                  : null,
            'free_qty_basis'  => $isBxgy ? ($s->free_qty_basis ?: 'outer') : null,
            // Group fields (null for BXGY)
            'products'        => !$isBxgy ? $s->schemeProducts->map(fn ($p) => $productName($p->sellerProduct))->filter()->values() : [],
            'products_detail' => $productsDetail,
            'applies_to_all'  => (bool) $s->applies_to_all,
            'slabs'           => !$isBxgy ? $s->schemeSlabs->sortBy('min_value')->map(fn ($sl) => [
                'min_value'      => (float) $sl->min_value,
                'max_value'      => $sl->max_value !== null ? (float) $sl->max_value : null,
                'discount_type'  => $sl->discount_type,
                'discount_value' => (float) $sl->discount_value,
                'tax_option'     => $sl->tax_option ?? 'inclusive',
            ])->values() : [],
        ];
    }
}
