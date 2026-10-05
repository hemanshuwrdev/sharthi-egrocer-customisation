<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Scheme;
use App\Models\SchemeProduct;
use App\Models\SchemeSlab;
use App\Models\SellerProduct;
use App\Services\SchemeEngine;
use Illuminate\Support\Facades\DB;

echo "=== STARTING COMPREHENSIVE SCHEME ENGINE & CART TESTS ===\n\n";

$passCount = 0;
$failCount = 0;

function assertTest($condition, $message) {
    global $passCount, $failCount;
    if ($condition) {
        echo "  [PASS] $message\n";
        $passCount++;
    } else {
        echo "  [FAIL] $message\n";
        $failCount++;
    }
}

// 1. Pick a seller and products with known secondary_unit_value
$sp1 = SellerProduct::with('masterProductVariant')->whereHas('masterProductVariant', function ($q) {
    $q->where('secondary_unit_value', '>', 1);
})->first();

if (!$sp1) {
    echo "No seller product with secondary_unit_value > 1 found. Exiting.\n";
    exit(1);
}

$sellerId = $sp1->seller_id;
$secVal1 = (float) $sp1->masterProductVariant->secondary_unit_value; // e.g. 10
$unitPrice1 = (float) ($sp1->discounted_price && (float) $sp1->discounted_price > 0 ? $sp1->discounted_price : $sp1->selling_price);

// Pick a second product for multi-product tests
$sp2 = SellerProduct::with('masterProductVariant')
    ->where('seller_id', $sellerId)
    ->where('id', '!=', $sp1->id)
    ->first();

if (!$sp2) {
    // If not on same seller, create a temporary seller product or pick another
    $sp2 = SellerProduct::with('masterProductVariant')->where('id', '!=', $sp1->id)->first();
}
$secVal2 = ($sp2 && $sp2->masterProductVariant && (float) $sp2->masterProductVariant->secondary_unit_value > 0)
    ? (float) $sp2->masterProductVariant->secondary_unit_value
    : 1.0;
$unitPrice2 = (float) ($sp2->discounted_price && (float) $sp2->discounted_price > 0 ? $sp2->discounted_price : $sp2->selling_price);

echo "Testing with Seller ID: $sellerId\n";
echo "Product 1: ID {$sp1->id}, Price: ₹$unitPrice1, Secondary Unit Value (1 Outer): $secVal1 units\n";
echo "Product 2: ID {$sp2->id}, Price: ₹$unitPrice2, Secondary Unit Value (1 Outer): $secVal2 units\n\n";

