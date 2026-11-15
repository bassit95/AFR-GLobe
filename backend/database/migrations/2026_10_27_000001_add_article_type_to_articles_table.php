<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('articles', 'article_type')) {
            Schema::table('articles', function (Blueprint $table): void {
                $table->string('article_type', 40)
                    ->default('culture')
                    ->index();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('articles', 'article_type')) {
            Schema::table('articles', function (Blueprint $table): void {
                // The database drops an index that depends on this column.
                $table->dropColumn('article_type');
            });
        }
    }
};
