<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddReceivedAmountToOrderPayments extends Migration
{
    /**
     * received_amount is the office-verified actual amount for this payment, separate
     * from amount (the driver/salesman's self-reported figure at collection time).
     * NULL means "not corrected yet" — callers treat that as equal to amount.
     */
    public function up()
    {
        Schema::table('order_payments', function (Blueprint $table) {
            if (!Schema::hasColumn('order_payments', 'received_amount')) {
                $table->decimal('received_amount', 10, 2)->nullable()->after('amount');
            }
        });
    }

    public function down()
    {
        Schema::table('order_payments', function (Blueprint $table) {
            if (Schema::hasColumn('order_payments', 'received_amount')) {
                $table->dropColumn('received_amount');
            }
        });
    }
}
