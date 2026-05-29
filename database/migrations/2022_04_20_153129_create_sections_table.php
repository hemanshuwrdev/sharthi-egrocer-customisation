<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSectionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('short_description');

        $table->string('position')->nullable();

        $table->string('style_app')->default('style_1');
        $table->string('style_web')->default('style_1');

        $table->string('banner_app')->nullable();
        $table->string('banner_web')->nullable();

        $table->string('background_color_for_light_theme')->nullable();
        $table->string('background_color_for_dark_theme')->nullable();
            //$table->string('style');
            $table->string('product_type');
            $table->text('product_ids')->nullable();
            $table->text('category_ids')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sections');
    }
}