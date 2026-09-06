<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class AttributeValue extends Model
{   use HasFactory;
    protected $fillable = ['attribute_type_id', 'value', 'hex_code'];
    public function type() { return $this->belongsTo(AttributeType::class, 'attribute_type_id'); }
}
