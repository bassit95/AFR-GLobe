<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('styles', function (Blueprint $table) {
    $table->id();
    $table->foreignId('parent_id')->nullable()->constrained('styles')->nullOnDelete();
    $table->string('name');
    $table->string('slug')->unique();
    $table->text('description')->nullable();
    $table->timestamps();
    $table->softDeletes();
    $table->index('parent_id');
});
    }

    public function down(): void
    {
        Schema::dropIfExists('styles');
    }
};
