<?php

namespace App\Http\Resources\V1\Source;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SourceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'source_type' => $this->source_type,
            'url' => $this->url,
            'publisher' => $this->publisher,
            'published_at' => $this->published_at,
            'checked_at' => $this->checked_at,
        ];
    }
}