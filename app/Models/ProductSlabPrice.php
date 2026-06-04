<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductSlabPrice extends Model
{
    protected $table = 'product_slab_prices';

    protected $fillable = [
        'product_variant_id',
        'min_qty',
        'max_qty',
        'price',
    ];

    protected $casts = [
        'min_qty' => 'integer',
        'max_qty' => 'integer',
        'price' => 'float',
    ];

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id', 'id');
    }
}
