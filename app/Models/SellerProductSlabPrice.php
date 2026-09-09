<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SellerProductSlabPrice extends Model
{
    use HasFactory, LogsActivity;
    protected $table = 'seller_product_slab_prices';

    protected $fillable = [
        'seller_product_id',
        'min_qty',
        'max_qty',
        'price',
    ];

    public function sellerProduct()
    {
        return $this->belongsTo(SellerProduct::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('SellerProductSlabPrice');
    }
}
