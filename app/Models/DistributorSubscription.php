<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;

class DistributorSubscription extends Model
{
    use LogsActivity;

    protected $fillable = [
        'seller_id',
        'plan_id',
        'plan_name',
        'start_date',
        'end_date',
        'status',
        'assigned_by',
    ];

    public function seller()
    {
        return $this->belongsTo(Seller::class, 'seller_id');
    }

    public function plan()
    {
        return $this->belongsTo(DistributorSubscriptionPlan::class, 'plan_id');
    }

    public function assignedBy()
    {
        return $this->belongsTo(Admin::class, 'assigned_by');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('DistributorSubscription');
    }
}
