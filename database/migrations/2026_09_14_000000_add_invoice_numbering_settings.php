<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddInvoiceNumberingSettings extends Migration
{
    public function up()
    {
        Schema::table('sellers', function (Blueprint $table) {
            if (!Schema::hasColumn('sellers', 'invoice_prefix')) {
                $table->string('invoice_prefix')->nullable()->after('thermal_paper_width');
            }
            if (!Schema::hasColumn('sellers', 'invoice_suffix')) {
                $table->string('invoice_suffix')->nullable()->after('invoice_prefix');
            }
            if (!Schema::hasColumn('sellers', 'invoice_next_number')) {
                // Next number to assign to this distributor's next order invoice.
                $table->unsignedInteger('invoice_next_number')->default(1)->after('invoice_suffix');
            }
            if (!Schema::hasColumn('sellers', 'loading_slip_next_number')) {
                // Independent counter — a loading slip is its own document, not an invoice.
                $table->unsignedInteger('loading_slip_next_number')->default(1)->after('invoice_next_number');
            }
        });

        // Checkout (RetailerCartOrderApiController::placeOrder) groups the cart by
        // seller_id and creates one Order per seller — so every order belongs to
        // exactly one distributor. The number is assigned once, on first view, and
        // stored here so every later view shows the same number.
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'invoice_number')) {
                $table->string('invoice_number')->nullable()->after('orders_id');
            }
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'invoice_number')) {
                $table->dropColumn('invoice_number');
            }
        });

        Schema::table('sellers', function (Blueprint $table) {
            foreach (['invoice_prefix', 'invoice_suffix', 'invoice_next_number', 'loading_slip_next_number'] as $col) {
                if (Schema::hasColumn('sellers', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
}
