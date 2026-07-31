<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecentlyVisitedProduct extends Model
{
    use HasFactory;

    // Table name
    protected $table = 'recently_visited_products';

    // Fillable fields
    protected $fillable = [
        'user_id',
        'product_id',
        'master_product_id',
        'visited_at'
    ];

    // Cast visited_at as datetime
    protected $casts = [
        'visited_at' => 'datetime',
    ];

    // Relationship with User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship with legacy Product model (kept for old rows, no longer written)
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Relationship with MasterProduct model (current catalog)
    public function masterProduct()
    {
        return $this->belongsTo(MasterProduct::class, 'master_product_id');
    }
}
