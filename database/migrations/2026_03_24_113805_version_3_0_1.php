<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('newsletters')) {
            Schema::dropIfExists('newsletters');
        }
        if (Schema::hasTable('area')) {
            Schema::dropIfExists('area');
        }
        if (Schema::hasTable('devices')) {
            Schema::dropIfExists('devices');
        }
        if (Schema::hasTable('invoice')) {
            Schema::dropIfExists('invoice');
        }
        if (Schema::hasTable('order_bank_transfers')) {
            Schema::dropIfExists('order_bank_transfers');
        }
        if (Schema::hasTable('order_trackings')) {
            Schema::dropIfExists('order_trackings');
        }
        if (Schema::hasTable('payment_requests')) {
            Schema::dropIfExists('payment_requests');
        }
        if (Schema::hasTable('payments')) {
            Schema::dropIfExists('payments');
        }
        if (Schema::hasTable('pincodes')) {
            Schema::dropIfExists('pincodes');
        }
        if (Schema::hasTable('updates')) {
            Schema::dropIfExists('updates');
        }
        if (Schema::hasTable('seller_commissions')) {
            Schema::dropIfExists('seller_commissions');
        }
        if (Schema::hasTable('seller_transactions')) {
            Schema::dropIfExists('seller_transactions');
        }

       $settings = [
            ['variable' => 'country_code', 'value' => '+91'],
            ['variable' => 'nation_code',  'value' => 'IN'],
        ];

        foreach ($settings as $setting) {
            $exists = DB::table('settings')
                ->where('variable', $setting['variable'])
                ->exists();

            if (!$exists) {
                DB::table('settings')->insert($setting);
            }
        }

        // Normalize country_code in users table to +XX format
        if (Schema::hasTable('users') && Schema::hasColumn('users', 'country_code')) {
            // Add '+' prefix to codes that are just digits (e.g. '91' -> '+91')
            DB::table('users')
                ->whereNotNull('country_code')
                ->where('country_code', '!=', '')
                ->where('country_code', 'NOT LIKE', '+%')
                ->update(['country_code' => DB::raw("CONCAT('+', country_code)")]);

            // Set default country code only for users who have a mobile number but no country code
            DB::table('users')
                ->whereNotNull('mobile')
                ->where('mobile', '!=', '')
                ->where(function ($query) {
                    $query->whereNull('country_code')
                        ->orWhere('country_code', '');
                })
                ->update(['country_code' => '+91']);
        }

        if (!Schema::hasTable('admin_commission_transactions')) {
            Schema::create('admin_commission_transactions', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('order_id')->nullable();
                $table->unsignedBigInteger('order_item_id')->nullable()->unique();
                $table->unsignedBigInteger('seller_id')->nullable();
                $table->double('seller_commission_percentage', 8, 2)->default(0);
                $table->double('amount', 8, 2)->default(0);
                $table->double('order_item_amount', 8, 2)->default(0);
                $table->string('message')->nullable();
                $table->tinyInteger('status')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasColumn('seller_wallet_transactions', 'is_commission')) {
            Schema::table('seller_wallet_transactions', function (Blueprint $table) {
                $table->tinyInteger('is_commission')->default(0)->after('status');
            });

            DB::table('seller_wallet_transactions')->where('message', 'seller_wallet_order_item_commission')->update(['is_commission' => 1]);
        }

        if (!Schema::hasColumn('product_variants', 'purchase_price')) {
            Schema::table('product_variants', function (Blueprint $table) {
                $table->float('purchase_price', 11, 2)->default(0)->after('price');
            });
        }

        // Remove additional_charges from settings table (now managed via dedicated tables)
        DB::table('settings')->where('variable', 'additional_charges')->delete();

        // Additional Charges Tables (v3.0.1)
        if (!Schema::hasTable('additional_charges')) {
            Schema::create('additional_charges', function (Blueprint $table) {
                $table->id();
                $table->string('title')->nullable();
                $table->decimal('amount', 10, 2)->default(0);
                $table->enum('charge_type', ['amount', 'percentage'])->default('amount');
                $table->boolean('is_refundable')->default(false);
                $table->boolean('is_active')->default(true);
                $table->json('applicable_on')->nullable();
                $table->integer('sort_order')->default(0);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('additional_charge_translations')) {
            Schema::create('additional_charge_translations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('additional_charge_id');
                $table->unsignedBigInteger('language_id');
                $table->string('title')->nullable();
                $table->timestamps();

                $table->foreign('additional_charge_id')->references('id')->on('additional_charges')->onDelete('cascade');
                $table->foreign('language_id')->references('id')->on('languages')->onDelete('cascade');
                $table->unique(['additional_charge_id', 'language_id'], 'ac_translations_charge_lang_unique');
            });
        }

        //  Delivery Boy Salary Table (v3.0.1)
        if (!Schema::hasTable('delivery_boy_salary')) {

            Schema::create('delivery_boy_salary', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('delivery_boy_id');
                $table->decimal('amount', 10, 2);
                $table->text('message')->nullable();    
                $table->date('paid_on')->nullable();
                $table->timestamps();

                $table->foreign('delivery_boy_id')
                    ->references('id')
                    ->on('delivery_boys')
                    ->onDelete('cascade');
            });
        }

        if (Schema::hasColumn('orders', 'mobile')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->string('mobile')->nullable()->change();
            });
        }

        // Update historical rescheduled orders to have active_status = 12
        $orders = DB::table('orders')->get();
        foreach ($orders as $order) {
            $latestStatus = DB::table('order_statuses')
                ->where('order_id', $order->id)
                ->orderBy('id', 'desc')
                ->first();

            if ($latestStatus && trim(strtolower($latestStatus->status)) === 'rescheduled') {
                DB::table('orders')
                    ->where('id', $order->id)
                    ->update(['active_status' => \App\Models\OrderStatusList::$rescheduled]);

                DB::table('order_items')
                    ->where('order_id', $order->id)
                    ->whereNotIn('active_status', [\App\Models\OrderStatusList::$cancelled, \App\Models\OrderStatusList::$returned])
                    ->update(['active_status' => \App\Models\OrderStatusList::$rescheduled]);
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // No need to reverse the drops since they are irreversible, but we can remove the inserted setting
        DB::table('settings')->where('variable', 'country_code')->delete();

        Schema::dropIfExists('additional_charge_translations');
        Schema::dropIfExists('additional_charges');

        Schema::dropIfExists('admin_commission_transactions');

        if (Schema::hasColumn('product_variants', 'purchase_price')) {
            Schema::table('product_variants', function (Blueprint $table) {
                $table->dropColumn('purchase_price');
            });
        }

        if (Schema::hasColumn('seller_wallet_transactions', 'is_commission')) {
            Schema::table('seller_wallet_transactions', function (Blueprint $table) {
                $table->dropColumn('is_commission');
            });
        }
    }
};
