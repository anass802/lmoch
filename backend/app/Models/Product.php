<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'old_price',
        'reduction_percent',
        'image',
        'category_id',
        'species_id',
        'is_promo',
        'is_best',
        'stock',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'old_price' => 'decimal:2',
        'is_promo' => 'boolean',
        'is_best' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
    public function species()
{
    return $this->belongsTo(Species::class);
}

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? asset('storage/'.$this->image) : null;
    }
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
    public function variants() { return $this->hasMany(ProductVariant::class); }
}