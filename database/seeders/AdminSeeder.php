<?php

namespace Database\Seeders;

use App\Models\DeliveryBoy;
use App\Models\Role;
use App\Models\Seller;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /*Super Admin*/
        $superAdmin = \App\Models\Admin::where('email', 'admin@gmail.com')->first();
        if (!$superAdmin) {
            $superAdmin = \App\Models\Admin::create([
                'username' => 'superadmin',
                'email' => 'admin@gmail.com',
                'password' => bcrypt('123456'),
                'role_id' => 1,
                'created_by' => 1,
            ]);
        }
        if ($superAdmin && method_exists($superAdmin, 'assignRole')) {
            $superAdmin->assignRole('Super Admin');
        }

        /*Admin*/
        $admin = \App\Models\Admin::where('email', 'admin2@gmail.com')->first();
        if (!$admin) {
            $admin = \App\Models\Admin::create([
                'username' => 'Admin',
                'email' => 'admin2@gmail.com',
                'password' => bcrypt('123456'),
                'role_id' => 2,
                'created_by' => 1,
            ]);
        }
        if ($admin && method_exists($admin, 'assignRole')) {
            $admin->assignRole('Admin');
        }

        /*Seller*/
        $seller = \App\Models\Admin::where('email', 'seller@gmail.com')->first();
        if (!$seller) {
            $seller = \App\Models\Admin::create([
                'username' => 'Seller',
                'email' => 'seller@gmail.com',
                'password' => bcrypt('123456'),
                'role_id' => Role::$roleSeller ?? 3,
                'created_by' => 1,
            ]);
        }
        if ($seller && method_exists($seller, 'assignRole')) {
            $seller->assignRole(Role::$roleNameSeller ?? 'Seller');
        }

        if (!Seller::where('email', 'seller@mail.com')->exists()) {
            $sellerData = array();
            $sellerData['admin_id'] = $seller->id ?? 3;
            $sellerData['name'] = 'WRTeam';
            $sellerData['store_name'] = 'WRTeam';
            $sellerData['email'] = 'seller@mail.com';
            $sellerData['mobile'] = '9558192001';
            $sellerData['balance'] = 0;
            $sellerData['logo'] = '';
            $sellerData['store_description'] = 'WRTeam Store';
            $sellerData['street'] = 'Bhuj';
            $sellerData['status'] = 1;
            $sellerData['tax_name'] = 1;
            $sellerData['slug'] = '';
            $sellerData['city_id'] = 0;
            Seller::create($sellerData);
        }

        /*Delivery Boy*/
        $deliveryBoy = \App\Models\Admin::where('email', 'delivery@gmail.com')->first();
        if (!$deliveryBoy) {
            $deliveryBoy = \App\Models\Admin::create([
                'username' => 'Delivery Boy',
                'email' => 'delivery@gmail.com',
                'password' => bcrypt('123456'),
                'role_id' => Role::$roleDeliveryBoy ?? 4,
                'created_by' => 1,
            ]);
        }
        if ($deliveryBoy && method_exists($deliveryBoy, 'assignRole')) {
            $deliveryBoy->assignRole(Role::$roleNameDeliveryBoy ?? 'Delivery Boy');
        }
        if (!DeliveryBoy::where('mobile', '9558192002')->exists()) {
            $deliveryBoyData = array();
            $deliveryBoyData['admin_id'] = $deliveryBoy->id ?? 4;
            $deliveryBoyData['name'] = 'Delivery Boy';
            $deliveryBoyData['mobile'] = '9558192002';
            $deliveryBoyData['balance'] = 0;
            $deliveryBoyData['address'] = "Bhuj";
            $deliveryBoyData['status'] = 1;
            $deliveryBoyData['city_id'] = 0;
            DeliveryBoy::create($deliveryBoyData);
        }

        /*Users*/
        if (!\App\Models\User::where('email', 'customer@gmail.com')->exists()) {
            \App\Models\User::create([
                'name' => 'Customer',
                'email' => 'customer@gmail.com',
                'password' => bcrypt('123456'),
                'mobile' => 123456789,
                'status' => 1,
            ]);
        }
    }
}
