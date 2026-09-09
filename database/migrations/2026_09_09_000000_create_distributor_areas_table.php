<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDistributorAreasTable extends Migration
{
    /**
     * Distributor <-> Area assignment (territory the distributor covers), independent
     * of brand. Separate from brand_distributor_mappings, which maps a brand to a
     * distributor within a city.
     */
    public function up()
    {
        if (!Schema::hasTable('distributor_areas')) {
            Schema::create('distributor_areas', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('seller_id');
                $table->unsignedBigInteger('area_id');
                $table->timestamps();

                $table->unique(['seller_id', 'area_id'], 'uniq_distributor_area_seller_area');
                $table->index('seller_id', 'idx_distributor_area_seller');
                $table->index('area_id', 'idx_distributor_area_area');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('distributor_areas');
    }
}
