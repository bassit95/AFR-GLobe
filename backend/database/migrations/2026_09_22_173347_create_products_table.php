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
    $table->foreignId('brand_id')->constrained('brands')->cascadeOnDelete();
    $table->foreignId('collection_id')->nullable()->constrained('collections')->nullOnDelete();
    $table->string('name');
    $table->string('slug')->unique();
    $table->text('description')->nullable();
    $table->string('image')->nullable();
    $table->decimal('price', 12, 2)->nullable();
    $table->char('currency', 3)->nullable();
    $table->string('gender')->nullable()->index();
    $table->string('product_url')->nullable();
    $table->string('availability')->default('available')->index();
    $table->string('status')->default('draft')->index();
    $table->timestamps();
    $table->softDeletes();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
