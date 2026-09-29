<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BrandLine extends Model
{
    use HasFactory, LogsActivity;
    protected $table = 'brand_lines';

    protected $fillable = [
        'brand_id',
        'name',
        'status',
        'sort_order',
        'is_overlap_allowed',
    ];

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function products()
    {
        return $this->hasMany(MasterProduct::class, 'brand_line_id');
    }

    public function mappings()
    {
        return $this->hasMany(BrandDistributorMapping::class, 'brand_line_id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('BrandLine');
    }
}
