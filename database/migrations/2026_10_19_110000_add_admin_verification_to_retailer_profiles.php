<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Admin-side retailer onboarding. An admin can add a retailer from the panel and approve a
 * pending one without waiting for a salesman visit (e.g. shops that already trade offline).
 *
 *  - retailer_profiles.verified_by_admin_id : set when an admin (not a salesman) verified the
 *    retailer; verified_by_salesman_id stays NULL in that case.
 *  - retailer_profiles.created_by_admin_id  : set when the retailer was added from the panel
 *    rather than self-registered in the app.
 *  - customer_create / customer_verify permissions for Super Admin + Admin. customer_verify is
 *    separate from customer_update because approving skips the in-person visit.
 */
class AddAdminVerificationToRetailerProfiles extends Migration
{
    private array $permissions = ['customer_create', 'customer_verify'];

    public function up()
    {
        if (Schema::hasTable('retailer_profiles')) {
            Schema::table('retailer_profiles', function (Blueprint $table) {
                if (!Schema::hasColumn('retailer_profiles', 'verified_by_admin_id')) {
                    $table->unsignedBigInteger('verified_by_admin_id')->nullable()->after('verified_by_salesman_id')
                          ->comment('admins.id who verified without a salesman visit');
                }
                if (!Schema::hasColumn('retailer_profiles', 'created_by_admin_id')) {
                    $table->unsignedBigInteger('created_by_admin_id')->nullable()->after('verified_by_admin_id')
                          ->comment('admins.id who added this retailer from the panel');
                }
            });
        }

        \Artisan::call('cache:forget spatie.permission.cache');

        $categoryId = \App\Models\PermissionCategory::where('name', 'customer')->value('id');
        if (!$categoryId) {
            \Log::error('customer permission category not found; customer_create / customer_verify not added');
            return;
        }

        foreach ($this->permissions as $name) {
            \App\Models\Permission::firstOrCreate(['name' => $name], ['category_id' => $categoryId]);
        }

        foreach (['Super Admin', 'Admin'] as $roleName) {
            $role = \Spatie\Permission\Models\Role::where('name', $roleName)->first();
            if ($role) {
                $role->givePermissionTo($this->permissions);
            } else {
                \Log::error("Role not found: $roleName");
            }
        }
    }

    public function down()
    {
        if (Schema::hasTable('retailer_profiles')) {
            Schema::table('retailer_profiles', function (Blueprint $table) {
                foreach (['created_by_admin_id', 'verified_by_admin_id'] as $column) {
                    if (Schema::hasColumn('retailer_profiles', $column)) {
                        $table->dropColumn($column);
                    }
                }
            });
        }

        \App\Models\Permission::whereIn('name', $this->permissions)->delete();
    }
}
