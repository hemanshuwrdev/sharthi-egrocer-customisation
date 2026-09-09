<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAddress extends Model
{
    use HasFactory, LogsActivity;
    protected $fillable = ['id','user_id','type','name','mobile','alternate_mobile','address','landmark','area','area_id','pincode','city_id','city','state',
        'country','latitude','longitude','is_default'];

    protected $hidden = ['user_id','created_at','updated_at'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('UserAddress');
    }
}
