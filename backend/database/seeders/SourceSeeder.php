<?php

namespace Database\Seeders;

use App\Models\Source;
use Database\Seeders\Support\SeedRecord;
use Illuminate\Database\Seeder;

class SourceSeeder extends Seeder
{
    public function run(): void
    {
        $sources = [
            ['title' => 'THEBE MAGUGU — site officiel', 'source_type' => 'official_website', 'url' => 'https://www.thebemagugu.com/about/', 'publisher' => 'THEBE MAGUGU'],
            ['title' => 'Thebe Magugu — profil LVMH Prize', 'source_type' => 'institutional_profile', 'url' => 'https://www.lvmhprize.com/en/designer/thebe-magugu', 'publisher' => 'LVMH Prize'],
            ['title' => 'Imane Ayissi Couture — site officiel', 'source_type' => 'official_website', 'url' => 'https://imane-ayissi.com/en', 'publisher' => 'Imane Ayissi'],
            ['title' => 'Imane Ayissi — profil Fédération de la Haute Couture et de la Mode', 'source_type' => 'institutional_profile', 'url' => 'https://www.fhcm.paris/en/news/a-feel-for-fashion-imane-ayissi', 'publisher' => 'Fédération de la Haute Couture et de la Mode'],
            ['title' => 'Kenneth Ize — site officiel', 'source_type' => 'official_website', 'url' => 'https://www.kennethize.net/', 'publisher' => 'Kenneth Ize'],
            ['title' => 'Kenneth Ize — profil LVMH Prize', 'source_type' => 'institutional_profile', 'url' => 'https://www.lvmhprize.com/en/designer/kenneth-ize', 'publisher' => 'LVMH Prize'],
            ['title' => 'Kenneth Ize — Austrian Fashion Association', 'source_type' => 'institutional_profile', 'url' => 'https://www.austrianfashionassociation.at/en/talent/kenneth-ize/', 'publisher' => 'Austrian Fashion Association'],
            ['title' => 'Lisa Folawiyo — à propos', 'source_type' => 'official_website', 'url' => 'https://www.lisafolawiyo.com/about', 'publisher' => 'Lisa Folawiyo'],
            ['title' => 'Lisa Folawiyo — portrait éditorial Vogue', 'source_type' => 'editorial_profile', 'url' => 'https://www.vogue.com/article/female-designers-portfolio-march-2024', 'publisher' => 'Vogue'],
            ['title' => 'Lisa Folawiyo — contacts officiels', 'source_type' => 'official_contact_page', 'url' => 'https://www.lisafolawiyo.com/contact', 'publisher' => 'Lisa Folawiyo'],
            ['title' => 'Loza Maléombho — à propos', 'source_type' => 'official_website', 'url' => 'https://www.lozamaleombho.com/fr/about', 'publisher' => 'Loza Maléombho'],
            ['title' => 'Loza Maléombho — contacts officiels', 'source_type' => 'official_contact_page', 'url' => 'https://www.lozamaleombho.com/contacts', 'publisher' => 'Loza Maléombho'],
            ['title' => 'Selly Raby Kane — site officiel', 'source_type' => 'official_website', 'url' => 'https://www.sellyrabykane.net/', 'publisher' => 'Selly Raby Kane'],
            ['title' => 'Selly Raby Kane — profil Prince Claus Fund', 'source_type' => 'institutional_profile', 'url' => 'https://princeclausfund.nl/people/selly-raby-kane', 'publisher' => 'Prince Claus Fund'],
        ];

        foreach ($sources as $data) {
            SeedRecord::upsert(Source::class, ['url' => $data['url']], $data + [
                'published_at' => null,
                'checked_at' => now(),
            ]);
        }
    }
}
