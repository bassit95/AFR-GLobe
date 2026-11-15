<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('boutiques', 'image')) {
            Schema::table('boutiques', function (Blueprint $table) {
                $table->string('image')->nullable()->after('name');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('boutiques', 'image')) {
            Schema::table('boutiques', function (Blueprint $table) {
                $table->dropColumn('image');
            });
        }
    }
};
