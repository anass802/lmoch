<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AttributeType;
use App\Models\AttributeValue;

class AttributeValueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $color    = AttributeType::where('slug', 'color')->first();
        $size     = AttributeType::where('slug', 'size')->first();
        $weightKg = AttributeType::where('slug', 'weight-kg')->first();
        $weightL  = AttributeType::where('slug', 'weight-l')->first();

        $colors = [
            ['value' => 'Red',          'hex_code' => '#FF0000'],
            ['value' => 'Blue',         'hex_code' => '#0000FF'],
            ['value' => 'Black',        'hex_code' => '#000000'],
            ['value' => 'White',        'hex_code' => '#FFFFFF'],
            ['value' => 'Gray',         'hex_code' => '#808080'],
            ['value' => 'Beige',        'hex_code' => '#F5F5DC'],
            ['value' => 'Brown',        'hex_code' => '#8B4513'],
            ['value' => 'Green',        'hex_code' => '#008000'],
            ['value' => 'Yellow',       'hex_code' => '#FFFF00'],
            ['value' => 'Orange',       'hex_code' => '#FFA500'],
            ['value' => 'Pink',         'hex_code' => '#FFC0CB'],
            ['value' => 'Purple',       'hex_code' => '#800080'],
            ['value' => 'Navy',         'hex_code' => '#000080'],
            ['value' => 'Turquoise',    'hex_code' => '#40E0D0'],
            ['value' => 'Gold',         'hex_code' => '#FFD700'],
            ['value' => 'Silver',       'hex_code' => '#C0C0C0'],
            ['value' => 'Cream',        'hex_code' => '#FFFDD0'],
            ['value' => 'Khaki',        'hex_code' => '#C3B091'],
            ['value' => 'Burgundy',     'hex_code' => '#800020'],
            ['value' => 'Camel',        'hex_code' => '#C19A6B'],
            ['value' => 'Fuchsia',      'hex_code' => '#FF00FF'],
            ['value' => 'Lime',         'hex_code' => '#32CD32'],
            ['value' => 'Sky Blue',     'hex_code' => '#87CEEB'],
            ['value' => 'Mint',         'hex_code' => '#98FF98'],
            ['value' => 'Coral',        'hex_code' => '#FF7F50'],
            ['value' => 'Lavender',     'hex_code' => '#E6E6FA'],
            ['value' => 'Charcoal',     'hex_code' => '#36454F'],
            ['value' => 'Taupe',        'hex_code' => '#483C32'],
            // added
            ['value' => 'Rose',         'hex_code' => '#FF66B2'],
            ['value' => 'Indigo',       'hex_code' => '#4B0082'],
            ['value' => 'Maroon',       'hex_code' => '#800000'],
            ['value' => 'Ivory',        'hex_code' => '#FFFFF0'],
            ['value' => 'Denim Blue',   'hex_code' => '#1560BD'],
            ['value' => 'Chocolate',    'hex_code' => '#7B3F00'],
            ['value' => 'Peach',        'hex_code' => '#FFDAB9'],
            ['value' => 'Olive',        'hex_code' => '#808000'],
            // patterns / no single hex
            ['value' => 'Multicolor',   'hex_code' => null],
            ['value' => 'Leopard Print','hex_code' => null],
        ];
        foreach ($colors as $c) {
            AttributeValue::create([
                'attribute_type_id' => $color->id,
                'value' => $c['value'],
                'hex_code' => $c['hex_code'],
            ]);
        }

        $sizes = ['S', 'M', 'L', 'XL', '2XL'];
        foreach ($sizes as $s) {
            AttributeValue::create([
                'attribute_type_id' => $size->id,
                'value' => $s,
            ]);
        }

        $weightKgValues = ['400g', '1.5kg', '2kg', '3kg', '4kg', '8kg', '10kg', '15kg', '20kg']; // renamed
        foreach ($weightKgValues as $w) {
            AttributeValue::create([
                'attribute_type_id' => $weightKg->id, // no longer overwritten
                'value' => $w,
            ]);
        }

        $weightLValues = ['5L', '10L', '12L', '20L']; // renamed
        foreach ($weightLValues as $w) {
            AttributeValue::create([
                'attribute_type_id' => $weightL->id,
                'value' => $w,
            ]);
        }
    }
}