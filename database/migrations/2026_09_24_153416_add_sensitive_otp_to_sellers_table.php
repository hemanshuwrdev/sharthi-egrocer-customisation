<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSensitiveOtpToSellersTable extends Migration
{
    /**
     * Forgot-password recovery for sensitive_password (see
     * add_sensitive_password_to_sellers_table): a short-lived, single-use OTP
     * emailed to the seller's registered address, letting them reset the
     * sensitive password without knowing the old one.
     */
    public function up()
    {
        Schema::table('sellers', function (Blueprint $table) {
            if (!Schema::hasColumn('sellers', 'sensitive_otp')) {
                $table->string('sensitive_otp')->nullable()->after('sensitive_unlocked_at');
            }
            if (!Schema::hasColumn('sellers', 'sensitive_otp_expires_at')) {
                $table->timestamp('sensitive_otp_expires_at')->nullable()->after('sensitive_otp');
            }
        });
    }

    public function down()
    {
        Schema::table('sellers', function (Blueprint $table) {
            if (Schema::hasColumn('sellers', 'sensitive_otp_expires_at')) {
                $table->dropColumn('sensitive_otp_expires_at');
            }
            if (Schema::hasColumn('sellers', 'sensitive_otp')) {
                $table->dropColumn('sensitive_otp');
            }
        });
    }
}
