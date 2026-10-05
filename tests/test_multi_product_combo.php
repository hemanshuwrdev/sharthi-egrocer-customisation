<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Scheme;
use App\Models\SchemeProduct;
use App\Models\SellerProduct;
use App\Services\SchemeEngine;
use Illuminate\Support\Facades\DB;

echo "=== EXTENSIVE MULTI-PRODUCT COMBO COMBINATIONS TEST ===\n\n";

$sp1 = SellerProduct::with('masterProductVariant')->whereHas('masterProductVariant', function ($q) {
    $q->where('secondary_unit_value', '>', 1);
})->first();

if (!$sp1) {
    echo "No sp1 found\n";
    exit(1);
}
$sellerId = $sp1->seller_id;

$otherProducts = SellerProduct::with('masterProductVariant')
    ->where('seller_id', $sellerId)
    ->where('id', '!=', $sp1->id)
    ->limit(3)
    ->get();

$sp2 = $otherProducts->get(0);
$sp3 = $otherProducts->get(1);
$unrelatedSp = $otherProducts->get(2);

$sec1 = (float)($sp1->masterProductVariant->secondary_unit_value ?? 1.0) ?: 1.0;
$sec2 = (float)($sp2->masterProductVariant->secondary_unit_value ?? 1.0) ?: 1.0;
$sec3 = (float)($sp3->masterProductVariant->secondary_unit_value ?? 1.0) ?: 1.0;

$p1Price = (float)($sp1->discounted_price ?: $sp1->selling_price);
$p2Price = (float)($sp2->discounted_price ?: $sp2->selling_price);
$p3Price = (float)($sp3->discounted_price ?: $sp3->selling_price);

echo "Seller ID: {$sellerId}\n";
echo "P1 (ID {$sp1->id}): Rs. {$p1Price}, 1 Outer = {$sec1}\n";
echo "P2 (ID {$sp2->id}): Rs. {$p2Price}, 1 Outer = {$sec2}\n";
echo "P3 (ID {$sp3->id}): Rs. {$p3Price}, 1 Outer = {$sec3}\n";
if ($unrelatedSp) {
    echo "Unrelated Product (ID {$unrelatedSp->id})\n";
}
echo "\n";

