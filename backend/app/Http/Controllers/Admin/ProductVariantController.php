<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductVariantController extends Controller
{
    public function index(Product $product)
    {
        return response()->json(['data' => $product->variants()->with('attributeValues.type')->get()]);
    }

public function store(Request $request, Product $product)
{
    $request->validate([
        'combinations' => 'required|array|min:1',
        'combinations.*.attribute_value_ids'   => 'required|array|min:1',
        'combinations.*.attribute_value_ids.*' => 'integer|exists:attribute_values,id',
        'combinations.*.stock'                 => 'required|integer|min:0',
        'combinations.*.image'                 => 'nullable|image|max:4096',
    ]);

    $created = [];
    $pathByImageHash = []; 

    foreach ($request->combinations as $i => $combo) {
        $imagePath = null;

        if ($request->hasFile("combinations.$i.image")) {
            $file = $request->file("combinations.$i.image");
            $hash = md5_file($file->getRealPath());

            if (isset($pathByImageHash[$hash])) {
                $imagePath = $pathByImageHash[$hash]; 
            } else {
                $imagePath = $file->store('variants', 'public');
                $pathByImageHash[$hash] = $imagePath;
            }
        }

        $variant = $product->variants()->create([
            'stock'      => $combo['stock'],
            'image_path' => $imagePath,
        ]);

        $variant->attributeValues()->sync($combo['attribute_value_ids']);
        $created[] = $variant->load('attributeValues');
    }

    return response()->json(['data' => $created], 201);
}
}