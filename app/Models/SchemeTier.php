<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

/**
 * One quantity tier of a scheme — see the create_scheme_tiers_table migration.
 */
class SchemeTier extends Model
{
    protected $table = 'scheme_tiers';

    protected $fillable = ['scheme_id', 'min_qty', 'max_qty', 'discount_value', 'free_qty'];

    protected $casts = [
        'min_qty'        => 'float',
        'max_qty'        => 'float',
        'discount_value' => 'float',
        'free_qty'       => 'float',
    ];

    /** False before the migration has run, so code deployed ahead of `php artisan migrate` keeps working. */
    public static function tableExists(): bool
    {
        static $exists = null;

        return $exists ??= Schema::hasTable('scheme_tiers');
    }

    public function scheme()
    {
        return $this->belongsTo(Scheme::class);
    }
}
