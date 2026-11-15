<?php

namespace App\Http\Resources\V1\Boutique;

use App\Http\Resources\V1\Concerns\ResolvesImage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BoutiqueResource extends JsonResource
{
    use ResolvesImage;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'image' => $this->image($this->image),
            'address' => $this->address,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'phone' => $this->phone,
            'email' => $this->email,
            'type' => $this->type,
            'website_url' => $this->website_url,
            'opening_hours' => $this->opening_hours,
            'status' => $this->status,

            'brand' => $this->whenLoaded('brand', fn () => [
                'id' => $this->brand->id,
                'name' => $this->brand->name,
                'slug' => $this->brand->slug,
            ]),

            'country' => $this->whenLoaded('country', fn () => [
                'id' => $this->country->id,
                'name' => $this->country->name,
            ]),

            'city' => $this->whenLoaded('city', fn () => [
                'id' => $this->city->id,
                'name' => $this->city->name,
            ]),

            'sources' => $this->whenLoaded('sources'),
        ];
    }
}