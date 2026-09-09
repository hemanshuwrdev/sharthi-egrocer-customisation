<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;

class DriverSettlement extends Model
{
    use LogsActivity;

    protected $fillable = [
        'delivery_boy_id', 'seller_id', 'settlement_date',
        'total_orders', 'total_cash', 'total_upi', 'total_cheque', 'total_signature',
        'status', 'locked_at',
        'cash_received', 'reconciliation_status', 'reconciled_at', 'reconciled_by',
    ];

    protected $casts = [
        'settlement_date'      => 'date',
        'locked_at'            => 'datetime',
        'reconciled_at'        => 'datetime',
        'total_cash'           => 'float',
        'total_upi'            => 'float',
        'total_cheque'         => 'float',
        'total_signature'      => 'float',
        'cash_received'        => 'float',
    ];

    public function deliveryBoy()
    {
        return $this->belongsTo(DeliveryBoy::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('DriverSettlement');
    }
}
