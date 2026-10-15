<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salesman extends Model
{
    use HasFactory, LogsActivity;
    public static $statusActive = 1;
    public static $statusBlocked = 0;

    protected $fillable = [
        'admin_id', 'name', 'mobile', 'email', 'seller_id',
        'brands', 'allow_payment_collection', 'allow_price_edit', 'discount', 'status',
    ];

    protected $casts = [
        'brands' => 'array',
        'allow_payment_collection' => 'boolean',
        'allow_price_edit' => 'boolean',
        'discount' => 'float',
        'status' => 'integer',
    ];

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id', 'id');
    }

    public function seller()
    {
        return $this->belongsTo(Seller::class, 'seller_id', 'id');
    }

    /**
     * True when this salesman appears in the books: orders he placed, payments he collected, or
     * settlements. orders.placed_by_salesman_id has no foreign key, so deleting him would leave
     * those orders reading as "Self - Retailer App Order" in the Tally export, and his settlements
     * cascade away. A salesman with any of it can only be deactivated.
     */
    public function hasHistory(): bool
    {
        return \Illuminate\Support\Facades\DB::table('orders')->where('placed_by_salesman_id', $this->id)->exists()
            || \Illuminate\Support\Facades\DB::table('order_payments')->where('salesman_id', $this->id)->exists()
            || \Illuminate\Support\Facades\DB::table('salesman_settlements')->where('salesman_id', $this->id)->exists()
            || ($this->admin_id && \Illuminate\Support\Facades\DB::table('loading_slips')->where('created_by', $this->admin_id)->exists());
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('Salesman');
    }
}
