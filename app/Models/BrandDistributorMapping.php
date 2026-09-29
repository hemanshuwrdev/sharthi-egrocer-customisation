<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BrandDistributorMapping extends Model
{
    use HasFactory, LogsActivity;
    protected $table = 'brand_distributor_mappings';

    protected $fillable = [
        'brand_id',
        'brand_line_id',
        'seller_id',
        'city_id',
    ];

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function brandLine()
    {
        return $this->belongsTo(BrandLine::class);
    }

    public function distributor()
    {
        return $this->belongsTo(Seller::class, 'seller_id');
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('BrandDistributorMapping');
    }

    /**
     * Whether two mappings' lines conflict under the "no overlap" rule, given each line's
     * own overlap override. $lineA/$lineB are null for "All Lines" mappings.
     *
     * - Both "All Lines": always conflicts (can't reason about it per-line).
     * - Same specific line: conflicts unless that line itself allows overlap.
     * - "All Lines" vs a specific line (either order): conflicts unless that specific line
     *   allows overlap ("All Lines" implicitly includes it).
     * - Two different specific lines: never conflicts.
     */
    public static function linesConflict(?BrandLine $lineA, ?BrandLine $lineB): bool
    {
        if (!$lineA && !$lineB) {
            return true;
        }

        if ($lineA && $lineB) {
            return $lineA->id === $lineB->id && !$lineA->is_overlap_allowed;
        }

        $specific = $lineA ?: $lineB;
        return !$specific->is_overlap_allowed;
    }

    /**
     * Find an existing mapping row for this brand, in one of $cityIds, owned by a DIFFERENT
     * seller, whose line conflicts with $lineId (null = "All Lines") under linesConflict().
     * Callers should only invoke this once the brand's own is_overlap_allowed has already
     * been confirmed false — this only handles per-line overrides on top of that.
     */
    public static function findConflict(int $brandId, ?int $lineId, array $cityIds, $excludeSellerId = null): ?self
    {
        if (empty($cityIds)) {
            return null;
        }

        if ($lineId) {
            $line = BrandLine::find($lineId);
            if ($line && $line->is_overlap_allowed) {
                return null;
            }
        }

        return static::where('brand_id', $brandId)
            ->whereIn('city_id', $cityIds)
            ->when($excludeSellerId, fn($q) => $q->where('seller_id', '!=', $excludeSellerId))
            ->where(function ($q) use ($lineId) {
                $q->whereNull('brand_line_id');
                if ($lineId) {
                    $q->orWhere('brand_line_id', $lineId);
                } else {
                    // Target is "All Lines": also conflicts with any specific line that
                    // itself does not allow overlap.
                    $q->orWhereHas('brandLine', fn($q2) => $q2->where('is_overlap_allowed', 0));
                }
            })
            ->with(['city', 'distributor', 'brandLine'])
            ->first();
    }

    /**
     * The seller ids mapped to serve $brandId (optionally scoped to one line) in any of
     * $cityIds. NULL-safe per the Brand Lines matching rule: a mapping with brand_line_id
     * NULL ("All Lines") always matches; a mapping with a specific line only matches when
     * $brandLineId equals it. Pass $brandLineId = null for a product with no line, which
     * then only matches "All Lines" rows (NULL = NULL is false in SQL, so a specific-line
     * mapping never matches a lineless product).
     *
     * This is the single shared place every retailer/distributor-facing query should use
     * to resolve brand+line+city eligibility, so the rule can't drift between call sites.
     */
    public static function eligibleSellerIds(int $brandId, ?int $brandLineId, array $cityIds)
    {
        if (empty($cityIds)) {
            return collect();
        }

        return static::where('brand_id', $brandId)
            ->whereIn('city_id', $cityIds)
            ->where(function ($q) use ($brandLineId) {
                $q->whereNull('brand_line_id');
                if ($brandLineId) {
                    $q->orWhere('brand_line_id', $brandLineId);
                }
            })
            ->pluck('seller_id')
            ->unique()
            ->values();
    }

    /**
     * Whether $productBrandLineId is covered by $allowedLines — an array of one seller's
     * brand_line_id values for one brand (as gathered from their mapping rows). A NULL
     * entry in the array means that seller holds an "All Lines" mapping for the brand,
     * which covers every line including an uncategorized (NULL) product.
     */
    public static function lineIsCovered(array $allowedLines, ?int $productBrandLineId): bool
    {
        foreach ($allowedLines as $lineId) {
            if ($lineId === null || (int) $lineId === (int) $productBrandLineId) {
                return true;
            }
        }
        return false;
    }
}
