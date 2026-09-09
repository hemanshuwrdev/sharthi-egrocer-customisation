<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CityTranslation extends Model
{
      use HasFactory, LogsActivity;
    protected $table = 'city_translations';

    protected $fillable = [
        'city_id',
        'language_id',
        'zone'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function city()
    {
        return $this->belongsTo(City::class, 'city_id');
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
            ->useLogName('CityTranslation');
    }
}
