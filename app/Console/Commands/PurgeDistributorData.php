<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * One-off clean-up of test data for chosen distributors: everything they transacted and every
 * person who worked for them goes; the distributor accounts, their logins and the shared catalog
 * stay. Built to be run once, then deleted.
 *
 *   php artisan sarthi:purge-distributor-data --email=a@x.com --email=b@y.com                       -> DRY RUN
 *   php artisan sarthi:purge-distributor-data --email=a@x.com --email=b@y.com --execute --i-have-a-backup
 *
 * The dry run really performs every delete inside a transaction and rolls it back, so its counts
 * are exact. Both modes abort (and roll back) if any OTHER distributor's data would change.
 */
class PurgeDistributorData extends Command
{
    protected $signature = 'sarthi:purge-distributor-data
        {--email=* : Email of a distributor to clean (repeat for each). Matches the distributor email or its login email}
        {--execute : Really delete (default is a dry run that rolls back)}
        {--i-have-a-backup : Required with --execute: confirms a verified database backup exists}';

    protected $description = 'One-off: wipe test transactions, staff and listings of chosen distributors (accounts are kept)';

    /** @var array<string,int> step => rows deleted/changed */
    private array $report = [];

    /** @var array<string,int[]> model class => ids deleted, used to clear their audit-log rows */
    private array $logIds = [];

