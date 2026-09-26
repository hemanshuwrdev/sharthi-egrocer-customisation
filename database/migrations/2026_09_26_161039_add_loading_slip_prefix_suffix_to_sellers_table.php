<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLoadingSlipPrefixSuffixToSellersTable extends Migration
{
    /**
     * loading_slip_next_number already exists (independent counter), but slip
     * numbers were still borrowing invoice_prefix/invoice_suffix — making a
     * loading slip visually indistinguishable from an actual invoice except
     * for the running number. Same reasoning as credit_note_prefix/suffix:
     * each document series needs its own prefix/suffix, not just its own count.
     */
    public function up()
    {
        Schema::table('sellers', function (Blueprint $table) {
            if (!Schema::hasColumn('sellers', 'loading_slip_prefix')) {
                // Default 'LS/' so a distributor who never touches this setting still
                // gets a slip series that reads as a slip (LS/0001), not a bare number.
                $table->string('loading_slip_prefix')->nullable()->default('LS/')->after('loading_slip_next_number');
            }
            if (!Schema::hasColumn('sellers', 'loading_slip_suffix')) {
                $table->string('loading_slip_suffix')->nullable()->after('loading_slip_prefix');
            }
        });

        // Backfill existing sellers whose prefix is still empty (either this ran
        // before with the old nullable-no-default version, or a row predates the
        // column existing at all) — new rows already get 'LS/' from the column
        // default above, this just catches ones that don't.
        \App\Models\Seller::whereNull('loading_slip_prefix')
            ->orWhere('loading_slip_prefix', '')
            ->update(['loading_slip_prefix' => 'LS/']);
    }

    public function down()
    {
        Schema::table('sellers', function (Blueprint $table) {
            if (Schema::hasColumn('sellers', 'loading_slip_suffix')) {
                $table->dropColumn('loading_slip_suffix');
            }
            if (Schema::hasColumn('sellers', 'loading_slip_prefix')) {
                $table->dropColumn('loading_slip_prefix');
            }
        });
    }
}
