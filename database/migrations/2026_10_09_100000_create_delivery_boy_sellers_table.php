<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * A driver can work for several distributors. delivery_boys.seller_id keeps pointing at the
 * distributor who first added the driver, but who may see / assign / settle a driver is decided
 * by this link table (see DeliveryBoy::scopeForSeller()).
 */
class CreateDeliveryBoySellersTable extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('delivery_boy_sellers')) {
            Schema::create('delivery_boy_sellers', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('delivery_boy_id');
                $table->unsignedBigInteger('seller_id');
                $table->timestamps();

                $table->unique(['delivery_boy_id', 'seller_id'], 'uniq_dbs_driver_seller');
                $table->index('seller_id', 'idx_dbs_seller');
                $table->foreign('delivery_boy_id')->references('id')->on('delivery_boys')->onDelete('cascade');
                $table->foreign('seller_id')->references('id')->on('sellers')->onDelete('cascade');
            });
        }

        // Every existing driver stays linked to the distributor they belong to today.
        DB::statement('
            INSERT IGNORE INTO delivery_boy_sellers (delivery_boy_id, seller_id, created_at, updated_at)
            SELECT d.id, d.seller_id, NOW(), NOW()
            FROM delivery_boys d
            JOIN sellers s ON s.id = d.seller_id
            WHERE d.seller_id IS NOT NULL AND d.seller_id > 0
        ');
    }

    public function down()
    {
        Schema::dropIfExists('delivery_boy_sellers');
    }
}
