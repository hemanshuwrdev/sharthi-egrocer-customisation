<?php

namespace App\Helpers;

use App\Models\Cart;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\TaxRule;
use Illuminate\Support\Facades\DB;

class ProductHelper
{

    public static function isItemAvailable($product_id, $product_variant_id)
    {

        $variant = ProductVariant::where('product_id', $product_id)->where('id', $product_variant_id)->first();
        if ($variant) {
            $product = Product::where('id', $product_id)->where('status', 1)->first();
            return !empty($product);
        } else {
            return false;
        }
    }

    public static function isItemAvailableWithStock($product_id = null, $product_variant_id, $qty)
    {
        // Fetch the variant first
        $variant = ProductVariant::where('id', $product_variant_id)
            ->where('status', 1)
            ->first();

        if (!$variant) {
            return false;
        }

        // Use product_id from the variant if not provided
        $product_id = $product_id ?? $variant->product_id;

        // Fetch the product
        $product = Product::where('id', $product_id)->where('status', 1)->first();

        if (!$product) {
            return false;
        }

        // If is_unlimited_stock is enabled, return true immediately
        if ($product->is_unlimited_stock == 1) {
            return true;
        }

        // Ensure stock is enough for the requested qty
        if ($product->type == 'packet') {
            return $variant->stock >= $qty;
        } elseif ($product->type == 'loose') {

            return $variant->stock >= $variant->measurement * $qty;
        }
    }
    public static function isItemAvailableWithStockWithProductName($product_variant_id, $qty)
    {
        // Fetch the variant first
        $variant = ProductVariant::where('id', $product_variant_id)
            ->where('status', 1)
            ->first();

        // Check if the variant exists
        if (!$variant) {
            return ['status' => false, 'message' => 'Product variant not found'];
        }

        // Fetch the associated product
        $product = Product::where('id', $variant->product_id)
            ->where('status', 1)
            ->first();

        if (!$product) {
            return ['status' => false, 'message' => 'Product not found'];
        }

        // If unlimited stock is enabled, return true immediately
        if ($product->is_unlimited_stock == 1) {
            return ['status' => true, 'message' => 'Unlimited stock available'];
        }

        // Check if the requested quantity is available
        if ($variant->stock >= $qty) {
            return ['status' => true, 'message' => 'Stock is sufficient'];
        }

        // If stock is less than requested quantity, return low stock message
        return [
            'status' => false,
            'message' => "Low stock: Only {$variant->stock} available for {$product->name}"
        ];
    }


    public static function isItemAvailableInUserCart($user_id, $product_variant_id = "")
    {
        $cart = Cart::where('user_id', $user_id);
        if ($product_variant_id != '') {
            $cart->where('product_variant_id', $product_variant_id);
        }
        return $cart->exists();
    }

    public static function getTaxableAmount($product_variant_id, ?int $countryId = null)
    {
        if (DB::table('product_variants')->where('id', $product_variant_id)->exists()) {
            // legacy tax_id path disabled — use tax_category_id/TaxRule instead;
            // "percentage" now defaults to 0 and is only ever set via the TaxRule
            // override below.
            $sql = "SELECT
                                pv.id,
                                pv.discounted_price,
                                0 AS percentage,
                                p.tax_category_id,
                                pv.price
                            FROM product_variants pv
                            LEFT JOIN products p ON pv.product_id = p.id
                            WHERE pv.id = :product_variant_id";

            $result = DB::select($sql, ['product_variant_id' => $product_variant_id]);

            $result = !empty($result) ? $result[0] : array();

            if (!empty($result) && $countryId) {
                $override = TaxRule::resolvePercentage($countryId, $result->tax_category_id ?? null);
                if ($override !== null) {
                    $result->percentage = $override;
                }
            }

            if (!empty($result)) {
                $percentage = (float) ($result->percentage ?? 0);
                $result->percentage = $percentage;
                $result->taxable_amount = $result->discounted_price != 0
                    ? $result->discounted_price + ($result->discounted_price * $percentage) / 100
                    : $result->price + ($result->price * $percentage) / 100;
                $result->taxable_discounted_price = $result->discounted_price != 0
                    ? $result->discounted_price + ($result->discounted_price * $percentage) / 100
                    : $result->discounted_price;
                $result->taxable_price = $result->price != 0
                    ? $result->price + ($result->price * $percentage) / 100
                    : $result->price;
            }

            return $result;
        }
    }
}
