<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug'];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function species(): BelongsToMany
    {
        return $this->belongsToMany(Species::class, 'category_species');
    }
    /**
     * Scope indexe: categories disponibles pour une espece donnee (slug).
     * Usage: Category::forSpecies('chat')->get();
     */
    public function scopeForSpecies($query, string $speciesSlug)
    {
        return $query->whereHas('species', fn ($q) => $q->where('slug', $speciesSlug));
    }
    public function attributeTypes() {
        return $this->belongsToMany(AttributeType::class, 'category_attribute_type');
    }
}