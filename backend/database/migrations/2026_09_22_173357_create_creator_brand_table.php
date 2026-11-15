<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('creator_brand', function (Blueprint $table) {
    $table->id();
    $table->foreignId('creator_id')->constrained('creators')->cascadeOnDelete();
    $table->foreignId('brand_id')->constrained('brands')->cascadeOnDelete();
    $table->string('role')->nullable();
    $table->timestamps();
    $table->unique(['creator_id', 'brand_id']);
});
    }

    public function down(): void
    {
        Schema::dropIfExists('creator_brand');
    }
};
