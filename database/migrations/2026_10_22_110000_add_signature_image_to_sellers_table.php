<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The distributor's signature image (a PNG/JPG they upload in Settings). Printed in the "Authorised Signatory"
 * block of invoices and credit notes; without one those keep printing the distributor's name as before.
 */
class AddSignatureImageToSellersTable extends Migration
{
    public function up()
    {
        Schema::table('sellers', function (Blueprint $table) {
            if (!Schema::hasColumn('sellers', 'signature_image')) {
                $table->string('signature_image')->nullable();
            }
        });
    }

    public function down()
    {
        Schema::table('sellers', function (Blueprint $table) {
            if (Schema::hasColumn('sellers', 'signature_image')) {
                $table->dropColumn('signature_image');
            }
        });
    }
}
