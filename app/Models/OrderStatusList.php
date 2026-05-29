<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderStatusList extends Model
{
    use HasFactory;

    public $timestamps = false;

    public static $paymentPending = 1;
    public static $received = 2;
    public static $processed = 3;
    public static $shipped = 4;
    public static $outForDelivery = 5;
    public static $delivered = 6;
    public static $cancelled = 7;
    public static $returned = 8;

    // Self Pickup Statuses
    public static $selfPickupPending = 9;
    public static $selfPickupReady = 10;
    public static $selfPickupPicked = 11;

    public static $orderPaymentPending = "Payment Pending";
    public static $orderReceived = "Received";
    public static $orderProcessed = "Processed";
    public static $orderShipped = "Shipped";
    public static $orderOutForDelivery = "Out For Delivery";
    public static $orderDelivered = "Delivered";
    public static $orderCancelled = "Cancelled";
    public static $orderReturned = "Returned";

    // Self Pickup Status Names
    public static $orderSelfPickupPending = "Pending";
    public static $orderSelfPickupReady = "Ready for Pickup";
    public static $orderSelfPickupPicked = "Picked Up";

    public static function getTranslationKey(int $statusId): string
    {
        $statusKeys = [
            self::$paymentPending     => 'payment_pending',      // ID 1
            self::$received           => 'received',             // ID 2
            self::$processed          => 'processed',            // ID 3
            self::$shipped            => 'shipped',              // ID 4
            self::$outForDelivery     => 'outForDelivery',       // ID 5
            self::$delivered          => 'delivered',            // ID 6
            self::$cancelled          => 'cancelled',            // ID 7
            self::$returned           => 'returned',             // ID 8
            self::$selfPickupPending  => 'pending',              // ID 9
            self::$selfPickupReady    => 'ready_for_pickup',     // ID 10
            self::$selfPickupPicked   => 'picked_up',            // ID 11
        ];

        return $statusKeys[$statusId] ?? '';
    }

    public static function getTranslatedName(int $statusId): string
    {
        $key = self::getTranslationKey($statusId);

        // Return empty string if no key found
        if (empty($key)) {
            return '';
        }

        return __($key);
    }
}
