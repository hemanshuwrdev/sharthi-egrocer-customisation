<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CreditNoteItem extends Model
{
    protected $fillable = [
        'credit_note_id', 'order_item_id', 'product_name', 'variant_name', 'quantity', 'amount',
    ];

    protected $casts = [
        'quantity' => 'float',
        'amount'   => 'float',
    ];

    public function creditNote()
    {
        return $this->belongsTo(CreditNote::class);
    }
}
