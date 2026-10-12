<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Every delivery zone a retailer's shop sits in. Zones can overlap but retailer_profiles.city_id keeps
 * only the first match, which made the salesman app say "not in your area" for a distributor whose
 * territory is a different zone covering the same spot. See RetailerZoneService.
 */
class CreateRetailerProfileCitiesTable extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('retailer_profile_cities')) {
            Schema::create('retailer_profile_cities', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('city_id');
                $table->timestamps();

                $table->unique(['user_id', 'city_id'], 'uniq_rpc_user_city');
                $table->index('city_id', 'idx_rpc_city');
            });
        }

        // Fill it for every retailer that already exists.
        try {
            (new \App\Services\RetailerZoneService())->syncAll();
        } catch (\Throwable $e) {
            \Log::error('retailer_profile_cities backfill failed — run `php artisan retailers:sync-zones`: ' . $e->getMessage());
        }
    }

    public function down()
    {
        Schema::dropIfExists('retailer_profile_cities');
    }
}
