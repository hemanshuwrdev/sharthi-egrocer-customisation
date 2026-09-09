<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    use HasFactory,HasTranslations, LogsActivity;
    public $timestamps = false;

        protected $translatable = [
        'question',
        'answer',
    ];

        protected $translationForeignKey = 'faq_id';
    protected $translationModel = 'FaqTranslation';

    protected $appends = ['translations'];

    protected $hidden = ['status','seller_id'];


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('Faq');
    }
}
