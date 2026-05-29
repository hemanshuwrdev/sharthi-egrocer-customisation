<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Schema;
class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        if (!file_exists(storage_path('installed'))) {
            return;
        }

        try {
            // Skip if settings table doesn't exist (e.g. during install/re-install)
            if (!Schema::hasTable('settings')) {
                return;
            }
            $timezone = DB::table('settings')->where('variable', 'system_timezone')->first();

            // Set the timezone in the application configuration
            if (isset($timezone) && $timezone->value != " " && $timezone->value != null) {
                Config::set('app.timezone', $timezone->value);
                date_default_timezone_set($timezone->value);
            }
        } catch (\Throwable $e) {
            // Database/table not ready (e.g. during install) - use default timezone
        }
    }
}