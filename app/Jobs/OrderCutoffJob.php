<?php

namespace App\Jobs;

use App\Models\Order;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class OrderCutoffJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Logic: 
        // We find orders created today but not yet assigned a delivery_date.
        // We compare their created_at time to a system 'cutoff_time' setting.
        // If created before cutoff -> delivery_date = tomorrow.
        // If created after cutoff -> delivery_date = day after tomorrow.

        try {
            // Get cutoff time setting, default to 18:00 (6 PM) if not set.
            $cutoffTimeSetting = Setting::where('variable', 'order_cutoff_time')->first();
            $cutoffTimeString = $cutoffTimeSetting ? $cutoffTimeSetting->value : '18:00';
            
            $now = Carbon::now();
            $cutoffTime = Carbon::createFromTimeString($cutoffTimeString);

            // Fetch unassigned orders
            $orders = Order::whereNull('delivery_date')->get();

            foreach ($orders as $order) {
                $createdAt = Carbon::parse($order->created_at);
                $cutoffForOrderDay = Carbon::parse($createdAt->toDateString() . ' ' . $cutoffTimeString);

                if ($createdAt->lessThanOrEqualTo($cutoffForOrderDay)) {
                    $order->delivery_date = $createdAt->addDay()->toDateString();
                } else {
                    $order->delivery_date = $createdAt->addDays(2)->toDateString();
                }

                $order->save();
            }

        } catch (\Exception $e) {
            Log::error('OrderCutoffJob failed: ' . $e->getMessage());
        }
    }
}
