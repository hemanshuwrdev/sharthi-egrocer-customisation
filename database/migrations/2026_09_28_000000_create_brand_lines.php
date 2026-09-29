<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('brand_lines')) {
            Schema::create('brand_lines', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('brand_id');
                $table->string('name');
                $table->tinyInteger('status')->default(1);
                $table->integer('sort_order')->default(0);
                $table->tinyInteger('is_overlap_allowed')->default(0)
                    ->comment('1 = multiple distributors can deliver this specific line in the same city, overriding the brand-level exclusivity');
                $table->timestamps();

                $table->unique(['brand_id', 'name'], 'uniq_brand_line_brand_name');
                $table->foreign('brand_id')->references('id')->on('brands')->onDelete('cascade');
            });
        }

        Schema::table('master_products', function (Blueprint $table) {
            if (!Schema::hasColumn('master_products', 'brand_line_id')) {
                $table->unsignedBigInteger('brand_line_id')->nullable()->after('brand_id');
                $table->index('brand_line_id', 'idx_master_products_brand_line');
                $table->foreign('brand_line_id')->references('id')->on('brand_lines')->onDelete('set null');
            }
        });

        Schema::table('brand_distributor_mappings', function (Blueprint $table) {
            if (!Schema::hasColumn('brand_distributor_mappings', 'brand_line_id')) {
                $table->unsignedBigInteger('brand_line_id')->nullable()->after('brand_id')
                    ->comment('NULL = distributor covers all lines of the brand');
                $table->foreign('brand_line_id')->references('id')->on('brand_lines')->onDelete('cascade');
            }
        });

        // Replace the old (brand_id, seller_id, city_id) unique index with one that
        // also accounts for the line, so the same brand+city+seller can have one row
        // per line (plus one "All Lines" row where brand_line_id is NULL).
        Schema::table('brand_distributor_mappings', function (Blueprint $table) {
            $indexes = collect(\Illuminate\Support\Facades\DB::select("SHOW INDEX FROM brand_distributor_mappings"))
                ->pluck('Key_name')->unique();
            if ($indexes->contains('uniq_bdm_brand_seller_city')) {
                $table->dropUnique('uniq_bdm_brand_seller_city');
            }
            if (!$indexes->contains('uniq_bdm_brand_line_seller_city')) {
                $table->unique(['brand_id', 'brand_line_id', 'seller_id', 'city_id'], 'uniq_bdm_brand_line_seller_city');
            }
        });
    }

    public function down(): void
    {
        Schema::table('brand_distributor_mappings', function (Blueprint $table) {
            $indexes = collect(\Illuminate\Support\Facades\DB::select("SHOW INDEX FROM brand_distributor_mappings"))
                ->pluck('Key_name')->unique();
            if ($indexes->contains('uniq_bdm_brand_line_seller_city')) {
                $table->dropUnique('uniq_bdm_brand_line_seller_city');
            }
            if (!$indexes->contains('uniq_bdm_brand_seller_city')) {
                $table->unique(['brand_id', 'seller_id', 'city_id'], 'uniq_bdm_brand_seller_city');
            }
            if (Schema::hasColumn('brand_distributor_mappings', 'brand_line_id')) {
                $table->dropForeign(['brand_line_id']);
                $table->dropColumn('brand_line_id');
            }
        });

        Schema::table('master_products', function (Blueprint $table) {
            if (Schema::hasColumn('master_products', 'brand_line_id')) {
                $table->dropForeign(['brand_line_id']);
                $table->dropIndex('idx_master_products_brand_line');
                $table->dropColumn('brand_line_id');
            }
        });

        Schema::dropIfExists('brand_lines');
    }
};
