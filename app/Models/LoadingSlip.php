<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoadingSlip extends Model
{
    use HasFactory;

    protected $fillable = [
        'slip_no',
        'vehicle_id',
        'driver_id',
        'status',
        'total_weight',
        'total_items',
        'total_orders',
        'created_by',
        'cash_received',
        'reconciliation_status',
        'reconciled_at',
        'reconciled_by',
    ];

    protected $casts = [
        'cash_received' => 'float',
        'reconciled_at' => 'datetime',
    ];

    protected $appends = ['status_text'];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function driver()
    {
        return $this->belongsTo(DeliveryBoy::class, 'driver_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'loading_slip_id');
    }

    public function creator()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function getStatusTextAttribute()
    {
        switch ($this->status) {
            case 0:
                return 'Created';
            case 1:
                return 'Dispatched';
            case 2:
                return 'Completed';
            case 3:
                return 'Cancelled';
            default:
                return 'Unknown';
        }
    }
}
