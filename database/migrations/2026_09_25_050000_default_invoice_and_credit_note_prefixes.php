<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * "INV/" / "CN/" as the out-of-the-box prefix instead of a blank one — both fields
 * stay nullable and editable in Settings, this only changes what a distributor who
 * has never touched the setting sees. The DB default covers new sellers going
 * forward (seller creation never sets these columns itself, so the column default
 * applies automatically); the backfill covers sellers that already exist.
 */
class DefaultInvoiceAndCreditNotePrefixes extends Migration
{
    public function up()
    {
        Schema::table('sellers', function (Blueprint $table) {
            $table->string('invoice_prefix')->nullable()->default('INV/')->change();
            $table->string('credit_note_prefix')->nullable()->default('CN/')->change();
        });

        DB::table('sellers')->whereNull('invoice_prefix')->update(['invoice_prefix' => 'INV/']);
        DB::table('sellers')->whereNull('credit_note_prefix')->update(['credit_note_prefix' => 'CN/']);
    }

    public function down()
    {
        Schema::table('sellers', function (Blueprint $table) {
            $table->string('invoice_prefix')->nullable()->default(null)->change();
            $table->string('credit_note_prefix')->nullable()->default(null)->change();
        });
    }
}
