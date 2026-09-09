<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasTranslations;

class Unit extends Model
{
    public $timestamps = false;

    use HasFactory, HasTranslations, LogsActivity;
    protected $table = 'units';

    protected $fillable = [
        'name',
        'short_code',
        'parent_id',
        'conversion',
    ];

    protected $translationAttributes = ['name', 'short_code'];

    protected $hidden = [
        'created_at'
    ];

    protected $appends = ['translations'];
    
    protected $translationForeignKey = 'unit_id';

    protected $translationModel = 'UnitTranslation';

    protected $translatable = [
        'name',
        'short_code',
    ];

    public function translations()
    {
        return $this->hasMany(UnitTranslation::class);
    }

    public function parent()
    {
        return $this->belongsTo(Unit::class, 'parent_id');
    }

    

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('Unit');
    }
}
