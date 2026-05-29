<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Seeds notification_templates and notification_template_translations (default language).
 * Templates use {{placeholder}} syntax. placeholders column lists keys for reference.
 * Translation table is used when sending FCM; seeding with default lang avoids empty content on first run.
 * Source: CommonHelper::sendNotificationOrderStatus, sendNotificationOrderAssignDeliveryBoy,
 * sendReturnRequestNotification, sendLowStockNotification; SendProductRequestNotificationJob;
 * CommonHelper::SendCartNotification. (Panel push templates removed; OrderNotification is database-only.)
 */
class NotificationTemplatesSeeder extends Seeder
{
    public function run(): void
    {
        // Default language for translation rows (same as used when language_id is null at send time)
        $defaultLangId = 1;
        if (Schema::hasTable('languages')) {
            $defaultLangId = (int) (DB::table('languages')->where('system_type', 4)->where('is_default', 1)->value('id') ?? 1);
        }

        $templates = [
            // --- Order status (CommonHelper::sendNotificationOrderStatus) ---
            [
                'type'        => 'order_status_customer',
                'title'       => 'Your order #{{order_id}} has been {{status_name}}',
                'message'     => 'This notification is just a friendly reminder (not a bill or a second charge) that on {{created_at}} you placed an order from {{app_name}} Order summary #{{order_id}} Final Total - {{currency}}{{final_total}} We would like to take this opportunity to thank you for your business and look forward to serving you in the future.',
                'placeholders' => json_encode(['order_id', 'status_name', 'created_at', 'app_name', 'currency', 'final_total']),
            ],
            [
                'type'        => 'order_status_seller_new',
                'title'       => 'You have {{status_name}} new order #{{order_id}}',
                'message'     => '',
                'placeholders' => json_encode(['status_name', 'order_id']),
            ],
            [
                'type'        => 'order_status_seller',
                'title'       => 'Order #{{order_id}} has been {{status_name}}',
                'message'     => '',
                'placeholders' => json_encode(['order_id', 'status_name']),
            ],
            [
                'type'        => 'order_status_delivery_boy',
                'title'       => 'Order #{{order_id}} has been {{status_name}}',
                'message'     => '',
                'placeholders' => json_encode(['order_id', 'status_name']),
            ],
            // --- Order assigned to delivery boy (CommonHelper::sendNotificationOrderAssignDeliveryBoy) ---
            [
                'type'        => 'assign_order_delivery_boy',
                'title'       => 'Order #{{order_id}} has been assigned to you for delivery.',
                'message'     => '',
                'placeholders' => json_encode(['order_id']),
            ],
            // --- Order assigned – notify customer (same flow; template for app user) ---
            [
                'type'        => 'assign_order_customer',
                'title'       => 'Your order #{{order_id}} has been assigned to {{delivery_boy_name}} for delivery.',
                'message'     => 'A delivery partner has been assigned to your order. You can track the order in the app.',
                'placeholders' => json_encode(['order_id', 'delivery_boy_name']),
            ],
            // --- Return request (CommonHelper::sendReturnRequestNotification) ---
            [
                'type'        => 'return_request_customer',
                'title'       => 'Your return request #{{return_request_id}} has been {{status_name}}',
                'message'     => 'Your return request for order #{{order_id}} has been updated to {{status_name}}. Thank you for using {{app_name}}.',
                'placeholders' => json_encode(['return_request_id', 'order_id', 'status_name', 'app_name']),
            ],
            [
                'type'        => 'return_request_seller',
                'title'       => 'Return request #{{return_request_id}} has been {{status_name}}',
                'message'     => 'A return request for order #{{order_id}} has been updated to {{status_name}}.',
                'placeholders' => json_encode(['return_request_id', 'order_id', 'status_name']),
            ],
            [
                'type'        => 'return_request_delivery_boy',
                'title'       => 'Return request #{{return_request_id}} has been {{status_name}}',
                'message'     => 'A return request for order #{{order_id}} has been updated to {{status_name}}.',
                'placeholders' => json_encode(['return_request_id', 'order_id', 'status_name']),
            ],
            // --- Low stock (CommonHelper::sendLowStockNotification) ---
            [
                'type'        => 'low_stock_single_product',
                'title'       => 'Low Stock Alert - 1 Product',
                'message'     => 'Your product has low stock. Stock for {{product_name}} is {{current_stock}} (limit: {{low_stock_limit}}).',
                'placeholders' => json_encode(['product_name', 'current_stock', 'low_stock_limit']),
            ],
            [
                'type'        => 'low_stock_multiple_products',
                'title'       => 'Low Stock Alert - {{product_count}} Products',
                'message'     => 'Your products have low stock. Please check your inventory and restock soon.',
                'placeholders' => json_encode(['product_count']),
            ],
            // --- Product request (SendProductRequestNotificationJob) ---
            [
                'type'        => 'product_request_accepted',
                'title'       => 'Product Request Accepted',
                'message'     => 'Great news! Your product request has been accepted. Product: {{product_name}}.',
                'placeholders' => json_encode(['product_name']),
            ],
            [
                'type'        => 'product_request_rejected',
                'title'       => 'Product Request Rejected',
                'message'     => 'We regret to inform you that your product request has been rejected.',
                'placeholders' => json_encode([]),
            ],
            // --- Cart reminder (CommonHelper::SendCartNotification) ---
            [
                'type'        => 'cart_reminder_first',
                'title'       => 'Hi, your cart with {{product_name}} is waiting for you!',
                'message'     => 'Don\'t forget to complete your purchase and place your order today!',
                'placeholders' => json_encode(['product_name']),
            ],
            [
                'type'        => 'cart_reminder_interval',
                'title'       => 'Title for product {{product_name}}',
                'message'     => 'Message based on some condition for {{measurement}}',
                'placeholders' => json_encode(['product_name', 'measurement']),
            ],
        ];

        $now = now();
        foreach ($templates as $row) {
            $row['created_at'] = $now;
            $row['updated_at'] = $now;
            DB::table('notification_templates')->updateOrInsert(
                ['type' => $row['type']],
                $row
            );
            // Seed translation for default language so getNotificationTemplateContent finds content immediately
            $template = DB::table('notification_templates')->where('type', $row['type'])->first();
            if ($template && Schema::hasTable('notification_template_translations')) {
                DB::table('notification_template_translations')->updateOrInsert(
                    [
                        'notification_template_id' => $template->id,
                        'language_id'             => $defaultLangId,
                    ],
                    [
                        'title'      => $row['title'],
                        'message'    => $row['message'] ?? '',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]
                );
            }
        }
    }
}
