<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class CatListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'breed', 'age_months', 'gender', 'color', 'description',
        'listing_type', 'price', 'city', 'vaccinated', 'sterilized',
        'image', 'status', 'owner_name', 'owner_phone',
    ];

    protected $casts = [
        'vaccinated' => 'boolean',
        'sterilized' => 'boolean',
        'price'      => 'decimal:2',
    ];

    public function scopeForSale(Builder $query): Builder
    {
        return $query->where('listing_type', 'vente');
    }

    public function scopeForAdoption(Builder $query): Builder
    {
        return $query->where('listing_type', 'adoption');
    }

    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('status', 'disponible');
    }
}