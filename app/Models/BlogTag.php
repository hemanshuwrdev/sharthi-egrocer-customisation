<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogTag extends Model
{
    use HasFactory, LogsActivity;
    protected $table = 'blog_tag';

    protected $fillable = [
        'name',
        'language_id',
    ];

    public $timestamps = true;

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
            ->useLogName('BlogTag');
    }
}
