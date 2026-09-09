<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdditionalChargeTranslation extends Model
{
    use HasFactory, LogsActivity;
    protected $table = 'additional_charge_translations';

    protected $fillable = [
        'additional_charge_id',
        'language_id',
        'title',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function additionalCharge()
    {
        return $this->belongsTo(AdditionalCharge::class, 'additional_charge_id');
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
            ->useLogName('AdditionalChargeTranslation');
    }
}