DB::beginTransaction();
try {
    $sp1->update(['stock' => 1000]);
    $sp2->update(['stock' => 1000]);
    if ($sp3) $sp3->update(['stock' => 1000]);
    if ($unrelatedSp) $unrelatedSp->update(['stock' => 1000]);

    // =========================================================================
    // SCENARIO 1: 3-Product Combo with Percentage Discount (Min: 5 Outer, 10% off)
    // =========================================================================
    echo "--- Scenario 1: 3 Products in Scheme (P1 + P2 + P3), Min 5 Outer, 10% Off ---\n";
    $scheme3 = Scheme::create([
        'seller_id'   => $sellerId,
        'name'        => '3-Product Combo 5 Outer 10% Off',
        'type'        => 'group_discount',
        'tax_option'  => 'inclusive',
        'start_date'  => date('Y-m-d', strtotime('-1 day')),
        'end_date'    => date('Y-m-d', strtotime('+30 days')),
        'status'      => 1
    ]);
    foreach ([$sp1, $sp2, $sp3] as $prod) {
        SchemeProduct::create([
            'scheme_id'         => $scheme3->id,
            'seller_product_id' => $prod->id,
            'qty_basis'         => 'outer',
            'min_qty'           => 5,
            'discount_type'     => 'percentage',
            'discount_value'    => 10,
        ]);
    }

    // 1A. Mix: 2 P1 + 2 P2 + 1 P3 = 5 outer -> QUALIFIES
    $cart1A = [
        ['seller_product_id' => $sp1->id, 'qty' => 2 * $sec1, 'line_total' => 2 * $sec1 * $p1Price],
        ['seller_product_id' => $sp2->id, 'qty' => 2 * $sec2, 'line_total' => 2 * $sec2 * $p2Price],
        ['seller_product_id' => $sp3->id, 'qty' => 1 * $sec3, 'line_total' => 1 * $sec3 * $p3Price],
    ];
    $res1A = SchemeEngine::evaluate($sellerId, $cart1A);
    $expTotal1A = (2 * $sec1 * $p1Price) + (2 * $sec2 * $p2Price) + (1 * $sec3 * $p3Price);
    $expDisc1A = round($expTotal1A * 0.10, 2);
    assert($res1A && $res1A['scheme_id'] === $scheme3->id && abs($res1A['scheme_discount'] - $expDisc1A) < 0.05);
    echo "  [PASS] Mix 2 P1 + 2 P2 + 1 P3 = 5 outer: QUALIFIES! Disc: Rs. {$res1A['scheme_discount']}\n";

    // 1B. Mix: 4 P1 + 0 P2 + 1 P3 = 5 outer -> QUALIFIES
    $cart1B = [
        ['seller_product_id' => $sp1->id, 'qty' => 4 * $sec1, 'line_total' => 4 * $sec1 * $p1Price],
        ['seller_product_id' => $sp3->id, 'qty' => 1 * $sec3, 'line_total' => 1 * $sec3 * $p3Price],
    ];
    $res1B = SchemeEngine::evaluate($sellerId, $cart1B);
    assert($res1B && $res1B['scheme_id'] === $scheme3->id);
    echo "  [PASS] Mix 4 P1 + 0 P2 + 1 P3 = 5 outer: QUALIFIES!\n";

    // 1C. Mix: 0 P1 + 5 P2 + 0 P3 = 5 outer (any single product in group reaches 5) -> QUALIFIES
    $cart1C = [
        ['seller_product_id' => $sp2->id, 'qty' => 5 * $sec2, 'line_total' => 5 * $sec2 * $p2Price],
    ];
    $res1C = SchemeEngine::evaluate($sellerId, $cart1C);
    assert($res1C && $res1C['scheme_id'] === $scheme3->id);
    echo "  [PASS] Mix 0 P1 + 5 P2 + 0 P3 = 5 outer: QUALIFIES!\n";

    // 1D. Mix: 1 P1 + 2 P2 + 1 P3 = 4 outer -> FAILS (below 5)
    $cart1D = [
        ['seller_product_id' => $sp1->id, 'qty' => 1 * $sec1, 'line_total' => 1 * $sec1 * $p1Price],
        ['seller_product_id' => $sp2->id, 'qty' => 2 * $sec2, 'line_total' => 2 * $sec2 * $p2Price],
        ['seller_product_id' => $sp3->id, 'qty' => 1 * $sec3, 'line_total' => 1 * $sec3 * $p3Price],
    ];
    $res1D = SchemeEngine::evaluate($sellerId, $cart1D);
    assert($res1D === null);
    echo "  [PASS] Mix 1 P1 + 2 P2 + 1 P3 = 4 outer: FAILS (correctly under threshold)\n";

    // 1E. Nearest unapplied check
    $near1 = SchemeEngine::nearestUnapplied($sellerId, $cart1D, null);
    assert($near1 && $near1['id'] === $scheme3->id && $near1['qty_needed'] == 1);
    echo "  [PASS] Nearest unapplied correctly suggests 1 more outer needed\n\n";

    $scheme3->delete();

    // =========================================================================
    // SCENARIO 2: Max Quantity Capping on Combo Scheme
    // Min 5 Outer, Max 8 Outer, 10% Off
    // Customer buys 6 P1 + 4 P2 = 10 Outer. Discount must cap at 8 Outer value!
    // =========================================================================
    echo "--- Scenario 2: Max Quantity Capping (Min 5, Max 8 Outer, 10% Off) ---\n";
    $schemeCap = Scheme::create([
        'seller_id'   => $sellerId,
        'name'        => 'Cap Test Min 5 Max 8',
        'type'        => 'group_discount',
        'tax_option'  => 'inclusive',
        'start_date'  => date('Y-m-d', strtotime('-1 day')),
        'end_date'    => date('Y-m-d', strtotime('+30 days')),
        'status'      => 1
    ]);
    foreach ([$sp1, $sp2] as $prod) {
        SchemeProduct::create([
            'scheme_id'         => $schemeCap->id,
            'seller_product_id' => $prod->id,
            'qty_basis'         => 'outer',
            'min_qty'           => 5,
            'max_qty'           => 8,
            'discount_type'     => 'percentage',
            'discount_value'    => 10,
        ]);
    }

    $cartCap = [
        ['seller_product_id' => $sp1->id, 'qty' => 6 * $sec1, 'line_total' => 6 * $sec1 * $p1Price],
        ['seller_product_id' => $sp2->id, 'qty' => 4 * $sec2, 'line_total' => 4 * $sec2 * $p2Price],
    ];
    $resCap = SchemeEngine::evaluate($sellerId, $cartCap);
    $totalSpend = (6 * $sec1 * $p1Price) + (4 * $sec2 * $p2Price);
    // Ratio is 8 / 10 = 0.8
    $expectedCappedDisc = round($totalSpend * 0.8 * 0.10, 2);
    assert($resCap && abs($resCap['scheme_discount'] - $expectedCappedDisc) < 0.05);
    echo "  [PASS] 10 outer purchased (exceeds max 8): Discount capped to 8 outer = Rs. {$resCap['scheme_discount']} (Expected: Rs. {$expectedCappedDisc})\n\n";

    $schemeCap->delete();

    // =========================================================================
    // SCENARIO 3: Flat Discount on Combo Scheme
    // Min 5 Outer, Flat Rs. 150 Off
    // =========================================================================
    echo "--- Scenario 3: Flat Discount on Multi-Product Combo (Min 5 Outer, Rs. 150 Flat Off) ---\n";
    $schemeFlat = Scheme::create([
        'seller_id'   => $sellerId,
        'name'        => 'Flat 150 Off on 5 Outer',
        'type'        => 'group_discount',
        'tax_option'  => 'inclusive',
        'start_date'  => date('Y-m-d', strtotime('-1 day')),
        'end_date'    => date('Y-m-d', strtotime('+30 days')),
        'status'      => 1
    ]);
    foreach ([$sp1, $sp2] as $prod) {
        SchemeProduct::create([
            'scheme_id'         => $schemeFlat->id,
            'seller_product_id' => $prod->id,
            'qty_basis'         => 'outer',
            'min_qty'           => 5,
            'discount_type'     => 'flat',
            'discount_value'    => 150,
        ]);
    }

    // 3A. 3 P1 + 2 P2 = 5 outer -> gives 150 flat discount
    $cartFlatPass = [
        ['seller_product_id' => $sp1->id, 'qty' => 3 * $sec1, 'line_total' => 3 * $sec1 * $p1Price],
        ['seller_product_id' => $sp2->id, 'qty' => 2 * $sec2, 'line_total' => 2 * $sec2 * $p2Price],
    ];
    $resFlatPass = SchemeEngine::evaluate($sellerId, $cartFlatPass);
    assert($resFlatPass && abs($resFlatPass['scheme_discount'] - 150.00) < 0.05);
    echo "  [PASS] 3 P1 + 2 P2 = 5 outer: Received Rs. 150 Flat Discount\n";

    // 3B. 2 P1 + 2 P2 = 4 outer -> fails
    $cartFlatFail = [
        ['seller_product_id' => $sp1->id, 'qty' => 2 * $sec1, 'line_total' => 2 * $sec1 * $p1Price],
        ['seller_product_id' => $sp2->id, 'qty' => 2 * $sec2, 'line_total' => 2 * $sec2 * $p2Price],
    ];
    $resFlatFail = SchemeEngine::evaluate($sellerId, $cartFlatFail);
    assert($resFlatFail === null);
    echo "  [PASS] 2 P1 + 2 P2 = 4 outer: FAILS (under 5)\n\n";

    $schemeFlat->delete();

    // =========================================================================
    // SCENARIO 4: Free Product on Multi-Product Combo
    // Min 5 Outer, Free 1 Outer of P1
    // =========================================================================
    echo "--- Scenario 4: Free Product Reward (Min 5 Outer, Free 1 Outer) ---\n";
    $schemeFree = Scheme::create([
        'seller_id'   => $sellerId,
        'name'        => 'Free Product on 5 Outer',
        'type'        => 'group_discount',
        'tax_option'  => 'inclusive',
        'start_date'  => date('Y-m-d', strtotime('-1 day')),
        'end_date'    => date('Y-m-d', strtotime('+30 days')),
        'status'      => 1
    ]);
    foreach ([$sp1, $sp2] as $prod) {
        SchemeProduct::create([
            'scheme_id'         => $schemeFree->id,
            'seller_product_id' => $prod->id,
            'qty_basis'         => 'outer',
            'min_qty'           => 5,
            'discount_type'     => 'free_product',
            'free_qty'          => 1,
            'free_qty_basis'    => 'outer',
        ]);
    }

    $cartFree = [
        ['seller_product_id' => $sp1->id, 'qty' => 1 * $sec1, 'line_total' => 1 * $sec1 * $p1Price],
        ['seller_product_id' => $sp2->id, 'qty' => 4 * $sec2, 'line_total' => 4 * $sec2 * $p2Price],
    ];
    $resFree = SchemeEngine::evaluate($sellerId, $cartFree);
    assert($resFree && !empty($resFree['free_items']));
    $freeItem = $resFree['free_items'][0];
    assert($freeItem['qty'] == (int)$sec1); // 1 outer in base units
    echo "  [PASS] 1 P1 + 4 P2 = 5 outer: Awarded 1 Outer Free Product ({$freeItem['qty']} base units of {$freeItem['product_name']})\n\n";

    $schemeFree->delete();

    // =========================================================================
    // SCENARIO 5: Inner Quantity Basis Combo Scheme
    // Basis: Inner, Min 50 Inner Units, 15% Off
    // =========================================================================
    echo "--- Scenario 5: Inner Qty Basis Combo (Min 50 Inner, 15% Off) ---\n";
    $schemeInner = Scheme::create([
        'seller_id'   => $sellerId,
        'name'        => 'Inner Qty Combo Min 50',
        'type'        => 'group_discount',
        'tax_option'  => 'inclusive',
        'start_date'  => date('Y-m-d', strtotime('-1 day')),
        'end_date'    => date('Y-m-d', strtotime('+30 days')),
        'status'      => 1
    ]);
    foreach ([$sp1, $sp2] as $prod) {
        SchemeProduct::create([
            'scheme_id'         => $schemeInner->id,
            'seller_product_id' => $prod->id,
            'qty_basis'         => 'inner',
            'min_qty'           => 50,
            'discount_type'     => 'percentage',
            'discount_value'    => 15,
        ]);
    }

    // 5A. 30 inner P1 + 20 inner P2 = 50 inner -> QUALIFIES
    $cartInnerPass = [
        ['seller_product_id' => $sp1->id, 'qty' => 30, 'line_total' => 30 * $p1Price],
        ['seller_product_id' => $sp2->id, 'qty' => 20, 'line_total' => 20 * $p2Price],
    ];
    $resInnerPass = SchemeEngine::evaluate($sellerId, $cartInnerPass);
    $expInnerDisc = round(((30 * $p1Price) + (20 * $p2Price)) * 0.15, 2);
    assert($resInnerPass && abs($resInnerPass['scheme_discount'] - $expInnerDisc) < 0.05);
    echo "  [PASS] 30 inner P1 + 20 inner P2 = 50 inner: QUALIFIES! Disc: Rs. {$resInnerPass['scheme_discount']}\n";

    // 5B. 20 inner P1 + 15 inner P2 = 35 inner -> FAILS
    $cartInnerFail = [
        ['seller_product_id' => $sp1->id, 'qty' => 20, 'line_total' => 20 * $p1Price],
        ['seller_product_id' => $sp2->id, 'qty' => 15, 'line_total' => 15 * $p2Price],
    ];
    $resInnerFail = SchemeEngine::evaluate($sellerId, $cartInnerFail);
    assert($resInnerFail === null);
    echo "  [PASS] 20 inner P1 + 15 inner P2 = 35 inner: FAILS (under 50)\n\n";

    $schemeInner->delete();

    // =========================================================================
    // SCENARIO 6: Non-Scheme Product Mixed in Cart
    // Scheme has P1 & P2. Cart has P1 + P2 + Unrelated Product
    // Unrelated product must NOT contribute to min qty, and must NOT receive discount
    // =========================================================================
    if ($unrelatedSp) {
        echo "--- Scenario 6: Non-Scheme Products in Cart ---\n";
        $schemeNonScheme = Scheme::create([
            'seller_id'   => $sellerId,
            'name'        => 'P1 & P2 only 5 Outer',
            'type'        => 'group_discount',
            'tax_option'  => 'inclusive',
            'start_date'  => date('Y-m-d', strtotime('-1 day')),
            'end_date'    => date('Y-m-d', strtotime('+30 days')),
            'status'      => 1
        ]);
        foreach ([$sp1, $sp2] as $prod) {
            SchemeProduct::create([
                'scheme_id'         => $schemeNonScheme->id,
                'seller_product_id' => $prod->id,
                'qty_basis'         => 'outer',
                'min_qty'           => 5,
                'discount_type'     => 'percentage',
                'discount_value'    => 10,
            ]);
        }

        // 6A. 3 outer P1 + 1 outer P2 (= 4 outer) + 10 units unrelated product -> FAILS because only 4 outer of scheme products
        $cartMixedFail = [
            ['seller_product_id' => $sp1->id, 'qty' => 3 * $sec1, 'line_total' => 3 * $sec1 * $p1Price],
            ['seller_product_id' => $sp2->id, 'qty' => 1 * $sec2, 'line_total' => 1 * $sec2 * $p2Price],
            ['seller_product_id' => $unrelatedSp->id, 'qty' => 10, 'line_total' => 1000.00],
        ];
        $resMixedFail = SchemeEngine::evaluate($sellerId, $cartMixedFail);
        assert($resMixedFail === null);
        echo "  [PASS] 3 outer P1 + 1 outer P2 + non-scheme product: FAILS (unrelated product does not count toward 5 outer)\n";

        // 6B. 3 outer P1 + 2 outer P2 (= 5 outer) + 10 units unrelated product -> QUALIFIES, discount only on P1 & P2
        $cartMixedPass = [
            ['seller_product_id' => $sp1->id, 'qty' => 3 * $sec1, 'line_total' => 3 * $sec1 * $p1Price],
            ['seller_product_id' => $sp2->id, 'qty' => 2 * $sec2, 'line_total' => 2 * $sec2 * $p2Price],
            ['seller_product_id' => $unrelatedSp->id, 'qty' => 10, 'line_total' => 1000.00],
        ];
        $resMixedPass = SchemeEngine::evaluate($sellerId, $cartMixedPass);
        $expectedGroupDisc = round(((3 * $sec1 * $p1Price) + (2 * $sec2 * $p2Price)) * 0.10, 2);
        assert($resMixedPass && abs($resMixedPass['scheme_discount'] - $expectedGroupDisc) < 0.05);
        echo "  [PASS] 3 outer P1 + 2 outer P2 + non-scheme product: QUALIFIES! Disc: Rs. {$resMixedPass['scheme_discount']} applied ONLY to P1 & P2 (not unrelated item)\n\n";

        $schemeNonScheme->delete();
    }

    echo "=======================================================\n";
    echo "ALL SCENARIOS & COMBINATIONS VERIFIED AND PASSED 100%!\n";
    echo "=======================================================\n";
} finally {
    DB::rollBack();
}
