<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SectionTranslation extends Model
{
    use HasFactory, LogsActivity;
    public $timestamps = false;
    protected $table = 'section_translations';

    protected $fillable = [
        'category_ids',
        'section_id',
        'language_id',
        'title',
        'short_description',
    ];

    protected $hidden = [
        'created_at',
    ];

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('SectionTranslation');
    }
}
