<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CatListing;
use Illuminate\Http\Request;

class CatListingController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'listing_type' => 'nullable|in:vente,adoption',
            'gender'       => 'nullable|in:male,female',
            'breed'        => 'nullable|string',
            'city'         => 'nullable|string',
            'min_age'      => 'nullable|integer|min:0',
            'max_age'      => 'nullable|integer|min:0',
            'vaccinated'   => 'nullable|boolean',
            'sterilized'   => 'nullable|boolean',
            'min_price'    => 'nullable|numeric|min:0',
            'max_price'    => 'nullable|numeric|min:0',
            'search'       => 'nullable|string',
            'per_page'     => 'nullable|integer|min:1|max:50',
        ]);

        $query = CatListing::query()->available();

        if ($request->filled('listing_type')) {
            $query->where('listing_type', $request->listing_type);
        }
        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }
        if ($request->filled('breed')) {
            $query->where('breed', 'like', '%' . $request->breed . '%');
        }
        if ($request->filled('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }
        if ($request->filled('min_age')) {
            $query->where('age_months', '>=', $request->min_age);
        }
        if ($request->filled('max_age')) {
            $query->where('age_months', '<=', $request->max_age);
        }
        if ($request->filled('vaccinated')) {
            $query->where('vaccinated', $request->boolean('vaccinated'));
        }
        if ($request->filled('sterilized')) {
            $query->where('sterilized', $request->boolean('sterilized'));
        }
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $listings = $query->latest()->paginate($request->integer('per_page', 12));

        return response()->json(['data' => $listings]);
    }

    public function show(CatListing $catListing)
    {
        return response()->json(['data' => $catListing]);
    }

    public function distinctBreeds(Request $request)
    {
        $breeds = CatListing::query()
            ->available()
            ->when($request->filled('listing_type'), fn ($q) => $q->where('listing_type', $request->listing_type))
            ->whereNotNull('breed')
            ->distinct()
            ->pluck('breed');

        return response()->json(['data' => $breeds]);
    }
}