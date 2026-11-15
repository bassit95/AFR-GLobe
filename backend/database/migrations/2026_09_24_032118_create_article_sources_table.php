<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('article_sources', function (Blueprint $table) {
    $table->foreignId('article_id')->constrained('articles')->cascadeOnDelete();
    $table->foreignId('source_id')->constrained('sources')->cascadeOnDelete();
    $table->timestamps();
    $table->primary(['article_id', 'source_id']);
});
    }

    public function down(): void
    {
        Schema::dropIfExists('article_sources');
    }
};
