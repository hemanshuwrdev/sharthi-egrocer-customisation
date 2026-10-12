<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Typed Address Line 1 / Line 2 for a distributor. They replace the Google-search address
 * (`formatted_address`) wherever the distributor's address is printed or returned — loading slip,
 * invoices, credit notes, the trip PDF and the retailer app's order details — and fall back to the
 * Google address when empty, so existing distributors print exactly as before until filled in.
 * Both nullable: Line 1 is required on create only (SellerApiController::save).
 */
class AddAddressLinesToSellersTable extends Migration
{
    public function up()
    {
        Schema::table('sellers', function (Blueprint $table) {
            if (!Schema::hasColumn('sellers', 'address_line1')) {
                $table->string('address_line1')->nullable()->after('street');
            }
            if (!Schema::hasColumn('sellers', 'address_line2')) {
                $table->string('address_line2')->nullable()->after('address_line1');
            }
        });
    }

    public function down()
    {
        Schema::table('sellers', function (Blueprint $table) {
            if (Schema::hasColumn('sellers', 'address_line2')) {
                $table->dropColumn('address_line2');
            }
            if (Schema::hasColumn('sellers', 'address_line1')) {
                $table->dropColumn('address_line1');
            }
        });
    }
}
