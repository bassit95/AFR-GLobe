<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\City;
use App\Models\Country;
use App\Models\Creator;
use Database\Seeders\Support\SeedRecord;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            [
                'slug'=>'thebe-magugu', 'name'=>'THEBE MAGUGU', 'creator'=>'thebe-magugu', 'country'=>'ZA', 'city'=>'Johannesburg', 'website'=>'https://www.thebemagugu.com/', 
                'description'=>'Maison sud-africaine de prêt-à-porter pour femmes et hommes, explorant l’héritage culturel, la nouveauté et la qualité.',
                'logo' => 'https://images.pexels.com/photos/1122528/pexels-photo-1122528.jpeg?auto=compress&cs=tinysrgb&w=400', // Détail de couture
                'cover_image' => 'https://images.pexels.com/photos/9558583/pexels-photo-9558583.jpeg?auto=compress&cs=tinysrgb&w=1600' // Lookbook
            ],
            [
                'slug'=>'imane-ayissi-couture', 'name'=>'Imane Ayissi Couture', 'creator'=>'imane-ayissi', 'country'=>'FR', 'city'=>'Paris', 'website'=>'https://imane-ayissi.com/', 
                'description'=>'Maison de couture, prêt-à-porter et accessoires du créateur camerounais Imane Ayissi.',
                'logo' => 'https://images.pexels.com/photos/291762/pexels-photo-291762.jpeg?auto=compress&cs=tinysrgb&w=400', // Détail de tissu
                'cover_image' => 'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=1600' // Défilé
            ],
            [
                'slug'=>'kenneth-ize', 'name'=>'KENNETH IZE', 'creator'=>'kenneth-ize', 'country'=>'NG', 'city'=>'Lagos', 'website'=>'https://www.kennethize.net/', 
                'description'=>'Marque nigériane qui réinterprète les textiles traditionnels et l’artisanat local dans une esthétique contemporaine.',
                'logo' => 'https://images.pexels.com/photos/5634719/pexels-photo-5634719.jpeg?auto=compress&cs=tinysrgb&w=400', // Tissu Aso-oke
                'cover_image' => 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1600' // Vêtement
            ],
            [
                'slug'=>'lisa-folawiyo', 'name'=>'Lisa Folawiyo', 'creator'=>'lisa-folawiyo', 'country'=>'NG', 'city'=>'Lagos', 'website'=>'https://www.lisafolawiyo.com/', 
                'description'=>'Maison de mode nigériane travaillant notamment les textiles Ankara et Akwete avec des embellissements faits main.',
                'logo' => 'https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg?auto=compress&cs=tinysrgb&w=400', // Détail perles
                'cover_image' => 'https://images.pexels.com/photos/9558247/pexels-photo-9558247.jpeg?auto=compress&cs=tinysrgb&w=1600' // Robe colorée
            ],
            [
                'slug'=>'loza-maleombho', 'name'=>'LOZA MALÉOMBHO', 'creator'=>'loza-maleombho', 'country'=>'CI', 'city'=>'Abidjan', 'website'=>'https://www.lozamaleombho.com/', 
                'description'=>'Marque de mode basée en Côte d’Ivoire, à l’intersection de l’héritage culturel et du design contemporain.',
                'logo' => 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400', // Accessoire
                'cover_image' => 'https://images.pexels.com/photos/2065194/pexels-photo-2065194.jpeg?auto=compress&cs=tinysrgb&w=1600' // Silhouette
            ],
            [
                'slug'=>'selly-raby-kane', 'name'=>'Selly Raby Kane', 'creator'=>'selly-raby-kane', 'country'=>'SN', 'city'=>'Dakar', 'website'=>'https://www.sellyrabykane.net/', 
                'description'=>'Marque sénégalaise de mode et projet créatif porté par la créatrice et réalisatrice Selly Raby Kane.',
                'logo' => 'https://images.pexels.com/photos/291762/pexels-photo-291762.jpeg?auto=compress&cs=tinysrgb&w=400', // Abstrait
                'cover_image' => 'https://images.pexels.com/photos/1536618/pexels-photo-1536618.jpeg?auto=compress&cs=tinysrgb&w=1600' // Avant-garde
            ],
        ];

        foreach ($brands as $data) {
            $country = Country::where('code', $data['country'])->firstOrFail();
            $city = City::where('country_id', $country->id)->where('name', $data['city'])->firstOrFail();
            
            $brand = SeedRecord::upsert(Brand::class, ['slug' => $data['slug']], [
                'name' => $data['name'], 
                'slug' => $data['slug'], 
                'logo' => $data['logo'], // ✅ Image du logo
                'cover_image' => $data['cover_image'], // ✅ Image de fond
                'description' => $data['description'], 
                'founded_year' => null,
                'country_id' => $country->id, 
                'city_id' => $city->id,
                'website_url' => $data['website'], 
                'status' => 'published',
            ]);

            $creator = Creator::where('slug', $data['creator'])->firstOrFail();
            $brand->creators()->sync([$creator->id => ['role' => 'Founder / Designer']]);
        }
    }
}