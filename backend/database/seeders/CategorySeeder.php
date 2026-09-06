<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Species;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // 1. especes
        $speciesMap = [];
        foreach (['chien' => 'Chien', 'chat' => 'Chat', 'poisson' => 'Poisson', 'oiseau' => 'Oiseau'] as $slug => $name) {
            $speciesMap[$slug] = Species::updateOrCreate(['slug' => $slug], ['name' => $name]);
        }

        // 2. categories partagees chien + chat
        $chienChat = [
            'Croquettes',
            'Friandises',
            'Pâtes',
            'Sac a dos & Cage',
            'Jouets',
            'Pharmacie',
            'Hygiène & Bain',
            'Fontaine & Gamelle',
            'Accessoires',
            'Vetements',
            'Coussin & niches',
        ];

        foreach ($chienChat as $name) {
            $this->createCategory($name, [$speciesMap['chien'], $speciesMap['chat']]);
        }

        // 3. litiere = chat uniquement
        $this->createCategory('Litière & bac a litière', [$speciesMap['chat']]);

        // 4. poisson & oiseau: categories separees (memes noms, especes differentes)
        foreach (['poisson', 'oiseau'] as $slug) {
            $this->createCategory('Nourriture', [$speciesMap[$slug]]);
            $this->createCategory('Accessoires', [$speciesMap[$slug]]);
        }
    }

    private function createCategory(string $name, array $species): void
    {
        $speciesSlugs = collect($species)->pluck('slug')->implode('-');
        $slug = Str::slug($name).'-'.$speciesSlugs;

        $category = Category::updateOrCreate(
            ['slug' => $slug],
            ['name' => $name]
        );

        $category->species()->sync(collect($species)->pluck('id'));
    }
}