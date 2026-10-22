<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Cart Value Discount: "cart value 5,000 - 10,000 -> flat 150, 10,001 - 15,000 -> flat 250".
 *
 * It reuses the existing basket-value scheme (type group_discount_price + scheme_slabs); only two things were
 * missing, both optional so every scheme that exists today behaves exactly as before:
 *
 *  - schemes.applies_to_all: the value counted is the WHOLE cart of the distributor, whatever the products.
 *    Explicit on purpose — "no products selected" must not silently mean "everything" (a scheme whose products
 *    were all deleted would otherwise start discounting every cart).
 *  - scheme_slabs.max_value: the upper end of a tier. NULL = no upper limit, which is the old behaviour (a slab
 *    simply held until a higher slab's minimum was reached).
 */
class AddCartValueToSchemes extends Migration
{
    public function up()
    {
        Schema::table('schemes', function (Blueprint $table) {
            if (!Schema::hasColumn('schemes', 'applies_to_all')) {
                $table->boolean('applies_to_all')->default(false)->after('tax_option')
                    ->comment('Cart Value Discount: counts the whole cart, not a product selection');
            }
        });

        Schema::table('scheme_slabs', function (Blueprint $table) {
            if (!Schema::hasColumn('scheme_slabs', 'max_value')) {
                $table->decimal('max_value', 15, 4)->nullable()->after('min_value')
                    ->comment('Upper end of the tier; NULL = no upper limit');
            }
        });
    }

    public function down()
    {
        Schema::table('scheme_slabs', function (Blueprint $table) {
            if (Schema::hasColumn('scheme_slabs', 'max_value')) {
                $table->dropColumn('max_value');
            }
        });

        Schema::table('schemes', function (Blueprint $table) {
            if (Schema::hasColumn('schemes', 'applies_to_all')) {
                $table->dropColumn('applies_to_all');
            }
        });
    }
}
