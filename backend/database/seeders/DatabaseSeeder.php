<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CountrySeeder::class,
            CitySeeder::class,
            CategorySeeder::class,
            StyleSeeder::class,
            CreatorSeeder::class,
            BrandSeeder::class,
            CollectionSeeder::class,
            BoutiqueSeeder::class,
            ProductSeeder::class,
            SourceSeeder::class,
            CreatorSourceSeeder::class,
            ArticleSeeder::class,
            SiwakArticleSeeder::class,        // ← AJOUT
            ArticleSourceSeeder::class,
            ResourceSeeder::class,
            PortfolioItemSeeder::class,
        ]);
    }
}