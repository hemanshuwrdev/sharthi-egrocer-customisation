<?php

namespace App\Models;

use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasFactory,HasTranslations;
    
    public $timestamps = false; 

    protected $table = 'countries';

    protected $translatable = ['name'];

    protected $translationModel = 'CountryTranslation';

    protected $appends = ['logo_url','translations'];

    protected $translationForeignKey = 'country_id';
    
    protected $hidden = ['created_at','updated_at','deleted_at'];

    // Logo URL
    public function getLogoUrlAttribute()
    {
        if ($this->logo) {
            return asset('storage/'.$this->logo);
        }
        return null;
    }
}