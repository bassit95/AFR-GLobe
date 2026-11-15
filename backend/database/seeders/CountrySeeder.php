<?php

namespace Database\Seeders;

use App\Models\Country;
use Database\Seeders\Support\SeedRecord;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        $countries = [
            ['name' => "Côte d'Ivoire", 'code' => 'CI', 'continent' => 'Africa'],
            ['name' => 'Nigeria', 'code' => 'NG', 'continent' => 'Africa'],
            ['name' => 'Senegal', 'code' => 'SN', 'continent' => 'Africa'],
            ['name' => 'Ghana', 'code' => 'GH', 'continent' => 'Africa'],
            ['name' => 'Kenya', 'code' => 'KE', 'continent' => 'Africa'],
            ['name' => 'Cameroon', 'code' => 'CM', 'continent' => 'Africa'],
            ['name' => 'South Africa', 'code' => 'ZA', 'continent' => 'Africa'],
            ['name' => 'France', 'code' => 'FR', 'continent' => 'Europe'],
            ['name' => 'Belgium', 'code' => 'BE', 'continent' => 'Europe'],
            ['name' => 'United Kingdom', 'code' => 'GB', 'continent' => 'Europe'],
            ['name' => 'Canada', 'code' => 'CA', 'continent' => 'North America'],
            ['name' => 'United States', 'code' => 'US', 'continent' => 'North America'],
        ];

        foreach ($countries as $country) {
            SeedRecord::upsert(Country::class, ['code' => $country['code']], $country);
        }
    }
}
