<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_newsletter_subscribers_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('newsletter_subscribers', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique(); // 🎯 Unique pour éviter les doublons
            $table->string('token')->nullable(); // 🎯 Pour un futur lien de désinscription
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('newsletter_subscribers');
    }
};