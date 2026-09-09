<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;

class PermissionCategory extends Model
{
    use LogsActivity;


    protected $table = 'permission_categories';

    protected $fillable = ['name', 'guard_name', 'created_at', 'updated_at'];

    public function permissions()
    {
        return $this->hasMany('App\Models\Permission', 'category_id', 'id');
    }


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('PermissionCategory');
    }
}
