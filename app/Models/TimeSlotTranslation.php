<?php

namespace App\Models;

use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeSlotTranslation extends Model
{
    use HasFactory,HasTranslations;

     protected $table = 'time_slot_translations';

       protected $fillable = [
        'time_slot_id', 'language_id', 'title'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function timeSlot()
    {
        return $this->belongsTo(TimeSlot::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class, 'language_id');
    }
}
