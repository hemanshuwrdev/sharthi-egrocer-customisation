<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddInnerPackValueAndWeightUnitToMasterProductVariants extends Migration
{
    public function up()
    {
        Schema::table('master_product_variants', function (Blueprint $table) {
            if (!Schema::hasColumn('master_product_variants', 'inner_pack_value')) {
                $table->unsignedInteger('inner_pack_value')->nullable()->after('secondary_unit_id')
                    ->comment('How many outer-pack units are in one inner pack (count, not the secondary_unit_value ratio)');
            }
            if (!Schema::hasColumn('master_product_variants', 'weight_unit_id')) {
                $table->unsignedBigInteger('weight_unit_id')->nullable()->after('weight');
            }
        });
    }

    public function down()
    {
        Schema::table('master_product_variants', function (Blueprint $table) {
            if (Schema::hasColumn('master_product_variants', 'inner_pack_value')) {
                $table->dropColumn('inner_pack_value');
            }
            if (Schema::hasColumn('master_product_variants', 'weight_unit_id')) {
                $table->dropColumn('weight_unit_id');
            }
        });
    }
}
