<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brand_sources', function (Blueprint $table) {
    $table->foreignId('brand_id')->constrained('brands')->cascadeOnDelete();
    $table->foreignId('source_id')->constrained('sources')->cascadeOnDelete();
    $table->timestamps();
    $table->primary(['brand_id', 'source_id']);
});
    }

    public function down(): void
    {
        Schema::dropIfExists('brand_sources');
    }
};
