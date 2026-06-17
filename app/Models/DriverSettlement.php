<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DriverSettlement extends Model
{
    protected $fillable = [
        'delivery_boy_id', 'seller_id', 'settlement_date',
        'total_orders', 'total_cash', 'total_upi', 'total_cheque', 'total_signature',
        'status', 'locked_at',
    ];

    protected $casts = [
        'settlement_date' => 'date',
        'locked_at'       => 'datetime',
        'total_cash'      => 'float',
        'total_upi'       => 'float',
        'total_cheque'    => 'float',
        'total_signature' => 'float',
    ];

    public function deliveryBoy()
    {
        return $this->belongsTo(DeliveryBoy::class);
    }
}
