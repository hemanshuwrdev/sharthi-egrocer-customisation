<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCashDiscountApplicableOnToSellersTable extends Migration
{
    public function up()
    {
        Schema::table('sellers', function (Blueprint $table) {
            if (!Schema::hasColumn('sellers', 'cash_discount_applicable_on')) {
                $table->enum('cash_discount_applicable_on', ['driver', 'salesman', 'both'])
                    ->default('driver')
                    ->after('cash_discount_percent')
                    ->comment('Specifies whether cash discount applies to driver on delivery, salesman on collection, or both');
            }
        });
    }

    public function down()
    {
        Schema::table('sellers', function (Blueprint $table) {
            if (Schema::hasColumn('sellers', 'cash_discount_applicable_on')) {
                $table->dropColumn('cash_discount_applicable_on');
            }
        });
    }
}
