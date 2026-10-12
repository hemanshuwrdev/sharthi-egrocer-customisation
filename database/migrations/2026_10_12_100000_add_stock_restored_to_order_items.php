<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Orders take stock out at placement, and nothing on the trip flow ever gave it back. Verify
 * on a Partial Invoice / Cancel Invoice row now restocks the goods that physically came
 * back. stock_restored_at is the "already done" claim that makes that happen at most once per
 * order item (double-click, re-verify, re-close), stock_restored_qty records how much went
 * back. Purely additive, nullable columns.
 */
class AddStockRestoredToOrderItems extends Migration
{
    public function up()
    {
        Schema::table('order_items', function (Blueprint $table) {
            if (!Schema::hasColumn('order_items', 'stock_restored_at')) {
                $table->timestamp('stock_restored_at')->nullable()->after('shortfall_verified_by');
            }
            if (!Schema::hasColumn('order_items', 'stock_restored_qty')) {
                $table->decimal('stock_restored_qty', 12, 3)->nullable()->after('stock_restored_at');
            }
        });
    }

    public function down()
    {
        Schema::table('order_items', function (Blueprint $table) {
            if (Schema::hasColumn('order_items', 'stock_restored_qty')) {
                $table->dropColumn('stock_restored_qty');
            }
            if (Schema::hasColumn('order_items', 'stock_restored_at')) {
                $table->dropColumn('stock_restored_at');
            }
        });
    }
}
