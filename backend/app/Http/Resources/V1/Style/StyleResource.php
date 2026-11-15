<?php

namespace App\Http\Resources\V1\Style;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StyleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'parent_id' => $this->parent_id,

            'parent' => $this->whenLoaded(
                'parent',
                fn () => $this->parent ? [
                    'id' => $this->parent->id,
                    'name' => $this->parent->name,
                    'slug' => $this->parent->slug,
                ] : null
            ),

            'children' => $this->whenLoaded(
                'children',
                fn () => $this->children->map(fn ($child) => [
                    'id' => $child->id,
                    'name' => $child->name,
                    'slug' => $child->slug,
                ])->values()
            ),
        ];
    }
}