<?php

namespace App\Http\Resources\V1\PortfolioItem;

use App\Http\Resources\V1\Concerns\ResolvesImage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PortfolioItemResource extends JsonResource
{
    use ResolvesImage;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'image' => $this->image($this->image),
            'alt_text' => $this->alt_text,
            'year' => $this->year,
            'display_order' => $this->display_order,
            'status' => $this->status,

            'creator' => $this->whenLoaded('creator', fn () => [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
                'slug' => $this->creator->slug,
            ]),

            'collection' => $this->whenLoaded(
                'collection',
                fn () => $this->collection ? [
                    'id' => $this->collection->id,
                    'name' => $this->collection->name,
                    'slug' => $this->collection->slug,
                    'year' => $this->collection->year,
                    'season' => $this->collection->season,
                ] : null
            ),
        ];
    }
}