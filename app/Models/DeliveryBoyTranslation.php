<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryBoyTranslation extends Model
{
    use HasFactory, LogsActivity;
 protected $translationModel = 'DeliveryBoyTranslation';
    protected $table = 'delivery_boy_translations';

    protected $fillable = [
        'delivery_boy_id',
        'language_id',
        'name',
        'address',
        'other_payment_information',
    ];

      public $timestamps = false;

    public function deliveryBoy()
    {
        return $this->belongsTo(DeliveryBoy::class, 'delivery_boy_id');
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
            ->useLogName('DeliveryBoyTranslation');
    }
}
