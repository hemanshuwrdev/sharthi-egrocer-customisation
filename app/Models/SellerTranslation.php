<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SellerTranslation extends Model
{
    use HasFactory;

    protected $table = 'seller_translations';

    protected $fillable = [
        'seller_id',
        'language_id',
        'name',
        'store_name',
        'store_description',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function seller()
    {
        return $this->belongsTo(Seller::class, 'seller_id');
    }

    public function language()
    {
        return $this->belongsTo(Language::class, 'language_id');
    }
}

