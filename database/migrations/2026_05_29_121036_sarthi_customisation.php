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
            $table->string('sku')->nullable()->after('type');
            $table->integer('secondary_unit_id')->nullable()->after('stock_unit_id')->comment('e.g., Box, Case, Bag');
            $table->float('secondary_unit_value', 8, 2)->nullable()->after('secondary_unit_id')->comment('How many primary units in secondary unit');
        });

        // 2. Brand Territory Control
        Schema::table('brands', function (Blueprint $table) {
            $table->tinyInteger('is_overlap_allowed')->default(1)->after('status')->comment('1: Multiple distributors allowed, 0: Exclusive to territory');
        });

        // 3. Distributor Territory Management
        Schema::table('sellers', function (Blueprint $table) {
            $table->text('managed_territories')->nullable()->after('city_id')->comment('Comma-separated City IDs owned by this distributor');
        });

        // 4. Brand-Distributor Territory Mapping
        Schema::create('brand_distributor_mappings', function (Blueprint $table) {
            $table->id();
            $table->integer('brand_id');
            $table->integer('seller_id');
            $table->integer('city_id');
            $table->timestamps();

            $table->index(['brand_id', 'city_id']);
            $table->index('seller_id');
        });

        // 5. Order Delivery Management
        Schema::table('orders', function (Blueprint $table) {
            $table->date('delivery_date')->nullable()->after('delivery_time')->comment('Assigned date based on cutoff rules');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('delivery_date');
        });

        Schema::dropIfExists('brand_distributor_mappings');

        Schema::table('sellers', function (Blueprint $table) {
            $table->dropColumn('managed_territories');
        });

        Schema::table('brands', function (Blueprint $table) {
            $table->dropColumn('is_overlap_allowed');
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropColumn(['sku', 'secondary_unit_id', 'secondary_unit_value']);
        });
    }
}
