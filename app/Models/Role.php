<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class Role extends Model
{
    use LogsActivity;


    public static $roleSuperAdmin = 1;
    public static $roleAdmin = 2;
    public static $roleSeller = 3;
    public static $roleDeliveryBoy = 4;
    public static $roleSalesman = 5;

    public static $roleNameSuperAdmin = "Super Admin";
    public static $roleNameAdmin = "Admin";
    public static $roleNameSeller = "Seller";
    public static $roleNameDeliveryBoy = "Delivery Boy";
    public static $roleNameSalesman = "Salesman";

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('Role');
    }
}
