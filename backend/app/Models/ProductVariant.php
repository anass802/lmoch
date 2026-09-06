<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class ProductVariant extends Model
{   use HasFactory;
    protected $fillable = ['product_id','image_path', 'stock', 'price_override'];
    public function product() { return $this->belongsTo(Product::class); }
    public function attributeValues() {
        return $this->belongsToMany(AttributeValue::class, 'product_variant_attribute_value');
    }
}
