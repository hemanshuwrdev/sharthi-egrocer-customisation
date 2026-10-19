<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;

class MobileRegistry extends Model
{
    use LogsActivity;

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

    public static $roleTables = [
        self::ROLE_SALESMAN => 'salesmen',
        self::ROLE_SELLER => 'sellers',
        self::ROLE_DELIVERY_BOY => 'delivery_boys',
        self::ROLE_RETAILER => 'users',
    ];

    /**
     * True when the role record that holds this claim no longer exists. Plain table lookup
     * (no model scopes) so a soft-deleted record still counts as existing.
     */
    public function isOrphaned(): bool
    {
        $table = self::$roleTables[$this->role] ?? null;
        if (!$table) {
            return false;
        }

        return !\Illuminate\Support\Facades\DB::table($table)->where('id', $this->role_id)->exists();
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('MobileRegistry');
    }
}
