<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UnitTranslation extends Model
{
    
    use HasFactory;

      public $timestamps = false;
    protected $table = 'unit_translations';

    protected $fillable = [
        'unit_id',
        'language_id',
        'name',
        'short_code',
        
    ];

    protected $hidden = [
        'created_at'
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class);
    }
}
