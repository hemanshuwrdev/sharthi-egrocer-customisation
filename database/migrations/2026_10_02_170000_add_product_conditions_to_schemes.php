<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AddProductConditionsToSchemes extends Migration
{
    public function up()
    {
        Schema::table('schemes', function (Blueprint $table) {
            if (!Schema::hasColumn('schemes', 'description')) {
                $table->text('description')->nullable()->after('name');
            }
            if (!Schema::hasColumn('schemes', 'tax_option')) {
                $table->enum('tax_option', ['inclusive', 'exclusive'])->default('inclusive')->after('status');
            }
        });

        DB::statement("ALTER TABLE schemes MODIFY COLUMN type VARCHAR(50) NOT NULL");

        Schema::table('scheme_products', function (Blueprint $table) {
            if (!Schema::hasColumn('scheme_products', 'qty_basis')) {
                $table->enum('qty_basis', ['inner', 'outer'])->default('inner')->after('seller_product_id');
            }
            if (!Schema::hasColumn('scheme_products', 'min_qty')) {
                $table->decimal('min_qty', 15, 2)->nullable()->after('qty_basis');
            }
            if (!Schema::hasColumn('scheme_products', 'max_qty')) {
                $table->decimal('max_qty', 15, 2)->nullable()->after('min_qty');
            }
            if (!Schema::hasColumn('scheme_products', 'discount_type')) {
                $table->string('discount_type', 50)->nullable()->after('max_qty');
            }
            if (!Schema::hasColumn('scheme_products', 'discount_value')) {
                $table->decimal('discount_value', 15, 4)->nullable()->after('discount_type');
            }
            if (!Schema::hasColumn('scheme_products', 'free_qty')) {
                $table->decimal('free_qty', 15, 2)->nullable()->after('discount_value');
            }
            if (!Schema::hasColumn('scheme_products', 'free_qty_basis')) {
                $table->enum('free_qty_basis', ['inner', 'outer'])->default('inner')->after('free_qty');
            }
        });
    }

    public function down()
    {
        Schema::table('schemes', function (Blueprint $table) {
            if (Schema::hasColumn('schemes', 'description')) {
                $table->dropColumn('description');
            }
            if (Schema::hasColumn('schemes', 'tax_option')) {
                $table->dropColumn('tax_option');
            }
        });

        DB::statement("ALTER TABLE schemes MODIFY COLUMN type ENUM('buy_x_get_y','group_discount_price','group_discount_qty') NOT NULL");

        Schema::table('scheme_products', function (Blueprint $table) {
            $cols = ['qty_basis', 'min_qty', 'max_qty', 'discount_type', 'discount_value', 'free_qty', 'free_qty_basis'];
            foreach ($cols as $col) {
                if (Schema::hasColumn('scheme_products', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
}
