<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RetailerProfile extends Model
{
    use HasFactory, LogsActivity;
    protected $fillable = [
        'user_id', 'shop_name', 'party_name', 'gst_no',
        'address', 'address_line1', 'address_line2', 'city', 'state',
        'city_id', 'area_id', 'gps_lat', 'gps_lng',
        'verified_lat', 'verified_lng', 'storefront_photo', 'verification_notes',
        'verified_at', 'verified_by_salesman_id',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
        'gps_lat' => 'float',
        'gps_lng' => 'float',
        'verified_lat' => 'float',
        'verified_lng' => 'float',
    ];

    // Expose only the area's name and pincode on the API; the full `area` relation object
    // is hidden to keep the response flat.
    protected $appends = ['area_name', 'area_pincode'];

    protected $hidden = ['area'];

    /**
     * Single-line `address` text from the structured parts ("line1, line2, city, state"),
     * skipping blanks. `address` is what invoices, the salesman app and order fallback read.
     */
    public static function composeAddress($line1, $line2, $city, $state): string
    {
        return collect([$line1, $line2, $city, $state])
            ->map(fn ($part) => trim((string) $part))
            ->filter(fn ($part) => $part !== '')
            ->implode(', ');
    }

    public function getStorefrontPhotoAttribute($value): ?string
    {
        if (!$value) return null;
        if (str_starts_with($value, 'http')) return $value;
        return asset('storage/' . $value);
    }

    public function getAreaNameAttribute(): ?string
    {
        return $this->area?->name;
    }

    public function getAreaPincodeAttribute(): ?string
    {
        return $this->area?->pincode;
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function verifiedBy()
    {
        return $this->belongsTo(Salesman::class, 'verified_by_salesman_id', 'id');
    }

    public function area()
    {
        return $this->belongsTo(Area::class, 'area_id', 'id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('RetailerProfile');
    }
}
