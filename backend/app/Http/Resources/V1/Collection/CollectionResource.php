<?php

namespace App\Http\Resources\V1\Collection;

use App\Http\Resources\V1\Concerns\ResolvesImage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CollectionResource extends JsonResource
{
    use ResolvesImage;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'year' => $this->year,
            'season' => $this->season,
            'cover_image' => $this->image($this->cover_image),
            'status' => $this->status,

            'brand' => $this->whenLoaded('brand', fn () => [
                'id' => $this->brand->id,
                'name' => $this->brand->name,
                'slug' => $this->brand->slug,
            ]),

            'products' => $this->whenLoaded('products', fn () => $this->products->map(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
            ])),

            'portfolio_items' => $this->whenLoaded('portfolioItems', fn () => $this->portfolioItems->map(fn ($item) => [
                'id' => $item->id,
                'title' => $item->title,
                'image' => $this->image($item->image),
            ])),
        ];
    }
}