<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Salesman equivalent of loading_slips.payment_lock_status (driver side) — but a
 * salesman has no loading-slip/trip grouping, so the lock unit is the order itself:
 * a salesman locks one order once its payment is collected and (for non-cash
 * methods) manually verified by the distributor. Replaces needing to wait for the
 * whole-day EOD lock to confirm any single order is settled.
 */
class AddPaymentLockToOrdersTable extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'payment_lock_status')) {
                $table->enum('payment_lock_status', ['open', 'locked'])->default('open')->after('placed_by_salesman_id')
                    ->comment('Salesman-side lock: locked once this order\'s payment is collected and verified.');
            }
            if (!Schema::hasColumn('orders', 'payment_locked_at')) {
                $table->timestamp('payment_locked_at')->nullable()->after('payment_lock_status');
            }
            if (!Schema::hasColumn('orders', 'payment_locked_by')) {
                $table->unsignedBigInteger('payment_locked_by')->nullable()->after('payment_locked_at')
                    ->comment('salesmen.id of the salesman who locked it.');
            }
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            foreach (['payment_lock_status', 'payment_locked_at', 'payment_locked_by'] as $col) {
                if (Schema::hasColumn('orders', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
}
