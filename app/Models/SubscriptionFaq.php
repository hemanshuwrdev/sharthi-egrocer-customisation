<?php

namespace App\Models;

use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionFaq extends Model
{
    use HasFactory,HasTranslations;

    protected $table = 'subscription_faqs';

    //  protected $fillable = [
    //     'sort_order',
    //     'status',
    //    'question',
    //    'answer'
    // ];
        
            protected $appends = ['translations']; 

    protected $hidden = ['updated_at', 'created_at'];
    protected $translatable = ['question', 'answer'];
    protected $translationForeignKey = 'subscription_faq_id';
    protected $translationModel = 'SubscriptionFaqTranslation';
    


    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('question', 'like', '%' . $search . '%')
              ->orWhere('answer', 'like', '%' . $search . '%');
        });
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc')->orderBy('id', 'desc');
    }
}

