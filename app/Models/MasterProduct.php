<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterProduct extends Model
{
    use HasFactory;

    protected $table = 'master_products';

    protected $fillable = [
        'name',
        'slug',
        'parent_company_id',
        'brand_id',
        'category_id',
        'tax_id',
        'hsn',
        'image',
        'other_images',
        'short_description',
        'description',
        'type',
        'status',
        'created_by',
    ];

    protected $casts = [
        'other_images' => 'array',
    ];

    public function parentCompany()
    {
        return $this->belongsTo(ParentCompany::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function variants()
    {
        return $this->hasMany(MasterProductVariant::class);
    }
}
