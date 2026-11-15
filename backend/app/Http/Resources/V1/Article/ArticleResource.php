<?php

namespace App\Http\Resources\V1\Article;

use App\Http\Resources\V1\Concerns\ResolvesImage;
use App\Http\Resources\V1\Source\SourceResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    use ResolvesImage;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,

            // ✅ AJOUT — SEO
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,

            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'article_type' => $this->article_type,
            'cover_image' => $this->image($this->cover_image),
            'published_at' => $this->published_at,
            'status' => $this->status,

            'author' => $this->whenLoaded(
                'author',
                fn () => $this->author ? [
                    'id' => $this->author->id,
                    'name' => $this->author->name,
                ] : null
            ),

            // ✅ CORRIGÉ (Bug #20) : utilise SourceResource au lieu du Model brut
            'sources' => $this->whenLoaded(
                'sources',
                fn () => SourceResource::collection($this->sources)
            ),
        ];
    }
}