<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Order extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;
    public static $activeType = 1;
    public static $previousType = 0;
    protected $casts = [
        'additional_charges' => 'array',
        'cancel_verified_at' => 'datetime',
        'cancel_verified_by' => 'integer',
    ];

    public static $previousTypeStatus = 0;

    public static function boot()
    {
        parent::boot();
        static::deleting(function ($data) { // before delete() method call this
            $data->items()->delete();
        });
    }

    function getActiveStatusNameAttribute()
    {

    }

    /**
     * Language key explaining why this order can't be deleted from the panel, or null when it can.
     * An order that was dispatched, delivered, paid or credited is part of the books — the Tally
     * exports, receipts, trip settlements and credit notes all hang off it — so deleting it would
     * hide it from all of them. Only an order that never left the warehouse and has no money or
     * credit note against it may go (cancel it instead if it was raised by mistake).
     */
    public function deletionBlockReason(): ?string
    {
        $dispatched = [
            OrderStatusList::$outForDelivery,
            OrderStatusList::$delivered,
            OrderStatusList::$returned,
            OrderStatusList::$rescheduled,
            OrderStatusList::$selfPickupPicked,
            OrderStatusList::$partialDelivery,
            OrderStatusList::$notDelivered,
        ];

        if (in_array((int) $this->active_status, $dispatched, true)
            || $this->loading_slip_id
            || OrderPayment::where('order_id', $this->id)->exists()
            || CreditNote::where('order_id', $this->id)->exists()) {
            return 'order_has_history_cannot_delete';
        }

        return null;
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id', 'id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function orderStatus()
    {
        return $this->hasMany(OrderStatus::class, 'order_id', 'id');
    }

    // Relationship: Order belongs to a user subscription (if applicable)
    public function subscription()
    {
        return $this->belongsTo(UserSubscription::class, 'subscription_id', 'id');
    }

    public function setDeliveryBoyBonusDetailsAttribute($value)
    {
        $this->attributes['delivery_boy_bonus_details'] = json_encode($value);
    }

    public function getDeliveryBoyBonusDetailsAttribute($value)
    {
        return json_decode($value, true);
    }

    public function loadingSlip()
    {
        return $this->belongsTo(LoadingSlip::class, 'loading_slip_id');
    }

    public function deliveryBoy()
    {
        return $this->belongsTo(DeliveryBoy::class, 'delivery_boy_id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('Order');
    }
}
