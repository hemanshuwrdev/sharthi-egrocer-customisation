<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Support\Facades\DB;

class WishlistsApiController extends Controller
{
    public function index(){

        $wishlists = Favorite::select(
                'users.name as user_name',
                DB::raw('COALESCE(products.name, master_products.name) as product_name'),
                'sellers.name as seller_name',
                'master_products.id as master_product_id',
                'favorites.*',
                DB::raw("COUNT(*) as 'total_qty'")
            )
            ->leftJoin('users', 'favorites.user_id', '=', 'users.id')
            ->leftJoin('products', 'favorites.product_id', '=', 'products.id')
            ->leftJoin('sellers', 'products.seller_id', '=', 'sellers.id')
            ->leftJoin('master_product_variants', 'favorites.master_product_variant_id', '=', 'master_product_variants.id')
            ->leftJoin('master_products', 'master_product_variants.master_product_id', '=', 'master_products.id')
            ->groupBy('favorites.product_id', 'favorites.master_product_variant_id')
            ->orderBy('favorites.id','DESC')
            ->get();
        return CommonHelper::responseWithData($wishlists);
    }
}
