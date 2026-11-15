<?php

namespace Database\Seeders;

use App\Models\Resource;
use Database\Seeders\Support\SeedRecord;
use Illuminate\Database\Seeder;

class ResourceSeeder extends Seeder
{
    public function run(): void
    {
        $resources = [
            ['slug'=>'thebe-magugu-site-officiel', 'title'=>'THEBE MAGUGU — site officiel', 'description'=>'Site officiel de la maison sud-africaine THEBE MAGUGU.', 'url'=>'https://www.thebemagugu.com/', 'resource_type'=>'designer'],
            ['slug'=>'imane-ayissi-site-officiel', 'title'=>'Imane Ayissi Couture — site officiel', 'description'=>'Collections couture, prêt-à-porter et accessoires.', 'url'=>'https://imane-ayissi.com/', 'resource_type'=>'designer'],
            ['slug'=>'kenneth-ize-site-officiel', 'title'=>'Kenneth Ize — site officiel', 'description'=>'Site officiel de la marque du créateur nigérian.', 'url'=>'https://www.kennethize.net/', 'resource_type'=>'designer'],
            ['slug'=>'lisa-folawiyo-site-officiel', 'title'=>'Lisa Folawiyo — site officiel', 'description'=>'Site officiel de la maison de mode nigériane.', 'url'=>'https://www.lisafolawiyo.com/', 'resource_type'=>'designer'],
            ['slug'=>'loza-maleombho-site-officiel', 'title'=>'Loza Maléombho — site officiel', 'description'=>'Catalogue, collections et contacts officiels.', 'url'=>'https://www.lozamaleombho.com/', 'resource_type'=>'designer'],
            ['slug'=>'selly-raby-kane-site-officiel', 'title'=>'Selly Raby Kane — site officiel', 'description'=>'Univers mode et projets créatifs de Selly Raby Kane.', 'url'=>'https://www.sellyrabykane.net/', 'resource_type'=>'designer'],
        ];

        foreach ($resources as $data) {
            SeedRecord::upsert(Resource::class, ['slug' => $data['slug']], $data + ['cover_image' => null, 'status' => 'published']);
        }
    }
}
