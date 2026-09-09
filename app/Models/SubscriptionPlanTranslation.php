<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPlanTranslation extends Model
{
    use HasFactory, LogsActivity;
        protected $fillable = [
        'subscription_plan_id',
        'language_id',
        'name',
    ];
        protected $table = 'subscription_plan_translations';
    protected $hidden = ['updated_at', 'created_at'];
    public $timestamps = false;

public function plan()
{
    return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id');
}

    public function language()
    {
        return $this->belongsTo(Language::class, 'language_id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('SubscriptionPlanTranslation');
    }
}
