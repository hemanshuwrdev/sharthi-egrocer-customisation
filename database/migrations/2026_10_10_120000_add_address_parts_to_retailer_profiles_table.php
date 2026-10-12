<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Structured shop address captured at retailer registration. `address` stays as the combined
 * text everything else reads (invoices, salesman app, order fallback); these hold the parts.
 *
 * `city` is the plain-text city name the app prefills from area/search-by-pincode — NOT the
 * GPS-derived delivery zone, which stays in retailer_profiles.city_id.
 *
 * All nullable: existing retailers have no parts, and app builds that haven't shipped the
 * new fields yet must keep registering.
 */
class AddAddressPartsToRetailerProfilesTable extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('retailer_profiles')) {
            return;
        }

        Schema::table('retailer_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('retailer_profiles', 'address_line1')) {
                $table->string('address_line1')->nullable()->after('address');
            }
            if (!Schema::hasColumn('retailer_profiles', 'address_line2')) {
                $table->string('address_line2')->nullable()->after('address_line1');
            }
            if (!Schema::hasColumn('retailer_profiles', 'city')) {
                $table->string('city')->nullable()->after('address_line2');
            }
            if (!Schema::hasColumn('retailer_profiles', 'state')) {
                $table->string('state')->nullable()->after('city');
            }
        });
    }

    public function down()
    {
        if (!Schema::hasTable('retailer_profiles')) {
            return;
        }

        foreach (['state', 'city', 'address_line2', 'address_line1'] as $column) {
            if (Schema::hasColumn('retailer_profiles', $column)) {
                Schema::table('retailer_profiles', function (Blueprint $table) use ($column) {
                    $table->dropColumn($column);
                });
            }
        }
    }
}
