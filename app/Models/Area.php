<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use LogsActivity;

    protected $table = 'areas';

    protected $fillable = [
        'city_id',
        'name',
        'pincode',
        'state',
        'district',
        'status',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('Area');
    }
}
