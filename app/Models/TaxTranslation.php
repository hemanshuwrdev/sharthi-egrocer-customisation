<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaxTranslation extends Model
{
    use HasFactory, LogsActivity;
    public $timestamps = false;
    
    protected $fillable = [
        'tax_id',
        'language_id',
        'title'
    ];

        public function tax()
    {
        return $this->belongsTo(Tax::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('TaxTranslation');
    }
}
