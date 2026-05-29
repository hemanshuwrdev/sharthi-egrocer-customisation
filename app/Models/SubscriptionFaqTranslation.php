<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Symfony\Component\Console\Question\Question;

class SubscriptionFaqTranslation extends Model
{
    use HasFactory;
 
     protected $fillable = [
     'subscription_faq_id',
        'language_id',
        'question',
        'answer',
     ];

    protected $hidden = ['updated_at', 'created_at'];
    
      protected $table = 'subscription_faq_translations';

    public $timestamps = false;

    public function faq()
    {
        return $this->belongsTo(SubscriptionFaq::class, 'subscription_faq_id');
    }
    public function language()
    {
        return $this->belongsTo(Language::class, 'language_id');
    }
}
