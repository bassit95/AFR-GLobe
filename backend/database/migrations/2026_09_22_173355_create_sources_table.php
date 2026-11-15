<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sources', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->string('source_type');
    $table->string('url')->unique();
    $table->string('publisher')->nullable();
    $table->date('published_at')->nullable();
    $table->timestamp('checked_at')->nullable();
    $table->timestamps();
    $table->softDeletes();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('sources');
    }
};
