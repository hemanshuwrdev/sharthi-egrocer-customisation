<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Product;

$p = Product::first();
echo "Before:\n";
// Not loading any relation, getting dynamically
$translations = $p->translations;
echo "Type: " . gettype($translations) . "\n";
if (is_array($translations)) {
    echo "Desc: " . ($translations['description'] ?? 'none') . "\n";
}

$translations['description'] = 'OVERRIDDEN_DESC';
unset($p->translations);
$p->translations = $translations;

$arr = $p->toArray();
echo "After toArray():\n";
echo "Desc inside array: " . ($arr['translations']['description'] ?? 'none') . "\n";

