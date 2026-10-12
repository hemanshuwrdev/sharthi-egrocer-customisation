<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Structured new address on a retailer address-change request, applied to
 * retailer_profiles.address_line1/line2/city/state when a salesman verifies the move
 * (see 2026_10_10_120000_add_address_parts_to_retailer_profiles_table).
 *
 * `new_city_name` is the plain-text city, deliberately not `new_city_id` — that is the
 * GPS-derived delivery zone. All nullable so app builds that only send `new_address` keep working.
 */
class AddAddressPartsToRetailerAddressChangeRequestsTable extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('retailer_address_change_requests')) {
            return;
        }

        Schema::table('retailer_address_change_requests', function (Blueprint $table) {
            if (!Schema::hasColumn('retailer_address_change_requests', 'new_address_line1')) {
                $table->string('new_address_line1')->nullable()->after('new_address');
            }
            if (!Schema::hasColumn('retailer_address_change_requests', 'new_address_line2')) {
                $table->string('new_address_line2')->nullable()->after('new_address_line1');
            }
            if (!Schema::hasColumn('retailer_address_change_requests', 'new_city_name')) {
                $table->string('new_city_name')->nullable()->after('new_address_line2');
            }
            if (!Schema::hasColumn('retailer_address_change_requests', 'new_state')) {
                $table->string('new_state')->nullable()->after('new_city_name');
            }
        });
    }

    public function down()
    {
        if (!Schema::hasTable('retailer_address_change_requests')) {
            return;
        }

        foreach (['new_state', 'new_city_name', 'new_address_line2', 'new_address_line1'] as $column) {
            if (Schema::hasColumn('retailer_address_change_requests', $column)) {
                Schema::table('retailer_address_change_requests', function (Blueprint $table) use ($column) {
                    $table->dropColumn($column);
                });
            }
        }
    }
}
