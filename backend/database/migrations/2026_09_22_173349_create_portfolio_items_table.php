<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolio_items', function (Blueprint $table) {
    $table->id();
    $table->foreignId('creator_id')->constrained('creators')->cascadeOnDelete();
    $table->foreignId('collection_id')->nullable()->constrained('collections')->nullOnDelete();
    $table->string('title');
    $table->text('description')->nullable();
    $table->string('image');
    $table->string('alt_text')->nullable();
    $table->unsignedSmallInteger('year')->nullable();
    $table->unsignedInteger('display_order')->default(0);
    $table->string('status')->default('draft')->index();
    $table->timestamps();
    $table->softDeletes();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_items');
    }
};
