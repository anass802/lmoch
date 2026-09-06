<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->string('name',500)->index();
            $table->string('slug',191)->unique();
            $table->text('description')->nullable();

            $table->decimal('price', 10, 2)->index();              // prix actuel (affiche)
            $table->decimal('old_price', 10, 2)->nullable(); // prix barre si promo
            $table->unsignedTinyInteger('reduction_percent')->nullable(); // ex: 10 pour -10%

            $table->string('image',300)->nullable(); // chemin local storage, ex: products/xxx.jpg

            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete()->index();

            $table->boolean('is_promo')->default(false)->index();
            $table->boolean('is_best')->default(false)->index(); // meilleur produit
            $table->foreignId('species_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('stock')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};