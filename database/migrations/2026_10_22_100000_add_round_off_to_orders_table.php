<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Order totals are rounded to the nearest rupee when the order is placed (CommonHelper::roundOrderTotal);
 * this keeps the paise that rounding added or took off (e.g. +0.20 for 20,424.80 -> 20,425.00) so the invoice
 * can show it as its own "Round Off" line. 0 on orders placed before this, which keep their exact totals.
 */
class AddRoundOffToOrdersTable extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'round_off')) {
                $table->decimal('round_off', 8, 2)->default(0)->after('final_total');
            }
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'round_off')) {
                $table->dropColumn('round_off');
            }
        });
    }
}
