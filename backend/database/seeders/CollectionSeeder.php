<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Collection;
use Database\Seeders\Support\SeedRecord;
use Illuminate\Database\Seeder;

class CollectionSeeder extends Seeder
{
    public function run(): void
    {
        $collections = [
            ['brand'=>'thebe-magugu', 'slug'=>'thebe-magugu-doublethink-ss22', 'name'=>'Doublethink', 'year'=>2022, 'season'=>'Spring/Summer 2022', 'description'=>'Collection explorant la corruption et les lanceurs d\'alerte.'],
            ['brand'=>'imane-ayissi-couture', 'slug'=>'imane-ayissi-ikorrok', 'name'=>'Ikorrok', 'year'=>2025, 'season'=>'Fall/Winter 2025-2026', 'description'=>'Collection couture inspirée par la nature et les textiles innovants.'],
            ['brand'=>'kenneth-ize', 'slug'=>'kenneth-ize-the-circle-of-birth-and-death', 'name'=>'The Circle of Birth and Death', 'year'=>2021, 'season'=>'Fall 2021', 'description'=>'Collection présentée à la Paris Fashion Week, célébrant le cycle de la vie.'],
            ['brand'=>'lisa-folawiyo', 'slug'=>'lisa-folawiyo-collection-1-2024', 'name'=>'Collection 1 2024', 'year'=>2024, 'season'=>'2024', 'description'=>'Collection inspirée par la nature multifacette des femmes.'],
            ['brand'=>'loza-maleombho', 'slug'=>'loza-maleombho-pokou', 'name'=>'Pokou', 'year'=>null, 'season'=>null, 'description'=>'Collection Pokou présentée dans le catalogue officiel de la marque.'],
            ['brand'=>'selly-raby-kane', 'slug'=>'selly-raby-kane-sahel-under-waves', 'name'=>'Sahel Under Waves', 'year'=>2016, 'season'=>'Fall/Winter 2016-2017', 'description'=>'Collection reconnectant la femme à ses rêves.'],
            ['brand'=>'selly-raby-kane', 'slug'=>'selly-raby-kane-alien-cartoon', 'name'=>'Alien Cartoon', 'year'=>2014, 'season'=>'Fall/Winter 2014', 'description'=>'Une exploration afro-surréaliste.'],
            ['brand'=>'imane-ayissi-couture', 'slug'=>'imane-ayissi-bissakarak-ss-2026', 'name'=>'BISSAKARAK', 'year'=>2026, 'season'=>'Spring/Summer 2026', 'description'=>'Collection couture Printemps-Été 2026 présentée sur le site officiel de la maison.'],
            ['brand'=>'imane-ayissi-couture', 'slug'=>'imane-ayissi-ozouandam-ollat-fw-2026', 'name'=>'OZOUANDAM OLLAT', 'year'=>2026, 'season'=>'Fall/Winter 2026', 'description'=>'Collection couture Automne-Hiver 2026 présentée sur le site officiel de la maison.'],
            ['brand'=>'loza-maleombho', 'slug'=>'loza-maleombho-pokou', 'name'=>'Pokou', 'year'=>null, 'season'=>null, 'description'=>'Collection Pokou présentée dans le catalogue officiel de la marque.'],
            ['brand'=>'selly-raby-kane', 'slug'=>'selly-raby-kane-taxaw', 'name'=>'Taxaw', 'year'=>null, 'season'=>'Capsule', 'description'=>'Capsule Taxaw présentée sur le site officiel de Selly Raby Kane.'],

        ];

        foreach ($collections as $data) {
            $brand = Brand::where('slug', $data['brand'])->firstOrFail();
            SeedRecord::upsert(Collection::class, ['slug' => $data['slug']], [
                'brand_id' => $brand->id, 
                'name' => $data['name'], 
                'slug' => $data['slug'],
                'year' => $data['year'], 
                'season' => $data['season'], 
                'description' => $data['description'],
                'cover_image' => null, 
                'status' => 'published',
            ]);
        }
    }
}