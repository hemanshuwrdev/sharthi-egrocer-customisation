<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RetailerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'shop_name', 'party_name', 'gst_no',
        'address', 'city_id', 'gps_lat', 'gps_lng',
        'verified_lat', 'verified_lng', 'storefront_photo', 'verification_notes',
        'verified_at', 'verified_by_salesman_id',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
        'gps_lat' => 'float',
        'gps_lng' => 'float',
        'verified_lat' => 'float',
        'verified_lng' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function verifiedBy()
    {
        return $this->belongsTo(Salesman::class, 'verified_by_salesman_id', 'id');
    }
}
