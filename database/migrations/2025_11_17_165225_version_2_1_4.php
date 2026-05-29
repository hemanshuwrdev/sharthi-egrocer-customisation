<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasColumn('blogs', 'short_description')) {
            Schema::table('blogs', function (Blueprint $table) {
                $table->text('short_description')->nullable()->after('description');
            });
        }

        if (!Schema::hasColumn('blogs', 'tags')) {
            Schema::table('blogs', function (Blueprint $table) {
                $table->text('tags')->nullable()->after('short_description');
            });
        }

        if (!Schema::hasTable('blog_tag')) {
            Schema::create('blog_tag', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
                $table->timestamps();
            });
        }
     
        if (!DB::table('settings')->where('variable', 'product_rating')->exists()) {
            DB::table('settings')->insert([
                'variable' => 'product_rating',
                'value' => '1'
            ]);
        }
        
        if (!DB::table('settings')->where('variable', 'few_quantity_left_alert')->exists()) {
            DB::table('settings')->insert([
                'variable' => 'few_quantity_left_alert',
                'value' => '5'
            ]);
        }

        // Remove row_order column from sections table
        if (Schema::hasColumn('sections', 'row_order')) {
            Schema::table('sections', function (Blueprint $table) {
                $table->dropColumn('row_order');
            });
        }
        
        // Recently Visited Products Table
        if (!Schema::hasTable('recently_visited_products')) {
            Schema::create('recently_visited_products', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('product_id');
                $table->timestamp('visited_at')->useCurrent();
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
                
                $table->index(['user_id', 'visited_at']);
                $table->unique(['user_id', 'product_id']);
            });
        }

        // Subscription Plans Table
        if (!Schema::hasTable('subscription_plans')) {
            Schema::create('subscription_plans', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->integer('days');
                $table->float('price');
                $table->float('discounted_price')->nullable();
                $table->float('free_delivery_above')->nullable()->default(0);
                $table->string('ios_product_id')->nullable()->comment('iOS In-App Purchase product ID');
                $table->tinyInteger('status')->default(1)->comment('0 = Inactive, 1 = Active');
                $table->timestamps();
                $table->softDeletes();
            });
        }

        // User Subscriptions Table
        if (!Schema::hasTable('user_subscriptions')) {
            Schema::create('user_subscriptions', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('plan_id')->nullable();
                $table->string('plan_name');
                $table->float('price_paid');
                $table->float('discounted_price')->nullable();
                $table->float('free_delivery_above')->nullable()->default(0);
                $table->date('start_date');
                $table->date('end_date');
                $table->enum('status', ['active', 'expired'])->default('active');
                $table->timestamps();
                $table->softDeletes();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('plan_id')->references('id')->on('subscription_plans')->onDelete('set null');
                
                $table->index(['user_id', 'status']);
                $table->index(['plan_id']);
                $table->index(['end_date']);
            });
        }

        if (!DB::table('settings')->where('variable', 'subscription_name')->exists()) {
            DB::table('settings')->insert([
                'variable' => 'subscription_name',
                'value' => 'eGrocer MAX'
            ]);
        }

        if (!Schema::hasTable('subscription_faqs')) {
            Schema::create('subscription_faqs', function (Blueprint $table) {
                $table->id();
                $table->text('question');
                $table->text('answer')->nullable();
                $table->integer('sort_order')->default(0)->comment('Order for displaying FAQs');
                $table->tinyInteger('status')->default(1)->comment('0 = Inactive, 1 = Active');
                $table->timestamps();
            });
        }

        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'subscription_id')) {
                $table->unsignedBigInteger('subscription_id')->nullable()->after('remaining_total');
                $table->index('subscription_id');
            }
            if (!Schema::hasColumn('orders', 'delivery_save_amount')) {
                $table->double('delivery_save_amount')->default(0)->after('subscription_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('blog_tag');

        if (Schema::hasColumn('blogs', 'tags')) {
            Schema::table('blogs', function (Blueprint $table) {
                $table->dropColumn('tags');
            });
        }

        if (Schema::hasColumn('blogs', 'short_description')) {
            Schema::table('blogs', function (Blueprint $table) {
                $table->dropColumn('short_description');
            });
        }

        if (Schema::hasTable('recently_visited_products')) {
            Schema::dropIfExists('recently_visited_products');
        }

        if (Schema::hasTable('user_subscriptions')) {
            Schema::dropIfExists('user_subscriptions');
        }

        if (Schema::hasTable('subscription_plans')) {
            Schema::dropIfExists('subscription_plans');
        }

        if (Schema::hasTable('subscription_faqs')) {
            Schema::dropIfExists('subscription_faqs');
        }

        if (Schema::hasTable('orders')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropColumn(['subscription_id', 'delivery_save_amount']);
            });
        }
    }
};
