<?php

namespace Database\Seeders;

use App\Models\Category;
use Database\Seeders\Support\SeedRecord;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['womenswear', 'Womenswear', 'Créations et vêtements principalement destinés à la mode féminine.'],
            ['menswear', 'Menswear', 'Créations et vêtements principalement destinés à la mode masculine.'],
            ['unisex', 'Unisex', 'Créations pouvant être portées indépendamment du genre.'],
            ['ready-to-wear', 'Ready-to-Wear', 'Collections de prêt-à-porter.'],
            ['haute-couture', 'Haute Couture', 'Créations de couture haut de gamme.'],
            ['streetwear', 'Streetwear', 'Mode inspirée des cultures urbaines.'],
            ['shoes', 'Shoes', 'Chaussures et souliers.'],
            ['jewelry', 'Jewelry', 'Bijoux et joaillerie.'],
            ['bags', 'Bags', 'Sacs et maroquinerie.'],
            ['accessories', 'Accessories', 'Accessoires liés à la mode et au style.'],
            ['textile', 'Textile', 'Création et design textile.'],
            ['children', 'Children', 'Mode destinée aux enfants.'],
        ];

        foreach ($categories as [$slug, $name, $description]) {
            SeedRecord::upsert(Category::class, ['slug' => $slug], compact('name', 'slug', 'description'));
        }
    }
}
