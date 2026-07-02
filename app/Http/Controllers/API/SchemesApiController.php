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
        $scheme = Scheme::with(['schemeProducts', 'schemeSlabs'])
            ->where('id', $id)->where('seller_id', $sellerId)->first();
        if (!$scheme) {
            return CommonHelper::responseError('scheme_not_found');
        }

        return CommonHelper::responseWithData([
            'id'                     => $scheme->id,
            'name'                   => $scheme->name,
            'type'                   => $scheme->type,
            'buy_seller_product_id'  => $scheme->buy_seller_product_id,
            'buy_qty'                => $scheme->buy_qty,
            'free_seller_product_id' => $scheme->free_seller_product_id,
            'free_qty'               => $scheme->free_qty,
            'start_date'             => $scheme->start_date,
            'end_date'               => $scheme->end_date,
            'status'                 => $scheme->status,
            'product_ids'            => $scheme->schemeProducts->pluck('seller_product_id'),
            'slabs'                  => $scheme->schemeSlabs->map(fn ($sl) => [
                'min_value'      => $sl->min_value,
                'discount_type'  => $sl->discount_type,
                'discount_value' => $sl->discount_value,
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

        $products = SellerProduct::with('masterProductVariant.masterProduct')
            ->where('seller_id', $sellerId)
            ->where('status', 1)
            ->get()
            ->map(fn ($sp) => [
                'id'    => $sp->id,
                'name'  => trim(($sp->masterProductVariant->masterProduct->name ?? '') . ' — ' . ($sp->masterProductVariant->sku ?? '')),
                'price' => (float) ($sp->discounted_price && (float) $sp->discounted_price > 0 ? $sp->discounted_price : $sp->selling_price),
                'stock' => (float) $sp->stock,
            ])->values();

        return CommonHelper::responseWithData($products);
    }

    private function persist(Request $request, ?Scheme $scheme)
    {
        $sellerId = $this->currentSellerId();
        if (!$sellerId) {
            return CommonHelper::responseError('seller_not_found');
        }

        $rules = [
            'name'       => 'required|string|max:255',
            'type'       => 'required|in:buy_x_get_y,group_discount_price,group_discount_qty',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
            'status'     => 'required|integer|in:0,1',
        ];
        if ($request->type === 'buy_x_get_y') {
            $rules += [
                'buy_seller_product_id'  => 'required|integer|exists:seller_products,id',
                'buy_qty'                => 'required|integer|min:1',
                'free_seller_product_id' => 'required|integer|exists:seller_products,id',
                'free_qty'               => 'required|integer|min:1',
            ];
        } else {
            $rules += [
                'product_ids'            => 'required|array|min:1',
                'product_ids.*'          => 'integer|exists:seller_products,id',
                'slabs'                  => 'required|array|min:1',
                'slabs.*.min_value'      => 'required|numeric|min:1',
                'slabs.*.discount_type'  => 'required|in:percentage,flat',
                'slabs.*.discount_value' => 'required|numeric|min:0.01',
            ];
        }

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        // Every referenced product must belong to this distributor.
        $isBxgy = $request->type === 'buy_x_get_y';
        $referenced = $isBxgy
            ? [(int) $request->buy_seller_product_id, (int) $request->free_seller_product_id]
            : array_map('intval', $request->product_ids);
        $owned = SellerProduct::where('seller_id', $sellerId)->whereIn('id', $referenced)->count();
        if ($owned !== count(array_unique($referenced))) {
            return CommonHelper::responseError('product_not_owned_by_seller');
        }

        try {
            DB::transaction(function () use ($request, $sellerId, &$scheme) {
                $isBxgy = $request->type === 'buy_x_get_y';
                $data = [
                    'seller_id'              => $sellerId,
                    'name'                   => $request->name,
                    'type'                   => $request->type,
                    'buy_seller_product_id'  => $isBxgy ? $request->buy_seller_product_id : null,
                    'buy_qty'                => $isBxgy ? $request->buy_qty : null,
                    'free_seller_product_id' => $isBxgy ? $request->free_seller_product_id : null,
                    'free_qty'               => $isBxgy ? $request->free_qty : null,
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
                    foreach (array_unique(array_map('intval', $request->product_ids)) as $spId) {
                        SchemeProduct::create(['scheme_id' => $scheme->id, 'seller_product_id' => $spId]);
                    }
                    foreach ($request->slabs as $slab) {
                        SchemeSlab::create([
                            'scheme_id'      => $scheme->id,
                            'min_value'      => $slab['min_value'],
                            'discount_type'  => $slab['discount_type'],
                            'discount_value' => $slab['discount_value'],
                        ]);
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

        return [
            'id'         => $s->id,
            'name'       => $s->name,
            'type'       => $s->type,
            'start_date' => $s->start_date,
            'end_date'   => $s->end_date,
            'status'     => $s->status,
            // BXGY fields (null for group types)
            'buy_product'  => $isBxgy ? $productName($s->buyProduct)  : null,
            'buy_qty'      => $isBxgy ? $s->buy_qty                   : null,
            'free_product' => $isBxgy ? $productName($s->freeProduct) : null,
            'free_qty'     => $isBxgy ? $s->free_qty                  : null,
            // Group fields (null for BXGY)
            'products'     => !$isBxgy ? $s->schemeProducts->map(fn ($p) => $productName($p->sellerProduct))->filter()->values() : [],
            'slabs'        => !$isBxgy ? $s->schemeSlabs->map(fn ($sl) => [
                'min_value'      => (float) $sl->min_value,
                'discount_type'  => $sl->discount_type,
                'discount_value' => (float) $sl->discount_value,
            ])->values() : [],
        ];
    }
}
