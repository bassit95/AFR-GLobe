<?php

namespace App\Http\Resources\V1\City;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,

            'country' => $this->whenLoaded(
                'country',
                fn () => [
                    'id' => $this->country->id,
                    'name' => $this->country->name,
                    'code' => $this->country->code,
                ]
            ),
        ];
    }
}