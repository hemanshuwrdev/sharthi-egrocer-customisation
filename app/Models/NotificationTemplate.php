<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NotificationTemplate extends Model
{
    use LogsActivity;

    protected $table = 'notification_templates';

    protected $fillable = ['type', 'title', 'message', 'placeholders'];

    protected $casts = [
        'placeholders' => 'array',
    ];

    /**
     * Translations per language (title, message).
     */
    public function translations(): HasMany
    {
        return $this->hasMany(NotificationTemplateTranslation::class, 'notification_template_id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('NotificationTemplate');
    }
}
