<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RetailerAddressChangeRequest extends Model
{
    protected $table = 'retailer_address_change_requests';

    protected $fillable = [
        'user_id',
        'reason',
        'old_address',
        'old_city_id',
        'old_gps_lat',
        'old_gps_lng',
        'new_address',
        'new_city_id',
        'new_gps_lat',
        'new_gps_lng',
        'status',
        'assigned_salesman_id',
        'verified_lat',
        'verified_lng',
        'storefront_photo',
        'verification_notes',
        'verified_by_salesman_id',
        'verified_at',
        'rejected_reason',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
    ];

    public function retailer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function assignedSalesman()
    {
        return $this->belongsTo(Salesman::class, 'assigned_salesman_id');
    }

    public function verifiedBySalesman()
    {
        return $this->belongsTo(Salesman::class, 'verified_by_salesman_id');
    }

    public function newCity()
    {
        return $this->belongsTo(\App\Models\City::class, 'new_city_id');
    }
}
