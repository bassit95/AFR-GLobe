<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Boutique;
use App\Models\City;
use App\Models\Country;
use Database\Seeders\Support\SeedRecord;
use Illuminate\Database\Seeder;

class BoutiqueSeeder extends Seeder
{
    public function run(): void
    {
        // Public contact/showroom locations only; coordinates and opening hours are left blank unless verified.
        $locations = [
            [
                'slug'=>'loza-maleombho-showroom', 'brand'=>'loza-maleombho', 'name'=>'Loza Maléombho Showroom',
                'address'=>'Avenue 8 & Boulevard Gbon Coulibaly, Immeuble Céline, 4e étage, Treichville, Abidjan',
                'country'=>'CI', 'city'=>'Abidjan', 'phone'=>'+225 07 18 04 10 17', 'email'=>'hello@lozamaleombho.com',
                'website'=>'https://www.lozamaleombho.com/',
            ],
            [
                'slug'=>'lisa-folawiyo-contact-location', 'brand'=>'lisa-folawiyo', 'name'=>'Lisa Folawiyo — contact location',
                'address'=>'13 Ribadu Road, Ikoyi, Lagos',
                'country'=>'NG', 'city'=>'Lagos', 'phone'=>'+234 803 308 5416', 'email'=>'info@lisafolawiyo.com',
                'website'=>'https://www.lisafolawiyo.com/',
            ],
        ];

        foreach ($locations as $data) {
            $brand = Brand::where('slug', $data['brand'])->firstOrFail();
            $country = Country::where('code', $data['country'])->firstOrFail();
            $city = City::where('country_id', $country->id)->where('name', $data['city'])->firstOrFail();
            SeedRecord::upsert(Boutique::class, ['name' => $data['name']], [
                'brand_id' => $brand->id, 'name' => $data['name'], 'address' => $data['address'],
                'country_id' => $country->id, 'city_id' => $city->id,
                'latitude' => null, 'longitude' => null, 'phone' => $data['phone'], 'email' => $data['email'],
                'type' => 'physical', 'website_url' => $data['website'], 'opening_hours' => null, 'status' => 'published',
            ]);
        }
    }
}
