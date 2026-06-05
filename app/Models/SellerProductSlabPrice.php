<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SellerProductSlabPrice extends Model
{
    use HasFactory;

    protected $table = 'seller_product_slab_prices';

    protected $fillable = [
        'seller_product_id',
        'min_qty',
        'max_qty',
        'price',
    ];

    public function sellerProduct()
    {
        return $this->belongsTo(SellerProduct::class);
    }
}
