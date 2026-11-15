<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brands', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug')->unique();
    $table->string('logo')->nullable();
    $table->string('cover_image')->nullable();
    $table->text('description')->nullable();
    $table->unsignedSmallInteger('founded_year')->nullable();
    $table->foreignId('country_id')->nullable()->constrained('countries')->nullOnDelete();
    $table->foreignId('city_id')->nullable()->constrained('cities')->nullOnDelete();
    $table->string('website_url')->nullable();
    $table->string('status')->default('draft')->index();
    $table->timestamps();
    $table->softDeletes();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('brands');
    }
};
