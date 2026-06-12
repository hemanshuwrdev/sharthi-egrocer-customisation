<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchemeProduct extends Model
{
    use HasFactory;

    protected $table = 'scheme_products';

    protected $fillable = [
        'scheme_id',
        'seller_product_id',
    ];

    public function scheme()
    {
        return $this->belongsTo(Scheme::class);
    }

    public function sellerProduct()
    {
        return $this->belongsTo(SellerProduct::class);
    }
}
