<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Scheme extends Model
{
    use HasFactory;

    public const TYPE_BUY_X_GET_Y = 'buy_x_get_y';
    public const TYPE_GROUP_DISCOUNT = 'group_discount';

    protected $table = 'schemes';

    protected $fillable = [
        'seller_id',
        'name',
        'type',
        'buy_seller_product_id',
        'buy_qty',
        'free_seller_product_id',
        'free_qty',
        'start_date',
        'end_date',
        'status',
    ];

    public function schemeProducts()
    {
        return $this->hasMany(SchemeProduct::class);
    }

    public function schemeSlabs()
    {
        return $this->hasMany(SchemeSlab::class);
    }

    public function buyProduct()
    {
        return $this->belongsTo(SellerProduct::class, 'buy_seller_product_id');
    }

    public function freeProduct()
    {
        return $this->belongsTo(SellerProduct::class, 'free_seller_product_id');
    }

    public function scopeActive($query)
    {
        $today = now()->toDateString();
        return $query->where('status', 1)
            ->whereDate('start_date', '<=', $today)
            ->whereDate('end_date', '>=', $today);
    }
}
