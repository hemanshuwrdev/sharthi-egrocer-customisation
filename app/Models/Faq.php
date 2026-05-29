<?php

namespace App\Models;

use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    use HasFactory,HasTranslations;
    public $timestamps = false;

        protected $translatable = [
        'question',
        'answer',
    ];

        protected $translationForeignKey = 'faq_id';
    protected $translationModel = 'FaqTranslation';

    protected $appends = ['translations'];

    protected $hidden = ['status','seller_id'];

}
