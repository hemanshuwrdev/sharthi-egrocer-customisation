<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salesman extends Model
{
    use HasFactory;

    public static $statusActive = 1;
    public static $statusBlocked = 0;

    protected $fillable = [
        'admin_id', 'name', 'mobile', 'email', 'seller_id',
        'brands', 'allow_payment_collection', 'discount', 'status',
    ];

    protected $casts = [
        'brands' => 'array',
        'allow_payment_collection' => 'boolean',
        'discount' => 'float',
        'status' => 'integer',
    ];

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id', 'id');
    }

    public function seller()
    {
        return $this->belongsTo(Seller::class, 'seller_id', 'id');
    }
}
