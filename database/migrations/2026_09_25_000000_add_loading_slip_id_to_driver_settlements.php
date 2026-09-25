<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * driver_settlements was one row per driver per day, so a driver running two
 * separate loading-slip trips on the same day collapsed into a single row on
 * /seller/trips. loading_slip_id lets a settlement row represent one trip;
 * rows without a slip (legacy/slip-less payments) keep the old per-day grouping.
 */
class AddLoadingSlipIdToDriverSettlements extends Migration
{
    public function up()
    {
        Schema::table('driver_settlements', function (Blueprint $table) {
            if (!Schema::hasColumn('driver_settlements', 'loading_slip_id')) {
                $table->foreignId('loading_slip_id')->nullable()->after('delivery_boy_id')
                      ->constrained('loading_slips')->onDelete('set null');
            }
        });

        // delivery_boy_id's FK is backed by uniq_ds_driver_date (its leftmost column);
        // the replacement unique index must exist before the old one is dropped, or MySQL
        // refuses the drop for leaving the FK without a backing index.
        $existingIndexes = collect(DB::select('SHOW INDEX FROM driver_settlements'))->pluck('Key_name')->toArray();
        if (!in_array('uniq_ds_driver_slip_date', $existingIndexes)) {
            Schema::table('driver_settlements', function (Blueprint $table) {
                $table->unique(['delivery_boy_id', 'loading_slip_id', 'settlement_date'], 'uniq_ds_driver_slip_date');
            });
        }
        if (in_array('uniq_ds_driver_date', $existingIndexes)) {
            Schema::table('driver_settlements', function (Blueprint $table) {
                $table->dropUnique('uniq_ds_driver_date');
            });
        }
    }

    public function down()
    {
        // Same ordering concern as up(): keep delivery_boy_id's FK backed at all times.
        $existingIndexes = collect(DB::select('SHOW INDEX FROM driver_settlements'))->pluck('Key_name')->toArray();
        if (!in_array('uniq_ds_driver_date', $existingIndexes)) {
            Schema::table('driver_settlements', function (Blueprint $table) {
                $table->unique(['delivery_boy_id', 'settlement_date'], 'uniq_ds_driver_date');
            });
        }
        if (in_array('uniq_ds_driver_slip_date', $existingIndexes)) {
            Schema::table('driver_settlements', function (Blueprint $table) {
                $table->dropUnique('uniq_ds_driver_slip_date');
            });
        }

        Schema::table('driver_settlements', function (Blueprint $table) {
            if (Schema::hasColumn('driver_settlements', 'loading_slip_id')) {
                $table->dropConstrainedForeignId('loading_slip_id');
            }
        });
    }
}
