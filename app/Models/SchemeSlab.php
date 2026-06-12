<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchemeSlab extends Model
{
    use HasFactory;

    protected $table = 'scheme_slabs';

    protected $fillable = [
        'scheme_id',
        'min_value',
        'discount_type',
        'discount_value',
    ];

    public function scheme()
    {
        return $this->belongsTo(Scheme::class);
    }
}
