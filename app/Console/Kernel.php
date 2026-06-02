<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Console\Commands\SendCartNotificationCommand;
use App\Jobs\OrderCutoffJob;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        SendCartNotificationCommand::class,
    ];
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('cart:notification')->everyMinute();
        $schedule->command('queue:work --once')->everyMinute();
        
        // Sarthi DDOS: Run order cutoff processing periodically (e.g. every hour)
        $schedule->job(new OrderCutoffJob)->hourly();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
