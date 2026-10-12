<?php

namespace App\Console\Commands;

use App\Services\RetailerZoneService;
use Illuminate\Console\Command;

class SyncRetailerZones extends Command
{
    protected $signature = 'retailers:sync-zones';

    protected $description = 'Recompute which delivery zones every retailer sits in (run after changing zone boundaries in bulk)';

    public function handle(RetailerZoneService $zones): int
    {
        $count = $zones->syncAll();
        $this->info("Updated zones for {$count} retailer(s).");

        return self::SUCCESS;
    }
}
