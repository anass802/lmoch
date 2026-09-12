<?php

namespace App\Http\Controllers;
use App\Models\Product;
use App\Models\Category;
use App\Models\Species;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    // methods for Home pages //
    public function JouetChat(){
        $category = Category::where('name','Jouets')->first();
        $product = Product::with(['category','variants.attributeValues'])->where('category_id', $category->id)
            ->whereHas('species', fn($s) => $s->where('slug','chat'))
            ->inRandomOrder()
            ->limit(10)
            ->get();
        return response()->json(['data'=>$product]);
    }
    public function JouetDog(){
        $category = Category::where('name','Jouets')->first();
        $product = Product::with(['category','variants.attributeValues'])->where('category_id', $category->id)
            ->whereHas('species', fn($s) => $s->where('slug','chien'))
            ->inRandomOrder()
            ->limit(10)
            ->get();
        return response()->json(['data'=>$product]);
    }
    public function randomProducts()
    {
        $ids = Product::inRandomOrder()->limit(10)->pluck('id');
        $products = Product::with(['category', 'variants.attributeValues'])
            ->whereIn('id', $ids)
            ->get();

        return response()->json(['data' => $products]);
    }
    public function getAllProducts(){
        $product=Product::with('category')
        ->paginate(50);
        
        return response()->json(['data'=>$product]);
    }
    public function outOfStockProducts()
    {
        $products = Product::with('category')
            ->where('stock', 0)
            ->paginate(50);

        return response()->json(['data' => $products]);
    }
    public function search(Request $requet){
        $query=$requet->input('q');
        $products=Product::with('category')
                ->where(function ($qBuilder) use($query){
                $qBuilder->where('name','LIKE',"%{$query}%")
                        ->orWhereHas('category',function($q)use($query){
                            $q->where('name', 'LIKE', "%{$query}%");
                        });
                })
                ->limit(20)
                ->get();
        return response()->json(['data'=>$products]);
    }
    // methods for Categories Products pages //
    public function species(){
        $species = Species::with('categories')->get();
        return response()->json(['data'=>$species]);
    }
    public function categories(string $slug){
        $species=Species::where('slug',$slug)
                ->with('categories')
                ->firstOrFail();
        return response()->json(['data'=>$species->categories]);
    }
    public function getFilteredProducts(int $category_id, int $species_id)
    {
        $product = Product::with(['category','variants.attributeValues'])->where('category_id', $category_id)
            ->where('species_id', $species_id)
            ->paginate(50);

        return response()->json(['data' => $product]);
    }
    public function getProductDetails(string $slug){
        $product=Product::with(['category','variants.attributeValues'])->where('slug', $slug)->firstOrFail();
        return response()->json(['data'=>$product]);
    }
    public function getSuggestionProduct(int $product_id, int $species_id,int $category_id){
        $products=Product::where('id','!=',$product_id)
                            ->where('species_id',$species_id)
                            ->where('category_id',$category_id)
                            ->limit(20)
                            ->inRandomOrder()
                            ->get();
        return response()->json(['data'=>$products]);
    }
    public function uncategorized()
    {
        $products = Product::whereNull('category_id')->orWhereNull('species_id')->paginate(50);
        return response()->json(['data' => $products]);
    }
    public function getPromoProducts()
    {
        $products = Product::with(['category','variants.attributeValues'])
            ->where('is_promo', true)
            ->paginate(50);

        return response()->json(['data' => $products]);
    }
    public function updateCategory(Request $request, Product $product)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'species_id'  => 'required|exists:species,id',
        ]);
        $product->update($request->only(['category_id', 'species_id']));
        return response()->json(['data' => $product->load(['category', 'species'])]);
    }
    public function store(Request $request){
        $data=$request->validate([
            'name'=>'required|string|max:255',
            'description'=>'nullable|string',
            'price'=>'required|numeric|min:0',
            'old_price'    => 'nullable|numeric|min:0',
            'category_id'  => 'required|exists:categories,id',
            'species_id'   => 'required|exists:species,id',
            'stock'        => 'required|integer|min:0',
            'is_promo'     => 'boolean',
            'is_best'      => 'boolean',
            'image'        => 'nullable|image|max:4096',
        ]);
        $data['slug'] = Str::slug($data['name']) . '-' . uniqid();
        if($request->hasFile('image')){
            $data['image']=$request->file('image')->store('products','public');
        }
        $product=Product::create($data);
        return response()->json(['data' => $product->load(['category', 'species'])], 201);
    }
    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name'         => 'required|string|max:255',
            'description'  => 'nullable|string',
            'price'        => 'required|numeric|min:0',
            'old_price'    => 'nullable|numeric|min:0',
            'category_id'  => 'required|exists:categories,id',
            'species_id'   => 'required|exists:species,id',
            'stock'        => 'required|integer|min:0',
            'is_promo'     => 'boolean',
            'is_best'      => 'boolean',
            'image'        => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);

        return response()->json(['data' => $product->load(['category', 'species'])]);
    }
    public function delete(Product $product){
        $product->delete();
        return response()->json([
        'success'=>true,
        'message' => 'Product deleted successfully'
    ]);
    }
}
