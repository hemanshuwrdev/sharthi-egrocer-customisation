<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Scheme;
use App\Models\SchemeProduct;
use App\Models\SchemeSlab;
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

        $query = Scheme::with(['schemeProducts.sellerProduct.masterProductVariant.masterProduct', 'schemeSlabs', 'buyProduct.masterProductVariant.masterProduct', 'freeProduct.masterProductVariant.masterProduct'])
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
        $scheme = Scheme::with([
            'schemeProducts.sellerProduct.masterProductVariant.masterProduct',
            'schemeProducts.sellerProduct.masterProductVariant.unit',
            'schemeProducts.sellerProduct.masterProductVariant.secondaryUnit',
            'schemeSlabs',
        ])
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
            'slabs'                  => $scheme->schemeSlabs->map(fn ($sl) => [
                'min_value'      => $sl->min_value,
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
            'type'        => 'required|string',
            'description' => 'nullable|string',
            'tax_option'  => 'nullable|in:inclusive,exclusive',
            'start_date'  => 'required|date',
            'end_date'    => 'required|date|after_or_equal:start_date',
            'status'      => 'required|integer|in:0,1',
        ];

        $isBxgy = $request->type === 'buy_x_get_y';

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

        $productsInput = $request->input('products');
        if (is_string($productsInput)) {
            $productsInput = json_decode($productsInput, true);
        }

        if (!$isBxgy) {
            if ((!is_array($productsInput) || count($productsInput) === 0) && !$request->filled('product_ids')) {
                return CommonHelper::responseError('Please select at least one product.');
            }
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
        }

        try {
            DB::transaction(function () use ($request, $sellerId, $isBxgy, $productsInput, &$scheme) {
                $data = [
                    'seller_id'              => $sellerId,
                    'name'                   => $request->name,
                    'description'            => $request->description,
                    'type'                   => $request->type,
                    'tax_option'             => $request->tax_option ?? 'inclusive',
                    'buy_seller_product_id'  => $isBxgy ? $request->buy_seller_product_id : null,
                    'buy_qty'                => $isBxgy ? $request->buy_qty : null,
                    'buy_qty_basis'          => $isBxgy ? ($request->buy_qty_basis ?: 'outer') : null,
                    'free_seller_product_id' => $isBxgy ? $request->free_seller_product_id : null,
                    'free_qty'               => $isBxgy ? $request->free_qty : null,
                    'free_qty_basis'         => $isBxgy ? ($request->free_qty_basis ?: 'outer') : null,
                    'start_date'             => $request->start_date,
                    'end_date'               => $request->end_date,
                    'status'                 => $request->status,
                ];

                if ($scheme) {
                    $scheme->update($data);
                    $scheme->schemeProducts()->delete();
                    $scheme->schemeSlabs()->delete();
                } else {
                    $scheme = Scheme::create($data);
                }

                if (!$isBxgy) {
                    if (is_array($productsInput) && count($productsInput) > 0) {
                        foreach ($productsInput as $p) {
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

                    if ($request->filled('slabs') && is_array($request->slabs)) {
                        foreach ($request->slabs as $slab) {
                            SchemeSlab::create([
                                'scheme_id'      => $scheme->id,
                                'min_value'      => $slab['min_value'],
                                'discount_type'  => $slab['discount_type'],
                                'discount_value' => $slab['discount_value'],
                                'tax_option'     => $slab['tax_option'] ?? 'inclusive',
                            ]);
                        }
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
            'slabs'           => !$isBxgy ? $s->schemeSlabs->map(fn ($sl) => [
                'min_value'      => (float) $sl->min_value,
                'discount_type'  => $sl->discount_type,
                'discount_value' => (float) $sl->discount_value,
                'tax_option'     => $sl->tax_option ?? 'inclusive',
            ])->values() : [],
        ];
    }
}
