<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DistributorArea extends Model
{
    protected $table = 'distributor_areas';

    protected $fillable = [
        'seller_id',
        'area_id',
    ];

    public function distributor()
    {
        return $this->belongsTo(Seller::class, 'seller_id');
    }

    public function area()
    {
        return $this->belongsTo(Area::class);
    }
}
