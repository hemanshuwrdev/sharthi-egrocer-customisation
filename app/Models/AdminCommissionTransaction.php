<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminCommissionTransaction extends Model
{
    use HasFactory;

    public static $rules = [
        'order_item_id' => 'unique:admin_commission_transactions',
    ];
}
