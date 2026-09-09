<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogTranslation extends Model
{
    use HasFactory, LogsActivity;
    public $timestamps = false;
    protected $table = 'blog_translations';

    protected $fillable = [
        'blog_id',
        'language_id',
        'title',
        'description',
        'short_description',
        'meta_title',
        'meta_keywords',
        'meta_description',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

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
            ->useLogName('BlogTranslation');
    }
}
