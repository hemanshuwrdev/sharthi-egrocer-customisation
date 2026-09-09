<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SellerProduct extends Model
{
    use HasFactory, LogsActivity;
    protected $table = 'seller_products';

    protected $fillable = [
        'seller_id',
        'master_product_variant_id',
        'mrp',
        'selling_price',
        'discounted_price',
        'stock',
        'status',
        'allow_loose_qty',
        'max_qty_mode',
        'max_qty_value',
    ];

    public function seller()
    {
        return $this->belongsTo(Seller::class);
    }

    public function masterProductVariant()
    {
        return $this->belongsTo(MasterProductVariant::class);
    }

    public function slabPrices()
    {
        return $this->hasMany(SellerProductSlabPrice::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('SellerProduct');
    }
}
