<?php

namespace App\Http\Resources\V1\Brand;

use App\Http\Resources\V1\Concerns\ResolvesImage;
use App\Http\Resources\V1\Source\SourceResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BrandResource extends JsonResource
{
    use ResolvesImage;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,

            // ✅ AJOUT — SEO
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,

            'logo' => $this->image($this->logo),
            'cover_image' => $this->image($this->cover_image),
            'description' => $this->description,
            'founded_year' => $this->founded_year,
            'website_url' => $this->website_url,
            'status' => $this->status,

            'country' => $this->whenLoaded('country', fn () => [
                'id' => $this->country->id,
                'name' => $this->country->name,
            ]),

            'city' => $this->whenLoaded('city', fn () => [
                'id' => $this->city->id,
                'name' => $this->city->name,
            ]),

            'creators' => $this->whenLoaded('creators', fn () => $this->creators->map(fn ($creator) => [
                'id' => $creator->id,
                'name' => $creator->name,
                'slug' => $creator->slug,
                'role' => $creator->pivot->role,
            ])),

            'boutiques' => $this->whenLoaded('boutiques', fn () => $this->boutiques->map(fn ($boutique) => [
                'id' => $boutique->id,
                'name' => $boutique->name,
                'city' => $boutique->city?->name,
                'country' => $boutique->country?->name,
            ])),

            'collections' => $this->whenLoaded('collections', fn () => $this->collections->map(fn ($collection) => [
                'id' => $collection->id,
                'name' => $collection->name,
                'slug' => $collection->slug,
                'year' => $collection->year,
                'season' => $collection->season,
            ])),

            // ✅ CORRIGÉ (Bug #20) : utilise SourceResource
            'sources' => $this->whenLoaded(
                'sources',
                fn () => SourceResource::collection($this->sources)
            ),
        ];
    }
}