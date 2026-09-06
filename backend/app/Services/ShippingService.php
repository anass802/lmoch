<?php

namespace App\Services;
use App\Models\Product;

class ShippingService
{
    private const FREE_CATEGORIES = [
        "Sac a dos & Cage",
        "Jouets",
        "Pharmacie",
        "Accessoires",
        "Vetements",
        "Coussin & niches",
    ];

    public static function calculate(string $city, array $items): array
{
    $requiredCount = $city === "Casablanca" ? 4 : 6;

    
    $products = Product::whereIn('id', collect($items)->pluck('id'))
        ->with('category')
        ->get()
        ->keyBy('id');

    $eligibleCount = collect($items)
        ->map(function ($item) use ($products) {

            $product = $products[$item['id']] ?? null;

            if (!$product || !$product->category) return 0;

            return in_array($product->category->name, self::FREE_CATEGORIES)
                ? $item['quantity']
                : 0;
        })
        ->sum();

    $basePrice = $city === "Casablanca" ? 20 : 45;

    $shippingPrice = $eligibleCount >= $requiredCount ? 0 : $basePrice;

    return [
        'price' => $shippingPrice,
        'eligible_count' => $eligibleCount,
        'required_count' => $requiredCount,
        'is_free_shipping' => $shippingPrice === 0,
    ];
}
}