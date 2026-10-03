<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchemeProduct extends Model
{
    use HasFactory, LogsActivity;
    protected $table = 'scheme_products';

    protected $fillable = [
        'scheme_id',
        'seller_product_id',
        'qty_basis',
        'min_qty',
        'max_qty',
        'discount_type',
        'discount_value',
        'free_qty',
        'free_qty_basis',
    ];

    public function scheme()
    {
        return $this->belongsTo(Scheme::class);
    }

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
            ->useLogName('SchemeProduct');
    }
}
