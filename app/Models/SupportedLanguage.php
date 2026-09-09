<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupportedLanguage extends Model
{
    use HasFactory, LogsActivity;
    public $timestamps = false;
    protected $fillable = ['name','code','type'];

    public function getTypeAttribute($value)
    {
        return strtoupper($value);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('SupportedLanguage');
    }
}
