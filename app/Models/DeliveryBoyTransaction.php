<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryBoyTransaction extends Model
{
    use HasFactory, LogsActivity;
    public static $statusSuccess = "success";
    public static $statusFailed = "failed";

    public static $paymentTypeCod = "COD";

    

    protected $fillable = ['user_id','order_id','delivery_boy_id','type',
        'amount', 'status','message','transaction_date'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('DeliveryBoyTransaction');
    }
}
