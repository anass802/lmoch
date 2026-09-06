<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\AttributeType;

class CategoryAttributeTypeSeeder extends Seeder
{
    public function run(): void
    {
        $color  = AttributeType::where('slug', 'color')->first();
        $size   = AttributeType::where('slug', 'size')->first();
        $weightKg = AttributeType::where('slug', 'weight-kg')->first();
        $weightL = AttributeType::where('slug', 'weight-l')->first();

        // toys -> color + size
        $Vetements = Category::where('slug', 'vetements-chien-chat')->first();
        if ($Vetements) {
            $Vetements->attributeTypes()->syncWithoutDetaching([$color->id, $size->id]);
        }
        $Coussin_niches=Category::where('slug','coussin-niches-chien-chat')->first();
        if($Coussin_niches){
            $Coussin_niches->attributeTypes()->syncWithoutDetaching([$color->id, $size->id]);
        }
        $SacAdos_Cage=Category::where('slug','sac-a-dos-cage-chien-chat')->first();
        if($SacAdos_Cage){
            $SacAdos_Cage->attributeTypes()->syncWithoutDetaching([$color->id, $size->id]);
        }
        $Fontaine_Gamelle=Category::where('slug','fontaine-gamelle-chien-chat')->first();
        if($Fontaine_Gamelle){
            $Fontaine_Gamelle->attributeTypes()->syncWithoutDetaching([$color->id]);
        }

        // croquettes/food -> weight only
        $croquettes = Category::where('slug', 'croquettes-chien-chat')->first();
        if ($croquettes) {
            $croquettes->attributeTypes()->syncWithoutDetaching([$weightKg->id]);
        }
        $litiere = Category::where('slug', 'litiere-bac-a-litiere-chat')->first();
        if ($litiere) {
            $litiere->attributeTypes()->syncWithoutDetaching([$weightL->id]);
        }

        // accessories -> color only, for example
        $accessories = Category::where('slug', 'accessoires-chien-chat')->first();
        if ($accessories) {
            $accessories->attributeTypes()->syncWithoutDetaching([$color->id]);
        }
    }
}