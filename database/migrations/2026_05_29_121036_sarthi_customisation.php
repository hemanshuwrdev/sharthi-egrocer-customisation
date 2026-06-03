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

        if (Schema::hasColumn('sellers', 'managed_territories')) {
            Schema::table('sellers', function (Blueprint $table) {
                $table->dropColumn('managed_territories');
            });
        }

        if (Schema::hasColumn('brands', 'is_overlap_allowed')) {
            Schema::table('brands', function (Blueprint $table) {
                $table->dropColumn('is_overlap_allowed');
            });
        }

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
    }
}
