<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The store's own pincode — one store, one address, one pincode — kept as a real field instead of being read
 * out of the Google address text. Filled from the map search on the distributor form (editable), required
 * for a new distributor. Not the pincodes of the areas assigned to the distributor; that is a separate thing.
 * Nullable: distributors created before this get it from their Google address until it is saved once.
 */
class AddPincodeToSellersTable extends Migration
{
    public function up()
    {
        Schema::table('sellers', function (Blueprint $table) {
            if (!Schema::hasColumn('sellers', 'pincode')) {
                $table->string('pincode', 10)->nullable()->after('address_line2');
            }
        });
    }

    public function down()
    {
        Schema::table('sellers', function (Blueprint $table) {
            if (Schema::hasColumn('sellers', 'pincode')) {
                $table->dropColumn('pincode');
            }
        });
    }
}
