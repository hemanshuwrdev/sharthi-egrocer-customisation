<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Address Line 1 / 2 of the delivery address, saved on the order the way `address` already is — a snapshot
 * of what the retailer's address was when they ordered (taken from their profile by the server, nothing
 * extra for the retailer app to send). Nullable: orders placed before this, and orders from retailers who
 * registered before the lines existed, have only the one-line `address`.
 */
class AddAddressLinesToOrdersTable extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'address_line1')) {
                $table->string('address_line1')->nullable()->after('address');
            }
            if (!Schema::hasColumn('orders', 'address_line2')) {
                $table->string('address_line2')->nullable()->after('address_line1');
            }
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'address_line2')) {
                $table->dropColumn('address_line2');
            }
            if (Schema::hasColumn('orders', 'address_line1')) {
                $table->dropColumn('address_line1');
            }
        });
    }
}
