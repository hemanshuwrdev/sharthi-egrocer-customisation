<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Http\Controllers\API\Customer\RetailerCartOrderApiController;
use App\Models\Cart;
use App\Models\Scheme;
use App\Models\SchemeProduct;
use App\Models\SellerProduct;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

echo "=== STARTING FULL END-TO-END CUSTOMER CART & SCHEMES API TEST ===\n\n";

$passCount = 0;
$failCount = 0;

function assertE2E($condition, $message) {
    global $passCount, $failCount;
    if ($condition) {
        echo "  [PASS] $message\n";
        $passCount++;
    } else {
        echo "  [FAIL] $message\n";
        $failCount++;
    }
}

// 1. Pick a retailer/customer user
$customer = User::first();
if (!$customer) {
    echo "No customer user found. Exiting.\n";
    exit(1);
}
auth()->login($customer);
echo "Logged in as customer ID: {$customer->id} ({$customer->name})\n";

// 2. Pick a seller and products with secondary unit (Outer pack)
$sp1 = SellerProduct::with('masterProductVariant.masterProduct')
    ->whereHas('masterProductVariant', function ($q) {
        $q->where('secondary_unit_value', '>', 1);
    })->first();

if (!$sp1) {
    echo "No seller product with secondary_unit_value > 1 found. Exiting.\n";
    exit(1);
}

$sellerId = $sp1->seller_id;
$mv1 = $sp1->masterProductVariant;
$secVal1 = (float) $mv1->secondary_unit_value; // e.g. 10
$unitPrice1 = (float) ($sp1->discounted_price && (float) $sp1->discounted_price > 0 ? $sp1->discounted_price : $sp1->selling_price);

echo "Distributor Seller ID: $sellerId\n";
echo "Product 1: ID {$sp1->id} ({$mv1->masterProduct->name}), Price: ₹$unitPrice1, 1 Outer = $secVal1 units\n\n";

