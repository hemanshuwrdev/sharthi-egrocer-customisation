<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CityTranslation extends Model
{
      use HasFactory;

    protected $table = 'city_translations';

    protected $fillable = [
        'city_id',
        'language_id',
        'zone'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function city()
    {
        return $this->belongsTo(City::class, 'city_id');
    }

    public function language()
    {
        return $this->belongsTo(Language::class, 'language_id');
    }

}
