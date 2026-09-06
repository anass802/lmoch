<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AttributeType;

class AttributeTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AttributeType::insert([
            ['name' => 'Color',  'slug' => 'color',  'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Size',   'slug' => 'size',   'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Weight-kg', 'slug' => 'weight-kg', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Weight-L', 'slug' => 'weight-l', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
