<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class AddRetailerVerificationRadiusSetting extends Migration
{
    /**
     * Max distance (meters) between the salesman and the shop when verifying a retailer.
     * 0 disables the check. The code falls back to 50 if this row is missing.
     */
    public function up()
    {
        if (!DB::table('settings')->where('variable', 'retailer_verification_radius_meters')->exists()) {
            DB::table('settings')->insert(['variable' => 'retailer_verification_radius_meters', 'value' => '50']);
        }
    }

    public function down()
    {
        DB::table('settings')->where('variable', 'retailer_verification_radius_meters')->delete();
    }
}
