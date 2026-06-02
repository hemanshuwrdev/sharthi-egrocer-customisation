<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BrandDistributorMapping extends Model
{
    use HasFactory;

    protected $table = 'brand_distributor_mappings';

    protected $fillable = [
        'brand_id',
        'seller_id',
        'city_id',
    ];

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function distributor()
    {
        return $this->belongsTo(Seller::class, 'seller_id');
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }
}
