<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('boutiques', function (Blueprint $table) {
    $table->id();
    $table->foreignId('brand_id')->nullable()->constrained('brands')->nullOnDelete();
    $table->string('name');
    $table->text('address')->nullable();
    $table->foreignId('country_id')->nullable()->constrained('countries')->nullOnDelete();
    $table->foreignId('city_id')->nullable()->constrained('cities')->nullOnDelete();
    $table->decimal('latitude', 10, 7)->nullable();
    $table->decimal('longitude', 10, 7)->nullable();
    $table->string('phone')->nullable();
    $table->string('email')->nullable();
    $table->string('type')->default('physical');
    $table->string('website_url')->nullable();
    $table->json('opening_hours')->nullable();
    $table->string('status')->default('draft')->index();
    $table->timestamps();
    $table->softDeletes();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('boutiques');
    }
};
