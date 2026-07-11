<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderPayment extends Model
{
    protected $fillable = [
        'order_id', 'delivery_boy_id', 'salesman_id', 'method', 'amount',
        'proof_photo', 'status', 'verified_by', 'verified_at',
    ];

    protected $casts = [
        'amount'      => 'float',
        'verified_at' => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function deliveryBoy()
    {
        return $this->belongsTo(DeliveryBoy::class);
    }
}
