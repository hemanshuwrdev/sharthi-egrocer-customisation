<?php

namespace App\Models;

use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdditionalCharge extends Model
{
    use HasFactory, HasTranslations;

    protected $table = 'additional_charges';

    protected $fillable = [
        'title',
        'amount',
        'charge_type',
        'is_refundable',
        'is_active',
        'applicable_on',
        'sort_order',
    ];

    protected $casts = [
        'amount'        => 'float',
        'is_refundable' => 'boolean',
        'is_active'     => 'boolean',
        'applicable_on' => 'array',
    ];

    protected $hidden = ['created_at', 'updated_at'];

    protected $appends = ['translations'];

    protected $translatable = ['title'];

    protected $translationModel = 'AdditionalChargeTranslation';
    protected $translationForeignKey = 'additional_charge_id';
}
