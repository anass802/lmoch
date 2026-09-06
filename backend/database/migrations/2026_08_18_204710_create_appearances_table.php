<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('appearances', function (Blueprint $table) {
            $table->id();
            $table->string('primary_color')->default('#4A4E58');
            $table->string('secondary_color')->default('#F0A93E');
            $table->string('gradient_from')->default('#2A2C31');
            $table->string('gradient_via')->default('#4A4E58');
            $table->string('gradient_to')->default('#767B87');
            $table->string('success_color')->default('#10B981');
            $table->string('warning_color')->default('#F59E0B');
            $table->string('danger_color')->default('#EF4444');
            $table->json('chart_palette')->nullable();
            $table->string('page_background')->default('#FDF9F2');
            $table->string('card_background')->default('#FFFFFF');
            $table->string('border_color')->default('#E8DFC9');       // slate-100
            $table->string('text_primary')->default('#201F1D');       // slate-900
            $table->string('text_muted')->default('#8A8D93'); 
            $table->enum('theme', ['light', 'dark'])->default('light');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appearances');
    }
};
