<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Order / payment / delivery-OTP events for the retailer's in-app Notifications screen.
 *
 * Until now the notifications table only held what the panel's "Send Notification" screen creates;
 * order events were push-only, so they never reached customer/notifications. These columns let the
 * same table carry them: `category` drives the All / Orders / Payments / OTP tabs, `event` says what
 * happened (order_placed, out_for_delivery, payment_received, ...), `order_id` lets the app open the
 * order, and `data` is a JSON snapshot of what the card shows (distributor, invoice number, driver,
 * OTP, amount) so the card never needs a second call.
 *
 * Purely additive and nullable: panel-sent notifications leave all four empty and are unaffected.
 */
class AddOrderFieldsToNotificationsTable extends Migration
{
    public function up()
    {
        Schema::table('notifications', function (Blueprint $table) {
            if (!Schema::hasColumn('notifications', 'category')) {
                $table->string('category', 20)->nullable()->after('type_link')
                    ->comment('orders | payments | otp — null for panel-sent notifications');
            }
            if (!Schema::hasColumn('notifications', 'event')) {
                $table->string('event', 40)->nullable()->after('category')
                    ->comment('what happened, e.g. order_placed, out_for_delivery, payment_received');
            }
            if (!Schema::hasColumn('notifications', 'order_id')) {
                $table->unsignedBigInteger('order_id')->nullable()->after('event');
            }
            if (!Schema::hasColumn('notifications', 'data')) {
                $table->text('data')->nullable()->after('order_id')
                    ->comment('JSON snapshot for the card: distributor, invoice_number, driver, otp, amount, ...');
            }
        });

        Schema::table('notifications', function (Blueprint $table) {
            // (type_id, category) rather than (type, type_id, ...): `type` is a 255-char string, and an index
            // through it can exceed the key-length limit on older MySQL / MariaDB setups.
            $table->index(['type_id', 'category'], 'idx_notifications_audience');
            $table->index('order_id', 'idx_notifications_order');
        });
    }

    public function down()
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex('idx_notifications_audience');
            $table->dropIndex('idx_notifications_order');
        });

        $columns = array_values(array_filter(
            ['data', 'order_id', 'event', 'category'],
            fn ($column) => Schema::hasColumn('notifications', $column)
        ));
        if ($columns) {
            Schema::table('notifications', function (Blueprint $table) use ($columns) {
                $table->dropColumn($columns);
            });
        }
    }
}
