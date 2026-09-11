<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropInnerPackValueFromMasterProductVariants extends Migration
{
    /**
     * inner_pack_value turned out to duplicate secondary_unit_value — dropping it.
     * weight_unit_id is untouched, that one stays.
     */
    public function up()
    {
        Schema::table('master_product_variants', function (Blueprint $table) {
            if (Schema::hasColumn('master_product_variants', 'inner_pack_value')) {
                $table->dropColumn('inner_pack_value');
            }
        });
    }

    public function down()
    {
        Schema::table('master_product_variants', function (Blueprint $table) {
            if (!Schema::hasColumn('master_product_variants', 'inner_pack_value')) {
                $table->unsignedInteger('inner_pack_value')->nullable()->after('secondary_unit_id');
            }
        });
    }
}
