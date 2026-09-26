<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Credit notes are a document only — they record money that already moved via the
 * existing wallet flows (return approval, item-level cancel refund), generated once
 * per order at trip close. They do not themselves credit anything.
 * Numbering mirrors CommonHelper::resolveDistributorInvoiceNumber /
 * nextLoadingSlipNumber: one counter per seller, incremented under lockForUpdate() —
 * but with its own prefix/suffix pair (credit_note_prefix/suffix), not reusing the
 * invoice ones, since a credit note visually indistinguishable from an invoice
 * number is a real problem for a distributor's own bookkeeping.
 *
 * credit_note_no is unique PER SELLER, not globally — every distributor's numbering
 * is independent (this mirrors how orders.invoice_number already has no global
 * unique constraint at all, for the same reason: two different distributors will
 * both legitimately produce "0001" as their first document).
 */
class CreateCreditNotesTable extends Migration
{
    public function up()
    {
        Schema::table('sellers', function (Blueprint $table) {
            if (!Schema::hasColumn('sellers', 'credit_note_prefix')) {
                $table->string('credit_note_prefix')->nullable()->after('loading_slip_next_number');
            }
            if (!Schema::hasColumn('sellers', 'credit_note_suffix')) {
                $table->string('credit_note_suffix')->nullable()->after('credit_note_prefix');
            }
            if (!Schema::hasColumn('sellers', 'credit_note_next_number')) {
                $table->unsignedInteger('credit_note_next_number')->default(1)->after('credit_note_suffix');
            }
        });

        if (!Schema::hasTable('credit_notes')) {
            Schema::create('credit_notes', function (Blueprint $table) {
                $table->id();
                $table->string('credit_note_no');
                $table->unsignedBigInteger('seller_id');
                $table->unsignedBigInteger('driver_settlement_id')->nullable()->comment('Trip this was generated from, if any');
                $table->unsignedBigInteger('order_id');
                $table->unsignedBigInteger('retailer_id')->nullable();
                $table->enum('reason_type', ['return', 'cancel']);
                $table->decimal('total_amount', 15, 2)->default(0);
                $table->timestamp('generated_at')->nullable();
                $table->unsignedBigInteger('generated_by')->nullable()->comment('admins.id who closed the trip');
                $table->timestamps();

                // Numbering is per-seller, not global — two distributors can both have "0001".
                $table->unique(['seller_id', 'credit_note_no'], 'uniq_cn_seller_no');
                // At most one credit note per order per reason — re-closing a trip
                // (needs_rereconcile) must not generate duplicates for the same order.
                $table->unique(['order_id', 'reason_type'], 'uniq_cn_order_reason');
                $table->index('driver_settlement_id', 'idx_cn_settlement');
            });
        }

        if (!Schema::hasTable('credit_note_items')) {
            Schema::create('credit_note_items', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('credit_note_id');
                $table->unsignedBigInteger('order_item_id')->nullable();
                $table->string('product_name')->nullable();
                $table->string('variant_name')->nullable();
                $table->decimal('quantity', 10, 2)->default(1);
                $table->decimal('amount', 15, 2)->default(0);
                $table->timestamps();

                $table->foreign('credit_note_id')->references('id')->on('credit_notes')->onDelete('cascade');
                $table->index('order_item_id', 'idx_cni_order_item');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('credit_note_items');
        Schema::dropIfExists('credit_notes');

        Schema::table('sellers', function (Blueprint $table) {
            foreach (['credit_note_prefix', 'credit_note_suffix', 'credit_note_next_number'] as $col) {
                if (Schema::hasColumn('sellers', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
}
