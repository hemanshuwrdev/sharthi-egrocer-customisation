<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Setting::truncate();

        $settings = [
            [
                'variable' => 'app_name',
                'value' => 'eGrocer',
            ],
            [
                'variable' => 'support_number',
                'value' => '1234567890',
            ],
            [
                'variable' => 'support_email',
                'value' => 'support@gmail.com',
            ],
            [
                'variable' => 'logo',
                'value' => '',
            ],
            [
                'variable' => 'purchase_code',
                'value' => '',
            ],
            [
                'variable' => 'stripe_secret_key',
                'value' => '',
            ],
            [
                'variable' => 'stripe_publishable_key',
                'value' => '',
            ],
            [
                'variable' => 'stripe_webhook_secret_key',
                'value' => '',
            ],
            [
                'variable' => 'currency',
                'value' => '₹',
            ],
            [
                'variable' => 'currency_code',
                'value' => 'INR',
            ],
            [
                'variable' => 'decimal_point',
                'value' => '2',
            ],
            [
                'variable' => 'cod_payment_method',
                'value' => '1',
            ],
            [
                'variable' => 'cod_mode',
                'value' => 'global',
            ],
            [
                'variable' => 'max_cart_items_count',
                'value' => '10',
            ],
            [
                'variable' => 'email_login',
                'value' => '1',
            ],
            [
                'variable' => 'google_login',
                'value' => '1',
            ],
            [
                'variable' => 'date_format',
                'value' => 'd M Y',
            ],
            [
                'variable' => 'time_format',
                'value' => 'h:i A',
            ],
            [
                'variable' => 'country_code',
                'value' => '+91',
            ],
            [
                'variable' => 'nation_code',
                'value' => 'IN',
            ]
        ];

        foreach ($settings as $setting){
            Setting::create($setting);
        }
    }
}
