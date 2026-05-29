<?php

namespace App\Models;

use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeSlot extends Model
{
    use HasFactory,HasTranslations;

        protected $fillable = [
            'title',
        'from_time',
        'to_time',
        'last_order_time',
        'is_free_delivery',

    ];

    protected $hidden = ['created_at', 'updated_at'];

    protected $appends = ['translations'];

    protected $translatable = ['title'];

    protected $translationModel = 'TimeSlotTranslation';
    protected $translationForeignKey = 'time_slot_id';
}