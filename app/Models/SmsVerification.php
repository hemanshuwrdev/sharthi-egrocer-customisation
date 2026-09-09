<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SmsVerification extends Model
{
    use HasFactory, LogsActivity;
    protected $fillable = [
        'contact_number','code','status'
    ];

    protected $dates = ['expires_at'];
    public function store($request)
        {
        $this->fill($request->all());
        $sms = $this->save();
        return response()->json($sms, 200);
        }
        public function updateModel($request)
        {
        $this->update($request->all());
        return $this;
        }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('SmsVerification');
    }
}
