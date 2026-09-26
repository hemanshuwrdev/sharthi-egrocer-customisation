<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;

class CreditNote extends Model
{
    use LogsActivity;

    protected $fillable = [
        'credit_note_no', 'seller_id', 'driver_settlement_id', 'order_id', 'retailer_id',
        'reason_type', 'total_amount', 'generated_at', 'generated_by',
    ];

    protected $casts = [
        'total_amount' => 'float',
        'generated_at' => 'datetime',
    ];

    public function items()
    {
        return $this->hasMany(CreditNoteItem::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function retailer()
    {
        return $this->belongsTo(User::class, 'retailer_id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('CreditNote');
    }
}
