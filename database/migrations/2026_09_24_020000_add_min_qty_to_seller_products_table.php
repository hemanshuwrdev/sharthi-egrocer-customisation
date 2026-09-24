<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMinQtyToSellerProductsTable extends Migration
{
    public function up()
    {
        if (Schema::hasTable('seller_products')) {
            Schema::table('seller_products', function (Blueprint $table) {
                if (!Schema::hasColumn('seller_products', 'min_qty')) {
                    $table->unsignedInteger('min_qty')->nullable()->after('max_qty_value');
                }
            });
        }
    }

    public function down()
    {
        if (Schema::hasTable('seller_products')) {
            Schema::table('seller_products', function (Blueprint $table) {
                if (Schema::hasColumn('seller_products', 'min_qty')) {
                    $table->dropColumn('min_qty');
                }
            });
        }
    }
}
