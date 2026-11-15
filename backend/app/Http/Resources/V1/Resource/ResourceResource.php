<?php

namespace App\Http\Resources\V1\Resource;

use App\Http\Resources\V1\Concerns\ResolvesImage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResourceResource extends JsonResource
{
    use ResolvesImage;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'resource_type' => $this->resource_type,
            'url' => $this->url,
            'cover_image' => $this->image($this->cover_image),
            'status' => $this->status,
        ];
    }
}