<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE `credit_notes` MODIFY COLUMN `reason_type` ENUM('return', 'cancel', 'partial') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE `credit_notes` MODIFY COLUMN `reason_type` ENUM('return', 'cancel') NOT NULL");
    }
};
