<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('boutique_sources', function (Blueprint $table) {
    $table->foreignId('boutique_id')->constrained('boutiques')->cascadeOnDelete();
    $table->foreignId('source_id')->constrained('sources')->cascadeOnDelete();
    $table->timestamps();
    $table->primary(['boutique_id', 'source_id']);
});
    }

    public function down(): void
    {
        Schema::dropIfExists('boutique_sources');
    }
};