    public function handle(): int
    {
        $emails = array_values(array_unique(array_filter(array_map(fn ($e) => strtolower(trim((string) $e)), (array) $this->option('email')))));
        $execute = (bool) $this->option('execute');

        if (!$emails) {
            $this->error('Give at least one distributor: --email=owner@example.com (repeat for each).');
            return 1;
        }

        if ($execute && !$this->option('i-have-a-backup')) {
            $this->error('Refusing to run: add --i-have-a-backup once a verified database backup exists.');
            return 1;
        }

        // Each email must point at exactly one distributor: by the distributor's own email, or by
        // the email of its login. Anything unknown or ambiguous stops the run before it starts.
        $picked = [];
        foreach ($emails as $email) {
            $matches = DB::table('sellers')->where(fn ($q) => $q
                ->whereRaw('LOWER(TRIM(email)) = ?', [$email])
                ->orWhereIn('admin_id', DB::table('admins')->whereRaw('LOWER(TRIM(email)) = ?', [$email])->select('id')))
                ->get();
            if ($matches->count() !== 1) {
                $this->error("Email {$email} matched {$matches->count()} distributors (need exactly 1): " . $matches->pluck('name')->implode(', '));
                return 1;
            }
            $picked[$matches->first()->id] = $matches->first();
        }
        $sellers = collect(array_values($picked));
        if ($sellers->count() !== count($emails)) {
            $this->error('Two of the emails point at the same distributor — check the list.');
            return 1;
        }

        $this->line('Distributors: ' . $sellers->map(fn ($s) => "#{$s->id} {$s->name}")->implode(' | '));
        $this->line($execute ? '<fg=red>EXECUTE MODE: this will commit.</>' : '<fg=green>DRY RUN: everything is rolled back at the end.</>');

        if ($execute) {
            $this->warn('This permanently deletes data on database "' . DB::connection()->getDatabaseName() . '".');
            if ($this->ask('Type DELETE to continue') !== 'DELETE') {
                $this->line('Cancelled.');
                return 1;
            }
        }

        DB::beginTransaction();
        try {
            $before = $this->bystanderSnapshot($sellers->pluck('id')->all());
            $this->purge($sellers->pluck('id')->all(), $sellers->pluck('admin_id')->filter()->all());
            $after = $this->bystanderSnapshot($sellers->pluck('id')->all());

            if ($before !== $after) {
                throw new \RuntimeException("Another distributor's data would change — aborting.\n" . json_encode(['before' => $before, 'after' => $after]));
            }

            $this->printReport($sellers->pluck('id')->all());

            if ($execute) {
                DB::commit();
                $this->info('Committed.');
            } else {
                DB::rollBack();
                $this->info('Dry run finished: NOTHING was changed.');
            }
        } catch (\Throwable $e) {
            DB::rollBack();
            $this->error('Rolled back, nothing changed: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }

    private function purge(array $sellerIds, array $sellerAdminIds): void
    {
        $S = $sellerIds;

        // ---- who and what is in scope -------------------------------------------------------
        $salesmen = DB::table('salesmen')->whereIn('seller_id', $S)->get(['id', 'admin_id']);
        $salesmanIds = $salesmen->pluck('id')->all();
        $salesmanAdminIds = $salesmen->pluck('admin_id')->filter()->all();

        // A driver shared with a distributor outside this clean-up is only unlinked, never deleted.
        $driverCandidates = DB::table('delivery_boys')->where(fn ($q) => $q
            ->whereIn('seller_id', $S)
            ->orWhereIn('id', DB::table('delivery_boy_sellers')->whereIn('seller_id', $S)->select('delivery_boy_id')))
            ->get(['id', 'admin_id', 'seller_id']);
        $driverIds = [];
        $sharedDrivers = [];
        foreach ($driverCandidates as $d) {
            $elsewhere = DB::table('delivery_boy_sellers')->where('delivery_boy_id', $d->id)->whereNotIn('seller_id', $S)->pluck('seller_id')->all();
            if ($elsewhere) {
                $sharedDrivers[$d->id] = $elsewhere;
            } else {
                $driverIds[] = $d->id;
            }
        }
        $driverAdminIds = $driverCandidates->whereIn('id', $driverIds)->pluck('admin_id')->filter()->all();
        $staffAdminIds = array_values(array_unique(array_merge($salesmanAdminIds, $driverAdminIds)));
        $allAdminIds = array_values(array_unique(array_merge($staffAdminIds, $sellerAdminIds)));

        $vehicleIds = DB::table('vehicles')->whereIn('seller_id', $S)->pluck('id')->all();

        $itemIds = DB::table('order_items')->whereIn('seller_id', $S)->pluck('id')->all();
        $itemOrderIds = DB::table('order_items')->whereIn('seller_id', $S)->distinct()->pluck('order_id')->all();
        $mixedOrderIds = $itemOrderIds ? DB::table('order_items')->whereIn('order_id', $itemOrderIds)->whereNotIn('seller_id', $S)->distinct()->pluck('order_id')->all() : [];
        // Orders placed by these salesmen that have no lines of another distributor are theirs too.
        $salesmanOrderIds = $salesmanIds ? DB::table('orders')->whereIn('placed_by_salesman_id', $salesmanIds)->pluck('id')->all() : [];
        $mixedOfSalesman = $salesmanOrderIds ? DB::table('order_items')->whereIn('order_id', $salesmanOrderIds)->whereNotIn('seller_id', $S)->distinct()->pluck('order_id')->all() : [];
        $mixedOrderIds = array_values(array_unique(array_merge($mixedOrderIds, $mixedOfSalesman)));
        $orderIds = array_values(array_diff(array_unique(array_merge($itemOrderIds, $salesmanOrderIds)), $mixedOrderIds));
        $this->report['(info) orders shared with another distributor — kept, only these distributors\' lines removed'] = count($mixedOrderIds);
        $this->report['(info) drivers shared with another distributor — only unlinked'] = count($sharedDrivers);

        $slipIds = DB::table('loading_slips')->where(fn ($q) => $q
            ->whereIn('id', DB::table('orders')->whereIn('id', $orderIds)->whereNotNull('loading_slip_id')->select('loading_slip_id'))
            ->orWhereIn('vehicle_id', $vehicleIds)
            ->orWhereIn('driver_id', $driverIds)
            ->orWhereIn('created_by', $sellerAdminIds))->pluck('id')->all();

        $creditNoteIds = DB::table('credit_notes')->where(fn ($q) => $q->whereIn('seller_id', $S)->orWhereIn('order_id', $orderIds))->pluck('id')->all();

        // ---- transactions, children first ----------------------------------------------------
        $this->del('credit_note_items', 'credit_note_items', fn ($q) => $q->whereIn('credit_note_id', $creditNoteIds));
        $this->del('credit_notes', 'credit_notes', fn ($q) => $q->whereIn('id', $creditNoteIds), 'CreditNote');
        $this->del('driver_settlements', 'driver_settlements', fn ($q) => $q->where(fn ($w) => $w->whereIn('seller_id', $S)->orWhereIn('loading_slip_id', $slipIds)->orWhereIn('delivery_boy_id', $driverIds)), 'DriverSettlement');
        $this->del('salesman_settlements', 'salesman_settlements', fn ($q) => $q->where(fn ($w) => $w->whereIn('seller_id', $S)->orWhereIn('salesman_id', $salesmanIds)), 'SalesmanSettlement');
        $this->del('order_statuses', 'order_statuses', fn ($q) => $q->where(fn ($w) => $w->whereIn('order_id', $orderIds)->orWhereIn('order_item_id', $itemIds)));
        $this->del('order_payments', 'order_payments', fn ($q) => $q->where(fn ($w) => $w->whereIn('order_id', $orderIds)->orWhereIn('delivery_boy_id', $driverIds)->orWhereIn('salesman_id', $salesmanIds)), 'OrderPayment');
        $this->del('live_tracking', 'live_tracking', fn ($q) => $q->whereIn('order_id', $orderIds));
        $this->del('return_requests', 'return_requests', fn ($q) => $q->where(fn ($w) => $w->whereIn('order_id', $orderIds)->orWhereIn('order_item_id', $itemIds)), 'ReturnRequest');
        $this->del('salesman_notifications', 'salesman_notifications', fn ($q) => $q->where(fn ($w) => $w->whereIn('salesman_id', $salesmanIds)->orWhereIn('order_id', $orderIds)));
        $this->del('delivery_boy_notifications', 'delivery_boy_notifications', fn ($q) => $q->where(fn ($w) => $w->whereIn('delivery_boy_id', $driverIds)->orWhereIn('order_item_id', $itemIds)));
        $this->del('delivery_boy_transactions', 'delivery_boy_transactions', fn ($q) => $q->where(fn ($w) => $w->whereIn('delivery_boy_id', $driverIds)->orWhereIn('order_id', $orderIds)), 'DeliveryBoyTransaction');
        $this->del('fund_transfers', 'fund_transfers', fn ($q) => $q->whereIn('delivery_boy_id', $driverIds));
        $this->del('admin_commission_transactions', 'admin_commission_transactions', fn ($q) => $q->where(fn ($w) => $w->whereIn('seller_id', $S)->orWhereIn('order_id', $orderIds)->orWhereIn('order_item_id', $itemIds)), 'AdminCommissionTransaction');
        $this->del('seller_wallet_transactions', 'seller_wallet_transactions', fn ($q) => $q->where(fn ($w) => $w->whereIn('seller_id', $S)->orWhereIn('order_id', $orderIds)->orWhereIn('order_item_id', $itemIds)), 'SellerWalletTransaction');
        $this->del('transactions', 'transactions', fn ($q) => $q->whereIn('order_id', $orderIds));
        $this->del('wallet_transactions', 'wallet_transactions', fn ($q) => $q->where(fn ($w) => $w->whereIn('order_id', $orderIds)->orWhereIn('order_item_id', $itemIds)));
        $this->del('app_usages', 'app_usages', fn ($q) => $q->whereIn('order_id', $orderIds));
        $this->del('order_items', 'order_items', fn ($q) => $q->whereIn('id', $itemIds), 'OrderItem');
        if (\Illuminate\Support\Facades\Schema::hasTable('order_schemes')) {
            $this->del('order_schemes', 'order_schemes', fn ($q) => $q->whereIn('order_id', $orderIds));
        }
        $this->del('orders', 'orders', fn ($q) => $q->whereIn('id', $orderIds), 'Order');
        $this->del('loading_slips', 'loading_slips', fn ($q) => $q->whereIn('id', $slipIds), 'LoadingSlip');
        $this->del('vehicles', 'vehicles', fn ($q) => $q->whereIn('id', $vehicleIds), 'Vehicle');
        $this->del('carts', 'carts', fn ($q) => $q->where(fn ($w) => $w->whereIn('seller_id', $S)->orWhereIn('placed_by_salesman_id', $salesmanIds)), 'Cart');
        $this->del('favorites', 'favorites', fn ($q) => $q->whereIn('seller_id', $S));

        // ---- listings, prices, stock, schemes (the catalog products themselves stay) ----------
        $schemeIds = DB::table('schemes')->whereIn('seller_id', $S)->pluck('id')->all();
        $spIds = DB::table('seller_products')->whereIn('seller_id', $S)->pluck('id')->all();
        $this->del('scheme_products', 'scheme_products', fn ($q) => $q->where(fn ($w) => $w->whereIn('scheme_id', $schemeIds)->orWhereIn('seller_product_id', $spIds)));
        $this->del('scheme_slabs', 'scheme_slabs', fn ($q) => $q->whereIn('scheme_id', $schemeIds));
        $this->del('schemes', 'schemes', fn ($q) => $q->whereIn('id', $schemeIds), 'Scheme');
        $this->del('seller_product_slab_prices', 'seller_product_slab_prices', fn ($q) => $q->whereIn('seller_product_id', $spIds));
        $this->del('seller_products (listings, prices, stock)', 'seller_products', fn ($q) => $q->whereIn('id', $spIds), 'SellerProduct');

        // ---- salesmen ------------------------------------------------------------------------
        $this->upd('users.salesman_id cleared (retailers unassigned)', 'users', fn ($q) => $q->whereIn('salesman_id', $salesmanIds), ['salesman_id' => null]);
        $this->upd('retailer_profiles.verified_by_salesman_id cleared', 'retailer_profiles', fn ($q) => $q->whereIn('verified_by_salesman_id', $salesmanIds), ['verified_by_salesman_id' => null]);
        $this->upd('retailer_address_change_requests.assigned_salesman_id cleared', 'retailer_address_change_requests', fn ($q) => $q->whereIn('assigned_salesman_id', $salesmanIds), ['assigned_salesman_id' => null]);
        $this->upd('retailer_address_change_requests.verified_by_salesman_id cleared', 'retailer_address_change_requests', fn ($q) => $q->whereIn('verified_by_salesman_id', $salesmanIds), ['verified_by_salesman_id' => null]);
        $this->upd('orders.placed_by_salesman_id cleared (shared orders)', 'orders', fn ($q) => $q->whereIn('placed_by_salesman_id', $salesmanIds), ['placed_by_salesman_id' => null]);
        $this->del('mobile_registry (salesmen)', 'mobile_registry', fn ($q) => $q->where('role', 'salesman')->whereIn('role_id', $salesmanIds));
        $this->del('salesmen', 'salesmen', fn ($q) => $q->whereIn('id', $salesmanIds), 'Salesman');

        // ---- drivers -------------------------------------------------------------------------
        $this->upd('orders.delivery_boy_id cleared (shared orders)', 'orders', fn ($q) => $q->whereIn('delivery_boy_id', $driverIds), ['delivery_boy_id' => null]);
        $this->upd('order_items.delivery_boy_id cleared (shared orders)', 'order_items', fn ($q) => $q->whereIn('delivery_boy_id', $driverIds), ['delivery_boy_id' => null]);
        foreach ($sharedDrivers as $driverId => $otherSellerIds) {
            $this->del('delivery_boy_sellers (shared driver unlinked)', 'delivery_boy_sellers', fn ($q) => $q->where('delivery_boy_id', $driverId)->whereIn('seller_id', $S));
            $this->upd('delivery_boys.seller_id repointed (shared driver)', 'delivery_boys', fn ($q) => $q->where('id', $driverId)->whereIn('seller_id', $S), ['seller_id' => $otherSellerIds[0]]);
        }
        $this->del('delivery_boy_cities', 'delivery_boy_cities', fn ($q) => $q->whereIn('delivery_boy_id', $driverIds));
        $this->del('delivery_boy_translations', 'delivery_boy_translations', fn ($q) => $q->whereIn('delivery_boy_id', $driverIds));
        $this->del('delivery_boy_salary', 'delivery_boy_salary', fn ($q) => $q->whereIn('delivery_boy_id', $driverIds));
        $this->del('delivery_boy_sellers', 'delivery_boy_sellers', fn ($q) => $q->where(fn ($w) => $w->whereIn('delivery_boy_id', $driverIds)->orWhere(fn ($x) => $x->whereIn('seller_id', $S)->whereNotIn('delivery_boy_id', array_keys($sharedDrivers)))));
        $this->del('mobile_registry (drivers)', 'mobile_registry', fn ($q) => $q->where('role', 'delivery_boy')->whereIn('role_id', $driverIds));
        $this->del('delivery_boys', 'delivery_boys', fn ($q) => $q->whereIn('id', $driverIds), 'DeliveryBoy');

        // ---- staff logins (the distributors' own logins stay) --------------------------------
        $this->del('admin_tokens (staff devices)', 'admin_tokens', fn ($q) => $q->whereIn('user_id', $staffAdminIds));
        $this->del('model_has_roles (staff)', 'model_has_roles', fn ($q) => $q->whereIn('model_id', $staffAdminIds)->where('model_type', 'like', '%Admin'));
        $this->del('admins (staff logins)', 'admins', fn ($q) => $q->whereIn('id', $staffAdminIds), 'Admin');

        // ---- notifications, audit trail ------------------------------------------------------
        $this->del('panel_notifications', 'panel_notifications', fn ($q) => $q->where('notifiable_type', 'like', '%Admin')->whereIn('notifiable_id', $allAdminIds));
        $this->logIds['Seller'] = $S;
        $this->logIds['Admin'] = array_values(array_unique(array_merge($this->logIds['Admin'] ?? [], $sellerAdminIds)));
        $logRows = 0;
        foreach ($this->logIds as $class => $ids) {
            foreach (array_chunk($ids, 1000) as $chunk) {
                $logRows += DB::table('activity_log')->where('subject_type', 'App\\Models\\' . $class)->whereIn('subject_id', $chunk)->delete();
            }
        }
        $logRows += DB::table('activity_log')->where('causer_type', 'like', '%Admin')->whereIn('causer_id', $allAdminIds)->delete();
        $this->report['activity_log (audit entries)'] = $logRows;

        // ---- reset each distributor to a clean slate -----------------------------------------
        $this->upd('sellers: wallet balance 0, invoice / credit note / loading slip numbers back to 1', 'sellers', fn ($q) => $q->whereIn('id', $S), [
            'balance' => 0, 'invoice_next_number' => 1, 'credit_note_next_number' => 1, 'loading_slip_next_number' => 1,
        ]);
    }

    private function del(string $label, string $table, \Closure $scope, ?string $logClass = null): void
    {
        if ($logClass) {
            $ids = $scope(DB::table($table))->pluck('id')->all();
            $this->logIds[$logClass] = array_merge($this->logIds[$logClass] ?? [], $ids);
        }
        $this->report[$label] = ($this->report[$label] ?? 0) + $scope(DB::table($table))->delete();
    }

    private function upd(string $label, string $table, \Closure $scope, array $values): void
    {
        $this->report[$label] = ($this->report[$label] ?? 0) + $scope(DB::table($table))->update($values);
    }

    /** Counts of everything that belongs to distributors NOT being cleaned — must not move. */
    private function bystanderSnapshot(array $targetSellerIds): array
    {
        $others = DB::table('sellers')->whereNotIn('id', $targetSellerIds)->get(['id', 'admin_id', 'balance', 'invoice_next_number', 'credit_note_next_number', 'loading_slip_next_number']);
        $snap = [];
        foreach ($others as $s) {
            $orderIds = DB::table('order_items')->where('seller_id', $s->id)->pluck('order_id')->all();
            $snap[$s->id] = [
                'order_items' => DB::table('order_items')->where('seller_id', $s->id)->count(),
                'orders_payments' => DB::table('order_payments')->whereIn('order_id', $orderIds)->count(),
                'credit_notes' => DB::table('credit_notes')->where('seller_id', $s->id)->count(),
                'driver_settlements' => DB::table('driver_settlements')->where('seller_id', $s->id)->count(),
                'salesman_settlements' => DB::table('salesman_settlements')->where('seller_id', $s->id)->count(),
                'seller_products' => DB::table('seller_products')->where('seller_id', $s->id)->count(),
                'schemes' => DB::table('schemes')->where('seller_id', $s->id)->count(),
                'salesmen' => DB::table('salesmen')->where('seller_id', $s->id)->count(),
                'vehicles' => DB::table('vehicles')->where('seller_id', $s->id)->count(),
                'drivers_linked' => DB::table('delivery_boy_sellers')->where('seller_id', $s->id)->count(),
                'wallet_tx' => DB::table('seller_wallet_transactions')->where('seller_id', $s->id)->count(),
                'commission_tx' => DB::table('admin_commission_transactions')->where('seller_id', $s->id)->count(),
                'loading_slips' => DB::table('loading_slips')->where('created_by', $s->admin_id)->count(),
                'carts' => DB::table('carts')->where('seller_id', $s->id)->count(),
                'balance_and_numbers' => [(string) $s->balance, $s->invoice_next_number, $s->credit_note_next_number, $s->loading_slip_next_number],
            ];
        }
        return $snap;
    }

    private function printReport(array $sellerIds): void
    {
        $rows = [];
        foreach ($this->report as $label => $n) {
            $rows[] = [$label, $n];
        }
        $this->table(['Step', 'Rows'], $rows);

        $this->line('Left behind for the two distributors (all should be 0):');
        $left = [
            'order_items' => DB::table('order_items')->whereIn('seller_id', $sellerIds)->count(),
            'credit_notes' => DB::table('credit_notes')->whereIn('seller_id', $sellerIds)->count(),
            'driver_settlements' => DB::table('driver_settlements')->whereIn('seller_id', $sellerIds)->count(),
            'salesman_settlements' => DB::table('salesman_settlements')->whereIn('seller_id', $sellerIds)->count(),
            'seller_products' => DB::table('seller_products')->whereIn('seller_id', $sellerIds)->count(),
            'schemes' => DB::table('schemes')->whereIn('seller_id', $sellerIds)->count(),
            'salesmen' => DB::table('salesmen')->whereIn('seller_id', $sellerIds)->count(),
            'vehicles' => DB::table('vehicles')->whereIn('seller_id', $sellerIds)->count(),
            'drivers linked' => DB::table('delivery_boy_sellers')->whereIn('seller_id', $sellerIds)->count(),
            'wallet_tx' => DB::table('seller_wallet_transactions')->whereIn('seller_id', $sellerIds)->count(),
            'commission_tx' => DB::table('admin_commission_transactions')->whereIn('seller_id', $sellerIds)->count(),
        ];
        $this->table(array_keys($left), [array_values($left)]);
        $this->line('Kept: the distributor accounts and logins, retailers, catalog products, brands, areas, subscriptions.');
    }
}
