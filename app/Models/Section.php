<?php

namespace App\Models;

use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory, HasTranslations;

    public $timestamps = false;

    protected $table = 'sections';

    protected $translatable = [
        'title',
        'short_description',
    ];
    protected $translationModel = 'SectionTranslation';

    protected $translationForeignKey = 'section_id';

    protected $fillable = [
    'title',
    'short_description',
    'product_type',
    'position',
    'product_ids',
    'category_ids',
    'style_app',
    'style_web',
    'banner_app',
    'banner_web',
    'background_color_for_light_theme',
    'background_color_for_dark_theme'
];


    protected $appends = ['banner_app_url', 'banner_web_url', 'translations'];

    public function getBannerAppUrlAttribute()
    {
        return $this->banner_app ? asset('storage/' . $this->banner_app) : null;
    }

    public function getBannerWebUrlAttribute()
    {
        return $this->banner_web ? asset('storage/' . $this->banner_web) : null;
    }
    public function translations()
    {
        return $this->hasMany(SectionTranslation::class);
    }
}
