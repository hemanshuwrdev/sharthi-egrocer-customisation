<?php

namespace App\Jobs;

use App\Helpers\CommonHelper;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class OrderCutoffJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct()
    {
        //
    }

    /**
     * Safety net: backfill delivery_date for any order that was placed
     * before the inline cutoff logic was in place. Inline logic in
     * OrderApiController::placeOrder is the primary path.
     * Uses each order's first item's seller_id to resolve per-distributor cutoff.
     */
    public function handle()
    {
        try {
            $orders = Order::whereNull('delivery_date')->get();
            foreach ($orders as $order) {
                $sellerId = OrderItem::where('user_id', $order->user_id)
                    ->where('order_id', $order->id)
                    ->value('seller_id');
                $order->delivery_date = CommonHelper::computeDeliveryDate($order->created_at, $sellerId);
                $order->save();
            }
        } catch (\Exception $e) {
            Log::error('OrderCutoffJob failed: ' . $e->getMessage());
        }
    }
}
