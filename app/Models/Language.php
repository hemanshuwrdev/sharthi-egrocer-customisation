<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    use HasFactory, LogsActivity;
    protected $hidden = ['created_at','updated_at'];
    protected $fillable = ['supported_language_id','system_type','json_data','is_default','display_name','status'];
    protected $appends = ['system_type_name'];

    public static $systemTypeRetailerApp = 1;
    public static $systemTypeDistributorApp = 2;
    public static $systemTypeWebsite = 3;
    public static $systemTypeAdminPanel = 4;
    public static $systemTypeDriverApp = 5;
    public static $systemTypeSalesmanApp = 6;


    public static function get_system_types(): array {
        return [
            ['id' => self::$systemTypeRetailerApp, 'name' => __('retailer_app')],
            ['id' => self::$systemTypeDistributorApp, 'name' => __('distributor_app')],
            ['id' => self::$systemTypeWebsite, 'name' => __('website')],
            ['id' => self::$systemTypeAdminPanel, 'name' => __('admin_panel')],
            ['id' => self::$systemTypeDriverApp, 'name' => __('driver_app')],
            ['id' => self::$systemTypeSalesmanApp, 'name' => __('salesman_app')],
        ];
    }

    public function getSystemTypeNameAttribute(){
        $system_types = $this->get_system_types();
        $system_type = $this->system_type;

        $filtered_array = array_filter($system_types, function($element) use ($system_type) {
            return $element['id'] == $system_type;
        });
        $type_array = reset($filtered_array);
        return $type_array['name'];
    }

    public function getTypeAttribute($value)
    {
        return strtoupper($value);
    }


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('Language');
    }
}
