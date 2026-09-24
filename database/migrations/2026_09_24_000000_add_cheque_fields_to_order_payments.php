<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddChequeFieldsToOrderPayments extends Migration
{
    /**
     * cheque_date/cheque_number are only ever set together with method='cheque' — see
     * SettlementController::sellerUpdatePaymentMethod(), which clears both whenever the
     * method is changed away from cheque.
     */
    public function up()
    {
        Schema::table('order_payments', function (Blueprint $table) {
            if (!Schema::hasColumn('order_payments', 'cheque_date')) {
                $table->date('cheque_date')->nullable()->after('received_amount');
            }
            if (!Schema::hasColumn('order_payments', 'cheque_number')) {
                $table->string('cheque_number')->nullable()->after('cheque_date');
            }
        });
    }

    public function down()
    {
        Schema::table('order_payments', function (Blueprint $table) {
            if (Schema::hasColumn('order_payments', 'cheque_number')) {
                $table->dropColumn('cheque_number');
            }
            if (Schema::hasColumn('order_payments', 'cheque_date')) {
                $table->dropColumn('cheque_date');
            }
        });
    }
}
