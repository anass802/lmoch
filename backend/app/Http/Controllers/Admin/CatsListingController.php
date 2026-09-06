<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CatListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CatsListingController extends Controller
{
    public function index(Request $request)
    {
        $query = CatListing::query();

        if ($request->filled('listing_type')) {
            $query->where('listing_type', $request->listing_type);
        }
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $listings = $query->latest()->paginate($request->integer('per_page', 10));

        return response()->json(['data' => $listings]);
    }

    public function show(CatListing $catListing)
    {
        return response()->json(['data' => $catListing]);
    }

    public function store(Request $request)
    {
        $validated = $this->validated($request);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('cats', 'public');
        }

        $cat = CatListing::create($validated);

        return response()->json(['data' => $cat], 201);
    }

    public function update(Request $request, CatListing $catListing)
    {
        $validated = $this->validated($request, $catListing->id);

        if ($request->hasFile('image')) {
            if ($catListing->image) {
                Storage::disk('public')->delete($catListing->image);
            }
            $validated['image'] = $request->file('image')->store('cats', 'public');
        }

        $catListing->update($validated);

        return response()->json(['data' => $catListing->fresh()]);
    }

    public function destroy(CatListing $catListing)
    {
        if ($catListing->image) {
            Storage::disk('public')->delete($catListing->image);
        }
        $catListing->delete();

        return response()->json(['message' => 'Supprimé']);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'name'          => 'required|string|max:255',
            'breed'         => 'nullable|string|max:255',
            'age_months'    => 'nullable|integer|min:0',
            'gender'        => 'required|in:male,female',
            'color'         => 'nullable|string|max:255',
            'description'   => 'nullable|string',
            'listing_type'  => 'required|in:vente,adoption',
            'price'         => 'nullable|numeric|min:0|required_if:listing_type,vente',
            'city'          => 'nullable|string|max:255',
            'vaccinated'    => 'nullable|boolean',
            'sterilized'    => 'nullable|boolean',
            'status'        => 'nullable|in:disponible,reserve,adopte,vendu',
            'owner_name'    => 'nullable|string|max:255',
            'owner_phone'   => 'nullable|string|max:50',
            'image'         => 'nullable|image|max:4096',
        ]);
    }
}