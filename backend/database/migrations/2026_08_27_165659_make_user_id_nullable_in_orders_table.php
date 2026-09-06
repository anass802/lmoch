<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // 1. drop foreign key first
            $table->dropForeign(['user_id']);

            // 2. make column nullable
            $table->foreignId('user_id')
                ->nullable()
                ->change();

            // 3. recreate foreign key with nullOnDelete
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // drop new FK
            $table->dropForeign(['user_id']);

            // revert nullable
            $table->foreignId('user_id')
                ->nullable(false)
                ->change();

            // restore original cascade behavior
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();
        });
    }
};