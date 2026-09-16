<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaxRule extends Model
{
    use HasFactory;

    protected $table = 'tax_rules';

    protected $fillable = [
        'country_id',
        'tax_category_id',
        'place_of_supply',
        'components',
        'total_rate',
        'status',
    ];

    protected $casts = [
        'components' => 'array',
    ];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function tax_category()
    {
        return $this->belongsTo(TaxCategory::class, 'tax_category_id');
    }

    /**
     * Resolve the tax percentage for a (country, tax category) pair.
     *
     * $isSameRegion, when known, is a real same-state/different-state comparison
     * (e.g. seller's state vs buyer's state — classic intra-state vs inter-state
     * GST) done by the caller and passed in here. When it's null (caller has no
     * state data to compare), this falls back to a deterministic tie-break:
     * exact category beats the "all categories" catch-all, then
     * same_region > different_region > any.
     *
     * Returns null when nothing matches, so callers fall back to the flat tax.
     */
    public static function resolvePercentage(?int $countryId, ?int $taxCategoryId, ?bool $isSameRegion = null): ?float
    {
        if (!$countryId) {
            return null;
        }

        $rules = static::where('country_id', $countryId)
            ->where('status', 1)
            ->where(function ($q) use ($taxCategoryId) {
                $q->whereNull('tax_category_id');
                if ($taxCategoryId) {
                    $q->orWhere('tax_category_id', $taxCategoryId);
                }
            })
            ->get();

        if ($rules->isEmpty()) {
            return null;
        }

        // When we know the real same/different-state answer, an 'any' rule is a
        // valid match for either side, but a rule for the *other* side of the
        // comparison is not — e.g. a same_region order should never charge the
        // different_region rate. Rank the actually-applicable place_of_supply
        // values first; anything else sorts last (never picked unless it's all
        // that's left, which keeps this non-breaking for existing configs).
        if ($isSameRegion === true) {
            $placeOfSupplyPriority = ['same_region' => 0, 'any' => 1, 'different_region' => 2];
        } elseif ($isSameRegion === false) {
            $placeOfSupplyPriority = ['different_region' => 0, 'any' => 1, 'same_region' => 2];
        } else {
            $placeOfSupplyPriority = ['same_region' => 0, 'different_region' => 1, 'any' => 2];
        }

        $best = $rules->sort(function ($a, $b) use ($placeOfSupplyPriority) {
            $aSpecific = $a->tax_category_id !== null ? 0 : 1;
            $bSpecific = $b->tax_category_id !== null ? 0 : 1;
            if ($aSpecific !== $bSpecific) {
                return $aSpecific <=> $bSpecific;
            }
            return ($placeOfSupplyPriority[$a->place_of_supply] ?? 3) <=> ($placeOfSupplyPriority[$b->place_of_supply] ?? 3);
        })->first();

        return (float) $best->total_rate;
    }
}
