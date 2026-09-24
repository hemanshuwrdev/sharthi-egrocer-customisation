<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSensitivePasswordToSellersTable extends Migration
{
    /**
     * sensitive_password gates risky corrections (e.g. editing a driver's recorded
     * payment method) behind a second, distributor-owner-only password — separate
     * from the login password so panel staff with login access can't rotate it
     * (rotating requires knowing the current one). sensitive_unlocked_at is a
     * short-lived server-side mark set when that password is last verified; edit
     * endpoints check it's recent instead of requiring the password on every request.
     */
    public function up()
    {
        Schema::table('sellers', function (Blueprint $table) {
            if (!Schema::hasColumn('sellers', 'sensitive_password')) {
                $table->string('sensitive_password')->nullable()->after('upi_name');
            }
            if (!Schema::hasColumn('sellers', 'sensitive_unlocked_at')) {
                $table->timestamp('sensitive_unlocked_at')->nullable()->after('sensitive_password');
            }
        });
    }

    public function down()
    {
        Schema::table('sellers', function (Blueprint $table) {
            if (Schema::hasColumn('sellers', 'sensitive_unlocked_at')) {
                $table->dropColumn('sensitive_unlocked_at');
            }
            if (Schema::hasColumn('sellers', 'sensitive_password')) {
                $table->dropColumn('sensitive_password');
            }
        });
    }
}
