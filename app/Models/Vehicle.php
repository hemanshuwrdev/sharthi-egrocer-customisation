<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory, LogsActivity;
    protected $fillable = [
        'seller_id',
        'name',
        'vehicle_number',
        'capacity',
        'status',
    ];

    public function loadingSlips()
    {
        return $this->hasMany(LoadingSlip::class);
    }

    public function seller()
    {
        return $this->belongsTo(Seller::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('Vehicle');
    }
}
