<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Model;
use App\Models\DeliveryBoyTranslation;
class DeliveryBoy extends Model
{
    use HasFactory, HasTranslations;

    protected $table = 'delivery_boys';
    protected $translationModel = 'DeliveryBoyTranslation';

    protected $fillable = [
        'name',
        'address',
        'other_payment_information',
        'admin_id',
        'dob',
        'mobile',
        'email',
        'ifsc_code',
        'bank_name',
        'bank_account_number',
        'account_name',
        'city_id',
        'status',
        'remark',
        'bonus_type',
        'bonus_percentage',
        'bonus_min_amount',
        'bonus_max_amount',
    ];

    protected $translationAttributes = [
        'name',
        'address',
        'other_payment_information',
    ];

    protected $translationForeignKey = 'delivery_boy_id';

    protected $translatable = [
        'name',
        'address',
        'other_payment_information',
    ];

    protected $appends = [
        'pending_order_count',
        'driving_license_url',
        'national_identity_card_url',
        'translations'
    ];

    protected $hidden = ['updated_at'];

    public static $bonusFixed = 0;
    public static $bonusCommission = 1;
    public static $commission = "Commission";
    public static $fixed = "Fixed/Salaried";

    public static $statusRegistered = 0;
    public static $statusActive = 1;
    public static $statusRejected = 2;
    public static $statusDeactivated = 3;
    public static $statusBlocked = 4;
    public static $statusRemoved = 7;

    public static $Registered = "Registered";
    public static $Active = "Active";
    public static $Rejected = "Rejected";
    public static $Deactivated = "Deactivated";
    public static $Blocked = "Blocked";
    public static $Removed = "Removed";

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id', 'id');
    }

    public function getPendingOrderCountAttribute()
    {
        $ignoreStatus = array(
            OrderStatusList::$paymentPending,
            OrderStatusList::$delivered,
            OrderStatusList::$cancelled,
            OrderStatusList::$returned,
        );
        return Order::where('delivery_boy_id', $this->id)->whereNotIn('active_status', $ignoreStatus)->count();
    }

    public function translations()
    {
        return $this->hasMany(DeliveryBoyTranslation::class, 'delivery_boy_id');
    }

    public function city()
    {
        return $this->belongsTo(City::class, 'city_id', 'id');
    }

    public function getDrivingLicenseUrlAttribute()
    {
        if ($this->driving_license) {
            $driving_licence_url = asset('storage/' . $this->driving_license);
            return $driving_licence_url;
        }
        return $this->driving_license;
    }

    public function getNationalIdentityCardUrlAttribute()
    {
        if ($this->national_identity_card) {
            $national_identity_card_url = asset('storage/' . $this->national_identity_card);
            return $national_identity_card_url;
        }
        return $this->national_identity_card;
    }
}
