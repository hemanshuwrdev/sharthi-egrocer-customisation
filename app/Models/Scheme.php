<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Scheme extends Model
{
    use HasFactory, LogsActivity;
    public const TYPE_BUY_X_GET_Y          = 'buy_x_get_y';
    public const TYPE_GROUP_DISCOUNT_PRICE  = 'group_discount_price';
    public const TYPE_GROUP_DISCOUNT_QTY    = 'group_discount_qty';
    public const TYPE_PRODUCT_CONDITIONS    = 'product_conditions';

    protected $table = 'schemes';

    protected $fillable = [
        'seller_id',
        'name',
        'type',
        'buy_seller_product_id',
        'buy_qty',
        'buy_qty_basis',
        'free_seller_product_id',
        'free_qty',
        'free_qty_basis',
        'start_date',
        'end_date',
        'status',
        'description',
        'tax_option',
        'applies_to_all',
    ];

    protected $casts = [
        'applies_to_all' => 'boolean',
    ];

    /**
     * False before `php artisan migrate` has added schemes.applies_to_all and scheme_slabs.max_value, so
     * code deployed ahead of the migration keeps working — Cart Value Discount just can't be saved yet.
     */
    public static function cartValueColumnsExist(): bool
    {
        static $exists = null;

        return $exists ??= \Illuminate\Support\Facades\Schema::hasColumn('schemes', 'applies_to_all')
            && \Illuminate\Support\Facades\Schema::hasColumn('scheme_slabs', 'max_value');
    }

    public function seller()
    {
        return $this->belongsTo(Seller::class);
    }

    public function schemeProducts()
    {
        return $this->hasMany(SchemeProduct::class);
    }

    public function schemeSlabs()
    {
        return $this->hasMany(SchemeSlab::class);
    }

    /** Quantity tiers, lowest range first. Only schemes with two or more have rows — see isTiered(). */
    public function schemeTiers()
    {
        return $this->hasMany(SchemeTier::class)->orderBy('min_qty');
    }

    /**
     * Two or more quantity tiers. A scheme with one tier (or none) is just the min / max / discount on its
     * product rows and behaves exactly as it always has; only a tiered scheme picks the tier that holds the
     * quantity — and then the ranges are strict: outside every tier there is no discount.
     */
    public function isTiered(): bool
    {
        return SchemeTier::tableExists() && $this->schemeTiers->count() > 1;
    }

    /** The tier whose min..max holds $qty (blank max = no upper limit), or null when none does. */
    public function tierForQty(float $qty): ?SchemeTier
    {
        foreach ($this->schemeTiers as $tier) {
            if ($qty >= (float) $tier->min_qty && ($tier->max_qty === null || $qty <= (float) $tier->max_qty)) {
                return $tier;
            }
        }

        return null;
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

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('Scheme');
    }
}