DB::beginTransaction();
try {
    $sp1->update(['stock' => 1000]);
    $sp2->update(['stock' => 1000]);

    // -------------------------------------------------------------
    // TEST SUITE 1: Create Scheme with Multi-Product & Outer/Inner Conditions
    // -------------------------------------------------------------
    echo "--- Test Suite 1: Scheme Creation & Row Persistence ---\n";

    $scheme = Scheme::create([
        'seller_id'   => $sellerId,
        'name'        => 'Unit Test Scheme - Multi Product',
        'type'        => 'group_discount',
        'description' => 'Test offer for unit testing',
        'tax_option'  => 'inclusive',
        'start_date'  => date('Y-m-d', strtotime('-1 day')),
        'end_date'    => date('Y-m-d', strtotime('+30 days')),
        'status'      => 1,
    ]);

    $row1 = SchemeProduct::create([
        'scheme_id'         => $scheme->id,
        'seller_product_id' => $sp1->id,
        'qty_basis'         => 'outer',
        'min_qty'           => 5,
        'max_qty'           => 50,
        'discount_type'     => 'percentage',
        'discount_value'    => 10,
    ]);

    assertTest($scheme->exists, "Scheme created successfully with ID: {$scheme->id}");
    assertTest($row1->qty_basis === 'outer', "SchemeProduct row persisted with qty_basis = 'outer'");
    assertTest((int)$row1->min_qty === 5, "SchemeProduct row persisted with min_qty = 5");
    assertTest((int)$row1->discount_value === 10, "SchemeProduct row persisted with discount_value = 10%");

    // -------------------------------------------------------------
    // TEST SUITE 2: Outer Qty Condition - Qualifying Cart
    // -------------------------------------------------------------
    echo "\n--- Test Suite 2: Outer Qty Condition - Qualifying Cart ---\n";

    $qualifyingUnits = 5 * $secVal1; // 5 Outer
    $lineTotal = round($qualifyingUnits * $unitPrice1, 2);
    $cartLines = [
        [
            'seller_product_id' => $sp1->id,
            'qty'               => $qualifyingUnits,
            'line_total'        => $lineTotal,
            'actual_line_total' => $lineTotal,
        ]
    ];

    $result = SchemeEngine::evaluate($sellerId, $cartLines);
    assertTest($result !== null, "Scheme evaluated and matched for 5 Outer units ($qualifyingUnits base units)");
    assertTest($result['scheme_id'] === $scheme->id, "Correct scheme ID applied");

    $expectedDiscount = round($lineTotal * 0.10, 2);
    assertTest(abs($result['scheme_discount'] - $expectedDiscount) < 0.05, "Discount correctly computed as 10% of ₹$lineTotal = ₹$expectedDiscount (Got: ₹{$result['scheme_discount']})");

    // -------------------------------------------------------------
    // TEST SUITE 3: Outer Qty Condition - Non-Qualifying Cart
    // -------------------------------------------------------------
    echo "\n--- Test Suite 3: Outer Qty Condition - Non-Qualifying Cart ---\n";

    $nonQualifyingUnits = (5 * $secVal1) - 1; // 1 unit short of 5 Outers
    $nonQualifyingCartLines = [
        [
            'seller_product_id' => $sp1->id,
            'qty'               => $nonQualifyingUnits,
            'line_total'        => round($nonQualifyingUnits * $unitPrice1, 2),
            'actual_line_total' => round($nonQualifyingUnits * $unitPrice1, 2),
        ]
    ];

    $nonResult = SchemeEngine::evaluate($sellerId, $nonQualifyingCartLines);
    assertTest($nonResult === null, "Scheme correctly does NOT trigger for $nonQualifyingUnits base units (4 Outer < 5 Outer min threshold)");

    // -------------------------------------------------------------
    // TEST SUITE 4: Fractional Outer Packs
    // e.g. 1 Outer = 10 units. 29 units = 2 Outer + 9 loose units -> < 3 Outer
    // 30 units = 3 Outer -> >= 3 Outer
    // -------------------------------------------------------------
    echo "\n--- Test Suite 4: Fractional Outer Packs ---\n";

    $row1->update(['min_qty' => 3, 'max_qty' => 10, 'discount_value' => 10]);

    // 29 base units = 2 outer packs + 9 loose units
    $twentyNineUnits = (3 * $secVal1) - 1;
    $fractionalCart = [
        [
            'seller_product_id' => $sp1->id,
            'qty'               => $twentyNineUnits,
            'line_total'        => round($twentyNineUnits * $unitPrice1, 2),
            'actual_line_total' => round($twentyNineUnits * $unitPrice1, 2),
        ]
    ];
    $fracResult = SchemeEngine::evaluate($sellerId, $fractionalCart);
    assertTest($fracResult === null, "Fractional outer packs: $twentyNineUnits units (floor: 2 outer) correctly fails min 3 outer threshold");

    // Exactly 30 base units = 3 outer packs
    $thirtyUnits = 3 * $secVal1;
    $thirtyCart = [
        [
            'seller_product_id' => $sp1->id,
            'qty'               => $thirtyUnits,
            'line_total'        => round($thirtyUnits * $unitPrice1, 2),
            'actual_line_total' => round($thirtyUnits * $unitPrice1, 2),
        ]
    ];
    $thirtyResult = SchemeEngine::evaluate($sellerId, $thirtyCart);
    assertTest($thirtyResult !== null, "Full outer packs: $thirtyUnits units (3 outer) triggers min 3 outer threshold");

    // -------------------------------------------------------------
    // TEST SUITE 5: Max Qty Capping
    // Min 2 Outer, Max 5 Outer @ 10% discount. Cart has 8 Outer.
    // Discount must be capped to 5 Outer worth of product!
    // -------------------------------------------------------------
    echo "\n--- Test Suite 5: Max Qty Capping ---\n";

    $row1->update([
        'qty_basis'      => 'outer',
        'min_qty'        => 2,
        'max_qty'        => 5,
        'discount_type'  => 'percentage',
        'discount_value' => 10,
    ]);

    $eightOuterUnits = 8 * $secVal1;
    $eightOuterTotal = round($eightOuterUnits * $unitPrice1, 2);
    $eightOuterCart = [
        [
            'seller_product_id' => $sp1->id,
            'qty'               => $eightOuterUnits,
            'line_total'        => $eightOuterTotal,
            'actual_line_total' => $eightOuterTotal,
        ]
    ];

    $cappedResult = SchemeEngine::evaluate($sellerId, $eightOuterCart);
    assertTest($cappedResult !== null, "Cart with 8 Outer evaluated successfully");

    // Capped at 5 Outer:
    $fiveOuterTotal = round(5 * $secVal1 * $unitPrice1, 2);
    $expectedCappedDiscount = round($fiveOuterTotal * 0.10, 2);
    assertTest(abs($cappedResult['scheme_discount'] - $expectedCappedDiscount) < 0.05, "Discount correctly capped to 5 Outer max limit: ₹$expectedCappedDiscount (Got: ₹{$cappedResult['scheme_discount']})");

    // -------------------------------------------------------------
    // TEST SUITE 6: Nearest Unapplied Suggestion
    // -------------------------------------------------------------
    echo "\n--- Test Suite 6: Nearest Unapplied Suggestion ---\n";

    $row1->update(['min_qty' => 5, 'max_qty' => 50]);
    $partialCartUnits = 3 * $secVal1; // 3 Outer
    $partialCartLines = [
        [
            'seller_product_id' => $sp1->id,
            'qty'               => $partialCartUnits,
            'line_total'        => round($partialCartUnits * $unitPrice1, 2),
            'actual_line_total' => round($partialCartUnits * $unitPrice1, 2),
        ]
    ];

    $nearest = SchemeEngine::nearestUnapplied($sellerId, $partialCartLines);
    assertTest($nearest !== null, "Nearest unapplied scheme found");

    $qtyNeeded = $nearest['qty_needed'] ?? null;
    assertTest($qtyNeeded === 2, "Accurately calculated qty_needed = 2 Outer packs needed to reach 5 Outer (Got: " . var_export($qtyNeeded, true) . ")");

    // Verify it does NOT suggest if the scheme is already applied:
    $nearestAlreadyApplied = SchemeEngine::nearestUnapplied($sellerId, $partialCartLines, $scheme->id);
    assertTest($nearestAlreadyApplied === null, "Nearest unapplied correctly skips scheme when already applied ($scheme->id)");

    // -------------------------------------------------------------
    // TEST SUITE 7: Free Product Option - Inner vs Outer
    // -------------------------------------------------------------
    echo "\n--- Test Suite 7: Free Product Option (Inner vs Outer) ---\n";

    // 7a. Free Inner: Buy 1 Outer, Get 2 Inner Free
    $row1->update([
        'qty_basis'      => 'outer',
        'min_qty'        => 1,
        'discount_type'  => 'free_product',
        'free_qty'       => 2,
        'free_qty_basis' => 'inner',
    ]);

    $oneOuterCart = [
        [
            'seller_product_id' => $sp1->id,
            'qty'               => $secVal1,
            'line_total'        => round($secVal1 * $unitPrice1, 2),
            'actual_line_total' => round($secVal1 * $unitPrice1, 2),
        ]
    ];

    $freeInnerResult = SchemeEngine::evaluate($sellerId, $oneOuterCart);
    assertTest($freeInnerResult !== null, "Free product (inner) evaluated");
    assertTest(!empty($freeInnerResult['free_items']), "Free items returned in result");
    assertTest(($freeInnerResult['free_items'][0]['qty'] ?? null) === 2, "Granted exactly 2 inner free units (Got: " . ($freeInnerResult['free_items'][0]['qty'] ?? 0) . ")");

    // 7b. Free Outer: Buy 1 Outer, Get 1 Outer Free (= $secVal1 base units)
    $row1->update([
        'free_qty'       => 1,
        'free_qty_basis' => 'outer',
    ]);

    $freeOuterResult = SchemeEngine::evaluate($sellerId, $oneOuterCart);
    assertTest($freeOuterResult !== null, "Free product (outer) evaluated");
    $expectedOuterFreeUnits = (int) $secVal1;
    assertTest(($freeOuterResult['free_items'][0]['qty'] ?? null) === $expectedOuterFreeUnits, "Granted exactly 1 Outer = $expectedOuterFreeUnits base free units (Got: " . ($freeOuterResult['free_items'][0]['qty'] ?? 0) . ")");

    // -------------------------------------------------------------
    // TEST SUITE 8: Discounted Product Option (e.g. 1 Outer @ 50% discount)
    // -------------------------------------------------------------
    echo "\n--- Test Suite 8: Discounted Product Option ---\n";

    $row1->update([
        'qty_basis'      => 'outer',
        'min_qty'        => 2,
        'discount_type'  => 'discounted_product',
        'free_qty'       => 1,
        'free_qty_basis' => 'outer',
        'discount_value' => 50, // 50% off
    ]);

    $twoOuterCart = [
        [
            'seller_product_id' => $sp1->id,
            'qty'               => 2 * $secVal1,
            'line_total'        => round(2 * $secVal1 * $unitPrice1, 2),
            'actual_line_total' => round(2 * $secVal1 * $unitPrice1, 2),
        ]
    ];

    $discProdResult = SchemeEngine::evaluate($sellerId, $twoOuterCart);
    assertTest($discProdResult !== null, "Discounted product scheme evaluated");
    
    // 1 Outer = $secVal1 units * $unitPrice1. 50% discount on 1 outer:
    $expectedDiscAmount = round(1 * $secVal1 * $unitPrice1 * 0.50, 2);
    assertTest(abs($discProdResult['scheme_discount'] - $expectedDiscAmount) < 0.05, "Discount correctly computed as 50% of 1 Outer: ₹$expectedDiscAmount (Got: ₹{$discProdResult['scheme_discount']})");

    // -------------------------------------------------------------
    // TEST SUITE 9: Tax Option: Inclusive vs Exclusive
    // -------------------------------------------------------------
    echo "\n--- Test Suite 9: Tax Option (Inclusive vs Exclusive) ---\n";

    // Setup: 10% discount on Product 1.
    // Line total with tax = 1180, actual pre-tax line total = 1000 (18% GST)
    $row1->update([
        'qty_basis'      => 'inner',
        'min_qty'        => 10,
        'max_qty'        => null,
        'discount_type'  => 'percentage',
        'discount_value' => 10,
    ]);

    $taxTestCart = [
        [
            'seller_product_id' => $sp1->id,
            'qty'               => 10,
            'line_total'        => 1180.00,
            'actual_line_total' => 1000.00,
        ]
    ];

    // 9a. Tax Option Inclusive (pre-tax base): 10% of 1000 = ₹100
    $scheme->update(['tax_option' => 'inclusive']);
    $inclusiveResult = SchemeEngine::evaluate($sellerId, $taxTestCart);
    assertTest(abs($inclusiveResult['scheme_discount'] - 100.00) < 0.05, "Tax option 'inclusive': 10% applied to pre-tax amount ₹1000 = ₹100 (Got: ₹{$inclusiveResult['scheme_discount']})");

    // 9b. Tax Option Exclusive (post-tax base): 10% of 1180 = ₹118
    $scheme->update(['tax_option' => 'exclusive']);
    $exclusiveResult = SchemeEngine::evaluate($sellerId, $taxTestCart);
    assertTest(abs($exclusiveResult['scheme_discount'] - 118.00) < 0.05, "Tax option 'exclusive': 10% applied to total inclusive amount ₹1180 = ₹118 (Got: ₹{$exclusiveResult['scheme_discount']})");

    $scheme->update(['tax_option' => 'inclusive']); // reset

    // -------------------------------------------------------------
    // TEST SUITE 10: Multi-Product Combined Combo Scheme
    // Global Scheme: Outer, Min 5, Max 50, 10% Discount
    // Products: P1 and P2 can be purchased in any combination (e.g., 3 P1 + 2 P2 = 5)
    // -------------------------------------------------------------
    echo "\n--- Test Suite 10: Multi-Product Combined Combo Scheme ---\n";

    $row1->update([
        'qty_basis'      => 'outer',
        'min_qty'        => 5,
        'max_qty'        => 50,
        'discount_type'  => 'percentage',
        'discount_value' => 10,
    ]);

    $row2 = SchemeProduct::create([
        'scheme_id'         => $scheme->id,
        'seller_product_id' => $sp2->id,
        'qty_basis'         => 'outer',
        'min_qty'           => 5,
        'max_qty'           => 50,
        'discount_type'     => 'percentage',
        'discount_value'    => 10,
    ]);

    // 10a. Cart with only 3 outer P1 + 1 outer P2 = 4 outer (below min 5)
    $failComboCart = [
        [
            'seller_product_id' => $sp1->id,
            'qty'               => 3 * $secVal1,
            'line_total'        => round(3 * $secVal1 * $unitPrice1, 2),
            'actual_line_total' => round(3 * $secVal1 * $unitPrice1, 2),
        ],
        [
            'seller_product_id' => $sp2->id,
            'qty'               => 1 * $secVal2,
            'line_total'        => round(1 * $secVal2 * $unitPrice2, 2),
            'actual_line_total' => round(1 * $secVal2 * $unitPrice2, 2),
        ]
    ];
    $failComboResult = SchemeEngine::evaluate($sellerId, $failComboCart);
    assertTest($failComboResult === null, "Cart with 4 outer total (< min 5) does not qualify");

    // 10b. Cart with 4 outer P1 + 1 outer P2 = 5 outer (meets min 5)
    $qualifyingComboCart = [
        [
            'seller_product_id' => $sp1->id,
            'qty'               => 4 * $secVal1,
            'line_total'        => round(4 * $secVal1 * $unitPrice1, 2),
            'actual_line_total' => round(4 * $secVal1 * $unitPrice1, 2),
        ],
        [
            'seller_product_id' => $sp2->id,
            'qty'               => 1 * $secVal2,
            'line_total'        => round(1 * $secVal2 * $unitPrice2, 2),
            'actual_line_total' => round(1 * $secVal2 * $unitPrice2, 2),
        ]
    ];
    $qualComboResult = SchemeEngine::evaluate($sellerId, $qualifyingComboCart);
    $expectedComboEligibleTotal = round((4 * $secVal1 * $unitPrice1) + (1 * $secVal2 * $unitPrice2), 2);
    $expectedComboDisc = round($expectedComboEligibleTotal * 0.10, 2);
    assertTest($qualComboResult !== null, "Cart with 4 outer P1 + 1 outer P2 (= 5 outer) qualifies for multi-product combo");
    assertTest(abs($qualComboResult['scheme_discount'] - $expectedComboDisc) < 0.05, "Combo 10% discount applied across both lines: ₹$expectedComboDisc (Got: ₹{$qualComboResult['scheme_discount']})");

    // 10c. Cart with 3 outer P1 + 2 outer P2 = 5 outer (different combination, meets min 5)
    $altComboCart = [
        [
            'seller_product_id' => $sp1->id,
            'qty'               => 3 * $secVal1,
            'line_total'        => round(3 * $secVal1 * $unitPrice1, 2),
            'actual_line_total' => round(3 * $secVal1 * $unitPrice1, 2),
        ],
        [
            'seller_product_id' => $sp2->id,
            'qty'               => 2 * $secVal2,
            'line_total'        => round(2 * $secVal2 * $unitPrice2, 2),
            'actual_line_total' => round(2 * $secVal2 * $unitPrice2, 2),
        ]
    ];
    $altComboResult = SchemeEngine::evaluate($sellerId, $altComboCart);
    assertTest($altComboResult !== null, "Cart with 3 outer P1 + 2 outer P2 (= 5 outer) qualifies for multi-product combo");

    // -------------------------------------------------------------
    // TEST SUITE 11: Auto-Apply Best Scheme (Competition)
    // Scheme A: Product conditions gives ₹50 benefit
    // Scheme B: Group discount price gives ₹200 benefit
    // SchemeEngine must pick Scheme B (benefit 200 > 50)
    // -------------------------------------------------------------
    echo "\n--- Test Suite 11: Best Scheme Auto-Apply Competition ---\n";

    $schemeB = Scheme::create([
        'seller_id'   => $sellerId,
        'name'        => 'Competing High Value Scheme',
        'type'        => Scheme::TYPE_GROUP_DISCOUNT_PRICE,
        'start_date'  => date('Y-m-d', strtotime('-1 day')),
        'end_date'    => date('Y-m-d', strtotime('+30 days')),
        'status'      => 1,
    ]);

    SchemeProduct::create([
        'scheme_id'         => $schemeB->id,
        'seller_product_id' => $sp2->id,
    ]);

    SchemeSlab::create([
        'scheme_id'      => $schemeB->id,
        'min_value'      => 100,
        'discount_type'  => 'flat',
        'discount_value' => 200,
        'tax_option'     => 'exclusive',
    ]);

    $competingCart = [
        [
            'seller_product_id' => $sp2->id,
            'qty'               => 10,
            'line_total'        => 500.00,
            'actual_line_total' => 500.00,
        ]
    ];

    $competingResult = SchemeEngine::evaluate($sellerId, $competingCart);
    assertTest($competingResult !== null, "Competing schemes evaluated");
    assertTest($competingResult['scheme_id'] === $schemeB->id, "SchemeEngine selected high-value Scheme B (ID: {$schemeB->id}) over Scheme A (ID: {$scheme->id})");
    assertTest(abs($competingResult['benefit'] - 200.00) < 0.05, "Selected benefit is ₹200 (Got: ₹{$competingResult['benefit']})");

    $schemeB->delete();

    // -------------------------------------------------------------
    // TEST SUITE 12: API Controller Save, Edit, and Format
    // -------------------------------------------------------------
    echo "\n--- Test Suite 12: API Controller Persistence & Edit ---\n";

    $seller = \App\Models\Seller::find($sellerId);
    $sellerAdmin = \App\Models\Admin::find($seller->admin_id);
    auth()->login($sellerAdmin);

    $apiController = new \App\Http\Controllers\API\SchemesApiController();
    $sellerReq = new \Illuminate\Http\Request(['seller_id' => $sellerId]);
    $prodResponse = $apiController->getSellerProducts($sellerReq)->getData(true);

    assertTest($prodResponse['status'] === 1, "API getSellerProducts returned status 1");
    assertTest(isset($prodResponse['data'][0]['uom']), "API getSellerProducts includes UOM");
    assertTest(isset($prodResponse['data'][0]['secondary_unit']), "API getSellerProducts includes secondary_unit");

    $saveReqData = [
        'seller_id'   => $sellerId,
        'name'        => 'API Multi-Offer Scheme',
        'type'        => 'product_conditions',
        'tax_option'  => 'inclusive',
        'start_date'  => date('Y-m-d'),
        'end_date'    => date('Y-m-d', strtotime('+30 days')),
        'status'      => 1,
        'products'    => [
            [
                'seller_product_id' => $sp1->id,
                'qty_basis'         => 'outer',
                'min_qty'           => 10,
                'max_qty'           => 50,
                'discount_type'     => 'percentage',
                'discount_value'    => 15,
            ],
            [
                'seller_product_id' => $sp2->id,
                'qty_basis'         => 'inner',
                'min_qty'           => 5,
                'max_qty'           => 20,
                'discount_type'     => 'free_product',
                'free_qty'          => 1,
                'free_qty_basis'    => 'inner',
            ],
        ]
    ];

    $saveReq = new \Illuminate\Http\Request($saveReqData);
    $saveResponse = $apiController->save($saveReq)->getData(true);
    assertTest($saveResponse['status'] === 1, "API save scheme returned status 1");

    $createdSchemeId = $saveResponse['data']['id'] ?? null;
    assertTest($createdSchemeId !== null, "Created scheme ID: $createdSchemeId");

    $editResponse = $apiController->edit($createdSchemeId)->getData(true);
    assertTest($editResponse['status'] === 1, "API edit returned status 1");
    assertTest(count($editResponse['data']['products']) === 2, "API edit returned all 2 configured products");
    assertTest($editResponse['data']['products'][0]['qty_basis'] === 'outer', "API edit returned qty_basis = 'outer'");
    assertTest((int)$editResponse['data']['products'][0]['min_qty'] === 10, "API edit returned min_qty = 10");
    assertTest((int)$editResponse['data']['products'][0]['discount_value'] === 15, "API edit returned discount_value = 15");

    $listResponse = $apiController->getSchemes($sellerReq)->getData(true);
    assertTest($listResponse['status'] === 1, "API getSchemes returned status 1");
    $foundInList = collect($listResponse['data'])->firstWhere('id', $createdSchemeId);
    assertTest($foundInList !== null, "Created scheme found in getSchemes list");
    assertTest(!empty($foundInList['products_detail']), "products_detail formatted in getSchemes");

    // -------------------------------------------------------------
    // TEST SUITE 13: Order Placement Simulation (Cart -> Order Items)
    // Verify scheme_id, scheme_discount, and free_items flow into DB
    // -------------------------------------------------------------
    echo "\n--- Test Suite 13: Order Placement Flow Simulation ---\n";

    // Setup a scheme with Free Product & Discount:
    $orderScheme = Scheme::create([
        'seller_id'   => $sellerId,
        'name'        => 'Checkout Flow Scheme',
        'type'        => 'product_conditions',
        'tax_option'  => 'inclusive',
        'start_date'  => date('Y-m-d', strtotime('-1 day')),
        'end_date'    => date('Y-m-d', strtotime('+30 days')),
        'status'      => 1,
    ]);

    SchemeProduct::create([
        'scheme_id'         => $orderScheme->id,
        'seller_product_id' => $sp1->id,
        'qty_basis'         => 'outer',
        'min_qty'           => 1,
        'discount_type'     => 'free_product',
        'free_qty'          => 2,
        'free_qty_basis'    => 'inner',
    ]);

    $checkoutCart = [
        [
            'seller_product_id' => $sp1->id,
            'qty'               => $secVal1,
            'line_total'        => round($secVal1 * $unitPrice1, 2),
            'actual_line_total' => round($secVal1 * $unitPrice1, 2),
        ]
    ];

    $checkoutEval = SchemeEngine::evaluate($sellerId, $checkoutCart);
    assertTest($checkoutEval !== null, "Checkout cart evaluated scheme successfully");
    assertTest(!empty($checkoutEval['free_items']), "Checkout evaluation returned free items");

    // Simulate RetailerCartOrderApiController place_order logic:
    $testOrderId = DB::table('orders')->insertGetId([
        'user_id'         => 1,
        'orders_id'       => 'TEST_' . uniqid(),
        'total'           => round($secVal1 * $unitPrice1, 2),
        'delivery_charge' => 0,
        'tax_amount'      => 0,
        'tax_percentage'  => 0,
        'wallet_balance'  => 0,
        'discount'        => 0,
        'promo_discount'  => 0,
        'scheme_id'       => $checkoutEval['scheme_id'],
        'scheme_discount' => $checkoutEval['scheme_discount'],
        'final_total'     => round($secVal1 * $unitPrice1, 2) - $checkoutEval['scheme_discount'],
        'mobile'          => '9999999999',
        'order_note'      => 'Test Note',
        'latitude'        => '21.1702',
        'longitude'       => '72.8311',
        'delivery_time'   => '',
        'address_id'      => 1,
        'payment_method'  => 'COD',
        'address'         => 'Test Store Address, 123 Main Road',
        'status'          => json_encode([['received', date('Y-m-d H:i:s')]]),
        'active_status'   => 'received',
        'order_type'      => 'doorstep',
        'created_at'      => now(),
        'updated_at'      => now(),
    ]);

    assertTest($testOrderId > 0, "Order placed with ID: $testOrderId");

    $savedOrder = DB::table('orders')->where('id', $testOrderId)->first();
    assertTest((int)$savedOrder->scheme_id === $checkoutEval['scheme_id'], "Order record saved correct scheme_id: {$savedOrder->scheme_id}");

    // Insert free lines as done by place_order:
    foreach ($checkoutEval['free_items'] as $free) {
        $freeItemId = DB::table('order_items')->insertGetId([
            'user_id'                   => 1,
            'order_id'                  => $testOrderId,
            'orders_id'                 => $savedOrder->orders_id,
            'product_name'              => $free['product_name'],
            'variant_name'              => $free['variant_name'],
            'product_variant_id'        => 0,
            'master_product_variant_id' => $free['master_product_variant_id'],
            'seller_product_id'         => $free['seller_product_id'],
            'quantity'                  => $free['qty'],
            'price'                     => 0,
            'discounted_price'          => 0,
            'tax_amount'                => 0,
            'tax_percentage'            => 0,
            'discount'                  => 0,
            'sub_total'                 => 0,
            'status'                    => json_encode([['received', date('Y-m-d H:i:s')]]),
            'active_status'             => 'received',
            'seller_id'                 => $sellerId,
            'scheme_id'                 => $checkoutEval['scheme_id'],
            'is_free_item'              => 1,
            'created_at'                => now(),
            'updated_at'                => now(),
        ]);
        assertTest($freeItemId > 0, "Free order item inserted with ID $freeItemId, price 0, is_free_item = 1");
    }

    $orderScheme->delete();

    // -------------------------------------------------------------
    // TEST SUITE 14: Buy X Get Y with Outer & Inner Basis
    // Buy 2 Outer of P1, Get 1 Outer of P2 Free
    // -------------------------------------------------------------
    echo "\n--- Test Suite 14: Buy X Get Y with Outer / Inner Basis ---\n";

    $bxgyScheme = Scheme::create([
        'seller_id'              => $sellerId,
        'name'                   => 'Buy 2 Outer P1 Get 1 Outer P2 Free',
        'type'                   => Scheme::TYPE_BUY_X_GET_Y,
        'buy_seller_product_id'  => $sp1->id,
        'buy_qty'                => 2,
        'buy_qty_basis'          => 'outer',
        'free_seller_product_id' => $sp2->id,
        'free_qty'               => 1,
        'free_qty_basis'         => 'outer',
        'start_date'             => date('Y-m-d', strtotime('-1 day')),
        'end_date'               => date('Y-m-d', strtotime('+30 days')),
        'status'                 => 1,
    ]);

    // 14a. 1 Outer P1 (below 2 Outer requirement)
    $bxgyCartFail = [
        [
            'seller_product_id' => $sp1->id,
            'qty'               => 1 * $secVal1,
            'line_total'        => round(1 * $secVal1 * $unitPrice1, 2),
            'actual_line_total' => round(1 * $secVal1 * $unitPrice1, 2),
        ]
    ];
    $bxgyResFail = SchemeEngine::evaluate($sellerId, $bxgyCartFail);
    assertTest($bxgyResFail === null, "Cart with 1 Outer P1 fails threshold of 2 Outer");

    // 14b. Nearest unapplied check
    $bxgyNear = SchemeEngine::nearestUnapplied($sellerId, $bxgyCartFail, null);
    assertTest($bxgyNear && $bxgyNear['id'] === $bxgyScheme->id && $bxgyNear['qty_needed'] === 1, "Nearest unapplied accurately suggests 1 more Outer needed for BXGY");

    // 14c. 2 Outer P1 (meets requirement) -> 1 Outer (secVal2 units) of P2 free
    $bxgyCartPass = [
        [
            'seller_product_id' => $sp1->id,
            'qty'               => 2 * $secVal1,
            'line_total'        => round(2 * $secVal1 * $unitPrice1, 2),
            'actual_line_total' => round(2 * $secVal1 * $unitPrice1, 2),
        ]
    ];
    $bxgyResPass = SchemeEngine::evaluate($sellerId, $bxgyCartPass);
    assertTest($bxgyResPass !== null && !empty($bxgyResPass['free_items']), "Cart with 2 Outer P1 qualifies for BXGY scheme");
    $expectedFreeQty = (int) $secVal2;
    assertTest(($bxgyResPass['free_items'][0]['qty'] ?? 0) === $expectedFreeQty, "Granted exactly 1 Outer = $expectedFreeQty base free units of P2 (Got: " . ($bxgyResPass['free_items'][0]['qty'] ?? 0) . ")");

    $bxgyScheme->delete();

} finally {
    DB::rollBack();
    echo "\n(Transaction rolled back cleanly: no test data left in database)\n";
}

echo "\n============================================\n";
echo "TEST RESULTS: $passCount PASSED, $failCount FAILED\n";
echo "============================================\n";

if ($failCount > 0) {
    exit(1);
}
