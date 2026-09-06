<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class AttributeType extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'slug'];
    public function values() { return $this->hasMany(AttributeValue::class); }
    public function categories() { return $this->belongsToMany(Category::class); }
}
