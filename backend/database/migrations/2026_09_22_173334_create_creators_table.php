<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('creators', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug')->unique();
    $table->string('profile_image')->nullable();
    $table->string('cover_image')->nullable();
    $table->foreignId('country_of_origin_id')->nullable()->constrained('countries')->nullOnDelete();
    $table->foreignId('country_of_residence_id')->nullable()->constrained('countries')->nullOnDelete();
    $table->foreignId('city_of_residence_id')->nullable()->constrained('cities')->nullOnDelete();
    $table->string('gender')->nullable();
    $table->string('short_bio', 500)->nullable();
    $table->longText('biography')->nullable();
    $table->json('social_links')->nullable();
    $table->string('website_url')->nullable();
    $table->string('status')->default('draft')->index();
    $table->string('verification_status')->default('unverified');
    $table->json('awards')->nullable();
    $table->timestamps();
    $table->softDeletes();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('creators');
    }
};
