<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;


class OrderStatus extends Model
{
    use LogsActivity;

    public $timestamps = false;
    public static $userTypeScript = 0;
    public static $userTypeAdmin = 1;
    public static $userTypeUser = 2;

    protected $appends = ['createdByName','displayDateTime'];

    public $fillable = [
        'order_id',
        'order_item_id',
		'status',
        'created_by',
        'user_type',
        'created_at'
    ];

    public function getcreatedByNameAttribute()
    {
        $name = "";
        if($this->user_type == 0)
        {
            $name = "Script";
        }
        if($this->user_type == 1)
        {
            $name = Admin::where('id', $this->created_by)->pluck('name')->first();
        }
        else if($this->user_type == 2)
        {
            $name = User::withTrashed()->where('id',$this->created_by)->pluck('name')->first();
        }
        return $name;
    }

    public function getdisplayDateTimeAttribute()
    {
        return \App\Helpers\CommonHelper::formatDateTime($this->created_at);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('OrderStatus');
    }
}
