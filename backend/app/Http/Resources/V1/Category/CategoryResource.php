<?php

namespace App\Http\Resources\V1\Category;

use App\Http\Resources\V1\Concerns\ResolvesImage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    use ResolvesImage;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,

            'creators' => $this->whenLoaded('creators', fn () => $this->creators->map(fn ($creator) => [
                'id' => $creator->id,
                'name' => $creator->name,
                'slug' => $creator->slug,
                'profile_image' => $this->image($creator->profile_image),
            ])->values()),

            'products' => $this->whenLoaded('products', fn () => $this->products->map(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'image' => $this->image($product->image),
                'price' => $product->price,
                'currency' => $product->currency,
            ])->values()),
        ];
    }
}