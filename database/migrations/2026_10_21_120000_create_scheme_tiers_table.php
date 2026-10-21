<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Quantity tiers of a scheme: "min 25 max 100 -> discount A, min 101 max 200 -> discount B".
 *
 * A tier only carries what may differ between tiers — the quantity range and the amount. The quantity
 * basis (outer/inner) and the discount type stay the scheme's own, on its scheme_products rows.
 * A scheme with no tier rows (or one) is the plain single rule on its product rows, exactly as before;
 * rows exist only for schemes with two or more tiers, and the first tier is also kept on the product rows
 * so anything that only reads those still sees a valid scheme.
 */
class CreateSchemeTiersTable extends Migration
{
    public function up()
    {
        if (Schema::hasTable('scheme_tiers')) {
            return;
        }

        Schema::create('scheme_tiers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scheme_id')->constrained('schemes')->onDelete('cascade');
            $table->decimal('min_qty', 15, 2);
            $table->decimal('max_qty', 15, 2)->nullable()->comment('NULL = no upper limit (only the last tier may have none)');
            $table->decimal('discount_value', 15, 4)->nullable()->comment('% or flat ₹ amount, by the scheme\'s discount type');
            $table->decimal('free_qty', 15, 2)->nullable()->comment('Free Product type only');
            $table->timestamps();

            $table->index(['scheme_id', 'min_qty'], 'idx_scheme_tiers_scheme_min');
        });
    }

    public function down()
    {
        Schema::dropIfExists('scheme_tiers');
    }
}
