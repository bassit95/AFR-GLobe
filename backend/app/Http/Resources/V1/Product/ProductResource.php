<?php

namespace App\Http\Resources\V1\Product;

use App\Http\Resources\V1\Concerns\ResolvesImage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    use ResolvesImage;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'image' => $this->image($this->image),
            'price' => $this->price,
            'currency' => $this->currency,
            'gender' => $this->gender,
            'product_url' => $this->product_url,
            'availability' => $this->availability,
            'status' => $this->status,

            'brand' => $this->whenLoaded('brand', fn () => $this->brand ? [
                'id' => $this->brand->id,
                'name' => $this->brand->name,
                'slug' => $this->brand->slug,
                'logo' => $this->image($this->brand->logo),
            ] : null),

            'collection' => $this->whenLoaded('collection', fn () => $this->collection ? [
                'id' => $this->collection->id,
                'name' => $this->collection->name,
                'slug' => $this->collection->slug,
                'year' => $this->collection->year,
                'season' => $this->collection->season,
            ] : null),

            'categories' => $this->whenLoaded('categories', fn () => $this->categories->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
            ])->values()),

            'styles' => $this->whenLoaded('styles', fn () => $this->styles->map(fn ($style) => [
                'id' => $style->id,
                'name' => $style->name,
                'slug' => $style->slug,
                'parent_id' => $style->parent_id,
            ])->values()),
        ];
    }
}