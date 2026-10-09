<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Models\DeliveryBoyTranslation;
class DeliveryBoy extends Model
{
    use HasFactory, HasTranslations, LogsActivity;
    protected $table = 'delivery_boys';
    protected $translationModel = 'DeliveryBoyTranslation';

    protected $fillable = [
        'name',
        'address',
        'other_payment_information',
        'admin_id',
        'seller_id',
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

    public function cities()
    {
        return $this->belongsToMany(City::class, 'delivery_boy_cities', 'delivery_boy_id', 'city_id');
    }

    /** Distributors this driver works for (a driver can be shared by several). */
    public function sellers()
    {
        return $this->belongsToMany(Seller::class, 'delivery_boy_sellers', 'delivery_boy_id', 'seller_id')->withTimestamps();
    }

    /** Drivers linked to the given distributor. */
    public function scopeForSeller($query, $sellerId)
    {
        return $query->whereIn('delivery_boys.id', DB::table('delivery_boy_sellers')
            ->where('seller_id', $sellerId)
            ->select('delivery_boy_id'));
    }

    /**
     * delivery_boys.cash_received is one running total across every distributor a driver works for.
     * For drivers shared with other distributors, replace it (on these in-memory models only) with the
     * COD collected on $sellerId's own orders, so one distributor never sees another's cash.
     */
    public static function limitCashToSeller($deliveryBoys, $sellerId)
    {
        $sharedDriverIds = DB::table('delivery_boy_sellers')
            ->whereIn('delivery_boy_id', collect($deliveryBoys)->pluck('id'))
            ->groupBy('delivery_boy_id')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('delivery_boy_id');
        if ($sharedDriverIds->isEmpty()) {
            return $deliveryBoys;
        }

        $ownCod = DB::table('delivery_boy_transactions as t')
            ->whereIn('t.delivery_boy_id', $sharedDriverIds)
            ->where('t.type', DeliveryBoyTransaction::$paymentTypeCod)
            ->whereExists(fn ($q) => $q->select(DB::raw(1))->from('order_items as oi')
                ->whereColumn('oi.order_id', 't.order_id')
                ->where('oi.seller_id', $sellerId))
            ->groupBy('t.delivery_boy_id')
            ->selectRaw('t.delivery_boy_id, SUM(t.amount) as total')
            ->pluck('total', 'delivery_boy_id');

        foreach ($deliveryBoys as $db) {
            if ($sharedDriverIds->contains($db->id)) {
                $db->cash_received = round((float) ($ownCod[$db->id] ?? 0), 2);
            }
        }
        return $deliveryBoys;
    }

    /** Drivers serving any of the given zones (pivot, or legacy primary city_id). */
    public function scopeServingCities($query, array $cityIds)
    {
        return $query->where(function ($q) use ($cityIds) {
            $q->whereIn('city_id', $cityIds)
              ->orWhereHas('cities', fn ($c) => $c->whereIn('cities.id', $cityIds));
        });
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

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('DeliveryBoy');
    }
}
