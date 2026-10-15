<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Traits\HasRoles;
class Admin extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable,HasRoles, LogsActivity;
    protected $appends = ['allPermissions','seller_status','delivery_boy_status','salesman_status'];
    protected $hidden = ['password'];

    protected $fillable = ['username','email','password','role_id','created_by'];

    public function role(){
        return $this->hasOne(Role::class,'id','role_id');
    }

    public function getAllPermissionsAttribute()
    {
        $permissions = [];
       
        if ($this->role){
            $rolePermissions = \DB::table('role_has_permissions')
                ->where('role_id', $this->role->id)
                ->get()->pluck('permission_id')->toArray();
        $permissions = Permission::whereIn('id', $rolePermissions)->get()->pluck('name')->toArray();
        }
        return $permissions;
    }

    public function notifications()
    {
        return $this->morphMany(PanelNotification::class, 'notifiable')->orderBy('created_at', 'desc');
    }

    public function seller(){
        return $this->belongsTo(Seller::class,'id','admin_id');
    }

    /**
     * Language key explaining why this login can't be deleted as a System User, or null when it can.
     * A distributor / driver / salesman login is removed through that person's own delete (which has
     * its own history checks), and loading_slips.created_by is ON DELETE CASCADE — deleting the
     * admin who created slips erases those slips and unlinks their orders.
     */
    public function deletionBlockReason(): ?string
    {
        foreach (['sellers', 'delivery_boys', 'salesmen'] as $table) {
            if (\Illuminate\Support\Facades\DB::table($table)->where('admin_id', $this->id)->exists()) {
                return 'admin_is_linked_account_cannot_delete';
            }
        }

        if (\Illuminate\Support\Facades\DB::table('loading_slips')->where('created_by', $this->id)->exists()) {
            return 'admin_has_history_cannot_delete';
        }

        return null;
    }

    public function getSellerStatusAttribute()
    {
        $status = 0;
        if($this->seller){
            $status = $this->seller->status;
        }
        return $status;
    }

    public function deliveryBoy(){
        return $this->belongsTo(DeliveryBoy::class,'id','admin_id');
    }

    public function getDeliveryBoyStatusAttribute()
    {
        $status = 0;
        if($this->deliveryBoy){
            $status = $this->deliveryBoy->status;
        }
        return $status;
    }

    public function salesman(){
        return $this->belongsTo(Salesman::class,'id','admin_id');
    }

    public function getSalesmanStatusAttribute()
    {
        $status = 0;
        if($this->salesman){
            $status = $this->salesman->status;
        }
        return $status;
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('Admin');
    }
}
