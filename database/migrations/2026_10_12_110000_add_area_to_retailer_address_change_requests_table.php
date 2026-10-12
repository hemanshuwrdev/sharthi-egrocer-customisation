<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Area + pincode on a retailer address-change request. `new_area_id` is the Area the retailer
 * picked in the app's pincode-search picker (same as `area_id` at registration / on saved
 * addresses) and is applied to retailer_profiles.area_id when a salesman verifies the move;
 * `new_pincode` is the pincode that was entered (or the chosen area's, when the app sent only
 * the area). Both nullable so app builds that send neither keep working.
 */
class AddAreaToRetailerAddressChangeRequestsTable extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('retailer_address_change_requests')) {
            return;
        }

        Schema::table('retailer_address_change_requests', function (Blueprint $table) {
            if (!Schema::hasColumn('retailer_address_change_requests', 'new_area_id')) {
                $table->unsignedBigInteger('new_area_id')->nullable()->after('new_state');
            }
            if (!Schema::hasColumn('retailer_address_change_requests', 'new_pincode')) {
                $table->string('new_pincode', 10)->nullable()->after('new_area_id');
            }
        });
    }

    public function down()
    {
        if (!Schema::hasTable('retailer_address_change_requests')) {
            return;
        }

        foreach (['new_pincode', 'new_area_id'] as $column) {
            if (Schema::hasColumn('retailer_address_change_requests', $column)) {
                Schema::table('retailer_address_change_requests', function (Blueprint $table) use ($column) {
                    $table->dropColumn($column);
                });
            }
        }
    }
}
