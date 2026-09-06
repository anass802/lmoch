<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Product;
use App\Models\Species;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImportWooProducts extends Command
{
    protected $signature = 'import:woo-products {source : chemin fichier json local OU url du Store API, ex: https://lmoch.com/wp-json/wc/store/products} {--fresh-images : vide storage/app/public/products avant de relancer, evite les fichiers orphelins}';
    protected $description = 'Importe les produits WooCommerce (fichier json ou Store API live) vers la table products, dedoublonne, remap les categories et re-heberge les images';

    /**
     * Noms de "categories" WooCommerce qui sont en fait des especes, pas de vraies categories.
     */
    private array $speciesLabels = [
        'Chats' => 'chat',
        'Chiens' => 'chien',
        'Poissons' => 'poisson',
        'Oiseaux' => 'oiseau',
    ];

    /**
     * Categories WooCommerce a ignorer completement (pas pertinentes pour toi).
     * Adapte cette liste au nom exact tel qu'il apparait dans le json (champ "categories.name").
     */
    private array $excludedCategories = [
        'Hors', // <-- remplace par le nom exact de la categorie a exclure
    ];

    public function handle(): int
    {
        $source = $this->argument('source');

        if ($this->option('fresh-images')) {
            Storage::disk('public')->deleteDirectory('products');
            Storage::disk('public')->makeDirectory('products');
            $this->line('storage/app/public/products vide.');
        }

        $items = str_starts_with($source, 'http')
            ? $this->fetchFromApi($source)
            : $this->fetchFromFile($source);

        if ($items === null) {
            return self::FAILURE;
        }

        $seenNames = [];
        $created = 0;
        $updated = 0;
        $skippedDuplicate = 0;
        $skippedExcluded = 0;
        $skippedErrors = 0;

        foreach ($items as $item) {
            $rawName = trim($item['name'] ?? '');

            if ($rawName === '') {
                continue;
            }

            // slug tronque a 140 caracteres + hash court pour rester unique et sous la limite de colonne
            $slugBase = Str::slug($rawName);
            $normalizedName = mb_substr($slugBase, 0, 140).'-'.substr(md5($rawName), 0, 8);

            // --- dedup: on garde seulement la premiere occurrence d'un nom identique ---
            if (isset($seenNames[$normalizedName])) {
                $skippedDuplicate++;
                $this->line("Doublon ignore: {$item['name']} (id {$item['id']})");
                continue;
            }
            $seenNames[$normalizedName] = true;

            $rawCategories = array_map(fn ($c) => $c['name'], $item['categories'] ?? []);

            // categorie explicitement exclue -> on saute carrement le produit
            if (array_intersect($rawCategories, $this->excludedCategories)) {
                $skippedExcluded++;
                $this->line("Categorie exclue, produit ignore: {$item['name']}");
                continue;
            }

            // especes detectees pour ce produit (chien/chat/poisson/oiseau)
            $species = [];
            foreach ($rawCategories as $catName) {
                if (isset($this->speciesLabels[$catName])) {
                    $species[] = $this->speciesLabels[$catName];
                }
            }

            // id espece a stocker sur le produit (on prend la premiere si plusieurs matchs)
            $speciesId = ! empty($species)
                ? Species::whereIn('slug', $species)->value('id')
                : null;

            // la "vraie" categorie = la premiere categorie qui n'est pas un nom d'espece
            $realCategoryNames = array_values(array_diff($rawCategories, array_keys($this->speciesLabels)));
            $category = $this->matchCategory($realCategoryNames, $species);

            // --- prix: WooCommerce stocke en centimes (string) ---
            $prices = $item['prices'] ?? [];
            $price = isset($prices['price']) ? ((int) $prices['price']) / 100 : 0;
            $regular = isset($prices['regular_price']) ? ((int) $prices['regular_price']) / 100 : $price;
            $isPromo = $regular > $price;

            $oldPrice = $isPromo ? $regular : null;
            $reductionPercent = $isPromo && $regular > 0
                ? (int) round((($regular - $price) / $regular) * 100)
                : null;

            // --- nom: on decode les entites html et on nettoie les espaces ---
            $cleanName = html_entity_decode(trim($item['name'] ?? ''), ENT_QUOTES);
            $cleanName = preg_replace('/\s+/', ' ', $cleanName);
            $cleanName = mb_substr($cleanName, 0, 500); // securite, colonne est en varchar(500)

            // --- description: on nettoie le html ---
            $description = trim(strip_tags($item['description'] ?? ''));
            $description = html_entity_decode($description, ENT_QUOTES);

            // --- image: on telecharge et on re-heberge en local ---
            $imagePath = $this->downloadFirstImage($item['images'][0]['src'] ?? null, $normalizedName);

            $stock = ($item['is_in_stock'] ?? false) ? 100 : 0;

            try {
                $product = Product::updateOrCreate(
                    ['slug' => $normalizedName],
                    [
                        'name' => $cleanName,
                        'description' => $description,
                        'price' => $price,
                        'old_price' => $oldPrice,
                        'reduction_percent' => $reductionPercent,
                        'image' => $imagePath,
                        'category_id' => $category?->id,
                        'species_id' => $speciesId,
                        'is_promo' => $isPromo,
                        'is_best' => false,
                        'stock' => $stock,
                    ]
                );

                $product->wasRecentlyCreated ? $created++ : $updated++;
            } catch (\Throwable $e) {
                $skippedErrors++;
                $this->error("Echec insertion produit '{$cleanName}': {$e->getMessage()}");
                continue;
            }
        }

        $this->info("Termine. Crees: {$created} | Mis a jour: {$updated} | Doublons ignores: {$skippedDuplicate} | Exclus: {$skippedExcluded} | Erreurs: {$skippedErrors}");

        return self::SUCCESS;
    }

    /**
     * Charge les produits depuis un fichier json local.
     */
    private function fetchFromFile(string $path): ?array
    {
        if (! file_exists($path)) {
            $this->error("Fichier introuvable: {$path}");
            return null;
        }

        $items = json_decode(file_get_contents($path), true);

        if (! is_array($items)) {
            $this->error('JSON invalide.');
            return null;
        }

        return $items;
    }

    /**
     * Recupere tous les produits en paginant le WooCommerce Store API (max 100/page).
     */
    private function fetchFromApi(string $url): ?array
    {
        $all = [];
        $page = 1;
        $perPage = 100;

        do {
            $this->line("Fetch page {$page}...");

            $response = Http::timeout(30)->get($url, [
                'page' => $page,
                'per_page' => $perPage,
            ]);

            if (! $response->successful()) {
                $this->error("Echec requete API (status {$response->status()}) sur la page {$page}.");
                return $all ?: null;
            }

            $batch = $response->json();

            if (! is_array($batch) || empty($batch)) {
                break;
            }

            $all = array_merge($all, $batch);
            $page++;
        } while (count($batch) === $perPage);

        $this->info('Total produits recuperes depuis l\'API: '.count($all));

        return $all;
    }

    /**
     * Trouve la categorie DB correspondant au nom + espece detectee.
     */
    private function matchCategory(array $names, array $species): ?Category
    {
        if (empty($names)) {
            return null;
        }

        foreach ($names as $name) {
            $normalized = Str::of($name)->lower()->ascii()->toString();

            $query = Category::query()->whereRaw('LOWER(name) = ?', [$normalized]);

            // si une espece a ete detectee, on filtre via la relation indexee category_species
            if (! empty($species)) {
                $query->whereHas('species', fn ($q) => $q->whereIn('slug', $species));
            }

            $match = $query->first();

            if ($match) {
                return $match;
            }
        }

        return null;
    }

    /**
     * Telecharge l'image source et la stocke localement, renvoie le chemin relatif (disk "public").
     */
    private function downloadFirstImage(?string $url, string $slug): ?string
    {
        if (! $url) {
            return null;
        }

        try {
            $response = Http::timeout(15)->get($url);

            if (! $response->successful()) {
                $this->warn("Image non recuperee ({$response->status()}): {$url}");
                return null;
            }

            $extension = pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'jpg';
            $filename = $slug.'-'.Str::random(6).'.'.$extension;
            $path = 'products/'.$filename;

            Storage::disk('public')->put($path, $response->body());

            return $path;
        } catch (\Throwable $e) {
            $this->warn("Echec telechargement image pour {$slug}: {$e->getMessage()}");
            return null;
        }
    }
}