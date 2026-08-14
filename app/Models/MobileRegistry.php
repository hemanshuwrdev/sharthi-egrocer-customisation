<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MobileRegistry extends Model
{
    protected $table = 'mobile_registry';

    protected $fillable = [
        'mobile',
        'role',
        'role_id',
    ];

    const ROLE_SALESMAN = 'salesman';
    const ROLE_SELLER = 'seller';
    const ROLE_DELIVERY_BOY = 'delivery_boy';
    const ROLE_RETAILER = 'retailer';

    public static $roleLabels = [
        self::ROLE_SALESMAN => 'Salesman',
        self::ROLE_SELLER => 'Distributor',
        self::ROLE_DELIVERY_BOY => 'Delivery Boy',
        self::ROLE_RETAILER => 'Retailer',
    ];
}
