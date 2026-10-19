<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

/**
 * One scheme applied to an order — see the create_order_schemes_table migration.
 */
class OrderScheme extends Model
{
    protected $table = 'order_schemes';

    protected $fillable = [
        'order_id', 'scheme_id', 'name', 'type', 'discount', 'benefit', 'tax_option', 'discount_pretax', 'free_items',
    ];

    protected $casts = [
        'discount'        => 'float',
        'benefit'         => 'float',
        'discount_pretax' => 'float',
        'free_items'      => 'array',
    ];

    /**
     * Save every scheme from a SchemeEngine::evaluate() result against the order just placed.
     * No-op when nothing applied, or before the migration has run.
     */
    public static function record(int $orderId, ?array $evaluated): void
    {
        if (empty($evaluated['schemes']) || !Schema::hasTable('order_schemes')) {
            return;
        }

        foreach ($evaluated['schemes'] as $s) {
            static::create([
                'order_id'        => $orderId,
                'scheme_id'       => $s['scheme_id'],
                'name'            => $s['name'],
                'type'            => $s['type'],
                'discount'        => $s['scheme_discount'] ?? 0,
                'benefit'         => $s['benefit'] ?? 0,
                'tax_option'      => $s['tax_option'] ?? null,
                'discount_pretax' => $s['scheme_discount_pretax'] ?? null,
                'free_items'      => $s['free_items'] ?? [],
            ]);
        }
    }
}
