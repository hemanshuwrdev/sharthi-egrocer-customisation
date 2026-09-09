<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromoCodeTranslation extends Model
{
    use HasFactory, LogsActivity;
    protected $table = 'promo_code_translations';

    protected $fillable = [
        'promo_code_id',
        'language_id',
        'message',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function promoCode()
    {
        return $this->belongsTo(PromoCode::class, 'promo_code_id');
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
            ->useLogName('PromoCodeTranslation');
    }
}

