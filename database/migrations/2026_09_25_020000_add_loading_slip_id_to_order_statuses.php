<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Reschedule nulls orders.loading_slip_id immediately, so there is no way to tell
 * which trip an order was rescheduled off of once it happens. This snapshots the
 * slip id into the "Rescheduled" order_statuses row at the moment of reschedule
 * (order_statuses already has no FKs at all, so this stays consistent with that).
 */
class AddLoadingSlipIdToOrderStatuses extends Migration
{
    public function up()
    {
        Schema::table('order_statuses', function (Blueprint $table) {
            if (!Schema::hasColumn('order_statuses', 'loading_slip_id')) {
                $table->unsignedBigInteger('loading_slip_id')->nullable()->after('order_item_id');
                $table->index('loading_slip_id', 'idx_os_loading_slip');
            }
        });
    }

    public function down()
    {
        Schema::table('order_statuses', function (Blueprint $table) {
            if (Schema::hasColumn('order_statuses', 'loading_slip_id')) {
                $table->dropIndex('idx_os_loading_slip');
                $table->dropColumn('loading_slip_id');
            }
        });
    }
}
