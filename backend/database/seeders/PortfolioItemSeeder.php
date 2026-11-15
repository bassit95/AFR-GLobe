<?php

namespace Database\Seeders;

use App\Models\Collection;
use App\Models\Creator;
use App\Models\PortfolioItem;
use Database\Seeders\Support\SeedRecord;
use Illuminate\Database\Seeder;

class PortfolioItemSeeder extends Seeder
{
    public function run(): void
    {
        $portfolioByCreator = [
            'thebe-magugu' => [
                ['title' => 'Doublethink SS22 — Silhouette 01', 'description' => 'Silhouette de la collection "Doublethink" SS22...', 'image' => 'africa-global/portfolioItem/thebe-magugu/look-01.webp', 'display_order' => 1, 'collection_slug' => 'thebe-magugu-doublethink-ss22'],
                ['title' => 'Doublethink SS22 — Silhouette 02', 'description' => 'Silhouette de la collection "Doublethink" SS22...', 'image' => 'africa-global/portfolioItem/thebe-magugu/look-02.webp', 'display_order' => 2, 'collection_slug' => 'thebe-magugu-doublethink-ss22'],
                ['title' => 'Doublethink SS22 — Silhouette 03', 'description' => 'Silhouette de la collection "Doublethink" SS22...', 'image' => 'africa-global/portfolioItem/thebe-magugu/look-03.webp', 'display_order' => 3, 'collection_slug' => 'thebe-magugu-doublethink-ss22'],
                ['title' => 'Doublethink SS22 — Silhouette 04', 'description' => 'Silhouette de la collection "Doublethink" SS22...', 'image' => 'africa-global/portfolioItem/thebe-magugu/look-04.webp', 'display_order' => 4, 'collection_slug' => 'thebe-magugu-doublethink-ss22'],
            ],
            'imane-ayissi' => [
                ['title' => 'Ikorrok — Look 01', 'description' => 'Look issu de la collection couture "Ikorrok"...', 'image' => 'africa-global/portfolioItem/imane-ayissi/look-01.jpg', 'display_order' => 1, 'collection_slug' => 'imane-ayissi-ikorrok'],
                ['title' => 'Ikorrok — Look 02', 'description' => 'Look issu de la collection couture "Ikorrok"...', 'image' => 'africa-global/portfolioItem/imane-ayissi/look-02.jpg', 'display_order' => 2, 'collection_slug' => 'imane-ayissi-ikorrok'],
                ['title' => 'Ikorrok — Look 03', 'description' => 'Look issu de la collection couture "Ikorrok"...', 'image' => 'africa-global/portfolioItem/imane-ayissi/look-03.jpg', 'display_order' => 3, 'collection_slug' => 'imane-ayissi-ikorrok'],
                ['title' => 'Ikorrok — Look 04', 'description' => 'Look issu de la collection couture "Ikorrok"...', 'image' => 'africa-global/portfolioItem/imane-ayissi/look-04.jpg', 'display_order' => 4, 'collection_slug' => 'imane-ayissi-ikorrok'],
            ],
            'kenneth-ize' => [
                ['title' => 'The Circle of Birth and Death — Look 02', 'description' => 'Look de la collection Fall 2021...', 'image' => 'africa-global/portfolioItem/kenneth-ize/look-01.webp', 'display_order' => 1, 'collection_slug' => 'kenneth-ize-the-circle-of-birth-and-death'],
                ['title' => 'The Circle of Birth and Death — Look 04', 'description' => 'Look de la collection Fall 2021...', 'image' => 'africa-global/portfolioItem/kenneth-ize/look-02.webp', 'display_order' => 2, 'collection_slug' => 'kenneth-ize-the-circle-of-birth-and-death'],
                ['title' => 'The Circle of Birth and Death — Look 05', 'description' => 'Look de la collection Fall 2021...', 'image' => 'africa-global/portfolioItem/kenneth-ize/look-03.webp', 'display_order' => 3, 'collection_slug' => 'kenneth-ize-the-circle-of-birth-and-death'],
                ['title' => 'The Circle of Birth and Death — Look 06', 'description' => 'Look de la collection Fall 2021...', 'image' => 'africa-global/portfolioItem/kenneth-ize/look-04.webp', 'display_order' => 4, 'collection_slug' => 'kenneth-ize-the-circle-of-birth-and-death'],
            ],
            'lisa-folawiyo' => [
                ['title' => 'Collection 1 2024 — Look 23', 'description' => 'Look de la collection "Collection 1 2024"...', 'image' => 'africa-global/portfolioItem/lisa-folawiyo/look-01.jpg', 'display_order' => 1, 'collection_slug' => 'lisa-folawiyo-collection-1-2024'],
                ['title' => 'Collection 1 2024 — Look 24', 'description' => 'Look de la collection "Collection 1 2024"...', 'image' => 'africa-global/portfolioItem/lisa-folawiyo/look-02.jpg', 'display_order' => 2, 'collection_slug' => 'lisa-folawiyo-collection-1-2024'],
                ['title' => 'Collection 1 2024 — Look 25', 'description' => 'Look de la collection "Collection 1 2024"...', 'image' => 'africa-global/portfolioItem/lisa-folawiyo/look-03.jpg', 'display_order' => 3, 'collection_slug' => 'lisa-folawiyo-collection-1-2024'],
                ['title' => 'Collection 1 2024 — Look 26', 'description' => 'Look de la collection "Collection 1 2024"...', 'image' => 'africa-global/portfolioItem/lisa-folawiyo/look-04.jpg', 'display_order' => 4, 'collection_slug' => 'lisa-folawiyo-collection-1-2024'],
            ],
            'loza-maleombho' => [
                ['title' => 'Moya Dress', 'description' => 'Création présentée dans le catalogue officiel...', 'image' => 'africa-global/portfolioItem/loza-maleombho/look-01.png', 'display_order' => 1, 'collection_slug' => 'loza-maleombho-pokou'],
                ['title' => 'Halo Dress', 'description' => 'Robe proposée dans la collection...', 'image' => 'africa-global/portfolioItem/loza-maleombho/look-02.png', 'display_order' => 2, 'collection_slug' => 'loza-maleombho-pokou'],
                ['title' => 'Nubiah Jacket', 'description' => 'Veste présentée dans le catalogue...', 'image' => 'africa-global/portfolioItem/loza-maleombho/look-03.png', 'display_order' => 3, 'collection_slug' => 'loza-maleombho-pokou'],
                ['title' => 'NTU Shirt', 'description' => 'Chemise imprimée présentée dans le catalogue...', 'image' => 'africa-global/portfolioItem/loza-maleombho/look-04.jpeg', 'display_order' => 4, 'collection_slug' => 'loza-maleombho-pokou'],
            ],
            'selly-raby-kane' => [
                ['title' => 'Sahel Under Waves — Lookbook 01', 'description' => 'Visuel du lookbook de la collection...', 'image' => 'africa-global/portfolioItem/selly-raby-kane/look-01.jpg', 'display_order' => 1, 'collection_slug' => 'selly-raby-kane-sahel-under-waves'],
                ['title' => 'Sahel Under Waves — Lookbook 02', 'description' => 'Deuxième visuel du lookbook...', 'image' => 'africa-global/portfolioItem/selly-raby-kane/look-02.jpg', 'display_order' => 2, 'collection_slug' => 'selly-raby-kane-sahel-under-waves'],
                ['title' => 'Alien Cartoon — Lookbook 01', 'description' => 'Visuel de la collection Alien Cartoon...', 'image' => 'africa-global/portfolioItem/selly-raby-kane/look-03.jpeg', 'display_order' => 3, 'collection_slug' => 'selly-raby-kane-alien-cartoon'],
                ['title' => 'Alien Cartoon — Lookbook 02', 'description' => 'Deuxième visuel de la collection...', 'image' => 'africa-global/portfolioItem/selly-raby-kane/look-04.jpeg', 'display_order' => 4, 'collection_slug' => 'selly-raby-kane-alien-cartoon'],
            ],
        ];

        foreach ($portfolioByCreator as $slug => $items) {
            $creator = Creator::query()->where('slug', $slug)->firstOrFail();

            foreach ($items as $item) {
                // 🎯 On cherche l'ID de la collection correspondante
                $collectionId = null;
                if (isset($item['collection_slug'])) {
                    $collectionId = Collection::where('slug', $item['collection_slug'])->value('id');
                }

                SeedRecord::upsert(
                    PortfolioItem::class,
                    ['creator_id' => $creator->id, 'title' => $item['title']],
                    [
                        'creator_id' => $creator->id,
                        'collection_id' => $collectionId, // 🎯 LIEN CRÉÉ ICI
                        'title' => $item['title'],
                        'description' => $item['description'],
                        'image' => $item['image'],
                        'alt_text' => $item['title'],
                        'display_order' => $item['display_order'],
                        'status' => 'published',
                    ]
                );
            }
        }
    }
}