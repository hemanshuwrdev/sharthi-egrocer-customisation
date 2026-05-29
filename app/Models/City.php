<?php

namespace App\Models;

use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory,HasTranslations;
        protected $table = 'cities';

    public $timestamps = false;


    protected $translatable = [
        'zone'
    ];

    protected $translationModel = 'CityTranslation';

  // protected $appends = ['translations'];
        protected $translationForeignKey = 'city_id';

    protected $hidden = ['created_at', 'updated_at'];
}
