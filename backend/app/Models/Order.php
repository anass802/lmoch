<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
    'user_id',
    'total_price',
    'paid_by',
    'points_used',
    'status',
    'shipping',
    'phone',
    'city',
    'address',
    'embalage',
];

   
    public function items()
        {
            return $this->hasMany(OrderItem::class);
        }
    public function user()
        {
            return $this->belongsTo(User::class);
        }
    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_items')
                    ->withPivot('quantity', 'price', 'total')
                    ->withTimestamps();
    }
    
}
