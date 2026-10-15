<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterProduct extends Model
{
    use HasFactory, HasTranslations, LogsActivity;
    protected $table = 'master_products';

    protected $fillable = [
        'name',
        'slug',
        'parent_company_id',
        'brand_id',
        'brand_line_id',
        'category_id',
        'tax_id',
        'tax_category_id',
        'hsn',
        'image',
        'other_images',
        'short_description',
        'description',
        'meta_title',
        'meta_keywords',
        'meta_description',
        'schema_markup',
        'type',
        'status',
        'created_by',
    ];

    protected $casts = [
        'other_images' => 'array',
    ];

    protected $translatable = [
        'name',
        'description',
        'meta_title',
        'meta_keywords',
        'schema_markup',
        'meta_description',
    ];

    protected $translationModel = 'MasterProductTranslation';
    protected $translationForeignKey = 'master_product_id';

    public function parentCompany()
    {
        return $this->belongsTo(ParentCompany::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function brandLine()
    {
        return $this->belongsTo(BrandLine::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function variants()
    {
        return $this->hasMany(MasterProductVariant::class);
    }

    /**
     * Language key when any variant of this product is listed by a distributor or sits on an order,
     * else null. Deleting it would cascade away every distributor's listing, price and stock for it
     * (seller_products are ON DELETE CASCADE from the variants) and leave old orders without their
     * HSN / unit in the Tally exports. An unlisted, never-ordered product can still be deleted.
     */
    public function inUseBlockReason(): ?string
    {
        $variantIds = MasterProductVariant::where('master_product_id', $this->id)->pluck('id');

        return MasterProductVariant::anyInUse($variantIds) ? 'master_product_in_use_cannot_delete' : null;
    }

    // legacy tax_id path disabled — use tax_category_id/TaxRule instead (no longer read anywhere live)
    public function tax()
    {
        return $this->belongsTo(Tax::class, 'tax_id', 'id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('MasterProduct');
    }
}
