<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Every scheme applied to an order. Schemes stack (all that qualify apply), but orders.scheme_id /
 * scheme_discount only hold one scheme's worth — so orders.scheme_discount is now the TOTAL of all
 * applied schemes, orders.scheme_id the biggest one (old reports keep working), and this table the
 * per-scheme breakdown. A snapshot, like orders.scheme_*: editing or deleting a scheme later must not
 * rewrite an old order, so there is deliberately no foreign key to schemes.
 *
 * Purely additive: orders placed before this have no rows and keep showing their single scheme.
 */
class CreateOrderSchemesTable extends Migration
{
    public function up()
    {
        if (Schema::hasTable('order_schemes')) {
            return;
        }

        Schema::create('order_schemes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id')->index();
            $table->unsignedBigInteger('scheme_id')->nullable();
            $table->string('name');
            $table->string('type', 50);
            $table->decimal('discount', 15, 4)->default(0)->comment('₹ taken off the order by this scheme');
            $table->decimal('benefit', 15, 4)->default(0)->comment('discount + value of free items');
            $table->string('tax_option', 20)->nullable();
            $table->decimal('discount_pretax', 15, 4)->nullable();
            $table->json('free_items')->nullable()->comment('free lines this scheme added (also real order_items rows)');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('order_schemes');
    }
}
