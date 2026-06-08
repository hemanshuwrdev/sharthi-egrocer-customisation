<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SarthiCustomisation extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // 1. Master Product System (Product Variants)
        Schema::table('product_variants', function (Blueprint $table) {
            if (!Schema::hasColumn('product_variants', 'sku')) {
                $table->string('sku')->nullable()->after('type');
            }
            if (!Schema::hasColumn('product_variants', 'secondary_unit_id')) {
                $table->integer('secondary_unit_id')->nullable()->after('stock_unit_id')->comment('e.g., Box, Case, Bag');
            }
            if (!Schema::hasColumn('product_variants', 'secondary_unit_value')) {
                $table->float('secondary_unit_value', 8, 2)->nullable()->after('secondary_unit_id')->comment('How many primary units in secondary unit');
            }
        });

        if (!Schema::hasTable('vehicles_and_dispatches_tables')) {
            Schema::create('vehicles_and_dispatches_tables', function (Blueprint $table) {
                $table->id();
                $table->timestamps();
            });
        }

        // Vehicles Table
        if (!Schema::hasTable('vehicles')) {
            Schema::create('vehicles', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('vehicle_number')->unique();
                $table->double('capacity', 8, 2);
                $table->tinyInteger('status')->default(1);
                $table->timestamps();
            });
        }

        // Loading Slips Table
        if (!Schema::hasTable('loading_slips')) {
            Schema::create('loading_slips', function (Blueprint $table) {
                $table->id();
                $table->string('slip_no')->unique();
                $table->foreignId('vehicle_id')->constrained('vehicles')->onDelete('cascade');
                $table->foreignId('driver_id')->constrained('delivery_boys')->onDelete('cascade');
                $table->tinyInteger('status')->default(0);
                $table->double('total_weight', 8, 2)->default(0.00);
                $table->integer('total_items')->default(0);
                $table->integer('total_orders')->default(0);
                $table->foreignId('created_by')->constrained('admins')->onDelete('cascade');
                $table->timestamps();
            });
        }

        // Add weight and loading_slip_id to orders table
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'weight')) {
                $table->double('weight', 8, 2)->nullable()->after('final_total');
            }
            if (!Schema::hasColumn('orders', 'loading_slip_id')) {
                $table->foreignId('loading_slip_id')->nullable()->constrained('loading_slips')->onDelete('set null')->after('weight');
            }
        });      

        // 2. Slab (Bulk) Pricing per variant
        // Schema::create('product_slab_prices', function (Blueprint $table) {
        //     $table->bigIncrements('id');
        //     $table->unsignedBigInteger('product_variant_id');
        //     $table->unsignedInteger('min_qty');
        //     $table->unsignedInteger('max_qty')->nullable()->comment('NULL = open-ended (e.g. "50+")');
        //     $table->decimal('price', 15, 4);
        //     $table->timestamps();

        //     $table->foreign('product_variant_id')
        //         ->references('id')->on('product_variants')
        //         ->onDelete('cascade');

        //     $table->index(['product_variant_id', 'min_qty'], 'idx_psp_variant_minqty');
        // });

        // 3. Slab snapshot + master catalog references on order_items (frozen at order time)
        Schema::table('order_items', function (Blueprint $table) {
            if (!Schema::hasColumn('order_items', 'slab_unit_price')) {
                $table->decimal('slab_unit_price', 15, 4)->nullable()->after('discounted_price');
            }
            if (!Schema::hasColumn('order_items', 'slab_min_qty')) {
                $table->unsignedInteger('slab_min_qty')->nullable()->after('slab_unit_price');
            }
            if (!Schema::hasColumn('order_items', 'slab_max_qty')) {
                $table->unsignedInteger('slab_max_qty')->nullable()->after('slab_min_qty');
            }
            if (!Schema::hasColumn('order_items', 'master_product_variant_id')) {
                $table->unsignedBigInteger('master_product_variant_id')->nullable()->after('product_variant_id');
                $table->index('master_product_variant_id', 'idx_oi_master_variant');
            }
            if (!Schema::hasColumn('order_items', 'seller_product_id')) {
                $table->unsignedBigInteger('seller_product_id')->nullable()->after('master_product_variant_id');
                $table->index('seller_product_id', 'idx_oi_seller_product');
            }
        });

        // 3c. Master catalog references on carts (retailer can have master + legacy items)
        if (Schema::hasTable('carts')) {
            Schema::table('carts', function (Blueprint $table) {
                if (!Schema::hasColumn('carts', 'master_product_variant_id')) {
                    $table->unsignedBigInteger('master_product_variant_id')->nullable()->after('product_variant_id');
                    $table->index('master_product_variant_id', 'idx_carts_master_variant');
                }
                if (!Schema::hasColumn('carts', 'seller_id')) {
                    $table->unsignedBigInteger('seller_id')->nullable()->after('master_product_variant_id');
                    $table->index('seller_id', 'idx_carts_seller');
                }
                if (!Schema::hasColumn('carts', 'seller_product_id')) {
                    $table->unsignedBigInteger('seller_product_id')->nullable()->after('seller_id');
                }
            });
        }

        // 3b. Same snapshot fields on pos_order_items so POS sales can reference master catalog too.
        Schema::table('pos_order_items', function (Blueprint $table) {
            if (!Schema::hasColumn('pos_order_items', 'master_product_variant_id')) {
                $table->unsignedBigInteger('master_product_variant_id')->nullable()->after('product_variant_id');
                $table->index('master_product_variant_id', 'idx_poi_master_variant');
            }
            if (!Schema::hasColumn('pos_order_items', 'seller_product_id')) {
                $table->unsignedBigInteger('seller_product_id')->nullable()->after('master_product_variant_id');
                $table->index('seller_product_id', 'idx_poi_seller_product');
            }
            if (!Schema::hasColumn('pos_order_items', 'slab_unit_price')) {
                $table->decimal('slab_unit_price', 15, 4)->nullable()->after('total_price');
            }
            if (!Schema::hasColumn('pos_order_items', 'slab_min_qty')) {
                $table->unsignedInteger('slab_min_qty')->nullable()->after('slab_unit_price');
            }
            if (!Schema::hasColumn('pos_order_items', 'slab_max_qty')) {
                $table->unsignedInteger('slab_max_qty')->nullable()->after('slab_min_qty');
            }
        });

        // 4. Brand overlap flag (multiple distributors for same brand)
        Schema::table('brands', function (Blueprint $table) {
            if (!Schema::hasColumn('brands', 'is_overlap_allowed')) {
                $table->tinyInteger('is_overlap_allowed')->default(0)->after('status')
                    ->comment('1 = multiple distributors can deliver this brand in same area');
            }
        });

        // 5. Per-distributor order cutoff time
        // NOTE: managed_territories was dropped — sellers.city_id is already a CSV of city IDs.
        Schema::table('sellers', function (Blueprint $table) {
            if (!Schema::hasColumn('sellers', 'order_cutoff_time')) {
                $table->string('order_cutoff_time', 5)->nullable()->after('city_id')
                    ->comment('HH:MM 24h. Per-distributor order cutoff. At/before this time -> next-day delivery; after -> day-after.');
            }
        });

        // 6. Brand → Distributor → City mapping (territory control)
        if (!Schema::hasTable('brand_distributor_mappings')) {
            Schema::create('brand_distributor_mappings', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('brand_id');
                $table->unsignedBigInteger('seller_id');
                $table->unsignedBigInteger('city_id');
                $table->timestamps();

                $table->unique(['brand_id', 'seller_id', 'city_id'], 'uniq_bdm_brand_seller_city');
                $table->index('brand_id', 'idx_bdm_brand');
                $table->index('seller_id', 'idx_bdm_seller');
                $table->index('city_id', 'idx_bdm_city');
            });
        }

        // 7. Order cutoff / delivery date (3 PM rule)

        // Schema::table('orders', function (Blueprint $table) {
        //     $table->date('delivery_date')->nullable()->after('delivery_time')
        //         ->comment('Auto-tagged delivery date per cutoff rule');
        // });
        
        
        
        Schema::table('orders', function (Blueprint $table) {
    if (!Schema::hasColumn('orders', 'delivery_date')) {
        $table->date('delivery_date')
            ->nullable()
            ->after('delivery_time')
            ->comment('Auto-tagged delivery date per cutoff rule');
    }
});

        // 9. Master Catalog: Parent Companies (e.g., Nestlé, ITC, HUL)
        if (!Schema::hasTable('parent_companies')) {
            Schema::create('parent_companies', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
                $table->tinyInteger('status')->default(1);
                $table->timestamps();
            });
        }

        // 10. Master Catalog: Products (super admin owned catalog)
        if (!Schema::hasTable('master_products')) {
            Schema::create('master_products', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->nullable();
                $table->unsignedBigInteger('parent_company_id')->nullable();
                $table->unsignedBigInteger('brand_id')->nullable();
                $table->unsignedBigInteger('category_id')->nullable();
                $table->unsignedBigInteger('tax_id')->nullable();
                $table->string('hsn')->nullable();
                $table->string('image')->nullable();
                $table->text('other_images')->nullable()->comment('JSON array of additional image paths');
                $table->text('short_description')->nullable();
                $table->longText('description')->nullable();
                $table->string('type')->default('single')->comment('single | variable');
                $table->tinyInteger('status')->default(1);
                $table->unsignedBigInteger('created_by')->nullable();
                $table->timestamps();

                $table->index('parent_company_id', 'idx_mp_parent');
                $table->index('brand_id', 'idx_mp_brand');
                $table->index('category_id', 'idx_mp_category');
            });
        }

        // 11. Master Catalog: Variants (SKU + unit + secondary unit + weight)
        if (!Schema::hasTable('master_product_variants')) {
            Schema::create('master_product_variants', function (Blueprint $table) {
                $table->id();
                $table->foreignId('master_product_id')->constrained('master_products')->onDelete('cascade');
                $table->string('sku')->nullable();
                $table->unsignedBigInteger('unit_id')->nullable();
                $table->unsignedBigInteger('secondary_unit_id')->nullable()->comment('e.g., Box, Case, Bag');
                $table->float('secondary_unit_value', 8, 2)->nullable()->comment('How many primary units in secondary unit');
                $table->double('weight', 10, 3)->nullable();
                $table->string('image')->nullable();
                $table->tinyInteger('status')->default(1);
                $table->timestamps();

                $table->index('master_product_id', 'idx_mpv_product');
                $table->index('sku', 'idx_mpv_sku');
            });
        }

        // 11a. Master Catalog: SEO columns on master_products (default-language fallback)
        Schema::table('master_products', function (Blueprint $table) {
            if (!Schema::hasColumn('master_products', 'meta_title')) {
                $table->string('meta_title')->nullable()->after('description');
            }
            if (!Schema::hasColumn('master_products', 'meta_keywords')) {
                $table->text('meta_keywords')->nullable()->after('meta_title');
            }
            if (!Schema::hasColumn('master_products', 'meta_description')) {
                $table->text('meta_description')->nullable()->after('meta_keywords');
            }
            if (!Schema::hasColumn('master_products', 'schema_markup')) {
                $table->text('schema_markup')->nullable()->after('meta_description');
            }
        });

        // 11b. Master Catalog: Translations (per-language name / description / SEO fields)
        if (!Schema::hasTable('master_product_translations')) {
            Schema::create('master_product_translations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('master_product_id');
                $table->unsignedBigInteger('language_id');
                $table->string('name')->nullable();
                $table->longText('description')->nullable();
                $table->string('meta_title')->nullable();
                $table->text('meta_keywords')->nullable();
                $table->text('schema_markup')->nullable();
                $table->text('meta_description')->nullable();
                $table->timestamps();

                $table->unique(['master_product_id', 'language_id'], 'uniq_mpt_product_language');
                $table->foreign('master_product_id', 'fk_mpt_product')
                    ->references('id')->on('master_products')->onDelete('cascade');
                $table->foreign('language_id', 'fk_mpt_language')
                    ->references('id')->on('languages')->onDelete('cascade');
            });
        }

        // 12. Seller (Distributor) Product Control: per-seller activation, mrp, selling price, stock
        if (!Schema::hasTable('seller_products')) {
            Schema::create('seller_products', function (Blueprint $table) {
                $table->id();
                $table->foreignId('seller_id')->constrained('sellers')->onDelete('cascade');
                $table->foreignId('master_product_variant_id')->constrained('master_product_variants')->onDelete('cascade');
                $table->decimal('mrp', 15, 4)->default(0);
                $table->decimal('selling_price', 15, 4)->default(0);
                $table->decimal('discounted_price', 15, 4)->nullable();
                $table->double('stock', 12, 3)->default(0);
                $table->tinyInteger('status')->default(1)->comment('1 = activated by distributor');
                $table->timestamps();

                $table->unique(['seller_id', 'master_product_variant_id'], 'uniq_sp_seller_variant');
                $table->index('seller_id', 'idx_sp_seller');
                $table->index('master_product_variant_id', 'idx_sp_variant');
            });
        }

        // 13. Seller Slab (Bulk) Pricing per seller_product
        if (!Schema::hasTable('seller_product_slab_prices')) {
            Schema::create('seller_product_slab_prices', function (Blueprint $table) {
                $table->id();
                $table->foreignId('seller_product_id')->constrained('seller_products')->onDelete('cascade');
                $table->unsignedInteger('min_qty');
                $table->unsignedInteger('max_qty')->nullable()->comment('NULL = open-ended (e.g. "50+")');
                $table->decimal('price', 15, 4);
                $table->timestamps();

                $table->index(['seller_product_id', 'min_qty'], 'idx_spsp_sp_minqty');
            });
        }

        // 8. Salesmen Table (onboarded by distributor)
        if (!Schema::hasTable('salesmen')) {
            Schema::create('salesmen', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('mobile')->unique();
                $table->foreignId('seller_id')->constrained('sellers')->onDelete('cascade')->comment('Distributor who onboarded the salesman');
                $table->text('brands')->comment('JSON array or CSV of assigned brand IDs');
                $table->boolean('allow_payment_collection')->default(false);
                $table->decimal('discount', 8, 2)->nullable()->comment('Discount percentage or amount');
                $table->tinyInteger('status')->default(1);
                $table->timestamps();
            });
        } else {
            Schema::table('salesmen', function (Blueprint $table) {
                if (!Schema::hasColumn('salesmen', 'discount')) {
                    $table->decimal('discount', 8, 2)->nullable()->after('allow_payment_collection')->comment('Discount percentage or amount');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Master catalog (reverse FK order)
        Schema::dropIfExists('seller_product_slab_prices');
        Schema::dropIfExists('seller_products');
        Schema::dropIfExists('master_product_translations');
        Schema::dropIfExists('master_product_variants');
        Schema::dropIfExists('master_products');
        Schema::dropIfExists('parent_companies');

        if (Schema::hasColumn('orders', 'delivery_date')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropColumn('delivery_date');
            });
        }


        Schema::dropIfExists('brand_distributor_mappings');

        Schema::table('sellers', function (Blueprint $table) {
            if (Schema::hasColumn('sellers', 'order_cutoff_time')) {
                $table->dropColumn('order_cutoff_time');
            }
        });

        if (Schema::hasColumn('brands', 'is_overlap_allowed')) {
            Schema::table('brands', function (Blueprint $table) {
                $table->dropColumn('is_overlap_allowed');
            });
        }

        Schema::table('order_items', function (Blueprint $table) {
            foreach (['slab_unit_price', 'slab_min_qty', 'slab_max_qty', 'master_product_variant_id', 'seller_product_id'] as $col) {
                if (Schema::hasColumn('order_items', $col)) {
                    $table->dropColumn($col);
                }
            }
        });

        if (Schema::hasTable('pos_order_items')) {
            Schema::table('pos_order_items', function (Blueprint $table) {
                foreach (['slab_unit_price', 'slab_min_qty', 'slab_max_qty', 'master_product_variant_id', 'seller_product_id'] as $col) {
                    if (Schema::hasColumn('pos_order_items', $col)) {
                        $table->dropColumn($col);
                    }
                }
            });
        }

        if (Schema::hasTable('carts')) {
            Schema::table('carts', function (Blueprint $table) {
                foreach (['master_product_variant_id', 'seller_id', 'seller_product_id'] as $col) {
                    if (Schema::hasColumn('carts', $col)) {
                        $table->dropColumn($col);
                    }
                }
            });
        }

        Schema::dropIfExists('product_slab_prices');

        Schema::table('product_variants', function (Blueprint $table) {
            if (Schema::hasColumn('product_variants', 'sku')) {
                $table->dropColumn('sku');
            }
            if (Schema::hasColumn('product_variants', 'secondary_unit_id')) {
                $table->dropColumn('secondary_unit_id');
            }
            if (Schema::hasColumn('product_variants', 'secondary_unit_value')) {
                $table->dropColumn('secondary_unit_value');
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'weight')) {
                $table->dropColumn('weight');
            }
            if (Schema::hasColumn('orders', 'loading_slip_id')) {
                $table->dropColumn('loading_slip_id');
            }
        });

        Schema::dropIfExists('loading_slips');
        Schema::dropIfExists('vehicles');
        Schema::dropIfExists('vehicles_and_dispatches_tables');
        Schema::dropIfExists('salesmen');

    }
}
