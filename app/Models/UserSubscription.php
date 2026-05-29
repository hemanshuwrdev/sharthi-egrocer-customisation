<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSubscription extends Model
{
    use HasFactory;

    // Define the table name
    protected $table = 'user_subscriptions';

    // Define fillable fields for mass assignment
    protected $fillable = [
        'user_id',
        'plan_id',
        'plan_name',
        'price_paid',
        'discounted_price',
        'free_delivery_above',
        'start_date',
        'end_date',
        'status'
    ];

    // Hide these fields from JSON responses
    protected $hidden = ['updated_at'];

    // Relationship: User subscription belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // Relationship: User subscription belongs to a subscription plan
    public function plan()
    {
        return $this->belongsTo(SubscriptionPlan::class, 'plan_id', 'id');
    }

    // Scope: Get only active subscriptions
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // Scope: Get only expired subscriptions
    public function scopeExpired($query)
    {
        return $query->where('status', 'expired');
    }

    // Scope: Get subscriptions for a specific user
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}