DB::beginTransaction();
try {
    // Clear any leftover cart for this customer
    Cart::where('user_id', $customer->id)->delete();
    $sp1->update(['stock' => 1000]);

    // -----------------------------------------------------------------
    // E2E STEP 1: Create Scheme with Outer Qty Condition
    // Min 2 Outer -> 10% Discount + 1 Inner Free
    // -----------------------------------------------------------------
    echo "--- E2E Step 1: Create Active Scheme on Distributor ---\n";

    $scheme = Scheme::create([
        'seller_id'   => $sellerId,
        'name'        => 'E2E Cart Scheme - 10% Off + Free Item',
        'type'        => 'product_conditions',
        'tax_option'  => 'inclusive',
        'start_date'  => date('Y-m-d', strtotime('-1 day')),
        'end_date'    => date('Y-m-d', strtotime('+30 days')),
        'status'      => 1,
    ]);

    SchemeProduct::create([
        'scheme_id'         => $scheme->id,
        'seller_product_id' => $sp1->id,
        'qty_basis'         => 'outer',
        'min_qty'           => 2,
        'max_qty'           => 20,
        'discount_type'     => 'percentage',
        'discount_value'    => 10,
    ]);

    assertE2E($scheme->exists, "Scheme created successfully on distributor $sellerId");

    // -----------------------------------------------------------------
    // E2E STEP 2: Add Non-Qualifying Qty to Cart (1 Outer = $secVal1 units)
    // Threshold is 2 Outer, so 1 Outer must NOT trigger discount
    // -----------------------------------------------------------------
    echo "\n--- E2E Step 2: Customer Cart API with 1 Outer (Below Threshold) ---\n";

    $cartItem = new Cart();
    $cartItem->user_id = $customer->id;
    $cartItem->product_id = $mv1->master_product_id;
    $cartItem->product_variant_id = 0;
    $cartItem->master_product_variant_id = $mv1->id;
    $cartItem->seller_id = $sellerId;
    $cartItem->seller_product_id = $sp1->id;
    $cartItem->qty = $secVal1;
    $cartItem->save_for_later = 0;
    $cartItem->save();

    $cartController = new RetailerCartOrderApiController();
    $cartResponse = $cartController->getCart(new Request())->getData(true);

    assertE2E($cartResponse['status'] === 1, "getCart API returned HTTP 200 / status 1");
    $sellerGroup = collect($cartResponse['data']['groups'])->firstWhere('seller_id', $sellerId);
    assertE2E($sellerGroup !== null, "Cart contains distributor group for seller $sellerId");
    assertE2E($sellerGroup['applied_scheme'] === null, "applied_scheme is null because 1 Outer < 2 Outer required");
    assertE2E((float)$sellerGroup['scheme_discount'] === 0.0, "scheme_discount is 0.0");
    assertE2E($sellerGroup['nearest_scheme'] !== null, "nearest_scheme banner is populated to encourage retailer to buy more");
    assertE2E((int)($sellerGroup['nearest_scheme']['qty_needed'] ?? 0) === 1, "nearest_scheme accurately states: 1 Outer pack needed to unlock discount");

    // -----------------------------------------------------------------
    // E2E STEP 3: Customer Updates Cart to 2 Outer (Qualifying Threshold)
    // -----------------------------------------------------------------
    echo "\n--- E2E Step 3: Customer Cart API with 2 Outer (Meets Threshold) ---\n";

    $cartItem->qty = 2 * $secVal1; // 2 Outer (20 base units)
    $cartItem->save();

    $cartResponse2 = $cartController->getCart(new Request())->getData(true);
    $sellerGroup2 = collect($cartResponse2['data']['groups'])->firstWhere('seller_id', $sellerId);

    assertE2E($sellerGroup2 !== null, "Cart retrieved distributor group");
    assertE2E($sellerGroup2['applied_scheme'] !== null, "applied_scheme is now POPULATED in getCart JSON payload!");
    assertE2E((int)$sellerGroup2['applied_scheme']['scheme_id'] === $scheme->id, "applied_scheme has correct scheme_id: {$scheme->id}");

    $expectedSubtotal = round(2 * $secVal1 * $unitPrice1, 2);
    $expectedDiscount = round($expectedSubtotal * 0.10, 2);
    $expectedFinalTotal = round($expectedSubtotal - $expectedDiscount, 2);

    assertE2E(abs((float)$sellerGroup2['scheme_discount'] - $expectedDiscount) < 0.05, "scheme_discount in JSON matches 10%: ₹$expectedDiscount (Got: ₹{$sellerGroup2['scheme_discount']})");
    assertE2E(abs((float)$sellerGroup2['final_total'] - $expectedFinalTotal) < 0.05, "final_total in JSON correctly deducts scheme_discount: ₹$expectedFinalTotal (Got: ₹{$sellerGroup2['final_total']})");
    assertE2E($sellerGroup2['nearest_scheme'] === null, "nearest_scheme is null because scheme is already fully applied");

    // -----------------------------------------------------------------
    // E2E STEP 4: Add Free Product Offer & Verify in Cart JSON
    // -----------------------------------------------------------------
    echo "\n--- E2E Step 4: Free Product Offer in Cart Payload ---\n";

    SchemeProduct::where('scheme_id', $scheme->id)->update([
        'discount_type'  => 'free_product',
        'free_qty'       => 2,
        'free_qty_basis' => 'inner',
        'discount_value' => null,
    ]);

    $cartResponse3 = $cartController->getCart(new Request())->getData(true);
    $sellerGroup3 = collect($cartResponse3['data']['groups'])->firstWhere('seller_id', $sellerId);

    assertE2E(!empty($sellerGroup3['applied_scheme']['free_items']), "applied_scheme.free_items is populated in cart response");
    $freeItem = $sellerGroup3['applied_scheme']['free_items'][0] ?? null;
    assertE2E($freeItem !== null && (int)$freeItem['qty'] === 2, "Cart payload shows exactly 2 free units for the retailer");
    assertE2E((float)$freeItem['unit_value'] > 0, "Cart payload shows value of the free item: ₹{$freeItem['unit_value']}");

    // -----------------------------------------------------------------
    // E2E STEP 5: Add Second Product to Scheme & Verify Multi-Item Cart
    // -----------------------------------------------------------------
    echo "\n--- E2E Step 5: Multi-Product Cart with Independent Row Offers ---\n";

    $sp2 = SellerProduct::with('masterProductVariant.masterProduct')
        ->where('seller_id', $sellerId)
        ->where('id', '!=', $sp1->id)
        ->first();

    if ($sp2) {
        $mv2 = $sp2->masterProductVariant;
        $unitPrice2 = (float) ($sp2->discounted_price && (float) $sp2->discounted_price > 0 ? $sp2->discounted_price : $sp2->selling_price);

        // Reset Row 1 to 10% discount on Outer
        SchemeProduct::where('scheme_id', $scheme->id)->where('seller_product_id', $sp1->id)->update([
            'discount_type'  => 'percentage',
            'discount_value' => 10,
            'free_qty'       => null,
        ]);

        // Add Row 2: Flat ₹30 discount on Product 2 when buying min 10 inner units
        SchemeProduct::create([
            'scheme_id'         => $scheme->id,
            'seller_product_id' => $sp2->id,
            'qty_basis'         => 'inner',
            'min_qty'           => 10,
            'max_qty'           => 50,
            'discount_type'     => 'flat',
            'discount_value'    => 30,
        ]);

        $cartItem2 = new Cart();
        $cartItem2->user_id = $customer->id;
        $cartItem2->product_id = $mv2->master_product_id;
        $cartItem2->product_variant_id = 0;
        $cartItem2->master_product_variant_id = $mv2->id;
        $cartItem2->seller_id = $sellerId;
        $cartItem2->seller_product_id = $sp2->id;
        $cartItem2->qty = 10;
        $cartItem2->save_for_later = 0;
        $cartItem2->save();

        $cartResponse4 = $cartController->getCart(new Request())->getData(true);
        $sellerGroup4 = collect($cartResponse4['data']['groups'])->firstWhere('seller_id', $sellerId);

        $expectedTotalDisc = round($expectedDiscount + 30.00, 2);
        assertE2E(abs((float)$sellerGroup4['scheme_discount'] - $expectedTotalDisc) < 0.05, "Multi-product cart correctly combines Row 1 (% off) + Row 2 (Flat ₹30 off) = ₹$expectedTotalDisc (Got: ₹{$sellerGroup4['scheme_discount']})");
    }

} finally {
    DB::rollBack();
    echo "\n(Transaction rolled back cleanly: no test carts or dummy schemes left in database)\n";
}

echo "\n============================================\n";
echo "E2E CART API TEST RESULTS: $passCount PASSED, $failCount FAILED\n";
echo "============================================\n";

if ($failCount > 0) {
    exit(1);
}
