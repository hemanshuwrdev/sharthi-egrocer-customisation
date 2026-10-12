<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;

class OrderPayment extends Model
{
    use LogsActivity;

    protected $fillable = [
        'order_id', 'delivery_boy_id', 'salesman_id', 'method', 'amount', 'received_amount',
        'proof_photo', 'status', 'verified_by', 'verified_at', 'cheque_date', 'cheque_number',
    ];

    protected $casts = [
        'amount'          => 'float',
        'received_amount' => 'float',
        'verified_at'     => 'datetime',
        'cheque_date'     => 'date',
    ];

    /**
     * "upi" is the stored method value (enum, reports, exports), but every app shows and sends "bank".
     * appMethod() maps stored -> app, storedMethod() maps what an app sent -> stored.
     */
    public static function appMethod(?string $method): ?string
    {
        return $method === 'upi' ? 'bank' : $method;
    }

    public static function storedMethod(?string $method): ?string
    {
        return $method === 'bank' ? 'upi' : $method;
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function deliveryBoy()
    {
        return $this->belongsTo(DeliveryBoy::class);
    }

    public function salesman()
    {
        return $this->belongsTo(Salesman::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('OrderPayment');
    }
}
