<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cat_listings', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('breed')->nullable();
            $table->unsignedTinyInteger('age_months')->nullable(); // âge en mois
            $table->enum('gender', ['male', 'female']);
            $table->string('color')->nullable();
            $table->text('description')->nullable();

            // vente ou adoption
            $table->enum('listing_type', ['vente', 'adoption']);
            $table->decimal('price', 10, 2)->nullable(); // requis seulement si vente

            $table->string('city')->nullable();
            $table->boolean('vaccinated')->default(false);
            $table->boolean('sterilized')->default(false);

            $table->string('image')->nullable();

            $table->enum('status', ['disponible', 'reserve', 'adopte', 'vendu'])->default('disponible');

            $table->string('owner_name')->nullable();
            $table->string('owner_phone')->nullable();

            $table->timestamps();

            $table->index(['listing_type', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cat_listings');
    }
};