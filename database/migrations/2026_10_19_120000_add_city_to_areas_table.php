<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * City name for an area, entered by the admin on the Area form. The retailer app prefills "city"
 * from it when a pincode is searched (area/search-by-pincode), replacing the guess that used to
 * be taken from the public postal API. Plain text: unrelated to `city_id`, which is the legacy
 * delivery-zone link and stays unused. Nullable so existing areas keep working (they fall back
 * to the postal guess until someone sets a city on them).
 */
class AddCityToAreasTable extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('areas') || Schema::hasColumn('areas', 'city')) {
            return;
        }

        Schema::table('areas', function (Blueprint $table) {
            $table->string('city', 191)->nullable()->after('district');
        });
    }

    public function down()
    {
        if (Schema::hasTable('areas') && Schema::hasColumn('areas', 'city')) {
            Schema::table('areas', function (Blueprint $table) {
                $table->dropColumn('city');
            });
        }
    }
}
