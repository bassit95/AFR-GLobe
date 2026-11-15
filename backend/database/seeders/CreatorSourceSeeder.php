<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Creator;
use App\Models\Source;
use Illuminate\Database\Seeder;

class CreatorSourceSeeder extends Seeder
{
    public function run(): void
    {
        $links = [
            'thebe-magugu' => [
                'https://www.thebemagugu.com/about/',
                'https://www.lvmhprize.com/en/designer/thebe-magugu',
            ],
            'imane-ayissi' => [
                'https://imane-ayissi.com/en',
                'https://www.fhcm.paris/en/news/a-feel-for-fashion-imane-ayissi',
            ],
            'kenneth-ize' => [
                'https://www.kennethize.net/',
                'https://www.lvmhprize.com/en/designer/kenneth-ize',
                'https://www.austrianfashionassociation.at/en/talent/kenneth-ize/',
            ],
            'lisa-folawiyo' => [
                'https://www.lisafolawiyo.com/about',
                'https://www.vogue.com/article/female-designers-portfolio-march-2024',
            ],
            'loza-maleombho' => [
                'https://www.lozamaleombho.com/fr/about',
                'https://www.lozamaleombho.com/contacts',
            ],
            'selly-raby-kane' => [
                'https://www.sellyrabykane.net/',
                'https://princeclausfund.nl/people/selly-raby-kane',
            ],
        ];

        foreach ($links as $slug => $urls) {
            $creator = Creator::where('slug', $slug)->firstOrFail();
            $sourceIds = Source::whereIn('url', $urls)->pluck('id')->all();
            $creator->sources()->sync($sourceIds);

            $brand = Brand::whereHas('creators', fn ($query) => $query->where('creators.id', $creator->id))->first();
            if ($brand) {
                $brand->sources()->sync($sourceIds);
            }
        }

        $lozaBoutique = \App\Models\Boutique::where('name', 'Loza Maléombho Showroom')->first();
        if ($lozaBoutique) {
            $id = Source::where('url', 'https://www.lozamaleombho.com/contacts')->value('id');
            if ($id) $lozaBoutique->sources()->sync([$id]);
        }

        $lisaBoutique = \App\Models\Boutique::where('name', 'Lisa Folawiyo — contact location')->first();
        if ($lisaBoutique) {
            $id = Source::where('url', 'https://www.lisafolawiyo.com/contact')->value('id');
            if ($id) $lisaBoutique->sources()->sync([$id]);
        }
    }
}
