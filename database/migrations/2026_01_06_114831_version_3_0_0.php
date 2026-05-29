<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Create category_translations table
        if (!Schema::hasTable('category_translations')) {
            Schema::create('category_translations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('category_id');
                $table->unsignedBigInteger('language_id');
                $table->string('name')->nullable();
                $table->string('subtitle')->nullable();
                $table->string('meta_title')->nullable();
                $table->text('meta_keywords')->nullable();
                $table->text('schema_markup')->nullable();
                $table->text('meta_description')->nullable();
                $table->timestamps();

                $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
                $table->foreign('language_id')->references('id')->on('languages')->onDelete('cascade');

                $table->unique(['category_id', 'language_id']);
            });
        }
        
        if (!Schema::hasTable('subscription_faq_translations'))  {
            Schema::create('subscription_faq_translations', function (Blueprint $table) {
                $table->id();
                $table->foreignId('subscription_faq_id')->constrained('subscription_faqs')->onDelete('cascade');
                $table->foreignId('language_id')->constrained('languages')->onDelete('cascade');
                $table->string('question', 1000)->nullable();
                $table->text('answer')->nullable();
                $table->unique(['subscription_faq_id', 'language_id'], 'sub_faq_lang_unique');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('subscription_plan_translations'))  {
            Schema::create('subscription_plan_translations', function (Blueprint $table) {
                $table->id();
                $table->foreignId('subscription_plan_id')->constrained('subscription_plans')->onDelete('cascade');
                $table->foreignId('language_id')->constrained('languages')->onDelete('cascade');
                $table->string('name');
                $table->unique(['subscription_plan_id', 'language_id'], 'sub_plan_lang_unique');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('subscription_plan_translations')) {
            Schema::create('subscription_plan_translations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('subscription_plan_id');
                $table->unsignedBigInteger('language_id');
                $table->string('name');
                $table->timestamps();

                $table->unique(['subscription_plan_id', 'language_id'], 'sub_plan_lang_unique');
            });
        }
        // Create seller_translations table
        if (!Schema::hasTable('seller_translations')) {
            Schema::create('seller_translations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('seller_id');
                $table->unsignedBigInteger('language_id');
                $table->string('name')->nullable();
                $table->string('store_name')->nullable();
                $table->text('store_description')->nullable();
                $table->timestamps();

                $table->foreign('seller_id')->references('id')->on('sellers')->onDelete('cascade');
                $table->foreign('language_id')->references('id')->on('languages')->onDelete('cascade');

                $table->unique(['seller_id', 'language_id']);
            });
        }



        if (!Schema::hasTable('promo_code_translations')) {
            Schema::create('promo_code_translations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('promo_code_id');
                $table->unsignedBigInteger('language_id');
                $table->string('message')->nullable();
                $table->timestamps();

                $table->foreign('promo_code_id')->references('id')->on('promo_codes')->onDelete('cascade');
                $table->foreign('language_id')->references('id')->on('languages')->onDelete('cascade');

                $table->unique(['promo_code_id', 'language_id']);
            });
        }

        if (!Schema::hasTable('unit_translations')) {
            Schema::create('unit_translations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('unit_id');
                $table->unsignedBigInteger('language_id');
                $table->string('name')->nullable();
                $table->string('short_code')->nullable();
                $table->timestamps();
                $table->unique(['unit_id', 'language_id']);

                $table->foreign('unit_id')->references('id')->on('units')->onDelete('cascade');
                $table->foreign('language_id')->references('id')->on('languages')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('tax_translations')) {
            Schema::create('tax_translations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('tax_id');
                $table->unsignedBigInteger('language_id');
                $table->string('title')->nullable();
                $table->timestamps();
                $table->unique(['tax_id', 'language_id']);
                $table->foreign('tax_id')->references('id')->on('taxes')->onDelete('cascade');
                $table->foreign('language_id')->references('id')->on('languages')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('brand_translations')) {
            Schema::create('brand_translations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('brand_id');
                $table->unsignedBigInteger('language_id');
                $table->string('name')->nullable();
                $table->timestamps();
                $table->foreign('brand_id')->references('id')->on('brands')->onDelete('cascade');
                $table->foreign('language_id')->references('id')->on('languages')->onDelete('cascade');
                $table->unique(['brand_id', 'language_id']);
            });
        }

        if (!Schema::hasTable('product_translations')) {
            Schema::create('product_translations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('product_id');
                $table->unsignedBigInteger('language_id');
                $table->string('name')->nullable();
                $table->text('tags')->nullable();
                $table->string('manufacturer')->nullable();
                $table->longText('description')->nullable();
                $table->string('meta_title')->nullable();
                $table->text('meta_keywords')->nullable();
                $table->text('schema_markup')->nullable();
                $table->text('meta_description')->nullable();
                $table->timestamps();
                $table->unique(['product_id', 'language_id']);
                $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
                $table->foreign('language_id')->references('id')->on('languages')->onDelete('cascade');
            });
        }

        // Update settings table: change value column from text to longtext
        if (Schema::hasTable('settings') && Schema::hasColumn('settings', 'value')) {
            Schema::table('settings', function (Blueprint $table) {
                $table->longText('value')->change();
            });
        }

        if (!Schema::hasTable('section_translations')) {
            Schema::create('section_translations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('section_id');
                $table->unsignedBigInteger('language_id');
                $table->string('title')->nullable();
                $table->text('short_description')->nullable();
                $table->timestamps();

                $table->unique(['section_id', 'language_id']);
                $table->foreign('section_id')->references('id')->on('sections')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('delivery_boy_translations')) {
            Schema::create('delivery_boy_translations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('delivery_boy_id');
                $table->unsignedBigInteger('language_id');
                $table->string('name');
                $table->text('address')->nullable();
                $table->text('other_payment_information')->nullable();
                $table->unique(['delivery_boy_id', 'language_id'], 'delivery_boy_language_unique');
                $table->foreign('delivery_boy_id')->references('id')->on('delivery_boys')->onDelete('cascade');
                $table->foreign('language_id')->references('id')->on('languages')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('blog_category_translations')) {
            Schema::create('blog_category_translations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('blog_category_id');
                $table->unsignedBigInteger('language_id');
                $table->string('name');
                $table->string('meta_title')->nullable();
                $table->text('meta_keywords')->nullable();
                $table->text('meta_description')->nullable();
                $table->timestamps();
                $table->unique(['blog_category_id', 'language_id'], 'blog_category_language_unique');
                $table->foreign('blog_category_id')->references('id')->on('blog_categories')->onDelete('cascade');
                $table->foreign('language_id')->references('id')->on('languages')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('blog_translations')) {
            Schema::create('blog_translations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('blog_id');
                $table->unsignedBigInteger('language_id');
                $table->string('title')->nullable();
                $table->longText('description')->nullable();
                $table->text('short_description')->nullable();
                $table->string('meta_title')->nullable();
                $table->text('meta_keywords')->nullable();
                $table->text('meta_description')->nullable();
                $table->timestamps();
                $table->unique(['blog_id', 'language_id']);
                $table->foreign('blog_id')->references('id')->on('blogs')->onDelete('cascade');
                $table->foreign('language_id')->references('id')->on('languages')->onDelete('cascade');
            });
        }
        
        if (Schema::hasTable('blog_tag')) {
            if (!Schema::hasColumn('blog_tag', 'language_id')) {
                Schema::table('blog_tag', function (Blueprint $table) {
                    $table->unsignedBigInteger('language_id')->nullable()->after('name');
                });
            }

            $defaultLangId = (int) (DB::table('languages')->where('system_type', 4)->where('is_default', 1)->value('id') ?? 1);
            if ($defaultLangId) {
                DB::table('blog_tag')->whereNull('language_id')->update(['language_id' => $defaultLangId]);
            }
        }

        if (Schema::hasTable('sellers') && (!Schema::hasColumn('sellers', 'invoice_logo'))) {
            Schema::table('sellers', function (Blueprint $table) {
                $table->string('invoice_logo')->nullable();
                $table->string('thermal_paper_width')->nullable()->after('invoice_logo');
            });
        }

        if (!Schema::hasTable('time_slot_translations')) {
            Schema::create('time_slot_translations', function (Blueprint $table) {
                $table->id();
                $table->foreignId('time_slot_id')->constrained('time_slots')->onDelete('cascade');
                $table->foreignId('language_id')->constrained('languages')->onDelete('cascade');
                $table->string('title');
                $table->timestamps();
                $table->unique(['time_slot_id', 'language_id']);
            });
        }

        if (!Schema::hasTable('seo_setting_translations')) {
            Schema::create('seo_setting_translations', function (Blueprint $table) {
                $table->id();
                $table->foreignId('seo_setting_id')->constrained('web_seo_pages')->onDelete('cascade');
                $table->foreignId('language_id')->constrained('languages')->onDelete('cascade');
                $table->string('meta_title')->nullable();
                $table->text('meta_keyword')->nullable();
                $table->longText('schema_markup')->nullable();
                $table->text('meta_description')->nullable();
                $table->unique(['seo_setting_id', 'language_id']);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('country_translations')) {
            Schema::create('country_translations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('country_id');
                $table->unsignedBigInteger('language_id');
                $table->string('name')->nullable();
                $table->timestamps();
                $table->foreign('country_id')->references('id')->on('countries')->onDelete('cascade');
                $table->foreign('language_id', 'country_trans_lang_fk')->references('id')->on('languages')->onDelete('cascade');
                $table->unique(['country_id', 'language_id']);
            });
        }
        
        if (!Schema::hasTable('faq_translations')) {
            Schema::create('faq_translations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('faq_id');
                $table->unsignedBigInteger('language_id');
                $table->string('question')->nullable();;
                $table->text('answer')->nullable();
                $table->timestamps();
                $table->unique(['faq_id', 'language_id']);
                $table->foreign('faq_id')->references('id')->on('faqs')->onDelete('cascade');
                $table->foreign('language_id')->references('id')->on('languages')->onDelete('cascade');
            });
        }

        // Notification templates (FCM multi-language)
        if (!Schema::hasTable('notification_templates')) {
            Schema::create('notification_templates', function (Blueprint $table) {
                $table->id();
                $table->string('type', 100)->unique();
                $table->string('title');
                $table->text('message')->nullable();
                $table->json('placeholders')->nullable();
                $table->timestamps();
            });
        }
        if (!Schema::hasTable('notification_template_translations')) {
            Schema::create('notification_template_translations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('notification_template_id');
                $table->unsignedBigInteger('language_id');
                $table->string('title');
                $table->text('message')->nullable();
                $table->timestamps();
                $table->foreign('notification_template_id', 'notif_tpl_trans_tpl_fk')->references('id')->on('notification_templates')->onDelete('cascade');
                $table->foreign('language_id', 'notif_tpl_trans_lang_fk')->references('id')->on('languages')->onDelete('cascade');
                $table->unique(['notification_template_id', 'language_id'], 'notif_tpl_trans_tpl_lang_unique');
            });
        }
        // language_id on user_tokens and admin_tokens for multi-language FCM
        $defaultLangId = 1;
        if (Schema::hasTable('languages')) {
            $defaultLangId = (int) (DB::table('languages')->where('system_type', 4)->where('is_default', 1)->value('id') ?? 1);
        }
        if (Schema::hasTable('user_tokens') && !Schema::hasColumn('user_tokens', 'language_id')) {
            Schema::table('user_tokens', function (Blueprint $table) {
                $table->unsignedBigInteger('language_id')->nullable()->after('platform');
            });
            DB::table('user_tokens')->whereNull('language_id')->update(['language_id' => $defaultLangId]);
        }
        if (Schema::hasTable('admin_tokens') && !Schema::hasColumn('admin_tokens', 'language_id')) {
            Schema::table('admin_tokens', function (Blueprint $table) {
                $table->unsignedBigInteger('language_id')->nullable()->after('platform');
            });
            DB::table('admin_tokens')->whereNull('language_id')->update(['language_id' => $defaultLangId]);
        }

        if (!Schema::hasTable('city_translations')) {
            Schema::create('city_translations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('city_id');
                $table->unsignedBigInteger('language_id');
                $table->string('zone')->nullable();
                $table->timestamps();
                $table->unique(['city_id', 'language_id']);
                $table->foreign('city_id')->references('id')->on('cities')->onDelete('cascade');
                $table->foreign('language_id')->references('id')->on('languages')->onDelete('cascade');
            }); 
        }

        // Convert transaction/wallet/seller_wallet message text to translation keys (lang-wise API response).
        $transactionMap = [
            'Paytabs order payment' => 'txn_order_payment',
            'Paytabs subscription payment' => 'txn_subscription_payment',
            'cashfree order payment' => 'txn_order_payment',
            'Cashfree subscription payment' => 'txn_subscription_payment',
            'Phonepe order payment' => 'txn_order_payment',
            'Phonepe subscription payment' => 'txn_subscription_payment',
            'Subscription payment' => 'txn_subscription_payment',
            'Subscription payment via wallet' => 'txn_subscription_payment_via_wallet',
            'Subscription payment via iOS In-App Purchase' => 'txn_subscription_payment_ios_iap',
            'Subscription successfully activated.' => 'txn_subscription_successfully_activated',
        ];
        foreach ($transactionMap as $text => $key) {
            DB::table('transactions')->where('message', $text)->update(['message' => $key]);
        }
        $walletMap = [
            'Used against Order Placement' => 'wallet_used_against_order_placement',
            'Refer Earn First Order Bonus' => 'wallet_refer_earn_first_order_bonus',
            'Order Item Cancelled' => 'wallet_order_item_cancelled',
            'Order Item Amount Refunded' => 'wallet_order_item_amount_refunded',
            'Order Item Returned' => 'wallet_order_item_returned',
            'Used for Subscription' => 'wallet_used_for_subscription',
            'Wallet successfully recharged.' => 'wallet_successfully_recharged',
            'Transaction by user' => 'wallet_transaction_by_user',
        ];
        foreach ($walletMap as $text => $key) {
            DB::table('wallet_transactions')->where('message', $text)->update(['message' => $key]);
        }
        $sellerWalletMap = [
            'Order Item Commission' => 'seller_wallet_order_item_commission',
            'Commission' => 'seller_wallet_commission',
        ];
        foreach ($sellerWalletMap as $text => $key) {
            DB::table('seller_wallet_transactions')->where('message', $text)->update(['message' => $key]);
        }
        $typeMap = [
            'COD' => 'txn_type_cod',
            'Stripe' => 'txn_type_stripe',
            'Razorpay' => 'txn_type_razorpay',
            'Paystack' => 'txn_type_paystack',
            'Paytm' => 'txn_type_paytm',
            'Paypal' => 'txn_type_paypal',
            'Wallet' => 'txn_type_wallet',
            'Midtrans' => 'txn_type_midtrans',
            'Phonepe' => 'txn_type_phonepe',
            'Cashfree' => 'txn_type_cashfree',
            'Paytabs' => 'txn_type_paytabs',
            'InAppPurchase' => 'txn_type_in_app_purchase',
        ];
        foreach ($typeMap as $text => $key) {
            DB::table('transactions')->where('type', $text)->update(['type' => $key]);
        }

        if (Schema::hasTable('products')) {
            Schema::table('products', function (Blueprint $table) {
                if (Schema::hasColumn('products', 'other_images')) {
                    $table->dropColumn('other_images');
                }
                if (Schema::hasColumn('products', 'tags')) {
                    $table->text('tags')->nullable()->change();
                }
            });
        }

        // Make mobile nullable in users table (supports social login without phone number)
        if (Schema::hasColumn('users', 'mobile')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('mobile')->nullable()->change();
            });
        }
    }

    public function down()
    {
        if (Schema::hasTable('category_translations')) {
            Schema::dropIfExists('category_translations');
        }
        if (Schema::hasTable('seller_translations')) {
            Schema::dropIfExists('seller_translations');
        }
        if (Schema::hasTable('promo_code_translations')) {
            Schema::dropIfExists('promo_code_translations');
        }
        if (Schema::hasTable('unit_translations')) {
            Schema::dropIfExists('unit_translations');
        }
        if (Schema::hasTable('tax_translations')) {
            Schema::dropIfExists('tax_translations');
        }
        if (Schema::hasTable('brand_translations')) {
            Schema::dropIfExists('brand_translations');
        }
        if (Schema::hasTable('product_translations')) {
            Schema::dropIfExists('product_translations');
        }
        if (Schema::hasColumn('users', 'language_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropForeign(['language_id']);
                $table->dropColumn('language_id');
            });
        }
        if (Schema::hasTable('section_translations')) {
            Schema::dropIfExists('section_translations');
        }
        if (Schema::hasTable('delivery_boy_translations')) {
            Schema::dropIfExists('delivery_boy_translations');
        }
        if (Schema::hasTable('blog_category_translations')) {
            Schema::dropIfExists('blog_category_translations');
        }
        if (Schema::hasTable('blog_translations')) {
            Schema::dropIfExists('blog_translations');
        }
        if (Schema::hasTable('blog_tag') && Schema::hasColumn('blog_tag', 'language_id')) {
            Schema::table('blog_tag', function (Blueprint $table) {
                $table->dropColumn('language_id');
            });
        }
        if (Schema::hasTable('subscription_faq_translations')) {
            Schema::dropIfExists('subscription_faq_translations');
        }
        if (Schema::hasTable('sellers') && Schema::hasColumn('sellers', 'invoice_logo')) {
            Schema::table('sellers', function (Blueprint $table) {
                $table->dropColumn('invoice_logo');
                $table->dropColumn('thermal_paper_width');
            });
        }
        if (Schema::hasTable('time_slot_translations')) {
            Schema::dropIfExists('time_slot_translations');
        }
        if (Schema::hasTable('seo_setting_translations')) {
            Schema::dropIfExists('seo_setting_translations');
        }
        if (Schema::hasTable('notification_template_translations')) {
            Schema::dropIfExists('notification_template_translations');
        }
        if (Schema::hasTable('notification_templates')) {
            Schema::dropIfExists('notification_templates');
        }
        if (Schema::hasTable('admin_tokens') && Schema::hasColumn('admin_tokens', 'language_id')) {
            Schema::table('admin_tokens', function (Blueprint $table) {
                $table->dropColumn('language_id');
            });
        }
        if (Schema::hasTable('user_tokens') && Schema::hasColumn('user_tokens', 'language_id')) {
            Schema::table('user_tokens', function (Blueprint $table) {
                $table->dropColumn('language_id');
            });
        }
        if (Schema::hasTable('city_translations')) {
            Schema::dropIfExists('city_translations');
        }
        // Restore transaction/wallet/seller_wallet message text from keys.
        $transactionMap = [
            'txn_order_payment' => 'Order payment',
            'txn_subscription_payment' => 'Subscription payment',
            'txn_subscription_payment_via_wallet' => 'Subscription payment via wallet',
            'txn_subscription_payment_ios_iap' => 'Subscription payment via iOS In-App Purchase',
            'txn_subscription_successfully_activated' => 'Subscription successfully activated.',
        ];
        foreach ($transactionMap as $key => $text) {
            DB::table('transactions')->where('message', $key)->update(['message' => $text]);
        }
        $walletMap = [
            'wallet_used_against_order_placement' => 'Used against Order Placement',
            'wallet_refer_earn_first_order_bonus' => 'Refer Earn First Order Bonus',
            'wallet_order_item_cancelled' => 'Order Item Cancelled',
            'wallet_order_item_amount_refunded' => 'Order Item Amount Refunded',
            'wallet_order_item_returned' => 'Order Item Returned',
            'wallet_used_for_subscription' => 'Used for Subscription',
            'wallet_successfully_recharged' => 'Wallet successfully recharged.',
            'wallet_transaction_by_user' => 'Transaction by user',
        ];
        foreach ($walletMap as $key => $text) {
            DB::table('wallet_transactions')->where('message', $key)->update(['message' => $text]);
        }
        $sellerWalletMap = [
            'seller_wallet_order_item_commission' => 'Order Item Commission',
            'seller_wallet_commission' => 'Commission',
        ];
        foreach ($sellerWalletMap as $key => $text) {
            DB::table('seller_wallet_transactions')->where('message', $key)->update(['message' => $text]);
        }
        $typeMap = [
            'txn_type_cod' => 'COD',
            'txn_type_stripe' => 'Stripe',
            'txn_type_razorpay' => 'Razorpay',
            'txn_type_paystack' => 'Paystack',
            'txn_type_paytm' => 'Paytm',
            'txn_type_paypal' => 'Paypal',
            'txn_type_wallet' => 'Wallet',
            'txn_type_midtrans' => 'Midtrans',
            'txn_type_phonepe' => 'Phonepe',
            'txn_type_cashfree' => 'Cashfree',
            'txn_type_paytabs' => 'Paytabs',
            'txn_type_in_app_purchase' => 'InAppPurchase',
        ];
        foreach ($typeMap as $key => $text) {
            DB::table('transactions')->where('type', $key)->update(['type' => $text]);
        }
    }
};