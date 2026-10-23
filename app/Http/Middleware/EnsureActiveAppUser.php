<?php

namespace App\Http\Middleware;

use App\Helpers\CommonHelper;
use App\Models\DeliveryBoy;
use App\Models\Role;
use App\Models\Salesman;
use Closure;
use Illuminate\Http\Request;

/**
 * Keeps a deactivated salesman / driver out of the app they are already logged in to.
 *
 * Login refuses them, but the access token the app holds lasts a year and nothing looked at the
 * account again — so someone deactivated (or removed) in the distributor panel could carry on using
 * the app, including placing orders. This runs on every authenticated API request: if the logged-in
 * salesman or driver is no longer Active it ends their session (revokes their tokens, stops their
 * push notifications) and answers 401, which the apps already treat as "logged out".
 *
 * Distributors, admins and every other role pass straight through.
 */
class EnsureActiveAppUser
{
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();

        if ($user && !self::isActive($user)) {
            CommonHelper::revokeAppAccess($user);

            return CommonHelper::responseError('your_account_is_deactivated_please_contact_your_distributor')
                ->setStatusCode(401);
        }

        return $next($request);
    }

    /** A salesman / driver is active only while their own record says Active; a missing record counts as not active. */
    private static function isActive($user): bool
    {
        if ((int) $user->role_id === Role::$roleSalesman) {
            return (int) Salesman::where('admin_id', $user->id)->value('status') === Salesman::$statusActive;
        }
        if ((int) $user->role_id === Role::$roleDeliveryBoy) {
            return (int) DeliveryBoy::where('admin_id', $user->id)->value('status') === DeliveryBoy::$statusActive;
        }

        return true;
    }
}
