<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterProductTranslation extends Model
{
    use HasFactory;

    protected $table = 'master_product_translations';

    protected $fillable = [
        'master_product_id',
        'language_id',
        'name',
        'description',
        'meta_title',
        'meta_keywords',
        'schema_markup',
        'meta_description',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'master_product_id',
    ];

    protected $appends = ['product_id'];

    public function getProductIdAttribute(): ?int
    {
        return $this->attributes['master_product_id'] ?? null;
    }

    public function masterProduct()
    {
        return $this->belongsTo(MasterProduct::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class);
    }
}
