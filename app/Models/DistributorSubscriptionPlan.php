<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DistributorSubscriptionPlan extends Model
{
    use SoftDeletes, LogsActivity;

    protected $fillable = [
        'name',
        'description',
        'duration_type',
        'duration_days',
        'price',
        'discounted_price',
        'tax_type',
        'tax_id',
        'booking_type',
        'booking_limit',
        'commission_enabled',
        'commission_threshold',
        'commission_percentage',
        'publish',
        'status',
    ];

    protected $casts = [
        'commission_enabled' => 'boolean',
        'publish' => 'boolean',
        'status' => 'boolean',
    ];

    public function tax()
    {
        return $this->belongsTo(Tax::class, 'tax_id');
    }

    public function assignments()
    {
        return $this->hasMany(DistributorSubscription::class, 'plan_id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('DistributorSubscriptionPlan');
    }
}
