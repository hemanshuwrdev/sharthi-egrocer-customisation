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

        // 3. Slab snapshot on order_items (frozen at order time)
        // Schema::table('order_items', function (Blueprint $table) {
        //     $table->decimal('slab_unit_price', 15, 4)->nullable()->after('discounted_price');
        //     $table->unsignedInteger('slab_min_qty')->nullable()->after('slab_unit_price');
        //     $table->unsignedInteger('slab_max_qty')->nullable()->after('slab_min_qty');
        // });

        // 4. Brand overlap flag (multiple distributors for same brand)
        // Schema::table('brands', function (Blueprint $table) {
        //     $table->tinyInteger('is_overlap_allowed')->default(0)->after('status')
        //         ->comment('1 = multiple distributors can deliver this brand in same area');
        // });

        // 5. Per-distributor order cutoff time
        // NOTE: managed_territories was dropped — sellers.city_id is already a CSV of city IDs.
        Schema::table('sellers', function (Blueprint $table) {
            if (!Schema::hasColumn('sellers', 'order_cutoff_time')) {
                $table->string('order_cutoff_time', 5)->nullable()->after('city_id')
                    ->comment('HH:MM 24h. Per-distributor order cutoff. At/before this time -> next-day delivery; after -> day-after.');
            }
        });

        // 6. Brand → Distributor → City mapping (territory control)
        // Schema::create('brand_distributor_mappings', function (Blueprint $table) {
        //     $table->bigIncrements('id');
        //     $table->unsignedBigInteger('brand_id');
        //     $table->unsignedBigInteger('seller_id');
        //     $table->unsignedBigInteger('city_id');
        //     $table->timestamps();

        //     $table->unique(['brand_id', 'seller_id', 'city_id'], 'uniq_bdm_brand_seller_city');
        //     $table->index('brand_id', 'idx_bdm_brand');
        //     $table->index('seller_id', 'idx_bdm_seller');
        //     $table->index('city_id', 'idx_bdm_city');
        // });

        // 7. Order cutoff / delivery date (3 PM rule)

        Schema::table('orders', function (Blueprint $table) {
            $table->date('delivery_date')->nullable()->after('delivery_time')
                ->comment('Auto-tagged delivery date per cutoff rule');
        });
        
        // 8. Salesmen Table (onboarded by distributor)
        if (!Schema::hasTable('salesmen')) {
            Schema::create('salesmen', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('mobile')->unique();
                $table->foreignId('seller_id')->constrained('sellers')->onDelete('cascade')->comment('Distributor who onboarded the salesman');
                $table->text('brands')->comment('JSON array or CSV of assigned brand IDs');
                $table->boolean('allow_payment_collection')->default(false);
                $table->tinyInteger('status')->default(1);
                $table->timestamps();
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
            $table->dropColumn(['slab_unit_price', 'slab_min_qty', 'slab_max_qty']);
        });

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
