<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Country;
use Database\Seeders\Support\SeedRecord;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $cities = [
            ['CI', 'Abidjan'], ['CI', 'Bouaké'], ['CI', 'Yamoussoukro'],
            ['NG', 'Lagos'], ['NG', 'Abuja'], ['SN', 'Dakar'],
            ['GH', 'Accra'], ['KE', 'Nairobi'], ['CM', 'Douala'], ['CM', 'Yaoundé'],
            ['ZA', 'Johannesburg'], ['ZA', 'Cape Town'],
            ['FR', 'Paris'], ['FR', 'Lyon'], ['BE', 'Bruxelles'],
            ['GB', 'London'], ['CA', 'Toronto'], ['CA', 'Montréal'],
            ['US', 'New York'], ['US', 'Los Angeles'],
        ];

        foreach ($cities as [$countryCode, $name]) {
            $country = Country::where('code', $countryCode)->firstOrFail();
            SeedRecord::upsert(City::class, ['country_id' => $country->id, 'name' => $name], [
                'country_id' => $country->id,
                'name' => $name,
            ]);
        }
    }
}

