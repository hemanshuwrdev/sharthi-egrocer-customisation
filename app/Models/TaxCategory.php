<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaxCategory extends Model
{
    use HasFactory;

    protected $table = 'tax_categories';

    protected $fillable = [
        'name',
        'code',
        'description',
        'status',
    ];

    public function taxRules()
    {
        return $this->hasMany(TaxRule::class);
    }
}
