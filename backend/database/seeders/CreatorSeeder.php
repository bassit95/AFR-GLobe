<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\City;
use App\Models\Country;
use App\Models\Creator;
use App\Models\Style;
use Database\Seeders\Support\SeedRecord;
use Illuminate\Database\Seeder;
use RuntimeException;

class CreatorSeeder extends Seeder
{
    public function run(): void
    {
        $profiles = [
            [
                'slug' => 'thebe-magugu',
                'name' => 'Thebe Magugu',
                'origin' => 'ZA',
                'residence_country' => 'ZA',
                'city' => 'Johannesburg',
                'gender' => 'male',
                'profile_image' => 'africa-global/creators/thebe-magugu/portrait.jpeg', 
                'cover_image' => 'africa-global/creators/thebe-magugu/cover.webp',
                'website' => 'https://www.thebemagugu.com/',
                'social_links' => ['instagram' => 'https://www.instagram.com/thebemagugu/'],
                'short_bio' => 'Créateur sud-africain basé à Johannesburg, connu pour un prêt-à-porter qui explore l’histoire, l’identité et les cultures sud-africaines.',
                'biography' => 'Thebe Magugu est un créateur sud-africain originaire de Kimberley et basé à Johannesburg. Il a fondé sa maison éponyme après des études de stylisme, de photographie de mode et de médias. Son travail utilise le vêtement comme un moyen de raconter des histoires et d’explorer l’histoire, les identités et les cultures sud-africaines. Il a remporté le LVMH Prize en 2019. La maison est principalement connue pour son prêt-à-porter féminin.',
                'categories' => ['womenswear', 'ready-to-wear'],
                'styles' => ['contemporain', 'heritage-africain', 'luxe'],
                'awards' => [
                    [
                        'title' => 'Lauréat du LVMH Prize',
                        'org' => 'LVMH Prize',
                        'year' => 2019,
                        'kind' => 'award',
                        'url' => 'https://www.lvmhprize.com/en/designer/thebe-magugu',
                        'image' => 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&q=80', // 🏆 Image du trophée
                    ],
                ],
            ],
            [
                'slug' => 'imane-ayissi',
                'name' => 'Imane Ayissi',
                'origin' => 'CM',
                'residence_country' => 'FR',
                'city' => 'Paris',
                'gender' => 'male',
                'profile_image' => 'africa-global/creators/imane-ayissi/portrait.jpg',
                'cover_image' => 'africa-global/creators/imane-ayissi/cover.jpeg',
                'website' => 'https://imane-ayissi.com/',
                'social_links' => ['instagram' => 'https://www.instagram.com/imaneayissi/'],
                'short_bio' => 'Couturier camerounais basé à Paris, qui associe des matières et savoir-faire africains aux codes de la haute couture.',
                'biography' => 'Imane Ayissi est un couturier camerounais basé à Paris. Sa maison présente des collections de haute couture, de prêt-à-porter et des accessoires, en faisant dialoguer des matières et savoir-faire africains avec les techniques de la couture parisienne. En 2020, il est devenu le premier créateur d’Afrique subsaharienne invité à présenter une collection au calendrier officiel de la Haute Couture de Paris.',
                'categories' => ['womenswear', 'haute-couture', 'ready-to-wear', 'accessories', 'bags'],
                'styles' => ['luxe', 'couture-inspired', 'fusion', 'artisanal'],
                'awards' => [
                    [
                        'title' => 'Première présence au calendrier officiel de la Haute Couture',
                        'org' => 'Fédération de la Haute Couture et de la Mode',
                        'year' => 2020,
                        'kind' => 'milestone',
                        'url' => 'https://www.fhcm.paris/en/news/a-feel-for-fashion-imane-ayissi',
                        'image' => 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=200&q=80', // 🏆 Image
                    ],
                ],
            ],
            [
                'slug' => 'kenneth-ize',
                'name' => 'Kenneth Ize',
                'origin' => 'NG',
                'residence_country' => 'NG',
                'city' => 'Lagos',
                'gender' => 'male',
                'profile_image' => 'africa-global/creators/kenneth-ize/portrait.avif',
                'cover_image' => 'africa-global/creators/kenneth-ize/cover.webp',
                'website' => 'https://www.kennethize.net/',
                'social_links' => ['instagram' => 'https://www.instagram.com/kennethize/'],
                'short_bio' => 'Créateur nigérian qui réinterprète notamment le textile aso-oke et les savoir-faire des tisserands nigérians dans une approche contemporaine.',
                'biography' => 'Kenneth Ize est un créateur nigérian dont le travail met en valeur l’artisanat et les textiles locaux, notamment l’aso-oke, une étoffe tissée à la main liée à la culture yoruba. Sa marque associe ces savoir-faire à une esthétique contemporaine et collabore avec des tisserands et des groupes d’artisans au Nigeria. Il a été finaliste du LVMH Prize en 2019 et a reçu le Fashion Award of the City of Vienna en 2019.',
                'categories' => ['womenswear', 'menswear', 'unisex', 'ready-to-wear', 'textile'],
                'styles' => ['traditionnel', 'artisanal', 'contemporain', 'fusion'],
                'awards' => [
                    [
                        'title' => 'Finaliste du LVMH Prize',
                        'org' => 'LVMH Prize',
                        'year' => 2019,
                        'kind' => 'recognition',
                        'url' => 'https://www.lvmhprize.com/en/designer/kenneth-ize',
                        'image' => 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&q=80',
                    ],
                    [
                        'title' => 'Fashion Award of the City of Vienna',
                        'org' => 'City of Vienna',
                        'year' => 2019,
                        'kind' => 'award',
                        'url' => 'https://www.austrianfashionassociation.at/en/talent/kenneth-ize/',
                        'image' => 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=200&q=80',
                    ],
                ],
            ],
            [
                'slug' => 'lisa-folawiyo',
                'name' => 'Lisa Folawiyo',
                'origin' => 'NG',
                'residence_country' => 'NG',
                'city' => 'Lagos',
                'gender' => 'female',
                'profile_image' => 'africa-global/creators/lisa-folawiyo/portrait.jpeg',
                'cover_image' =>'africa-global/creators/lisa-folawiyo/cover.webp',
                'website' => 'https://www.lisafolawiyo.com/',
                'social_links' => ['instagram' => 'https://www.instagram.com/lisafolawiyo/'],
                'short_bio' => 'Créatrice nigériane reconnue pour ses textiles ouest-africains, ses embellissements faits main et ses coupes contemporaines.',
                'biography' => 'Lisa Folawiyo est une créatrice nigériane qui a fondé sa marque en 2005. Son travail transforme des textiles comme l’Ankara et l’Akwete par des embellissements minutieux réalisés à la main et un travail de coupe contemporain. Sa maison met en avant le savoir-faire, les textiles locaux et une expression actuelle de la mode conçue au Nigeria.',
                'categories' => ['womenswear', 'ready-to-wear', 'accessories'],
                'styles' => ['contemporain', 'artisanal', 'luxe', 'fusion'],
                'awards' => [], // Aucune récompense pour l'instant
            ],
            [
                'slug' => 'loza-maleombho',
                'name' => 'Loza Maléombho',
                'origin' => 'CI',
                'residence_country' => 'CI',
                'city' => 'Abidjan',
                'gender' => 'female',
                'profile_image' =>'africa-global/creators/loza-maleombho/portrait.jpg',
                'cover_image' =>'africa-global/creators/loza-maleombho/cover.jpeg',
                'website' => 'https://www.lozamaleombho.com/',
                'social_links' => ['instagram' => 'https://www.instagram.com/atelier.loza.maleombho/'],
                'short_bio' => 'Créatrice établie à Abidjan, dont la marque fait dialoguer références culturelles ivoiriennes, héritages ouest-africains et silhouettes contemporaines.',
                'biography' => 'Loza Maléombho est une créatrice au parcours multiculturel, née au Brésil et élevée entre la Côte d’Ivoire et les États-Unis. Elle s’est installée en Côte d’Ivoire en 2012, où la production de sa marque est développée. Son univers associe références culturelles, influences urbaines et silhouettes contemporaines. Son site officiel présente notamment des vêtements, des chaussures, des accessoires et des objets pour la maison.',
                'categories' => ['womenswear', 'unisex', 'ready-to-wear', 'shoes', 'accessories'],
                'styles' => ['contemporain', 'heritage-africain', 'fusion', 'avant-garde'],
                'awards' => [],
            ],
            [
                'slug' => 'selly-raby-kane',
                'name' => 'Selly Raby Kane',
                'origin' => 'SN',
                'residence_country' => 'SN',
                'city' => 'Dakar',
                'gender' => 'female',
                'profile_image' => 'africa-global/creators/selly-raby-kane/portrait.jpeg',
                'cover_image' => 'africa-global/creators/selly-raby-kane/cover.webp',
                'website' => 'https://www.sellyrabykane.net/',
                'social_links' => ['instagram' => 'https://www.instagram.com/sellyrabykane/'],
                'short_bio' => 'Créatrice et réalisatrice sénégalaise dont l’univers relie mode, cinéma, culture urbaine de Dakar et imaginaire afrofuturiste.',
                'biography' => 'Selly Raby Kane est une créatrice de mode et réalisatrice sénégalaise basée à Dakar. Sa marque, lancée en 2012, développe un univers visuel qui associe références culturelles sénégalaises, culture urbaine, cinéma et silhouettes expérimentales. Elle explore aussi le film et les formes narratives immersives, notamment avec le projet de réalité virtuelle The Other Dakar.',
                'categories' => ['womenswear', 'ready-to-wear', 'accessories'],
                'styles' => ['avant-garde', 'experimental-avant-garde', 'afro-futuriste', 'contemporain'],
                'awards' => [
                    [
                        'title' => 'The Other Dakar — Film narratif en réalité virtuelle',
                        'org' => 'The Verge / Tribeca Film Festival',
                        'year' => 2017,
                        'kind' => 'recognition',
                        'url' => 'https://princeclausfund.nl/people/selly-raby-kane',
                        'image' => 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&q=80', // 🏆 Image
                    ],
                ],
            ],
        ];

        foreach ($profiles as $profile) {
            $origin = Country::where('code', $profile['origin'])->firstOrFail();
            $residenceCountry = Country::where('code', $profile['residence_country'])->firstOrFail();
            $city = City::where('country_id', $residenceCountry->id)
                ->where('name', $profile['city'])
                ->firstOrFail();

            $values = [
                'name' => $profile['name'],
                'slug' => $profile['slug'],
                'country_of_origin_id' => $origin->id,
                'country_of_residence_id' => $residenceCountry->id,
                'city_of_residence_id' => $city->id,
                'gender' => $profile['gender'],
                'short_bio' => $profile['short_bio'],
                'biography' => $profile['biography'],
                'social_links' => $profile['social_links'],
                'website_url' => $profile['website'],
                'awards' => $profile['awards'], // Grâce au cast JSON, ça va marcher
                'status' => 'published',
                'verification_status' => 'unverified',
            ];

            foreach (['profile_image', 'cover_image'] as $imageField) {
                if (!empty($profile[$imageField])) {
                    $values[$imageField] = $profile[$imageField];
                }
            }

            // Note: Ton SeedRecord::upsert doit être capable de gérer le JSON.
            // S'il utilise Eloquent, c'est bon. Sinon, remplace-le par :
            // $creator = Creator::updateOrCreate(['slug' => $profile['slug']], $values);
            $creator = SeedRecord::upsert(Creator::class, ['slug' => $profile['slug']], $values);

            $categories = Category::whereIn('slug', $profile['categories'])->get()->keyBy('slug');
            $styles = Style::whereIn('slug', $profile['styles'])->get()->keyBy('slug');

            $missingCategories = array_values(array_diff($profile['categories'], $categories->keys()->all()));
            $missingStyles = array_values(array_diff($profile['styles'], $styles->keys()->all()));

            if ($missingCategories !== []) {
                throw new RuntimeException('Creator ' . $profile['slug'] . ' has missing category slugs: ' . implode(', ', $missingCategories) . '. Run CategorySeeder first.');
            }

            if ($missingStyles !== []) {
                throw new RuntimeException('Creator ' . $profile['slug'] . ' has missing style slugs: ' . implode(', ', $missingStyles) . '. Run StyleSeeder first.');
            }

            $creator->categories()->sync($categories->pluck('id')->all());
            $creator->styles()->sync($styles->pluck('id')->all());
        }
    }
}