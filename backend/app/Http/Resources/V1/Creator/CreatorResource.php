<?php

namespace App\Http\Resources\V1\Creator;

use App\Http\Resources\V1\Concerns\ResolvesImage;
use App\Http\Resources\V1\PortfolioItem\PortfolioItemResource;
use App\Http\Resources\V1\Source\SourceResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CreatorResource extends JsonResource
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

            // ✅ AJOUT (Bug #9) — status
            'status' => $this->status,

            'verification_status' => $this->verification_status,
            'profile_image' => $this->image($this->profile_image),
            'cover_image' => $this->image($this->cover_image),
            'gender' => $this->gender,
            'short_bio' => $this->short_bio,
            'biography' => $this->biography,
            'website_url' => $this->website_url,
            'social_links' => $this->social_links,
            'awards' => $this->awards,

            'country_of_origin' => $this->whenLoaded('originCountry', fn () => [
                'id' => $this->originCountry->id,
                'name' => $this->originCountry->name,
                'code' => $this->originCountry->code,
            ]),

            'country_of_residence' => $this->whenLoaded('residenceCountry', fn () => [
                'id' => $this->residenceCountry->id,
                'name' => $this->residenceCountry->name,
                'code' => $this->residenceCountry->code,
            ]),

            'city_of_residence' => $this->whenLoaded('residenceCity', fn () => [
                'id' => $this->residenceCity->id,
                'name' => $this->residenceCity->name,
            ]),

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

            'brands' => $this->whenLoaded('brands', fn () => $this->brands->map(fn ($brand) => [
                'id' => $brand->id,
                'name' => $brand->name,
                'slug' => $brand->slug,
                'role' => $brand->pivot->role ?? null,
            ])->values()),

            'portfolio_items' => PortfolioItemResource::collection(
                $this->whenLoaded('portfolioItems')
            ),

            // ✅ CORRIGÉ (Bug #16) : portfolio_count fonctionne si withCount('portfolioItems')
            'portfolio_count' => $this->when(
                isset($this->portfolio_items_count),
                fn () => (int) $this->portfolio_items_count
            ),

            // ✅ AJOUT — sources
            'sources' => $this->whenLoaded(
                'sources',
                fn () => SourceResource::collection($this->sources)
            ),
        ];
    }
}