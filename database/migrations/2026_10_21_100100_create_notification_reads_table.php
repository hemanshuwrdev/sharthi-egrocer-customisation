<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Per-customer read state for the Notifications screen ("Mark all read", the unread dot).
 *
 * A separate table rather than a column on notifications, because one notification row can be seen by
 * many customers (a panel broadcast) — "read" is a fact about a customer, not about the row. A row here
 * means that customer has read that notification; no row means unread. No foreign keys, like the other
 * notification tables, so deleting a notification never trips over this.
 */
class CreateNotificationReadsTable extends Migration
{
    public function up()
    {
        if (Schema::hasTable('notification_reads')) {
            return;
        }

        Schema::create('notification_reads', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('notification_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamp('read_at')->useCurrent();
            $table->unique(['notification_id', 'user_id'], 'uniq_notification_reads');
            $table->index('user_id', 'idx_notification_reads_user');
        });
    }

    public function down()
    {
        Schema::dropIfExists('notification_reads');
    }
}
