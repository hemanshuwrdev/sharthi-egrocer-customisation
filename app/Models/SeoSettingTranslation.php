<?php

namespace App\Models;


use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeoSettingTranslation extends Model
{
    use HasFactory, LogsActivity;
     protected $table = 'seo_setting_translations';

    protected $fillable = [
        'seo_setting_id',
        'language_id',
        'meta_title',
        'meta_keyword',
        'schema_markup',
        'meta_description',
    ];

     protected $hidden = ['created_at', 'updated_at'];

    public function seoSetting()
    {
        return $this->belongsTo(SeoSetting::class);
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
            ->useLogName('SeoSettingTranslation');
    }
}
