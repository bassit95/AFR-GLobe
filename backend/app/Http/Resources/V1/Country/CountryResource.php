<?php

namespace App\Http\Resources\V1\Country;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CountryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'continent' => $this->continent,
            // Dans CountryResource.php
        'cities' => $this->whenLoaded('cities', fn () => $this->cities->map(fn ($city) => [
        'id' => $city->id,
      'name' => $city->name,
     ])),
        ];
    }
}