<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('schemes', function (Blueprint $table) {
            if (!Schema::hasColumn('schemes', 'buy_qty_basis')) {
                $table->enum('buy_qty_basis', ['inner', 'outer'])->nullable()->default('outer')->after('buy_qty');
            }
            if (!Schema::hasColumn('schemes', 'free_qty_basis')) {
                $table->enum('free_qty_basis', ['inner', 'outer'])->nullable()->default('outer')->after('free_qty');
            }
        });
    }

    public function down()
    {
        Schema::table('schemes', function (Blueprint $table) {
            $cols = [];
            if (Schema::hasColumn('schemes', 'buy_qty_basis')) {
                $cols[] = 'buy_qty_basis';
            }
            if (Schema::hasColumn('schemes', 'free_qty_basis')) {
                $cols[] = 'free_qty_basis';
            }
            if (!empty($cols)) {
                $table->dropColumn($cols);
            }
        });
    }
};
