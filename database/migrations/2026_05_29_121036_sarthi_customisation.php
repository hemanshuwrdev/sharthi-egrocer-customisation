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

        // We will add future DDOS customizations (Vehicles, Brand Mappings, etc.) in this file later.
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

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['weight', 'loading_slip_id']);
        });

        Schema::dropIfExists('loading_slips');
        Schema::dropIfExists('vehicles');
    }
}
