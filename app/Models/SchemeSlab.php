<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchemeSlab extends Model
{
    use HasFactory, LogsActivity;
    protected $table = 'scheme_slabs';

    protected $fillable = [
        'scheme_id',
        'min_value',
        'max_value',
        'discount_type',
        'discount_value',
        'tax_option',
    ];

    protected $casts = [
        'min_value' => 'float',
        'max_value' => 'float',
        'discount_value' => 'float',
    ];

    /**
     * Whether a cart/group value falls in this slab: from min_value up to max_value, both inclusive.
     * A blank max_value is "no upper limit", which is how slabs always behaved (they held until a higher
     * slab's minimum was reached), so existing slabs are unaffected.
     */
    public function containsValue(float $value): bool
    {
        return $value >= (float) $this->min_value && ($this->max_value === null || $value <= (float) $this->max_value);
    }

    public function scheme()
    {
        return $this->belongsTo(Scheme::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('SchemeSlab');
    }
}
