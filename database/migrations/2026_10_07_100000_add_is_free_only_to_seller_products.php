<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * "Free item only" flag on a distributor's own product row (seller_products), set from
 * Manage Products. A flagged product can be given away by a scheme (e.g. a free jar with
 * every carton of oil) but is hidden from the retailer and salesman apps and refused by
 * cart / place-order, so it can never be bought on its own.
 *
 * Per distributor, like status, stock and price: one distributor can gift a product that
 * another sells normally. Purely additive, default 0 — nothing existing changes behaviour
 * until a distributor ticks it.
 */
class AddIsFreeOnlyToSellerProducts extends Migration
{
    public function up()
    {
        Schema::table('seller_products', function (Blueprint $table) {
            if (!Schema::hasColumn('seller_products', 'is_free_only')) {
                $table->tinyInteger('is_free_only')->default(0)->after('status')
                    ->comment('1 = scheme gift only: giveable by a scheme, never purchasable or listed to buyers');
            }
        });
    }

    public function down()
    {
        Schema::table('seller_products', function (Blueprint $table) {
            if (Schema::hasColumn('seller_products', 'is_free_only')) {
                $table->dropColumn('is_free_only');
            }
        });
    }
}
