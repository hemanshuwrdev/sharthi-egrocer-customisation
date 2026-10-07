<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Snapshot of how a scheme discount treats tax, taken when the order is placed (same
 * reasoning as orders.scheme_id/scheme_discount: editing the scheme later must not rewrite
 * an old invoice).
 *
 *  - scheme_tax_option: the scheme's "Discount Option" (inclusive = before tax, exclusive =
 *    off the tax-inclusive total) at the time the order was placed.
 *  - scheme_discount_pretax: for a flat 'inclusive' discount, the before-tax part of
 *    scheme_discount — the invoice takes this off Net Taxable and shows the remainder
 *    (scheme_discount - this) as tax no longer charged. NULL when the discount has no
 *    before-tax part (exclusive, percentage, ...), in which case invoices print as before.
 *
 * Purely additive and nullable: existing orders and flows are unaffected.
 */
class AddSchemeTaxSnapshotToOrders extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'scheme_tax_option')) {
                $table->enum('scheme_tax_option', ['inclusive', 'exclusive'])->nullable()->after('scheme_discount');
            }
            if (!Schema::hasColumn('orders', 'scheme_discount_pretax')) {
                $table->decimal('scheme_discount_pretax', 15, 4)->nullable()->after('scheme_tax_option');
            }
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'scheme_discount_pretax')) {
                $table->dropColumn('scheme_discount_pretax');
            }
            if (Schema::hasColumn('orders', 'scheme_tax_option')) {
                $table->dropColumn('scheme_tax_option');
            }
        });
    }
}
