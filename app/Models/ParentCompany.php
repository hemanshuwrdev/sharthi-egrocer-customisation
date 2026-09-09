<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParentCompany extends Model
{
    use HasFactory, LogsActivity;
    protected $table = 'parent_companies';

    protected $fillable = [
        'name',
        'status',
    ];

    public function masterProducts()
    {
        return $this->hasMany(MasterProduct::class, 'parent_company_id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('ParentCompany');
    }
}
