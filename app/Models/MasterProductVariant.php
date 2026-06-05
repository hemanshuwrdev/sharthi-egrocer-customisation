<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterProductVariant extends Model
{
    use HasFactory;

    protected $table = 'master_product_variants';

    protected $fillable = [
        'master_product_id',
        'sku',
        'unit_id',
        'secondary_unit_id',
        'secondary_unit_value',
        'weight',
        'image',
        'status',
    ];

    public function masterProduct()
    {
        return $this->belongsTo(MasterProduct::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function secondaryUnit()
    {
        return $this->belongsTo(Unit::class, 'secondary_unit_id');
    }

    public function sellerProducts()
    {
        return $this->hasMany(SellerProduct::class);
    }
}
