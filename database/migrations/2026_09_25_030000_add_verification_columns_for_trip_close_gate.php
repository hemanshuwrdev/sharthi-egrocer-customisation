<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * "Verify" on a Partial Invoice / Cancel Invoice row is a plain distributor
 * acknowledgment flag (same shape as order_payments.verified_by/verified_at),
 * gating final trip close/reconciliation. Purely additive, nullable columns —
 * nothing existing reads or writes these, so no other flow changes behavior.
 */
class AddVerificationColumnsForTripCloseGate extends Migration
{
    public function up()
    {
        Schema::table('order_items', function (Blueprint $table) {
            if (!Schema::hasColumn('order_items', 'shortfall_verified_at')) {
                $table->timestamp('shortfall_verified_at')->nullable()->after('shortfall_reason');
            }
            if (!Schema::hasColumn('order_items', 'shortfall_verified_by')) {
                $table->unsignedBigInteger('shortfall_verified_by')->nullable()->after('shortfall_verified_at');
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'cancel_verified_at')) {
                $table->timestamp('cancel_verified_at')->nullable()->after('loading_slip_id');
            }
            if (!Schema::hasColumn('orders', 'cancel_verified_by')) {
                $table->unsignedBigInteger('cancel_verified_by')->nullable()->after('cancel_verified_at');
            }
        });
    }

    public function down()
    {
        Schema::table('order_items', function (Blueprint $table) {
            if (Schema::hasColumn('order_items', 'shortfall_verified_by')) {
                $table->dropColumn('shortfall_verified_by');
            }
            if (Schema::hasColumn('order_items', 'shortfall_verified_at')) {
                $table->dropColumn('shortfall_verified_at');
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'cancel_verified_by')) {
                $table->dropColumn('cancel_verified_by');
            }
            if (Schema::hasColumn('orders', 'cancel_verified_at')) {
                $table->dropColumn('cancel_verified_at');
            }
        });
    }
}
