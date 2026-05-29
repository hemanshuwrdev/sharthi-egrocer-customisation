<?php

namespace App\Models;

use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    use HasFactory,HasTranslations;
//   protected $fillable = [
//         'name',
//         'days',
//         'price',
//         'discounted_price',
//         'free_delivery_above',
//         'ios_product_id',
//         'status'
//     ];

    protected $translatable = ['name'];
    // Define the table name (optional, Laravel will use plural form by default)
    protected $table = 'subscription_plans';

    // Define fillable fields for mass assignment
 
        protected $translationModel = 'SubscriptionPlanTranslation';
          protected $translationForeignKey = 'subscription_plan_id';

    protected $appends = ['translations']; 

    // Hide these fields from JSON responses
    protected $hidden = ['updated_at','created_at','deleted_at'];

    // Relationship: A subscription plan can have many user subscriptions
    public function userSubscriptions()
    {
        return $this->hasMany(UserSubscription::class, 'plan_id', 'id');
    }

    // Scope: Get only active subscription plans
    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    // Scope: Search by name
    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'like', '%' . $search . '%');
    }



}

