<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('creator_style', function (Blueprint $table) {
    $table->foreignId('creator_id')->constrained('creators')->cascadeOnDelete();
    $table->foreignId('style_id')->constrained('styles')->cascadeOnDelete();
    $table->primary(['creator_id', 'style_id']);
});
    }

    public function down(): void
    {
        Schema::dropIfExists('creator_style');
    }
};
