<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogView extends Model
{
    use HasFactory, LogsActivity;
    protected $table = 'blog_views';

    public $timestamps = false;

    protected $primaryKey = ['blog_id', 'ip_address'];

    public $incrementing = false;

    protected $fillable = [
        'blog_id',
        'ip_address'
    ];
    public function blog()
    {
        return $this->belongsTo(Blog::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('BlogView');
    }
}
